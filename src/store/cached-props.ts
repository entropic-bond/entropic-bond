import { PersistentProperty, Persistent, DocumentChange } from '../persistent/persistent'
import { Collection } from '../types/utility-types'
import { DocumentChangeListenerHandler, DocumentChangeListener } from './data-source'
import { Store } from './store'

interface PropWithOwner { 
	prop: PersistentProperty
	propOwnerClassName: string 
}

export class UpdateCachedProps {
	constructor( private onAllPropsUpdated?: () => void ) {}

	installCachedPropsUpdaters(): DocumentChangeListenerHandler[] {
		const referencesWithCachedProps = Persistent.getSystemRegisteredReferencesWithCachedProps()
		const collectionsToWatch: Collection<PropWithOwner[]> = {}

		Object.entries( referencesWithCachedProps ).forEach(([ className, props ]) => {
			props.forEach( propInfo => {
				if ( !propInfo.typeName ) return
				const typeNames = Array.isArray( propInfo.typeName ) ? propInfo.typeName : [ propInfo?.typeName ?? className ]

				typeNames.map( tName => Persistent.collectionPath( Persistent.createInstance( tName ), propInfo )).forEach( collection => {
					if ( !collectionsToWatch[ collection ] ) collectionsToWatch[ collection ] = []
					collectionsToWatch[ collection ]!.push({
						prop: propInfo,
						propOwnerClassName: className
					})
				})
			})
		})

		const handlers: DocumentChangeListenerHandler[] = []
		Object.entries( collectionsToWatch ).forEach(([ collectionNameToListen, props ]) => {

			const listener = this.subscribeToDocumentChangeListener( collectionNameToListen, e => this.onDocumentChange( e, props ) )

			if ( !listener ) throw new Error( `The method documentChangeListener has not been implemented in the concrete data source` )
			else handlers.push( listener )
		})

		return handlers
	}

	protected subscribeToDocumentChangeListener( collectionPathToListen: string, listener: DocumentChangeListener<Persistent> ): DocumentChangeListenerHandler | undefined {
		const model = Store.getModel<Persistent>( collectionPathToListen )
		const handler = model.onCollectionChange( model.find(), event => {
			const snapshot = event[0]!
			listener( snapshot )
		})
		
		return {
			uninstall: handler,
			nativeHandler: handler,
			collectionPath: collectionPathToListen
		}
	}

	protected async onDocumentChange( event: DocumentChange<Persistent>, propsToUpdate: PropWithOwner[] ) {
		if ( !event.before ) return

		await Promise.all( propsToUpdate.map( async propWithOwner => {
			const ownerCollection = UpdateCachedProps.ownerCollectionPath( Persistent.createInstance( propWithOwner.propOwnerClassName ), propWithOwner.prop, event.params )
			const ownerModel = Store.getModel<any>( ownerCollection )
			let query = ownerModel.find()

			let hasChanges = false
			propWithOwner.prop.cachedProps?.forEach( persistentPropName => {
				const oldValue = event.before![ persistentPropName ]
				const newValue = event.after![ persistentPropName ]
				if ( oldValue !== newValue ) hasChanges = true
			})

			if ( hasChanges ) {
				if ( propWithOwner.prop.searchableArray ) query = query.where( propWithOwner.prop.name, 'contains', event.before! )
				else query = query.where( propWithOwner.prop.name, '==', event.before! )
			}

			const result = await query.get()

			return Promise.all([
				result.map( async document =>{
					let hasChanges = false
					propWithOwner.prop.cachedProps?.forEach( persistentPropName => {
						const oldValue = event.before![ persistentPropName ]
						const newValue = event.after![ persistentPropName ]
						if ( oldValue !== newValue ) hasChanges = true
					})
					if ( hasChanges ) {
						if ( propWithOwner.prop.searchableArray ) {
							const index = ( document[ propWithOwner.prop.name ] as Persistent[] ).findIndex( obj => obj.id === event.before!.id )
							document[ propWithOwner.prop.name ][ index ] = event.after
						}
						else {
							document[ `_${ propWithOwner.prop.name }` ] = event.after
						}
						// await document.markAsServerChange()
						await ownerModel.save( document )
					}
					else await Promise.resolve()
				})
			])
		}))

		if ( this.onAllPropsUpdated ) this.onAllPropsUpdated()
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
}
