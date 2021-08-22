import { v4 as uuid } from "uuid"
import { SomeClassProps } from '../types/utility-types';

type PersistentConstructor = new () => Persistent
interface Annotations {
	[ key: string ]: unknown
}

interface FactoryMap {
	[ id: string ]: {
		factory: PersistentConstructor
		annotations: Annotations
	}
}

// TODO: review and compare with DocumentReference
export type PersistentObject<T extends Persistent> = Omit<SomeClassProps<T>, 'className'> & {
	__className?: string
	__rootCollections?: Collections
	__documentReference?: {
		storedInCollection: string
	}
}

export type Collections = {
	[ collectionPath: string ]: PersistentObject<Persistent>[]
}

export interface DocumentReference {
	id: string
	__className: string
	__documentReference: {
		storedInCollection: string
	}
}

export class Persistent {
	static registerFactory( className: string, factory: PersistentConstructor, annotations?: Annotations ) {
		this._factoryMap[ className ] = { factory, annotations }
	}

	static classFactory( className: string ) {
		if ( !this._factoryMap[ className ] ) throw new Error( `You should register class ${ className } prior to use.` )
		return this._factoryMap[ className ].factory
	}

	static get persistentClases() {
		return Object.freeze({...this._factoryMap})
	}

	constructor( id: string = uuid() ) {
		this._id = id
	}

	get className(): string {
		return this[ '__className' ];
	}

	protected setId( value: string ) {
		this._id = value
	}

	get id() {
		return this._id;
	}

	protected loaded(){}

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

		if ( value[ '__documentReference' ] ) {
			const ref: DocumentReference = value as DocumentReference
			const emptyInstance = Persistent.createInstance( ref.__className )
			emptyInstance._id = ref.id
			emptyInstance['__documentReference'] = value[ '__documentReference' ]
			return emptyInstance
		}

		if ( value[ '__className' ] ) {
			return Persistent.createInstance( value as PersistentObject<Persistent> )
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
		
		if ( Array.isArray( propValue ) ) {

			return propValue.map( item => {
				this.pushDocument( rootCollections, collectionPath( item ), item )
				return this.buildRefObject( item, collectionPath( item ) )
			})

		}
		else {

			this.pushDocument( rootCollections, collectionPath( propValue ), propValue )
			return this.buildRefObject( propValue, collectionPath( propValue ) )

		}
	}

	private buildRefObject( value: Persistent, storeInCollection: string ): DocumentReference {
		return {
			id: value.id,
			__className: value.className,
			__documentReference: {
				storedInCollection: storeInCollection
			} 
		}
	}

	private pushDocument( collections: Collections, collectionName: string, value: PersistentObject<Persistent> ) {
		if ( value.__documentReference ) return
		const document = this.toDeepObj( value, collections )

		if ( !collections[ collectionName ] ) collections[ collectionName ] = []
		collections[ collectionName ].push( document )
	}

	private removeUnderscore( prop: PersistentProperty ) {
		return prop.name.slice(1)
	}

	static createInstance<T extends Persistent>( obj: PersistentObject<T> | string ): T {
		if ( typeof obj === 'string' ) {
			return new ( Persistent.classFactory( obj ) ) as T
		}
		else {
			const instance = new ( Persistent.classFactory( obj.__className ) )
			return instance.fromObject( obj ) as T
		}
	}

	@persistent private _id: string
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

export function registerPersistentClass( className: string, annotations?: Annotations ) {
	return ( constructor: PersistentConstructor ) => {
		Persistent.registerFactory( className, constructor, annotations )
		constructor.prototype.__className = className
	}
}
