import { v4 as uuid } from "uuid"
import { ClassPropNames, SomeClassProps } from '../types/utility-types';

export type PersistentConstructor = new () => Persistent

interface FactoryMap {
	[ id: string ]: {
		factory: PersistentConstructor
		annotation: unknown
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

export type MakePersistentObjects<T> = {
  [A in keyof T]: T[A] extends Persistent? PersistentObject<T[A]> : MakePersistentObjects<T[A]>
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
	static registerFactory( className: string, factory: PersistentConstructor, annotation?: unknown ) {
		this._factoryMap[ className ] = { factory, annotation }
	}

	static classFactory( className: string ) {
		if ( !this._factoryMap[ className ] ) throw new Error( `You should register class ${ className } prior to use.` )
		return this._factoryMap[ className ].factory
	}

	static registeredClasses() {
		return Object.keys( this._factoryMap )
	}

	static classesExtending( derivedFrom: PersistentConstructor | Function ) {
		return Object.entries( this._factoryMap )
			.filter(([ , obj ]) => new ( obj.factory ) instanceof derivedFrom )
			.map(([ className ]) => className )
	}

	static annotations( className: string | Persistent | PersistentConstructor ) {
		if ( className instanceof Persistent ) className = className.className
		else if ( typeof className === 'string' ) className
		else className = new className().className

		if ( !this._factoryMap[ className ] ) throw new Error( `You should register class ${ className } prior to use.` )
		return this._factoryMap[ className ].annotation
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

	protected onSerialized() {}
	protected beforeSerialize() {}

	getPersistentProperties(): readonly PersistentProperty[] {
		return this._persistentProperties.map( prop => ({
			...prop,
			name: prop.name.slice( 1 ) 
		}))
	}

	clone( instance: Persistent ) {
		const obj = instance.toObject() as any
		delete obj['id']
		this.fromObject( obj )
	}

	fromObject( obj: PersistentObject<this> ) {
		this.fromObj( obj )
		this.onSerialized()

		return this
	}

	private fromObj( obj: PersistentObject<this> ) {

		this._persistentProperties.forEach( prop => {
			const propName = this.removeUnderscore( prop )

			const value = obj[ propName ]
			if ( value !== undefined && value !== null ) {
				this[ prop.name ] = this.fromDeepObject( value )
			}
		})

		return this
	}

	toObject(): PersistentObject<this> {
		this.beforeSerialize()
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
			
			if ( propValue !== undefined && propValue !== null ) {

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
		if ( value === undefined || value === null ) return value
		
		if ( Array.isArray( value ) ) {
			return value.map( item => this.fromDeepObject( item ) )
		}

		if ( value[ '__documentReference' ] ) {
			const ref: DocumentReference = value as DocumentReference
			const emptyInstance = Persistent.createInstance( ref )
			// emptyInstance._id = ref.id
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

	private toDeepObj( value: any, rootCollections: Collections ) {
		if ( value === null || value === undefined ) {
			return undefined
		}

		if ( Array.isArray( value ) ) {
			return value.map( item => this.toDeepObj( item, rootCollections ) )
		}

		if ( value[ '__documentReference' ] ) return value
		
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
		
		const collectionPath = ( value: Persistent ) => {
			let storeInCollection: string

			if ( typeof prop.storeInCollection === 'function' ) {
				storeInCollection = prop.storeInCollection( value, prop )
			}
			else {
				storeInCollection = prop.storeInCollection || value.className
			}
			return storeInCollection
		}
		
		if ( Array.isArray( propValue ) ) {

			return propValue.map( item => {
				if ( !prop.isPureReference ) {
					this.pushDocument( rootCollections, collectionPath( item ), item )
				}
				return this.buildRefObject( item, collectionPath( item ), prop.forcedPersistentProps )
			})

		}
		else {
			if ( !prop.isPureReference ) {
				this.pushDocument( rootCollections, collectionPath( propValue ), propValue )
			}
			return this.buildRefObject( propValue, collectionPath( propValue ), prop.forcedPersistentProps )

		}
	}

	private buildRefObject( value: Persistent, storeInCollection: string, forcedPersistentProps: ClassPropNames<Persistent>[] ): DocumentReference {
		const forcedObject = forcedPersistentProps?.reduce( ( obj, propName ) => {
			if ( value[ propName ] !== undefined ) obj[ propName ] = value[ propName ]
			return obj
		}, {})

		return {
			id: value.id,
			__className: value.className || value['__className'],
			__documentReference: {
				storedInCollection: storeInCollection
			}, 
			...forcedObject	
		}
	}

	private pushDocument( collections: Collections, collectionName: string, value: PersistentObject<Persistent> ) {
		if ( value.__documentReference ) return
		
		if ( !collections[ collectionName ] ) collections[ collectionName ] = []
		const document = this.toDeepObj( value, collections )
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
			try {
				const instance = new ( Persistent.classFactory( obj.__className ) )
				return instance.fromObject( obj ) as T
			}
			catch ( e ) {
				throw new Error( `${ e } Class name not found in object ${ JSON.stringify( obj ) }.` )
			}
		}
	}

	@persistent private _id: string
	private _persistentProperties: PersistentProperty[]
	private static _factoryMap: FactoryMap = {}
}

///////////////////////////////////
//Decorators
///////////////////////////////////

type CollectionPathCallback = ( value: Persistent, prop: PersistentProperty ) => string

interface PersistentProperty {
	name: string
	isReference?: boolean
	isPureReference?: boolean
	storeInCollection?: string | CollectionPathCallback
	subCollection?: string
	forcedPersistentProps?: ClassPropNames<Persistent>[]
	toObjectSpecial?: ( classObj: any ) => any
	fromObjectSpecial?: ( obj: any ) => any
}

export function persistent( target: Persistent, property: string ) {
	return persistentParser()( target, property );
}

export function persistentReferenceAt( collectionPath: string | CollectionPathCallback ) {
	return function( target: Persistent, property: string ) {
		return persistentParser({ 
			storeInCollection: collectionPath,
			isReference: true
		})( target, property )
	}
}

/**
 * Decorator for a property that is a reference to a persistent object. 
 * The reference content is automatically stored in a collection. The collection 
 * is determined by the class name of the decorated property. 
 * @see persistentPureReference
 */
export function persistentReference( target: Persistent, property: string ) {
	return persistentParser({ isReference: true })( target, property )
}

/**
 * Decorator to declare a persistent reference (see @persistentReference) that stores
 * the values in forcedPersistentProps as values in the reference object. This is useful
 * when you are not able to wait for population of referenced properties.
 * @param forcedPersistentProps the properties whose values should be stored in the reference object
 * @param storedInCollection indicates the path of the collection where this reference is stored
 */
 export function persistentReferenceWithPersistentProps<T extends Persistent>( forcedPersistentProps: ClassPropNames<T>[], storeInCollection?: string | CollectionPathCallback ) {
	return function( target: Persistent, property: string ) {
		const persistentProps: Partial<PersistentProperty> = { 
			isReference: true, 
			forcedPersistentProps: forcedPersistentProps as ClassPropNames<Persistent>[],
			storeInCollection: storeInCollection
		}
		return persistentParser( persistentProps )( target, property )
	}
}

/**
 * Decorator for a property that is a reference to a persistent object. 
 * In this case, and contrary to the @persistentReference decorator, the reference 
 * contents is not stored. Only the reference information is stored.
 * @see persistentReference
 */
 export function persistentPureReference( target: Persistent, property: string, storeInCollection?: string | CollectionPathCallback ) {
	return persistentParser({ isReference: true, isPureReference: true, storeInCollection })( target, property )
}

/**
 * Decorator to declare a persistent reference (see @persistentReference) that stores
 * the values in forcedPersistentProps as values in the reference object. This is useful
 * when you are not able to wait for population of referenced properties.
 * @param forcedPersistentProps the properties whose values should be stored in the reference object
 */
 export function persistentPureReferenceWithPersistentProps<T extends Persistent>( forcedPersistentProps: ClassPropNames<T>[], storeInCollection?: string | CollectionPathCallback ) {
	return function( target: Persistent, property: string ) {
		return persistentParser({ isReference: true, isPureReference: true, forcedPersistentProps: forcedPersistentProps as ClassPropNames<Persistent>[], storeInCollection })( target, property )
	}
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

export function registerPersistentClass( className: string, annotation?: unknown ) {
	return ( constructor: PersistentConstructor ) => {
		Persistent.registerFactory( className, constructor, annotation )
		constructor.prototype.__className = className
	}
}

