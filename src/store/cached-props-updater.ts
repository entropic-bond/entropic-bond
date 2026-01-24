import { PersistentProperty, Persistent, DocumentChange } from '../persistent/persistent'
import { Collection } from '../types/utility-types'
import { DocumentChangeListenerHandler, DocumentChangeListener, DocumentObject, DataSource } from './data-source'
import { Store } from './store'

type CachedPropsUpdaterCallback = ( doc: Persistent, prop: PersistentProperty )=>void
type DocumentChangeListenerSubscriber = ( collectionPathToListen: string, listener: DocumentChangeListener<DocumentObject> )=> Promise<DocumentChangeListenerHandler | undefined>

export interface CachedPropsUpdaterConfig {
	beforeUpdateDocument?: CachedPropsUpdaterCallback
	afterUpdateDocument?: CachedPropsUpdaterCallback
	onAllPropsUpdated?: () => void
}

export class CachedPropsUpdater {
	constructor( config?: CachedPropsUpdaterConfig ) {
		if ( config ) {
			this.beforeUpdate = config.beforeUpdateDocument
			this.afterUpdate = config.afterUpdateDocument
			this.onAllPropsUpdatedCallback = config.onAllPropsUpdated
		}
	}	

	async installUpdaters(): Promise<DocumentChangeListenerHandler[]> {
		const referencesWithCachedProps = Persistent.getSystemRegisteredReferencesWithCachedProps()
		const collectionsToWatch: Collection<PersistentProperty[]> = {}

		Object.entries( referencesWithCachedProps ).forEach(([ className, props ]) => {
			props.forEach( propInfo => {
				if ( !propInfo.typeName ) return
				const typeNames = Array.isArray( propInfo.typeName ) ? propInfo.typeName : [ propInfo?.typeName ?? className ]

				typeNames.map( tName => Persistent.collectionPath( Persistent.createInstance( tName ), propInfo )).forEach( collection => {
					if ( !collectionsToWatch[ collection ] ) collectionsToWatch[ collection ] = []
					collectionsToWatch[ collection ]!.push( propInfo)
				})
			})
		})

		this.handlers = []
		await Promise.all( Object.entries( collectionsToWatch ).map(async ([ collectionNameToListen, props ]) => {

			const listener = await this.subscribeToDocumentChangeListener( 
				collectionNameToListen, 
				e => this.onDocumentChange( e, props ) 
			)

			if ( !listener ) throw new Error( `The method documentChangeListener has not been implemented in the concrete data source` )
			else this.handlers.push( listener )
		}))

		return this.handlers
	}

	uninstallUpdaters() {
		this.handlers.forEach( handler => handler.uninstall() )
		this.handlers = []
	}

	set onAllPropsUpdated( callback: () => void ) {
		this.onAllPropsUpdatedCallback = callback
	}

	set beforeUpdateDocument( callback: CachedPropsUpdaterCallback ) {
		this.beforeUpdate = callback
	}

	set afterUpdateDocument( callback: ( document: Persistent, prop: PersistentProperty ) => void ) {
		this.afterUpdate = callback
	}

	set documentChangeListenerSubscriber( subscriber: DocumentChangeListenerSubscriber ) {
		this.subscribeToDocumentChangeListener = subscriber
	}

	set collectionsMatchingTemplateFunction( func: ( template: string ) => Promise<string[]> ) {
		this.collectionsMatchingTemplate = func
	}
	protected async onDocumentChange( event: DocumentChange<DocumentObject>, propsToUpdate: PersistentProperty[] ) {
		const change = DataSource.toPersistentDocumentChange( event )
		if ( !change.before ) return

		await Promise.all( propsToUpdate.map( async prop => {
			const ownerCollectionTemplate = CachedPropsUpdater.ownerCollectionPath( Persistent.createInstance( prop.ownerClassName() ), prop, change.params )
			const matchingCollections = await this.collectionsMatchingTemplate( ownerCollectionTemplate )

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

				const result = await query.get()

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
							this.beforeUpdate?.( document, prop )
							// await document.markAsServerChange()
							await ownerModel.save( document )
							this.afterUpdate?.( document, prop )
						}
						else await Promise.resolve()
					})
				])
			}))
		}))	

		this.onAllPropsUpdatedCallback?.()
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

	private beforeUpdate: (( document: Persistent, prop: PersistentProperty ) => void ) | undefined
	private afterUpdate: (( document: Persistent, prop: PersistentProperty ) => void ) | undefined
	private onAllPropsUpdatedCallback: (() => void ) | undefined
	private handlers: DocumentChangeListenerHandler[] = []
	private subscribeToDocumentChangeListener: DocumentChangeListenerSubscriber = ()=> { throw new Error( 'The method subscribeToDocumentChangeListener has not been implemented in the concrete data source' ) }
	private collectionsMatchingTemplate: ( template: string ) => Promise<string[]> = ()=> { throw new Error( 'The method collectionsMatchingTemplate has not been implemented in the concrete data source' ) }
}
