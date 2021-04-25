import { ClassProps } from '../types';

export class Persistent {
	fromObject( obj: Partial<ClassProps<this>> ) {

		this._persistentProperties.forEach( prop =>{
			const value = obj[ prop.name.slice(1) ]
			if ( value ) this[ prop.name ] = value
		})

		return this
	}

	toObject(): Partial<ClassProps<this>> {
		const obj: Partial<ClassProps<this>> = {}

		this._persistentProperties.forEach( prop => {
			const value = this[ prop.name ]
			obj[ prop.name.slice(1) ] = value
		})

		return obj
	}

	private _persistentProperties: PersistentProperty[]
}

interface PersistentProperty {
	name: string
	toObjectSpecial? : ( classObj: any ) => any
	fromObjectSpecial?: ( obj: any ) => any
}

export function persistent(target: Persistent, property: string ) {
	if ( !target[ '_persistentProperties' ] )	target[ '_persistentProperties' ]  = [];
	target[ '_persistentProperties' ].push({ name: property })
}

export function persistentCollection( target: Persistent, property: string ) {
	const persistentProperty: PersistentProperty = {
		name: property,
		toObjectSpecial: ( collection: any[] ) => {
			collection.forEach( item =>{
				
			})
		}
	}
}
