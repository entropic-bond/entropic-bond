import { v4 as uuid } from "uuid"
import { ClassPropNames, SomeClassProps } from '../types/utility-types';

export type PersistentConstructor = new () => Persistent

interface FactoryMap {
	[ id: string ]: {
		factory: PersistentConstructor
		annotation: unknown
	}
}

/**
 * The corresponding type of the plain object of a persistent class.
 */
export type PersistentObject<T extends Persistent> = Omit<SomeClassProps<T>, 'className'> & {
	// TODO: review and compare with DocumentReference
	__className?: string
	__rootCollections?: Collections
	__documentReference?: {
		storedInCollection: string
	}
}

/**
 * The type of the plain object of a persistent class for all the nested properties.
 */
export type MakePersistentObjects<T> = {
  [A in keyof T]: T[A] extends Persistent? PersistentObject<T[A]> : MakePersistentObjects<T[A]>
}

/**
 * A collection of document objects typically returned by Persistent.toObject()
 * @see Persistent.toObject
 */
export type Collections = {
	[ collectionPath: string ]: PersistentObject<Persistent>[]
}

/**
 * Stores information about a reference in another collection.
 */
export interface DocumentReference {
	id: string
	__className: string
	__documentReference: {
		storedInCollection: string
	}
}

/**
 * A class that provides several methods to serialize and deserialize objects.
 */
export class Persistent {

	/**
	 * Registers a class to be used by the persistence engine.
	 * @param className the name of the class to be registered
	 * @param factory the constructor of the registered class
	 * @param annotation an annotation associated with the class
	 */
	static registerFactory( className: string, factory: PersistentConstructor, annotation?: unknown ) {
		this._factoryMap[ className ] = { factory, annotation }
	}

	/**
	 * Returns the constructor of a registered class
	 * @param className the name of the class to be retrieved
	 * @returns the constructor of the class
	 * @throws an error if the class is not registered
	 * @see registerFactory
	 * @see registeredClasses
	 * @see classesExtending
	 * @see annotations
	 */
	static classFactory( className: string | undefined ) {
		if ( !className ) throw new Error( `You should provide a class name.` )
		if ( !this._factoryMap[ className ] ) throw new Error( `You should register class ${ className } prior to use.` )
		return this._factoryMap[ className ].factory
	}

	/**
	 * Returns the names of all registered classes
	 * @returns the names of all registered classes
	 * @see registerFactory
	 * @see classFactory
	 */
	static registeredClasses() {
		return Object.keys( this._factoryMap )
	}

	/**
	 * Returns the names of all registered classes that extend a given class
	 * @param derivedFrom the class to be extended
	 * @returns the names of all registered classes that extend the given class
	 * @see registerFactory
	 * @see classFactory
	 */
	static classesExtending( derivedFrom: PersistentConstructor | Function ) {
		return Object.entries( this._factoryMap )
			.filter(([ , obj ]) => new ( obj.factory ) instanceof derivedFrom )
			.map(([ className ]) => className )
	}

	/**
	 * Returns the annotation associated with a registered class
	 * @param className the name of the class to be retrieved
	 * @returns the annotation associated with the class
	 * @throws an error if the class is not registered
	 * @see registerFactory
	 */
	static annotations( className: string | Persistent | PersistentConstructor ) {
		if ( className instanceof Persistent ) className = className.className
		else if ( typeof className === 'string' ) className
		else className = new className().className

		if ( !this._factoryMap[ className ] ) throw new Error( `You should register class ${ className } prior to use.` )
		return this._factoryMap[ className ].annotation
	}

	/**
	 * Returns a new instance of Persistent class.
	 * @param className the initial id of this instance. If not provided, a new id will be generated
	 */
	constructor( id: string = uuid() ) {
		this._id = id
	}

	/**
	 * Gets the class name of this instance.
	 */
	get className(): string {
		return this[ '__className' ];
	}

	/**
	 * Sets the id of this instance.
	 * @param value the id of this instance
	 */
	protected setId( value: string ) {
		this._id = value
	}

	/**
	 * Returns the id of this instance.
	 * @returns the id of this instance
	 */
	get id() {
		return this._id;
	}

	/**
	 * This method is called by the persistence engine when the instance has been
	 * just serialized. It is called after the properties are initialized with 
	 * serialized data.
	 */
	protected afterDeserialize() {}

	/**
	 * This method is called by the persistence engine before the instance is
	 * serialized. 
	 */
	protected beforeSerialize() {}

	/**
	 * Returns an array of the persistent properties of this instance.
	 * @returns an array of the persistent properties of this instance
	 */
	getPersistentProperties(): readonly PersistentProperty[] {
		return this._persistentProperties.map( prop => ({
			...prop,
			name: prop.name.slice( 1 ) 
		}))
	}

	/**
	 * Copy the persistent properties of the given instance to this instance. 
	 * The property `id` will be ignored.
	 * Only the properties that are not null or undefined will be copied.
	 * @param instance the instance to be copied
	 * @returns this instance
	 * @see fromObject
	 * @see toObject
	 */
	clone( instance: Persistent ): this {
		const obj = instance.toObject() as any
		delete obj['id']
		return this.fromObject( obj )
	}

	/**
	 * Initializes the persistent properties of this instance from the properties 
	 * of given object.
	 * @param obj the object to be copied
	 * @returns this instance
	 * @see clone
	 * @see toObject
	 */
	fromObject( obj: PersistentObject<this> ): this {
		this.fromObj( obj )
		this.afterDeserialize()

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

	/**
	 * Returns a plain object representation of this instance.
	 * Only the properties that are not null or undefined will be copied.
	 * @returns a plain object representation of this instance
	 * @see fromObject
	 * @see clone
	 */
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

	private buildRefObject( value: Persistent, storeInCollection: string, forcedPersistentProps?: ClassPropNames<Persistent>[] ): DocumentReference {
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
				const stringifiedObj = Object.entries( obj ).map(([ key, value ])=>`${ key }: ${ value }` ).join( ',\n\t' )
				throw new Error( `${ e }.\n-----> Class name not found in object:\n{\n ${ stringifiedObj } \n}` )
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

/**
 * Decorator for a property that you want to persist.
 */
export function persistent( target: Persistent, property: string ) {
	return persistentParser()( target, property );
}

/**
 * Decorator for a property that is a reference to a persistent object and should be stored
 * in a specific collection.
 * @param collectionPath the path to the collection where the reference should be stored.
 * @returns 
 */
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
 * contents is not stored even it has been changed. Only the reference information 
 * is stored.
 * @see persistentReference
 */
 export function persistentPureReference( target: Persistent, property: string, storeInCollection?: string | CollectionPathCallback ) {
	return persistentParser({ isReference: true, isPureReference: true, storeInCollection })( target, property )
}

/**
 * Decorator to declare a persistent property as a pure reference (see @persistentPureReference) that stores
 * the values of the properties listed in forcedPersistentProps as values in the reference object. This is useful
 * when you only need a few properties to be available without needing to populate the referenced property.
 * @param forcedPersistentProps the properties whose values should be stored in the reference object
 * @param storedInCollection indicates the path of the collection where this reference is stored
 * @see persistentReferenceWithPersistentProps
 * @see persistentPureReference
 * @sample
 * class User extends Persistent {
 * 	@persistentPureReferenceWithPersistentProps( ['name', 'email'] ) private _friend: User
 * }
 * // the reference object will contain the properties name and email of the referenced user
 * // without having to populate the _friend property
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

/**
 * Decorator to register a persistent class. Entropic Bond needs that you register
 * all persistent classes that you want to use in any persistent stream. 
 * @param className the name of the class
 * @param annotation an optional annotation that can be used to store additional information
 */
export function registerPersistentClass( className: string, annotation?: unknown ) {
	return ( constructor: PersistentConstructor ) => {
		Persistent.registerFactory( className, constructor, annotation )
		constructor.prototype.__className = className
	}
}

/**
 * Decorator to register a legacy name for a persistent class. This is useful when you want to
 * be able to load old data that was stored with a different class name.
 * @param legacyName the legacy name of the class
 */
export function registerLegacyClassName( legacyName: string ) {
	return ( constructor: PersistentConstructor ) => {
		Persistent.registerFactory( legacyName, constructor )
	}
}

