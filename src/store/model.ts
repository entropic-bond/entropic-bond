import { Persistent, PersistentObject } from '../persistent/persistent'
import { ClassPropNames } from '../types/utility-types'
import { DataSource, QueryOperator, QueryObject, QueryOrder, DocumentObject, QueryOperation } from './data-source'

/**
 * Provides abstraction to the database access. You should gain access to a Model
 * object through the Store.getModel method instead of its constructor.
 */
export class Model<T extends Persistent>{
	constructor( stream: DataSource, persistentClass: Persistent | string ) {
		this.collectionName = persistentClass instanceof Persistent
			? persistentClass.className : persistentClass

		this._stream = stream
	}

	/**
	 * Finds an stored object in the database by its id. The field id is provided
	 * by the Persistent parent class and it is automatically managed. Therefore,
	 * you should obtain the id by looking at the id field of the object.
	 * 
	 * @param id the id to look for
	 * @param instance you can pass an instace that will be filled with the found data
	 * @returns a promise resolving to an instance with the found data
	 */
	findById<D extends T>( id: string, instance?: D ): Promise<D> {
		return new Promise<D>( ( resolve, reject ) => {
			this._stream.findById( id, this.collectionName )
				.then(( data: PersistentObject<D> ) => {
					if ( data ) {

						if ( !instance ) instance = Persistent.createInstance( data )
						else instance.fromObject( data ) 

						resolve( instance )
					}
					else resolve( undefined )
				})
				.catch( error => reject( error ) )
		})
	}
	
	/**
	 * Stores an object in the database
	 * 
	 * @param instance the object instance to store
	 * @returns a promise 
	 */
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
	
	/**
	 * Removes an element from the database by id
	 * @param id the id of the element to be removed
	 * @returns a promise
	 */
	delete( id: string ): Promise<void> {
		return this._stream.delete( id, this.collectionName )
	}

	find<U extends T>(): Query<U> {
		return new Query<U>( this as unknown as Model<U> )
	}

	query<U extends T>( queryObject?: QueryObject<U>): Promise<U[]> {
		return this.mapToInstance( 
			() => this._stream.find( queryObject as QueryObject<DocumentObject>, this.collectionName ) 
		)
	}

	next<U extends T>( limit?: number ): Promise<U[]> {
		return this.mapToInstance( () => this._stream.next( limit ) )
	}

	// NOTE: You should implement prev functionality by using next in reverse order
	// prev<U extends T>( limit?: number ): Promise<U[]> {
	// 	return this.mapToInstance( () => this._stream.prev( limit ) )
	// }

	private mapToInstance<U extends T>( from: ()=>Promise<DocumentObject[]> ): Promise<U[]> {
		return new Promise<U[]>( ( resolve, reject ) => {
			from()
				.then( data => resolve( 
					data.map( obj => Persistent.createInstance( obj as any ))
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

	where<P extends ClassPropNames<T>>( property: P, operator: QueryOperator, value: Partial<T[P]> | Persistent ) {
		let val = value instanceof Persistent? { id: value.id } : value

		this.queryObject.operations.push({
			property,
			operator,
			value: val
		})

		return this
	}

	whereDeepProp( propertyPath: string, operator: QueryOperator, value: unknown ) {
		const props = propertyPath.split( '.' )
		let obj = {}
		let result = props.length > 1? obj : value  // TODO: review

		props.slice(1).forEach(( prop, i ) => {
			obj[ prop ] = i < props.length - 2? {} : value 
			obj = obj[ prop ]
		})

		this.queryObject.operations.push({
			property: props[0],
			operator,
			value: result
		} as QueryOperation<T>)

		return this
	}

	instanceOf<U extends T>( classId: U | string ) {
		const className = classId instanceof Persistent? classId.className : classId
		this.queryObject.operations.push({
			property: '__className' as any,
			operator: '==',
			value: className as any
		})
		return this
	}

	get<U extends T>( limit?: number ): Promise<U[]> {
		if ( limit ) {
			this.queryObject.limit = limit
		}
		return this.model.query( this.queryObject as unknown as QueryObject<U> )
	}

	limit( maxDocs: number ) {
		this.queryObject.limit = maxDocs
		return this
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

	private queryObject: QueryObject<T> = { operations: [] } as QueryObject<T>
	private model: Model<T>
}
