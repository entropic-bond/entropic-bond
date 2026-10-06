import { PersistentProperty, Persistent, DocumentChange } from '../persistent/persistent'
import { Collection } from '../types/utility-types'
import { DocumentObject, DataSource } from './data-source'
import { Model, Query } from './model'
import { Store } from './store'

export type CachedPropsUpdaterCallback = ( doc: Persistent, prop: PersistentProperty, value: unknown )=>void
export interface UpdatedResults {
	[ matchingCollection: string ]: {
		totalDocumentsToUpdate: number
		updatedDocuments: string[] 
		documentsToUpdate: string[]
	}
}
export type AfterDocumentChangeCallback = ( updatedResults?: UpdatedResults, propsToUpdate?: PersistentProperty[] ) => void
export type BeforeDocumentChangeCallback = ( change: DocumentChange<Persistent>, propsToUpdate?: PersistentProperty[] ) => void
export type BeforeQueryOwnerCollection = ( query: Query<any> ) => Query<any> | void

export interface CachedPropsUpdaterConfig {
	beforeUpdateDocument?: CachedPropsUpdaterCallback
	afterUpdateDocument?: CachedPropsUpdaterCallback
	beforeDocumentChange?: BeforeDocumentChangeCallback
	afterDocumentChange?: AfterDocumentChangeCallback
	beforeQueryOwnerCollection?: BeforeQueryOwnerCollection
	chunkSize?: number
	concurrency?: number
}

export class CachedPropsUpdater {
	/** Page size of every owner query: documents hydrated and saved per chunk. */
	static readonly DEFAULT_CHUNK_SIZE = 25
	/** Number of chunks processed in parallel; in-flight saves never exceed chunkSize x concurrency. */
	static readonly DEFAULT_CONCURRENCY = 4

	constructor( config?: CachedPropsUpdaterConfig ) {
		if ( config ) {
			this._beforeUpdateDocument = config.beforeUpdateDocument
			this._afterUpdateDocument = config.afterUpdateDocument
			this._afterDocumentChange = config.afterDocumentChange
			this._beforeDocumentChange = config.beforeDocumentChange
			this._beforeQueryOwnerCollection = config.beforeQueryOwnerCollection
			this._chunkSize = CachedPropsUpdater.sanitizeCount( config.chunkSize, CachedPropsUpdater.DEFAULT_CHUNK_SIZE )
			this._concurrency = CachedPropsUpdater.sanitizeCount( config.concurrency, CachedPropsUpdater.DEFAULT_CONCURRENCY )
		}
		this.installUpdaters()
	}	

	private installUpdaters() {
		const referencesWithCachedProps = Persistent.getSystemRegisteredReferencesWithCachedProps()
		this._collectionsToWatch = {}

		Object.entries( referencesWithCachedProps ).forEach(([ className, props ]) => {
			props.forEach( propInfo => {
				if ( !propInfo.typeName ) return
				const typeNames = Array.isArray( propInfo.typeName ) ? propInfo.typeName : [ propInfo?.typeName ?? className ]

				typeNames.map( tName => Persistent.collectionPath( Persistent.createInstance( tName ), propInfo )).forEach( collection => {
					if ( !this._collectionsToWatch[ collection ] ) this._collectionsToWatch[ collection ] = []
					const existsProp = this._collectionsToWatch[ collection ]!.find( prop => prop.name === propInfo.name && prop.ownerClassName() === propInfo.ownerClassName() )
					if ( !existsProp ) this._collectionsToWatch[ collection ]!.push( propInfo)
				})
			})
		})
	}

	/**
	 * Set a callback to be executed before updating each document that has a cached prop to update. 
	 * The callback receives the document to update and the prop that triggered the update as parameters.
	 * @param callback The callback to be executed before updating each document that has a cached prop to update.
	 */
	set beforeDocumentChange( callback: BeforeDocumentChangeCallback ) {
		this._beforeDocumentChange = callback
	}

	/**
	 * Set a callback to be executed after updating each document that has a cached prop to update. 
	 * The callback receives the document that was updated and the prop that triggered the update as parameters.
	 * @param callback The callback to be executed after updating each document that has a cached prop to update.
	 */
	set afterDocumentChange( callback: AfterDocumentChangeCallback ) {
		this._afterDocumentChange = callback
	}

	/**
	 * Set a callback to be executed before updating each document that has a cached prop to update.
	 * The callback receives the document to update and the prop that triggered the update as parameters.
	 * @param callback The callback to be executed before updating each document that has a cached prop to update.
	 */
	set beforeUpdateDocument( callback: CachedPropsUpdaterCallback ) {
		this._beforeUpdateDocument = callback
	}

	/**
	 * Set a callback to be executed after updating each document that has a cached prop to update.
	 * The callback receives the document that was updated and the prop that triggered the update as parameters.
	 * @param callback The callback to be executed after updating each document that has a cached prop to update.
	 */
	set afterUpdateDocument( callback: CachedPropsUpdaterCallback ) {
		this._afterUpdateDocument = callback
	}

	set beforeQueryOwnerCollection( subscriber: BeforeQueryOwnerCollection ) {
		this._beforeQueryOwnerCollection = subscriber
	}

	set resolveCollectionPaths( func: ( template: string ) => Promise<string[]> ) {
		this._resolveCollectionPaths = func
	}

	get collectionsToWatch(): Readonly<Collection<PersistentProperty[]>> {
		return this._collectionsToWatch
	}

	/**
	 * Fans out the update of every owner document whose cached props are affected
	 * by the given document change.
	 *
	 * Resolves after every dispatched save settled. Rejects with the first error
	 * when an owner save, an owner page read or a callback fails; no page is pulled
	 * after a failure and the failing page's in-flight saves are drained before the
	 * promise rejects.
	 * @throws When an owner save, an owner page read or a callback fails.
	 */
	updateProps( documentPath: string, event: DocumentChange<DocumentObject> ): Promise<void> {
		const propsToUpdate = this._collectionsToWatch[ documentPath ]
		if ( !propsToUpdate ) return Promise.resolve()

		return this.onDocumentChange( event, propsToUpdate )
	}

	private async onDocumentChange( event: DocumentChange<DocumentObject>, propsToUpdate: PersistentProperty[] ) {
		const change = DataSource.toPersistentDocumentChange( event )
		this._beforeDocumentChange?.( change, propsToUpdate )

		if ( event.type !== 'update' || !change.before ) return
		const afterId = change.after?.id
		if ( afterId && this._disabledChangeListeners.has( afterId ) ) return

		const results: UpdatedResults = {}
		const changedProps = propsToUpdate.filter( prop => CachedPropsUpdater.hasCachedPropsChanges( prop, change ) )

		if ( changedProps.length === 0 ) {
			this._afterDocumentChange?.( results, propsToUpdate )
			return
		}

		for ( const prop of changedProps ) {
			const ownerCollectionTemplate = CachedPropsUpdater.ownerCollectionPath( Persistent.createInstance( prop.ownerClassName() ), prop, change.params )
			const matchingCollections = await this._resolveCollectionPaths( ownerCollectionTemplate )

			for ( const ownerCollection of matchingCollections ) {
				await this.fanOutToCollection( ownerCollection, prop, change, results )
			}
		}

		this._afterDocumentChange?.( results, propsToUpdate )
	}

	/**
	 * Updates every owner document matching the changed reference in pages of
	 * `chunkSize` documents, with at most `concurrency` pages in flight. Only one
	 * page per worker is hydrated at a time and saves never exceed
	 * `chunkSize x concurrency` in flight. The returned promise settles after every
	 * dispatched save settled; the first failure stops new pages from being pulled,
	 * drains the in-flight saves and rejects.
	 */
	private async fanOutToCollection( ownerCollection: string, prop: PersistentProperty, change: DocumentChange<Persistent>, results: UpdatedResults ) {
		const ownerModel = Store.getModel<any>( ownerCollection )
		let query = ownerModel.find()
		if ( prop.searchableArray ) query = query.where( prop.name, 'contains', change.before! )
		else query = query.where( prop.name, '==', change.before! )

		query = this._beforeQueryOwnerCollection?.( query ) ?? query

		const maxDocuments = query.getQueryObject().limit || Number.POSITIVE_INFINITY
		const queryModel = query.getQueryModel()
		const firstPageSize = Math.min( this._chunkSize, maxDocuments )
		const firstPage = await query.get( firstPageSize )

		const result = { totalDocumentsToUpdate: 0, updatedDocuments: [] as string[], documentsToUpdate: [] as string[] }
		results[ ownerCollection ] = result

		let firstPageTaken = false
		let taken = 0
		let hasMore = firstPage.length >= firstPageSize
		const takePage = (): Promise<Persistent[]> => {
			if ( !firstPageTaken ) {
				firstPageTaken = true
				taken = firstPage.length
				return Promise.resolve( firstPage )
			}

			const remaining = maxDocuments - taken
			if ( remaining <= 0 || !hasMore ) return Promise.resolve( [] )

			const pageSize = Math.min( this._chunkSize, remaining )
			taken += pageSize
			return queryModel.next( pageSize ).then( page => {
				if ( page.length < pageSize ) hasMore = false
				return page
			})
		}

		let aborted = false
		const worker = async () => {
			while ( !aborted ) {
				let page: Persistent[]
				try {
					page = await takePage()
				}
				catch ( error ) {
					aborted = true
					throw error
				}
				if ( aborted || page.length === 0 ) return

				result.documentsToUpdate.push( ...page.map( document => document[ 'name' ] ?? document.id ) )
				const pageOutcomes = await Promise.allSettled( page.map( document => this.updateOwnerDocument( ownerModel, document, prop, change, result ) ) )
				const pageFailure = pageOutcomes.find( outcome => outcome.status === 'rejected' )
				if ( pageFailure ) {
					aborted = true
					throw ( pageFailure as PromiseRejectedResult ).reason
				}
			}
		}

		const outcomes = await Promise.allSettled(
			Array.from({ length: this._concurrency }, () => worker() )
		)
		const failure = outcomes.find( outcome => outcome.status === 'rejected' )
		if ( failure ) throw ( failure as PromiseRejectedResult ).reason

		result.totalDocumentsToUpdate = result.documentsToUpdate.length
	}

	private async updateOwnerDocument( ownerModel: Model<any>, document: any, prop: PersistentProperty, change: DocumentChange<Persistent>, result: UpdatedResults[ string ] ) {
		if ( prop.searchableArray ) {
			const index = ( document[ prop.name ] as Persistent[] ).findIndex( obj => obj.id === change.before!.id )
			document[ prop.name ][ index ] = change.after
		}
		else {
			document[ `_${ prop.name }` ] = change.after
		}

		this._beforeUpdateDocument?.( document, prop, change.after )
		this.disableChangeListener( document )
		try {
			await ownerModel.save( document )
			result.updatedDocuments.push( document.id )
			this._afterUpdateDocument?.( document, prop, change.after )
		}
		finally {
			this.enableChangeListener( document )
		}
	}

	private static hasCachedPropsChanges( prop: PersistentProperty, change: DocumentChange<Persistent> ): boolean {
		if ( !change.after ) return false
		return !!prop.cachedProps?.some( propName => change.before![ propName ] !== change.after![ propName ] )
	}

	private static sanitizeCount( value: number | undefined, fallback: number ): number {
		return value !== undefined && Number.isFinite( value )
			? Math.max( 1, Math.floor( value ) )
			: fallback
	}

	private disableChangeListener( document: DocumentObject ) {
		this._disabledChangeListeners.add( document.id! )
	}

	private enableChangeListener( document: DocumentObject ) {
		this._disabledChangeListeners.delete( document.id! )
	}

	private static ownerCollectionPath( owner: Persistent, prop: PersistentProperty, params?: any ): string {
		let ownerCollection: string

		if ( typeof prop.ownerCollection === 'function' ) {
			ownerCollection = prop.ownerCollection( owner, prop, params )
		}
		else {
			ownerCollection = prop.ownerCollection ?? owner.className
		}
		return ownerCollection
	}

	private _beforeUpdateDocument: CachedPropsUpdaterCallback | undefined
	private _afterUpdateDocument: CachedPropsUpdaterCallback | undefined
	private _beforeDocumentChange: BeforeDocumentChangeCallback | undefined
	private _afterDocumentChange: AfterDocumentChangeCallback | undefined
	private _beforeQueryOwnerCollection: BeforeQueryOwnerCollection | undefined
	private _resolveCollectionPaths: ( template: string ) => Promise<string[]> = ()=> { throw new Error( 'The method collectionsMatchingTemplate has not been implemented in the concrete data source' ) }
	private _disabledChangeListeners = new Set<string>()
	private _collectionsToWatch: Collection<PersistentProperty[]> = {}
	private _chunkSize = CachedPropsUpdater.DEFAULT_CHUNK_SIZE
	private _concurrency = CachedPropsUpdater.DEFAULT_CONCURRENCY
}
