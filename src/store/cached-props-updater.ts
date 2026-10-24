import { PersistentProperty, Persistent, DocumentChange } from '../persistent/persistent'
import { Collection } from '../types/utility-types'
import { Unsubscriber } from '../observable/observable'
import { DocumentObject, DataSource, TransactionConflictError } from './data-source'
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
/**
 * Notified when an install-driven refresh fails. The refresh itself is already
 * contained: it never rejects and the subscription is kept.
 * @param error the error that made the refresh fail
 * @param change the document change that triggered the refresh
 */
export type OnRefreshFailureCallback = ( error: unknown, change: DocumentChange<DocumentObject> ) => void

export interface CachedPropsUpdaterConfig {
	beforeUpdateDocument?: CachedPropsUpdaterCallback
	afterUpdateDocument?: CachedPropsUpdaterCallback
	beforeDocumentChange?: BeforeDocumentChangeCallback
	afterDocumentChange?: AfterDocumentChangeCallback
	beforeQueryOwnerCollection?: BeforeQueryOwnerCollection
	/**
	 * Notified when a refresh driven by the install subscription fails. Optional:
	 * when absent the failure is contained silently (no rejection, no logging).
	 */
	onRefreshFailure?: OnRefreshFailureCallback
	chunkSize?: number
	concurrency?: number
	/**
	 * When true (the default), each owner document is re-read and written inside a
	 * compare-and-set transaction, so a concurrent write to the same owner
	 * document is never silently overwritten. Retries on conflict up to
	 * `transactionRetries` times. Set to false to opt back into the legacy
	 * batch save (whole-document set from the hydrated copy).
	 */
	transactional?: boolean
	/** Max conflict retries per owner document when `transactional` is enabled. Defaults to 5. */
	transactionRetries?: number
}

export class CachedPropsUpdater {
	/** Page size of every owner query: documents hydrated and saved per chunk. */
	static readonly DEFAULT_CHUNK_SIZE = 25
	/** Number of chunks processed in parallel; in-flight saves never exceed chunkSize x concurrency. */
	static readonly DEFAULT_CONCURRENCY = 4
	/** Max conflict retries per owner document when transactional updates are enabled. */
	static readonly DEFAULT_TRANSACTION_RETRIES = 5

	constructor( config?: CachedPropsUpdaterConfig ) {
		if ( config ) {
			this._beforeUpdateDocument = config.beforeUpdateDocument
			this._afterUpdateDocument = config.afterUpdateDocument
			this._afterDocumentChange = config.afterDocumentChange
			this._beforeDocumentChange = config.beforeDocumentChange
			this._beforeQueryOwnerCollection = config.beforeQueryOwnerCollection
			this._onRefreshFailure = config.onRefreshFailure
			this._chunkSize = CachedPropsUpdater.sanitizeCount( config.chunkSize, CachedPropsUpdater.DEFAULT_CHUNK_SIZE )
			this._concurrency = CachedPropsUpdater.sanitizeCount( config.concurrency, CachedPropsUpdater.DEFAULT_CONCURRENCY )
			this._transactional = config.transactional ?? true
			this._transactionRetries = CachedPropsUpdater.sanitizeRetries( config.transactionRetries, CachedPropsUpdater.DEFAULT_TRANSACTION_RETRIES )
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
	 * Subscribes to the changes of every collection whose documents hold a cached
	 * prop of this updater, so a referenced document change refreshes its owners
	 * without any caller-side listener bridge. A host (or the data source that
	 * installed this updater) should call this once after construction.
	 *
	 * The data source passed here is also the one owner documents are read and
	 * written through, so the updater works independently of which data source is
	 * active in the Store. Unsubscribing stops the refreshes but does not clear
	 * that data source, so later direct `updateProps()` calls keep reading and
	 * writing owners through it. Calling it again replaces the previous
	 * subscription: only one subscription is live per updater and the previously
	 * returned unsubscriber becomes a no-op.
	 *
	 * Refreshes are fire-and-forget: a failure is handed to the `onRefreshFailure`
	 * config callback (if any) and never rejects. `updateProps` keeps rejecting as
	 * it always has when called directly.
	 * @param dataSource the data source that stores the watched and the owner documents
	 * @returns a function that unsubscribes this subscription
	 */
	subscribe( dataSource: DataSource ): Unsubscriber {
		this.unsubscribe()
		this._ownerDataSource = dataSource

		const unsubscribers = Object.keys( this._collectionsToWatch ).map( collectionTemplate =>
			dataSource.onDocumentTemplateChange( collectionTemplate, event => this.onSubscriptionChange( collectionTemplate, event ) )
		)

		const unsubscribe = () => {
			unsubscribers.forEach( unsubscriber => unsubscriber() )
			// only the live subscription clears itself, so an older unsubscriber is a no-op
			if ( this._subscriptionUnsubscriber === unsubscribe ) this._subscriptionUnsubscriber = undefined
		}
		this._subscriptionUnsubscriber = unsubscribe
		return unsubscribe
	}

	/**
	 * Stops the current subscription, if any. Owner routing stays as it was, so
	 * later direct `updateProps()` calls keep reading and writing owners through
	 * the data source of the stopped subscription.
	 */
	unsubscribe(): void {
		this._subscriptionUnsubscriber?.()
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

	/**
	 * Bridges a data source template notification to a refresh. The refresh is not
	 * awaited: its rejection is handed to the `onRefreshFailure` callback and
	 * contained, so a failed refresh never raises an unhandled rejection and never
	 * unsubscribes the listener. The host callback is itself guarded, so a throwing
	 * failure handler cannot fail the refresh path.
	 */
	private onSubscriptionChange( collectionTemplate: string, event: DocumentChange<DocumentObject> ) {
		this.updateProps( collectionTemplate, event ).catch( error => {
			try {
				this._onRefreshFailure?.( error, event )
			}
			catch {
				// A throwing host handler must not break the subscription.
			}
		})
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
		const ownerModel = this.ownerModel( ownerCollection )
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

	/**
	 * The model owner documents are read and written through: the data source this
	 * updater is subscribed to when it is, the Store data source otherwise.
	 */
	private ownerModel( collection: string ): Model<any> {
		return this._ownerDataSource
			? new Model<any>( this._ownerDataSource, collection )
			: Store.getModel<any>( collection )
	}

	private async updateOwnerDocument( ownerModel: Model<any>, document: any, prop: PersistentProperty, change: DocumentChange<Persistent>, result: UpdatedResults[ string ] ) {
		const after = change.after!
		const applyUpdate = ( target: any ) => {
			this.setCachedReference( target, prop, change )

			this._beforeUpdateDocument?.( target, prop, after )
			return target
		}

		if ( this._transactional ) {
			let updated: any
			const savedId = await this.runTransactionalUpdate( ownerModel, document.id, target => { updated = applyUpdate( target ) } )
			if ( savedId === undefined ) return

			result.updatedDocuments.push( savedId )
			this._afterUpdateDocument?.( updated, prop, after )
			return
		}

		applyUpdate( document )
		this.disableChangeListener( document )
		try {
			await ownerModel.save( document )
			result.updatedDocuments.push( document.id )
			this._afterUpdateDocument?.( document, prop, after )
		}
		finally {
			this.enableChangeListener( document )
		}
	}

	/**
	 * Writes the new cached reference into an owner document. The only place the
	 * updater mutates an owner's reference, shared by the transactional and the
	 * legacy save paths.
	 *
	 * A scalar reference is written to `'_' + prop.name` because `@persistent`
	 * properties live in their underscore-prefixed private field (the underscore is
	 * stripped on serialization, see the project conventions). A searchable array
	 * reference replaces the matching element, or appends the reference when it is
	 * not there yet.
	 */
	private setCachedReference( target: any, prop: PersistentProperty, change: DocumentChange<Persistent> ) {
		const after = change.after!

		if ( prop.searchableArray ) {
			const array = target[ prop.name ] as Persistent[]
			const index = array.findIndex( obj => obj.id === change.before!.id )
			if ( index >= 0 ) array[ index ] = after
			else array.push( after )
		}
		else {
			target[ `_${ prop.name }` ] = after
		}
	}

	/**
	 * Re-reads the owner document inside a compare-and-set transaction, applies
	 * the cached-prop mutation to the fresh instance and commits it. Retries on
	 * conflict so two fan-outs racing on the same owner document both survive.
	 * @returns the saved document id, or undefined when the document vanished
	 */
	private async runTransactionalUpdate( ownerModel: Model<any>, id: string, applyUpdate: ( target: any ) => void ): Promise<string | undefined> {
		this.disableChangeListener({ id })
		try {
			for ( let attempt = 0; ; attempt++ ) {
				try {
					let savedId: string | undefined
					await ownerModel.runTransaction( async handle => {
						const target = await handle.findById( id )
						if ( !target ) return

						applyUpdate( target )
						await handle.save( target )
						savedId = target.id
					})
					return savedId
				}
				catch ( error ) {
					if ( error instanceof TransactionConflictError && attempt < this._transactionRetries ) continue
					throw error
				}
			}
		}
		finally {
			this.enableChangeListener({ id })
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

	private static sanitizeRetries( value: number | undefined, fallback: number ): number {
		return value !== undefined && Number.isFinite( value )
			? Math.max( 0, Math.floor( value ) )
			: fallback
	}

	private disableChangeListener( document: { id?: string } ) {
		this._disabledChangeListeners.add( document.id! )
	}

	private enableChangeListener( document: { id?: string } ) {
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
	private _onRefreshFailure: OnRefreshFailureCallback | undefined
	private _ownerDataSource: DataSource | undefined
	private _subscriptionUnsubscriber: Unsubscriber | undefined
	private _resolveCollectionPaths: ( template: string ) => Promise<string[]> = ()=> { throw new Error( 'The method collectionsMatchingTemplate has not been implemented in the concrete data source' ) }
	private _disabledChangeListeners = new Set<string>()
	private _collectionsToWatch: Collection<PersistentProperty[]> = {}
	private _chunkSize = CachedPropsUpdater.DEFAULT_CHUNK_SIZE
	private _concurrency = CachedPropsUpdater.DEFAULT_CONCURRENCY
	private _transactional = true
	private _transactionRetries = CachedPropsUpdater.DEFAULT_TRANSACTION_RETRIES
}
