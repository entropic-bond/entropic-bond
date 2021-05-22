import { v4 as uuid } from "uuid"
import { SomeClassProps } from '../types/utility-types';

export type PersistentFactory = () => Persistent

interface FactoryMap {
	[ id: string ]: PersistentFactory
}

export type PersistentObject<T extends Persistent> = Omit<SomeClassProps<T>, 'className'> & {
	__className?: string
}

type Collections = PersistentObject<Persistent>[]

export type PersistentCollections<T extends Persistent> = PersistentObject<T> & {
	__rootCollections: Collections
}

export class Persistent {
	static registerFactory<T extends Persistent>( className: string, factory: () => T ) {
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
			const propName = prop.name.slice( 1 )		//removes leading underscore

			const value = obj[ propName ]
			if ( value ) {
				this[ prop.name ] = this.fromDeepObject( value )
			}
		})

		return this
	}

	toObject(): PersistentCollections<this> {
		const rootCollections = []
		const obj = this.toObj( rootCollections )
		rootCollections.push( obj )

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
			const propName = prop.name.slice( 1 )		//removes leading underscore
			
			if ( propValue ) {

				if ( prop.isDocument ) {

					if ( !obj[ propName ] ) obj[ propName ] = {}

					obj[ propName ].__documentRef = {
						collection: propValue.className,
						id: propValue.id
					}

					rootCollections.push( this.toDeepObj( propValue, rootCollections ) )
				}
				else {
					obj[ propName ] = this.toDeepObj( propValue, rootCollections )
				}
			}
		} )

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

		if ( value[ '__documentRef' ] ) {
			const emptyInstance = Persistent.classFactory( value[ '__documentRef' ].collection )()
			emptyInstance.fromObj( value[ '__documentRef' ] )

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

	static createInstance<T extends Persistent>( obj: PersistentObject<T>): T {
		const instance = Persistent.classFactory( obj.__className )()
		return instance.fromObject( obj ) as T
	}

	@persistent private _id: string
	private _loaded: boolean
	private _persistentProperties: PersistentProperty[]
	private static _factoryMap: FactoryMap = {}
}

interface PersistentProperty {
	name: string
	isDocument?: boolean
	toObjectSpecial?: ( classObj: any ) => any
	fromObjectSpecial?: ( obj: any ) => any
}

///////////////////////////////////
//Decorators
///////////////////////////////////

export function persistent( target: Persistent, property: string ) {
	return persistentParser()( target, property );
}

export function persistentParser( options?: Partial<PersistentProperty> ) {
	return function ( target: Persistent, property: string ) {

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

export function persistentDoc( target: Persistent, property: string ) {
	return persistentParser( { isDocument: true } )( target, property )
}

export function registerClassFactory( className: string, factory: PersistentFactory ) {
	Persistent.registerFactory( className, factory )
	return ( constructor: Function ) => {
		constructor.prototype.__className = className
	}
}




