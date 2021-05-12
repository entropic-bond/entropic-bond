import { v4 as uuid } from "uuid"
import { SomeClassProps } from '../types/utility-types';

export type PersistentFactory = () => Persistent

interface FactoryMap {
	[id: string]: PersistentFactory
}

export class Persistent {
	static registerFactory<T extends Persistent>(className: string, factory: () => T) {
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

	fromObject(obj: SomeClassProps<this>) {

		this._persistentProperties.forEach( prop => {
			const value = obj[ prop.name.slice(1) ]
			if ( value ) {

				if ( Array.isArray( value ) ) {
					this[ prop.name ] = this.fromArrayObject( value )
				}
				else {

					if ( value[ '__className' ] ) {
						this[ prop.name ] = this.createFromClassName( value )
					}
					else {
						this[ prop.name ] = value
					}

				}
			}
		})

		return this
	}

	toObject(): SomeClassProps<this> {
		const obj: SomeClassProps<this> = {}
		if ( !this.className ) throw new Error( 'You should register this class prior to streaming it.' )

		this._persistentProperties.forEach( prop => {
			const propValue = this[ prop.name ]
			const propName = prop.name.slice(1)
			
			if ( propValue ) {

				if ( Array.isArray( propValue ) ) {
					obj[ propName ] = this.toArrayObject( propValue )
				}
				else {

					if ( propValue instanceof Persistent ) {
						obj[ propName ]	= propValue.toObject()
					}
					else {
						obj[ propName ] = propValue
					}

				}
			}
		})

		obj[ '__className' ] = this.className

		return obj
	}

	private createFromClassName( value: unknown ) {
		const instance = Persistent.classFactory( value[ '__className' ] )()
		return instance.fromObject( value )
	}

	private toArrayObject( propValue: unknown[]) {
		return propValue.map( item => {
			if ( item instanceof Persistent ) return item.toObject()
			else return item
		})
	}

	private fromArrayObject( value: unknown[] ) {
		return value.map( item => {
			if ( item[ '__className' ] ) return this.createFromClassName( item )
			else return item
		})
	}

	@persistent private _id: string
	private _persistentProperties: PersistentProperty[]
	private static _factoryMap: FactoryMap = {}
}

interface PersistentProperty {
	name: string
	toObjectSpecial?: (classObj: any) => any
	fromObjectSpecial?: (obj: any) => any
}

export function persistent( target: Persistent, property: string ) {
	return persistentParser()( target, property);
}

export function persistentParser( toTypeParser?: ( val: any )=> any, fromTypeParser?: ( val: any ) => any ) {
	return function( target: Persistent, property: string ) {

		// from: https://stackoverflow.com/questions/43912168/typescript-decorators-with-inheritance
		// should work like this in order to avoid propagation of persistent properties from one class to others
		if ( !Object.getOwnPropertyDescriptor( target, '_persistentProperties' ) ) {
			if ( target[ '_persistentProperties' ] )	{
				target[ '_persistentProperties' ]  = [...target[ '_persistentProperties' ] ]
			}
			else target[ '_persistentProperties' ]  = []
		}

		target[ '_persistentProperties' ].push({ 
			name: property, 
			toObjectSpecial: toTypeParser, 
			fromObjectSpecial: fromTypeParser 
		})
	}
}


export function persistentCollection(target: Persistent, property: string) {
	const persistentProperty: PersistentProperty = {
		name: property,
		toObjectSpecial: (collection: any[]) => {
			collection.forEach(item => {

			})
		}
	}
}

export function registerClassFactory(className: string, factory: PersistentFactory) {
	Persistent.registerFactory(className, factory)
	return (constructor: Function) => {
		constructor.prototype.__className = className
	}
}

