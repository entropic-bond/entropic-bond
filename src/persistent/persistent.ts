import { v4 as uuid } from "uuid"
import { SomeClassProps } from '../types/utility-types';

export type PersistentFactory = () => Persistent

interface FactoryMap {
	[ id: string ]: PersistentFactory
}

export type PersistentObject<T extends Persistent> = Omit<SomeClassProps<T>, 'className'> & {
	__className?: string
	__rootCollections?: Collections
}

export type Collections = {
	[ collectionPath: string ]: PersistentObject<Persistent>[]
}

interface DocumentReference {
	id: string
	className: string
	storedInCollection: string
}

export class Persistent {
	static registerFactory( className: string, factory: () => Persistent ) {
		this._factoryMap[ className ] = factory
	}

	static classFactory( className: string ) {
		if ( !this._factoryMap[ className ] ) throw new Error( `You should register class ${ className } prior to use.` )
		return this._factoryMap[ className ]
	}

	constructor() {
		this._id = uuid()
	}

	get className(): string {
		return this[ '__className' ];
	}

	get id() {
		return this._id;
	}
	
	get wasLoaded() {
		return this._loaded
	}

	protected loaded(){
		this._loaded = true
	}

	fromObject( obj: PersistentObject<this> ) {
		this.fromObj( obj )
		this.loaded()

		return this
	}

	private fromObj( obj: PersistentObject<this> ) {

		this._persistentProperties.forEach( prop => {
			const propName = this.removeUnderscore( prop )

			const value = obj[ propName ]
			if ( value ) {
				this[ prop.name ] = this.fromDeepObject( value )
			}
		})

		return this
	}

	toObject(): PersistentObject<this> {
		const rootCollections: Collections = {}
		const obj = this.toObj( rootCollections )
		this.pushDocument( rootCollections, this.className, obj )

		return {
			...obj,
			__rootCollections: rootCollections
		}
	}

	private toObj( rootCollections: Collections ): PersistentObject<this> {
		const obj: PersistentObject<this> = {} as any
		if ( !this.className ) throw new Error( 'You should register this class prior to streaming it.' )

		this._persistentProperties.forEach( prop => {
			const propValue = this[ prop.name ]
			const propName = this.removeUnderscore( prop )
			
			if ( propValue ) {

				if ( prop.isReference ) {
					obj[ propName ] = this.toReferenceObj( prop, rootCollections )
				}
				else {
					obj[ propName ] = this.toDeepObj( propValue, rootCollections )
				}

			}
		})

		obj[ '__className' ] = this.className

		return obj
	}

	private fromDeepObject( value: unknown ) {

		if ( Array.isArray( value ) ) {
			return value.map( item => this.fromDeepObject( item ) )
		}

		if ( value[ '__className' ] ) {
			return Persistent.createInstance( value as PersistentObject<Persistent> )
		}

		if ( value[ '__documentReference' ] ) {
			const ref: DocumentReference = value[ '__documentReference' ]
			const emptyInstance = Persistent.classFactory( ref.className )()
			emptyInstance.fromObj( ref )
			emptyInstance[ '__referenceStoredInCollection' ] = ref.storedInCollection

			return emptyInstance
		}

		if ( typeof value === 'object' ) {
			const newObject = {}

			Object.entries( value ).forEach(
				( [ key, value ] ) => newObject[ key ] = this.fromDeepObject( value )
			)

			return newObject
		}

		return value
	}

	private toDeepObj( value: unknown, rootCollections: Collections ) {

		if ( Array.isArray( value ) ) {
			return value.map( item => this.toDeepObj( item, rootCollections ) )
		}

		if ( value instanceof Persistent ) {
			return value.toObj( rootCollections )
		}

		if ( typeof value === 'object' ) {
			const newObject = {}

			Object.entries( value ).forEach(
				( [ key, val ] ) => newObject[ key ] = this.toDeepObj( val, rootCollections )
			)

			return newObject
		}

		return value
	}

	private toReferenceObj( prop: PersistentProperty, rootCollections: Collections ) {
		const propValue: Persistent | Persistent[] = this[ prop.name ]
		
		const collectionPath = ( value: Persistent ) => prop.storeInCollection || value.className
		
		const buildRefObject = ( value: Persistent ) => ({
			__documentReference: {
				storedInCollection: collectionPath( value ),
				className: value.className,
				id: value.id
			} as DocumentReference
		}) 

		if ( Array.isArray( propValue ) ) {

			return propValue.map( item => {
				this.pushDocument( rootCollections, collectionPath( item ), this.toDeepObj( item, rootCollections ) )
				return buildRefObject( item )
			})

		}
		else {

			this.pushDocument( rootCollections, collectionPath( propValue ), this.toDeepObj( propValue, rootCollections ) )
			return buildRefObject( propValue )

		}
	}

	getCollectionWhereReferenceIsStored(): string {
		return this['__referenceStoredInCollection']
	}

	private pushDocument( collections: Collections, collectionName: string, document: PersistentObject<this> ) {
		if ( !collections[ collectionName ] ) collections[ collectionName ] = []
		collections[ collectionName ].push( document )
	}

	private removeUnderscore( prop: PersistentProperty ) {
		return prop.name.slice(1)
	}

	static createInstance<T extends Persistent>( obj: PersistentObject<T>): T {
		const instance = Persistent.classFactory( obj.__className )()
		return instance.fromObject( obj ) as T
	}

	@persistent private _id: string
	// @persistent private __documentReference: DocumentReference
	private _loaded: boolean
	private _persistentProperties: PersistentProperty[]
	private static _factoryMap: FactoryMap = {}
}

///////////////////////////////////
//Decorators
///////////////////////////////////

interface PersistentProperty {
	name: string
	isReference?: boolean
	storeInCollection?: string
	toObjectSpecial?: ( classObj: any ) => any
	fromObjectSpecial?: ( obj: any ) => any
}

export function persistent( target: Persistent, property: string ) {
	return persistentParser()( target, property );
}

export function persistentReferenceAt( collectionPath: string ) {
	return function( target: Persistent, property: string ) {
		return persistentParser({ 
			storeInCollection: collectionPath,
			isReference: true
		})( target, property )
	}
}

export function persistentReference( target: Persistent, property: string ) {
	return persistentParser({ isReference: true })( target, property )
}

export function persistentParser( options?: Partial<PersistentProperty> ) {
	return function( target: Persistent, property: string ) {

		// from: https://stackoverflow.com/questions/43912168/typescript-decorators-with-inheritance
		// should work like this in order to avoid propagation of persistent properties from one class to others
		if ( !Object.getOwnPropertyDescriptor( target, '_persistentProperties' ) ) {
			if ( target[ '_persistentProperties' ] ) {
				target[ '_persistentProperties' ] = [ ...target[ '_persistentProperties' ] ]
			}
			else target[ '_persistentProperties' ] = []
		}

		target[ '_persistentProperties' ].push( {
			name: property,
			...options
		} )
	}
}

export function registerClassFactory( className: string, factory: PersistentFactory ) {
	Persistent.registerFactory( className, factory )
	return ( constructor: Function ) => {
		constructor.prototype.__className = className
	}
}




