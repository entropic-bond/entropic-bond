import { v4 as uuid } from 'uuid'
import { ClassPropNames, ClassPropNamesOfType, Primitive, SomeClassProps, UnderscoredProp } from '../types/utility-types'

export type PersistentConstructor = new () => Persistent

export type DocumentChangeType = 'create' | 'update' | 'delete'
export interface DocumentChange<T extends Persistent | PersistentObject<Persistent>> {
	before?: T
	after?: T
	params?: { [key: string]: any }
	type: DocumentChangeType
}

interface FactoryMap {
	[ id: string ]: {
		factory: PersistentConstructor
		annotation: unknown
		isLegacy?: boolean
	}
}

/**
 * The corresponding type of the plain object of a persistent class.
 */
export type PersistentObject<T extends Persistent> = Omit<SomeClassProps<T>, 'className'> & Partial<DocumentReference> & {
	__className: string
	__rootCollections?: Collections
}

export type PersistentObjectWithId<T extends Persistent> = PersistentObject<T> & {
	id: string
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
	[ collectionPath: string ]: PersistentObjectWithId<Persistent>[] | undefined
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

type PersistentPropertyCollection = {
	[className: string]: PersistentProperty[]
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
	static registerFactory( className: string, factory: PersistentConstructor, annotation?: unknown, isLegacy: boolean = false ) {
		this._factoryMap[ className ] = { factory, annotation, isLegacy }
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
		return this._factoryMap[ className ]!.factory
	}

	/**
	 * Returns the names of all registered classes
	 * @returns the names of all registered classes
	 * @see registerFactory
	 * @see classFactory
	 */
	static registeredClasses() {
		return Object.entries( this._factoryMap )
			.filter(([ , obj ]) => !obj.isLegacy )
			.map(([ className ]) => className )
	}

	/**
	 * Returns the names of all registered classes, including legacy names
	 * @returns the names of all registered classes, including legacy names
	 * @see registerFactory
	 * @see classFactory
	 */
	static registeredClassesAndLegacyNames() {
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
			.filter(([ , obj ]) => new ( obj.factory ) instanceof derivedFrom && !obj.isLegacy )
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
		return this._factoryMap[ className ]!.annotation
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
		if ( !this._persistentProperties ) return []
		return this._persistentProperties.map( prop => ({
			...prop,
			name: prop.name.slice( 1 ) 
		}))
	}

	/**
	 * Get the property information of this instance
	 * @param propName the persistent property name
	 * @returns the property information
	 */
	getPropInfo<T extends this>( propName: ClassPropNames<T> ): PersistentProperty {
		const propInfo = this.getPersistentProperties().find( prop => prop.name === propName as string )
		if ( !propInfo ) throw new Error( `Property "${ propName as string }" has not been registered.` )
		return propInfo
	}

	/**
	 * Query if the property is required
	 * To mark a property as required, use the @required decorator
	 * @param propName the persistent property name
	 * @returns true if the property is required
	 * @see required
	 */
	isRequired<T extends this>( propName: ClassPropNames<T> ): boolean {
		const validator = this.getPropInfo( propName ).validator
		return validator !== undefined && validator !== null
	}

	/**
	 * Query if the property value is valid
	 * Define the validator function using the @required decorator
	 * @param propName the persistent property name
	 * @returns true if the property value is valid using the validator function
	 * passed to the @required decorator
	 * @see required
	 */
	isPropValueValid<T extends this>( propName: ClassPropNames<T> ): boolean {
		const propInfo = this.getPropInfo( propName )
		if ( !propInfo.validator ) return true
		return propInfo.validator( this[ propInfo.name ], propInfo, this )
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
	fromObject( obj: Partial<PersistentObject<this>> |{}): this {
		this.fromObj( obj )
		this.afterDeserialize()

		return this
	}

	private fromObj( obj: Partial<PersistentObject<this>> | {}) {
		if ( !this._persistentProperties ) return this

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
		const rootCollections: Collections = {}
		const obj = this.toObj( rootCollections )
		this.pushDocument( rootCollections, this.className, obj )

		return {
			...obj,
			__rootCollections: rootCollections
		}
	}

	private toObj( rootCollections: Collections ): PersistentObject<this> {
		if ( !this._persistentProperties ) return {} as PersistentObject<this>
		this.beforeSerialize()

		const obj: PersistentObject<this> = {} as any
		if ( !this.className ) throw new Error( `You should register \`${ this.constructor.name || this.toString() || 'this' }\` class prior to streaming it.` )

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

				if ( prop.searchableArray ) {
					obj[ Persistent.searchableArrayNameFor( propName ) ] = propValue.map(( value: PersistentObject<Persistent> ) => value.id )
				}
			}
		})

		obj[ '__className' ] = this.className

		return obj
	}

	static searchableArrayNameFor( propName: string ) {
		return `__${ propName }_searchable`
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

	static collectionPath( ownerInstance: Persistent, prop: PersistentProperty ) {
		let storeInCollection: string

		if ( typeof prop.storeInCollection === 'function' ) {
			storeInCollection = prop.storeInCollection( ownerInstance, prop )
		}
		else {
			storeInCollection = prop.storeInCollection ?? ownerInstance.className
		}
		return storeInCollection
	}

	private toReferenceObj( prop: PersistentProperty, rootCollections: Collections ) {
		const propValue: Persistent | Persistent[] = this[ prop.name ]
		
		if ( Array.isArray( propValue ) ) {

			return propValue.map( item => {
				if ( !prop.isPureReference ) {
					this.pushDocument( rootCollections, Persistent.collectionPath( item, prop ), item )
				}
				return this.buildRefObject( item, Persistent.collectionPath( item, prop ), prop.cachedPropsConfig?.cachedProps )
			})

		}
		else {
			if ( !prop.isPureReference ) {
				this.pushDocument( rootCollections, Persistent.collectionPath( propValue, prop ), propValue )
			}
			return this.buildRefObject( propValue, Persistent.collectionPath( propValue, prop ), prop.cachedPropsConfig?.cachedProps )

		}
	}

	private buildRefObject( value: Persistent, storeInCollection: string, cachedProps?: ClassPropNames<Persistent>[] ): DocumentReference {
		const forcedObject = cachedProps?.reduce( ( obj, propName ) => {
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

	private pushDocument( collections: Collections, collectionName: string, value: DocumentReference | Persistent | PersistentObject<this> ) {
		if ( '__documentReference' in value && value.__documentReference ) return
		
		if ( !collections[ collectionName ] ) collections[ collectionName ] = []
		const document = this.toDeepObj( value, collections )
		collections[ collectionName ]!.push( document )
	}

	private removeUnderscore( prop: PersistentProperty ) {
		return prop.name.slice(1)
	}

	static createReference<T extends Persistent>( obj: PersistentObject<T> | string ): T {
		const instance = Persistent.createInstance( obj )
		instance['__documentReference'] = obj['__documentReference'] || { storedInCollection: instance.className }
		return instance
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
				const stringifiedObj = Object.entries( obj )
					.filter(([ _key, value ])=> value !== undefined && value !== null && typeof value !== 'function' )
					.map(([ key, value ])=>`${ key }: ${ value }` )
					.join( ',\n\t' )
				throw new Error( `${ e }\n-----> Class name not found in object:\n{\n\t ${ stringifiedObj } \n}\n` )
			}
		}
	}

	static propInfo<T extends Persistent>( registeredClassName: string, propName: ClassPropNames<T> ): PersistentProperty {
		const inst = Persistent.createInstance( registeredClassName )
		return inst.getPropInfo( propName )
	}

	/**
	 * Retrieves a collection of references with the properties that are stored in the reference object
	 * @returns the references collection
	 */
	static getSystemRegisteredReferencesWithCachedProps(): PersistentPropertyCollection {
		const systemRegisteredClasses = Persistent.registeredClassesAndLegacyNames()
		const referencesWithStoredProps = systemRegisteredClasses.reduce(( referencesWithStoredProps, className ) => {
			const inst = Persistent.createInstance( className )
			const propsWithStoredValue = inst.getPersistentProperties().filter( 
				propInfo => propInfo.cachedPropsConfig?.cachedProps
			)
			if ( propsWithStoredValue.length > 0 ) referencesWithStoredProps[className] = propsWithStoredValue
			return referencesWithStoredProps
		}, {} as PersistentPropertyCollection )
		
		return referencesWithStoredProps
	}

	@persistent private _id: string
	private _persistentProperties: PersistentProperty[] | undefined
	private static _factoryMap: FactoryMap = {}
}

///////////////////////////////////
//Decorators
///////////////////////////////////

type CollectionPathCallback = ( value: Persistent, prop: PersistentProperty ) => string
type ValidatorFunction<T extends Persistent, P extends ClassPropNames<T>> = ( value: T[P], property: PersistentProperty, persistentInstance: T ) => boolean
export type OwnerCollectionResolver = ( ownerClassName: string, params: {} ) => string
/**
 * Cached properties configuration
 * @param cachedProps an array of properties whose values should be stored in the reference object
 * @param updater a function that is called when the referenced object is updated
 * @param ownerCollectionResolver a function that returns the collection path where the reference is stored
 * @see persistentReferenceWithCachedProps
 * @see persistentPureReferenceWithCachedProps
 */
export type CachedPropsConfig<T extends Persistent> = {
	cachedProps: ClassPropNamesOfType<T,Primitive>[]
	updater?: ( event: DocumentChange<T>, property: PersistentProperty ) => Promise<void>
	ownerCollectionResolver?: OwnerCollectionResolver
}

export interface PersistentProperty {
	name: string
	isReference?: boolean
	isPureReference?: boolean
	storeInCollection?: string | CollectionPathCallback
	subCollection?: string
	toObjectSpecial?: ( classObj: any ) => any
	fromObjectSpecial?: ( obj: any ) => any
	searchableArray?: boolean
	validator?: ValidatorFunction<any, any>
	typeName?: string | string[]
	cachedPropsConfig?: CachedPropsConfig<Persistent>
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
 * the values in cachedProps as values in the reference object. This is useful
 * when you are not able to wait for population of referenced properties.
 * @param cachedPropsConfig Pass an array of properties whose values should be stored in the reference object or an object
 * with the cachedProps configuration.
 * @param storedInCollection indicates the path of the collection where this reference is stored
 * @param propTypeName the accepted type name or type names of the property
 * @see persistentReference
 * @see CachedPropsConfig
 * @see persistentPureReferenceWithCachedProps
 * @sample
 * class UserGroup extends Persistent {
 * 	@persistentReferenceWithCachedProps( ['name', 'email'], 'Customer/Clients', 'User' ) private _friend: User
 * }
 * 
 * class SpecialUserGroup extends Persistent {
 * 	@persistentReferenceWithCachedProps( { cachedProps: ['name', 'email'], updater: async ( event, prop ) => {
 * 		// do something when the referenced user is updated
 * 	}}, undefined, [ 'SpecialUser', 'User' ] ) private _friend: User
 */
export function persistentReferenceWithCachedProps<T extends Persistent>( cachedPropsConfig: CachedPropsConfig<T> | ClassPropNamesOfType<T, Primitive>[], storeInCollection?: string | CollectionPathCallback, propTypeName?: string | string[] ) {
	const config = Array.isArray( cachedPropsConfig )? { cachedProps: cachedPropsConfig } : cachedPropsConfig
	return function( target: Persistent, property: string ) {
		const persistentProps: Partial<PersistentProperty> = { 
			isReference: true, 
			storeInCollection: storeInCollection,
			typeName: propTypeName,
			cachedPropsConfig: config as unknown as CachedPropsConfig<Persistent>
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
 * the values of the properties listed in cachedProps as values in the reference object. This is useful
 * when you only need a few properties to be available without needing to populate the referenced property.
 * @param cachedPropsConfig Pass an array of properties whose values should be stored in the reference object or an object
 * with the cachedProps configuration.
 * @param storedInCollection indicates the path of the collection where this reference is stored
 * @param propTypeName the accepted type name or type names of the property
 * @see persistentReferenceWithCachedProps
 * @see persistentPureReference
 * @see CachedPropsConfig
 * @see persistentReferenceWithCachedProps
 * @sample
 * class UserGroup extends Persistent {
 * 	@persistentPureReferenceWithCachedProps( ['name', 'email'], 'Customer/Clients', 'User' ) private _friend: User
 * }
 * 
 * class SpecialUserGroup extends Persistent {
 * 	@persistentPureReferenceWithCachedProps( { cachedProps: ['name', 'email'], updater: async ( event, prop ) => {
 * 		// do something when the referenced user is updated
 * 	}}, undefined, [ 'SpecialUser', 'User' ] ) private _friend: User
 * }
 * // the reference object will contain the properties name and email of the referenced user
 * // without having to populate the _friend property
 */
export function persistentPureReferenceWithCachedProps<T extends Persistent>( cachedPropsConfig: CachedPropsConfig<T> | ClassPropNamesOfType<T, Primitive>[], storeInCollection?: string | CollectionPathCallback, propTypeName?: string | string[] ) {
	return function( target: Persistent, property: string ) {
		const config = Array.isArray( cachedPropsConfig )? { cachedProps: cachedPropsConfig } : cachedPropsConfig
		return persistentParser({ 
			isReference: true, 
			isPureReference: true, 
			storeInCollection: storeInCollection,
			typeName: propTypeName,
			cachedPropsConfig: config as unknown as CachedPropsConfig<Persistent>
		})( target, property )
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

		const propInfo = target[ '_persistentProperties' ]!.find( prop => prop.name === property )
		if ( propInfo ) {
			Object.assign( propInfo, options )
		}
		else {
			target[ '_persistentProperties' ]!.push({
				name: property,
				...options
			})
		}
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
		Persistent.registerFactory( legacyName, constructor, undefined, true )
	}
}

/**
 * Decorator to make a `Persistent` array property searchable by the 
 * persistance engine.
 * When a property is marked as searchable, the persistance engine will
 * generate internally a new property with the same name but with the suffix `_searchable`
 * and prefixed with the `_` character. This new property will contain an array
 * with the `id` of the persistent elements in the original array.
 */ 
export function searchableArray( target: Persistent, property: string ) {
	return persistentParser({ searchableArray: true })( target, property )
}

/**
 * Decorator to mark the property as required.
 * @see requiredWithValidator
 */
export function required( target: Persistent, property: string ) {
	return persistentParser({ validator: ( value: any ) => value !== undefined && value !== null })( target, property )
}

/**
 * Decorator to mark the property as required.
 * @param validator a function that returns true if the property value is valid. 
 * By default, the property is valid if it is not undefined and not null.
 * @see required
 */
export function requiredWithValidator<T extends Persistent, P extends ClassPropNames<T>>( validator: ValidatorFunction<T, P> = ( value: T[P] ) => value !== undefined && value !== null ) {
	return function( target: T, property: UnderscoredProp<P> ) {
		return persistentParser({ validator: validator })( target, property )
	}
}
