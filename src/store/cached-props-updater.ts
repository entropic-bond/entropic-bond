import { PersistentProperty, Persistent, DocumentChange } from '../persistent/persistent'
import { Collection } from '../types/utility-types'
import { DocumentChangeListenerHandler, DocumentChangeListener, DocumentObject, DataSource } from './data-source'
import { Query } from './model'
import { Store } from './store'

type CachedPropsUpdaterCallback = ( doc: Persistent, prop: PersistentProperty )=>void
type DocumentChangeListenerSubscriber = ( collectionPathToListen: string, listener: DocumentChangeListener<DocumentObject> )=> DocumentChangeListenerHandler | undefined
export interface UpdatedResults {
	[ matchingCollection: string ]: {
		totalDocumentsToUpdate: number
		updatedDocuments: string[] 
		documentsToUpdate: string[]
	}
}
type AfterDocumentChangeCallback = ( updatedResults?: UpdatedResults, propsToUpdate?: PersistentProperty[] ) => void
type BeforeDocumentChangeCallback = ( change: DocumentChange<Persistent>, propsToUpdate?: PersistentProperty[] ) => void
type BeforeQueryOwnerCollection = ( query: Query<any> ) => Query<any> | void

export interface CachedPropsUpdaterConfig {
	beforeUpdateDocument?: CachedPropsUpdaterCallback
	afterUpdateDocument?: CachedPropsUpdaterCallback
	beforeDocumentChange?: BeforeDocumentChangeCallback
	afterDocumentChange?: AfterDocumentChangeCallback
	beforeQueryOwnerCollection?: BeforeQueryOwnerCollection
}

export class CachedPropsUpdater {
	constructor( config?: CachedPropsUpdaterConfig ) {
		if ( config ) {
			this._beforeUpdate = config.beforeUpdateDocument
			this._afterUpdate = config.afterUpdateDocument
			this._afterDocumentChange = config.afterDocumentChange
			this._beforeQueryOwnerCollection = config.beforeQueryOwnerCollection
		}
	}	

	installUpdaters(): DocumentChangeListenerHandler[] {
		const referencesWithCachedProps = Persistent.getSystemRegisteredReferencesWithCachedProps()
		const collectionsToWatch: Collection<PersistentProperty[]> = {}

		Object.entries( referencesWithCachedProps ).forEach(([ className, props ]) => {
			props.forEach( propInfo => {
				if ( !propInfo.typeName ) return
				const typeNames = Array.isArray( propInfo.typeName ) ? propInfo.typeName : [ propInfo?.typeName ?? className ]

				typeNames.map( tName => Persistent.collectionPath( Persistent.createInstance( tName ), propInfo )).forEach( collection => {
					if ( !collectionsToWatch[ collection ] ) collectionsToWatch[ collection ] = []
					const existsProp = collectionsToWatch[ collection ]!.find( prop => prop.name === propInfo.name && prop.ownerClassName() === propInfo.ownerClassName() )
					if ( !existsProp ) collectionsToWatch[ collection ]!.push( propInfo)
				})
			})
		})

		this.handlers = []
		Object.entries( collectionsToWatch ).forEach(([ collectionNameToListen, props ]) => {

			const listener = this._subscribeToDocumentChangeListener( 
				collectionNameToListen, 
				e => this.onDocumentChange( e, props ) 
			)
			
			if ( !listener ) throw new Error( `The method documentChangeListener has not been implemented in the concrete data source` )
			else {
				listener.props = props
				this.handlers.push( listener )
			}
		})

		return this.handlers
	}

	uninstallUpdaters() {
		this.handlers.forEach( handler => handler.uninstall() )
		this.handlers = []
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
		this._beforeUpdate = callback
	}

	/**
	 * Set a callback to be executed after updating each document that has a cached prop to update.
	 * The callback receives the document that was updated and the prop that triggered the update as parameters.
	 * @param callback The callback to be executed after updating each document that has a cached prop to update.
	 */
	set afterUpdateDocument( callback: CachedPropsUpdaterCallback ) {
		this._afterUpdate = callback
	}

	/**
	 * Set a subscriber for handling document change events.
	 * @param subscriber The subscriber to be used for handling document change events.
	 */
	set documentChangeListenerSubscriber( subscriber: DocumentChangeListenerSubscriber ) {
		this._subscribeToDocumentChangeListener = subscriber
	}

	set beforeQueryOwnerCollection( subscriber: BeforeQueryOwnerCollection ) {
		this._beforeQueryOwnerCollection = subscriber
	}

	set resolveCollectionPaths( func: ( template: string ) => Promise<string[]> ) {
		this._resolveCollectionPaths = func
	}

	protected async onDocumentChange( event: DocumentChange<DocumentObject>, propsToUpdate: PersistentProperty[] ) {
		const change = DataSource.toPersistentDocumentChange( event )
		this._beforeDocumentChange?.( change, propsToUpdate )
		const results: UpdatedResults = {}

		if ( !change.before ) return
		if ( change.after?.id && this._disabledChangeListeners.has( change.after?.id ) ) return

		await Promise.all( propsToUpdate.map( async prop => {
			const ownerCollectionTemplate = CachedPropsUpdater.ownerCollectionPath( Persistent.createInstance( prop.ownerClassName() ), prop, change.params )
			const matchingCollections = await this._resolveCollectionPaths( ownerCollectionTemplate )

			await Promise.all( matchingCollections.map( async ownerCollection => {
				const ownerModel = Store.getModel<any>( ownerCollection )
				let query = ownerModel.find()

				let hasChanges = false
				prop.cachedProps?.forEach( persistentPropName => {
					const oldValue = change.before![ persistentPropName ]
					const newValue = change.after![ persistentPropName ]
					if ( oldValue !== newValue ) hasChanges = true
				})

				if ( hasChanges ) {
					if ( prop.searchableArray ) query = query.where( prop.name, 'contains', change.before! )
					else query = query.where( prop.name, '==', change.before! )
				}

				query = this._beforeQueryOwnerCollection?.( query ) ?? query
				const result = await query.get()

				results[ ownerCollection ] = {
					totalDocumentsToUpdate: result.length,
					updatedDocuments: [],
					documentsToUpdate: result.map( doc => doc.name ?? doc.id )
				}

				return Promise.all([
					result.map( async document =>{
						let hasChanges = false
						prop.cachedProps?.forEach( persistentPropName => {
							const oldValue = change.before![ persistentPropName ]
							const newValue = change.after![ persistentPropName ]
							if ( oldValue !== newValue ) hasChanges = true
						})
						if ( hasChanges ) {
							if ( prop.searchableArray ) {
								const index = ( document[ prop.name ] as Persistent[] ).findIndex( obj => obj.id === change.before!.id )
								document[ prop.name ][ index ] = change.after
							}
							else {
								document[ `_${ prop.name }` ] = change.after
							}
							this._beforeUpdate?.( document, prop )
							this.disableChangeListener( document )
							await ownerModel.save( document )
							this.enableChangeListener( document )
							results[ ownerCollection ]?.updatedDocuments.push( document.id )
							this._afterUpdate?.( document, prop )
						}
						else await Promise.resolve()
					})
				])
			}))
		}))	

		this._afterDocumentChange?.( results, propsToUpdate )
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

	private _beforeUpdate: CachedPropsUpdaterCallback | undefined
	private _afterUpdate: CachedPropsUpdaterCallback | undefined
	private _beforeDocumentChange: BeforeDocumentChangeCallback | undefined
	private _afterDocumentChange: AfterDocumentChangeCallback | undefined
	private _beforeQueryOwnerCollection: BeforeQueryOwnerCollection | undefined
	private handlers: DocumentChangeListenerHandler[] = []
	private _subscribeToDocumentChangeListener: DocumentChangeListenerSubscriber = ()=> { throw new Error( 'The method subscribeToDocumentChangeListener has not been implemented in the concrete data source' ) }
	private _resolveCollectionPaths: ( template: string ) => Promise<string[]> = ()=> { throw new Error( 'The method collectionsMatchingTemplate has not been implemented in the concrete data source' ) }
	private _disabledChangeListeners = new Set<string>()
}
