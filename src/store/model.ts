import { Persistent, PersistentObject } from '../persistent/persistent'
import { ClassPropNames } from '../types/utility-types'
import { DataSource, QueryOperator, QueryObject, QueryOrder } from './data-source'

export class Model<T extends Persistent>{
	constructor( stream: DataSource, persistentClass: Persistent | string ) {
		this.collectionName = persistentClass instanceof Persistent
			? persistentClass.className : persistentClass

		this._stream = stream
	}

	findById( id: string, instance?: T ): Promise<T> {
		return new Promise<T>( ( resolve, reject ) => {
			this._stream.findById( id, this.collectionName )
				.then(( data: PersistentObject<T> ) => {
					if ( data ) {
						if ( !instance ) instance = Persistent.createInstance( data )
						else instance.fromObject( data as PersistentObject<T> ) 

						resolve( instance )
					}
					else resolve( undefined )
				})
				.catch( error => reject( error ) )
		})
	}
	
	save( instance: T ): Promise<void> {
		const obj = instance.toObject()
		
		if ( this.collectionName !== obj.__className ) {
			obj.__rootCollections[ this.collectionName ] = obj.__rootCollections[ obj.__className ]
			delete obj.__rootCollections[ obj.__className ]
		}
		
		return new Promise<void>( ( resolve, reject ) => {
			this._stream.save( obj.__rootCollections ) 
			.then( () => resolve() )
			.catch( error => reject( error ) )
		})
	}
	
	delete( id: string ): Promise<void> {
		return this._stream.delete( id, this.collectionName )
	}

	find(): Query<T> {
		return new Query<T>( this )
	}

	query( queryObject?: QueryObject<T>): Promise<T[]> {
		return new Promise<T[]>( ( resolve, reject ) => {
			this._stream.find( queryObject, this.collectionName )
				.then( data => resolve( 
					data.map( obj => Persistent.createInstance<T>( obj as any )) 
				))
				.catch( error => reject( error ) )
		})
	}

	readonly collectionName: string
	private _stream: DataSource
}


class Query<T extends Persistent> {
	constructor( model: Model<T> ) {
		this.model = model	
	}

	where<P extends ClassPropNames<T>>( property: P, operator: QueryOperator, value: Partial<T[P]> ) {
		this.queryObject.operations[ property ] = {
			operator,
			value
		}

		return this
	}

	instanceOf<U extends T>( classId: U | string ) {
		const className = classId instanceof Persistent? classId.className : classId
		this.queryObject[ '__className' ] = {
			operator: '==',
			value: className
		}
	}

	get() {
		return this.model.query( this.queryObject )
	}

	limit( maxDocs: number ) {
		this.queryObject.limit = maxDocs
		return this
	}

	next() {
		// todo
	}

	prev() {
		// todo
	}

	orderBy<P extends ClassPropNames<T>>( propertyName: P, order: QueryOrder = 'asc' ) {
		this.queryObject.sort = { 
			propertyName, 
			order 
		}
		
		return this
	}

	/**
	 * Orders the result set by a deep property
	 * 
	 * @param propertyPath The full path of the deep property. It should be 
	 * 											separated by dots like person.name.firstName.
	 * @param order The sort direction
	 * @returns a chainable query object
	 */
	orderByDeepProp( propertyPath: string, order: QueryOrder = 'asc' ) {
		this.queryObject.sort = { 
			propertyName: propertyPath, 
			order 
		}
		
		return this
	}

	private queryObject: QueryObject<T> = { operations: {} } as QueryObject<T>
	private model: Model<T>
}
