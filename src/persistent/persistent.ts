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

	fromObject( obj: PersistentObject<this> ) {

		this._persistentProperties.forEach( prop => {
			const value = obj[ prop.name.slice( 1 ) ]
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
			if ( propValue ) {
				if ( prop.isDocument ) {
					if ( !obj[ prop.name.slice( 1 ) ] ) obj[ prop.name.slice( 1 ) ] = {}
					obj[ prop.name.slice( 1 ) ].__document = {
						collection: propValue.className,
						documentId: propValue.id
					}
					rootCollections.push( this.toDeepObj( propValue, rootCollections ) )
				}
				else {
					obj[ prop.name.slice( 1 ) ] = this.toDeepObj( propValue, rootCollections )
				}
			}
		} )

		obj[ '__className' ] = this.className

		return obj
	}

	private fromDeepObject( obj: unknown ) {
		if ( Array.isArray( obj ) ) {
			return obj.map( item => this.fromDeepObject( item ) )
		}
		if ( obj[ '__className' ] ) {
			return this.createInstaceFromObject( obj as PersistentObject<Persistent> )
		}
		if ( typeof obj === 'object' ) {
			const newObject = {}

			Object.entries( obj ).forEach(
				( [ key, value ] ) => newObject[ key ] = this.fromDeepObject( value )
			)

			return newObject
		}
		return obj
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

	private createInstaceFromObject( value: PersistentObject<Persistent> ) {
		const instance = Persistent.classFactory( value.__className )()
		return instance.fromObject( value )
	}

	@persistent private _id: string
	private _persistentProperties: PersistentProperty[]
	private static _factoryMap: FactoryMap = {}
}

interface PersistentProperty {
	name: string
	// isCollection?: boolean
	isDocument?: boolean
	toObjectSpecial?: ( classObj: any ) => any
	fromObjectSpecial?: ( obj: any ) => any
}

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

// export function persistentCollection(target: Persistent, property: string) {
// 	return persistentParser({ isCollection: true })( target, property )
// }

export function persistentDoc( target: Persistent, property: string ) {
	return persistentParser( { isDocument: true } )( target, property )
}

// export function persistentSubCollection(target: Persistent, property: string) {
// 	return persistentParser({ isSubCollection: true })( target, property )
// }

export function registerClassFactory( className: string, factory: PersistentFactory ) {
	Persistent.registerFactory( className, factory )
	return ( constructor: Function ) => {
		constructor.prototype.__className = className
	}
}




