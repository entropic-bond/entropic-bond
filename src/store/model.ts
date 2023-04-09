import { Persistent, PersistentObject } from '../persistent/persistent'
import { ClassPropNames, PropPath, PropPathType } from '../types/utility-types'
import { DataSource, QueryOperator, QueryObject, QueryOrder, DocumentObject, QueryOperation } from './data-source'

/**
 * Provides abstraction to the database access. You should gain access to a Model
 * object through the Store.getModel method instead of its constructor.
 */
export class Model<T extends Persistent>{
	static error = { persistentNeedForSubCollection: 'The document parameter for a sub-collection should be a Persistent instace'	}

	constructor( stream: DataSource, persistentClass: Persistent | string, subCollection?: string ) {
		if ( subCollection ) {
			if( !( persistentClass instanceof Persistent ) ) throw new Error( Model.error.persistentNeedForSubCollection )

			this.collectionName = `${ persistentClass.className }/${ persistentClass.id }/${ subCollection }`
		}
		else {
			this.collectionName = persistentClass instanceof Persistent
				? persistentClass.className 
				: persistentClass
		}

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
	findById<D extends T>( id: string, instance?: D ): Promise<D | undefined> {
		return new Promise<D | undefined>( ( resolve, reject ) => {
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
		const obj = instance.toObject() as PersistentObject<T> & { __rootCollections: DocumentObject }
		
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
		return new Promise<void>( ( resolve, reject ) => {
			this._stream.delete( id, this.collectionName ) 
			.then( () => resolve() )
			.catch( error => reject( error ) )
		})
	}

	/**
	 * Call find to retrieve a Query object used to define the search conditions
	 * @returns a Query object
	 */
	find<U extends T>(): Query<U> {
		return new Query<U>( this as unknown as Model<U> )
	}

	/**
	 * Define the search conditions. You pass query operations and how the query
	 * results are returned to the QueryObject
	 * @param queryObject the QueryObject with the search constrains
	 * @returns a promise resolving to a collection of matched documents
	 */
	query<U extends T>( queryObject: QueryObject<U> = {}, objectType?: U | string ): Promise<U[]> {
		if ( objectType ) {
			const className = objectType instanceof Persistent ? objectType.className : objectType
			if ( !queryObject.operations ) queryObject.operations = []
			queryObject.operations.push(
				{ property: '__className', operator: '==', value: className } as any 
			)
		}

		return this.mapToInstance( 
			() => this._stream.find( queryObject as unknown as QueryObject<DocumentObject>, this.collectionName ) 
		)
	}

	/**
	 * Get the amount of documents matching the query
	 * @param queryObject the QueryObject with the search constrains
	 * @returns a promise resolving to the amount of matched documents
	 */
	count( queryObject: QueryObject<T> ): Promise<number> {
		return this._stream.count( queryObject as unknown as QueryObject<DocumentObject>, this.collectionName )
	}

	/**
	 * Get the next bunch of documents matching the last query
	 * @param limit the max amount of documents to retrieve. If not set, uses the
	 * last limit set
	 * @returns a promise resolving to a collection of matched documents
	 */
	next<U extends T>( limit?: number ): Promise<U[]> {
		return this.mapToInstance( () => this._stream.next( limit ) )
	}

	// /**
	//  * Get the previous bunch of documents matching the last query
	//  * @param limit the max amount of documents to retrieve. If not set, uses the
	//  * last limit set
	//  * @returns a promise resolving to a collection of matched documents
	//  */
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

/**
 * The Query class is used to define the search conditions. You can chain
 * where operations to define the search conditions. The where operations
 * are stored in a QueryObject that is passed to the query method of the
 * Model class.
 */
class Query<T extends Persistent> {
	constructor( model: Model<T> ) {
		this.model = model	
	}

	/**
	 * Defines a where condition
	 * @param property the property to be compared
	 * @param operator the operator to be used in the comparison. The available
	 * operators are: ==, !=, >, >=, < and <=
	 * @param value the value to be compared
	 * @returns this Query object to make chained calls possible
	 * @example
	 * query.where( 'name', '==', 'John' )
	 * query.where( 'age', '>', 18 )
	 * query.where( 'age', '==', 18 ).where( 'name', '==', 'John' )
	 */
	where<P extends ClassPropNames<T>>( property: P, operator: QueryOperator, value: Partial<T[P]> | Persistent ) {
		let val = value instanceof Persistent? { id: value.id } : value

		this.queryObject.operations?.push({
			property,
			operator,
			value: val
		})

		return this
	}

	// where2<P extends PropPath<T>>( property: P, operator: QueryOperator, value: PropPathType<T, P> ) {
	// 	if ( property.indexOf( '.' ) > 0 ) return this.whereDeepProp( property, operator, value )

	// 	let val = value instanceof Persistent? { id: value.id } : value

	// 	this.queryObject.operations.push({
	// 		property,
	// 		operator,
	// 		value: val
	// 	})

	// 	return this
	// }

	/**
	 * Defines a where condition for a deep property
	 * @param propertyPath the path to the property to be compared
	 * @param operator the operator to be used in the comparison. The available
	 * operators are: ==, !=, >, >=, < and <=
	 * @param value the value to be compared
	 * @returns this Query object to make chained calls possible
	 * @example
	 * query.whereDeepProp( 'address.street', '==', 'Main Street' )
	 */
	whereDeepProp( propertyPath: PropPath<T>, operator: QueryOperator, value: PropPathType<T, typeof propertyPath> ) {
		const props = propertyPath.split( '.' )
		let obj = {}
		let result = props.length > 1? obj : value  // TODO: review

		props.slice(1).forEach(( prop, i ) => {
			obj[ prop ] = i < props.length - 2? {} : value 
			obj = obj[ prop ]
		})

		this.queryObject.operations?.push({
			property: props[0],
			operator,
			value: result
		} as QueryOperation<T>)

		return this
	}

	/**
	 * Defines a where condition to match documents that are instances of the
	 * given class
	 * @param classId the class name or an instance to match
	 * @returns this Query object to make chained calls possible
	 * @example
	 * query.instanceOf( 'Person' )
	 * query.instanceOf( Person )
	 * query.instanceOf( Person ).where( 'age', '>', 18 )
	 */
	instanceOf<U extends T>( classId: U | string ) {
		const className = classId instanceof Persistent? classId.className : classId
		this.queryObject.operations?.push({
			property: '__className' as any,
			operator: '==',
			value: className as any
		})
		return this
	}

	/**
	 * Executes the query and returns the result
	 * @param limit the max amount of documents to retrieve. If not set, uses the
	 * last limit set or all the matching documents
	 * @returns a promise resolving to a collection of matched documents
	 * @example
	 * const namedJohn = await query.where( 'name', '==', 'John' ).get()
	 */
	get<U extends T>( limit?: number ): Promise<U[]> {
		if ( limit ) {
			this.queryObject.limit = limit
		}
		return this.model.query( this.queryObject as unknown as QueryObject<U> )
	}

	/**
	 * Limits the number of documents to retrieve
	 * @param maxDocs the max amount of documents to retrieve
	 * @returns this Query object to make chained calls possible
	 * @example
	 * query.where( 'name', '==', 'John' ).limit( 10 )
	 */
	limit( maxDocs: number ) {
		this.queryObject.limit = maxDocs
		return this
	}

	/**
	 * Orders the result set by a property.
	 * @param propertyName The name of the property to order by
	 * @param order The sort direction. Possible values are 'asc' and 'desc'
	 * @returns a chainable query object
	 * @example
	 * query.orderBy( 'name', 'asc' )
	 * query.orderBy( 'age', 'desc' )
	 */
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
	 * @param order The sort direction. Possible values are 'asc' and 'desc'
	 * @returns a chainable query object
	 */
	orderByDeepProp( propertyPath: string, order: QueryOrder = 'asc' ) {
		this.queryObject.sort = { 
			propertyName: propertyPath, 
			order 
		}
		
		return this
	}

	/**
	 * Returns the number of documents that match the query
	 * @returns a promise resolving to the number of documents that match the query
	 * @example
	 * const count = await query.where( 'name', '==', 'John' ).count()
	 */
	count() {
		return this.model.count( this.queryObject )
	}

	private queryObject: QueryObject<T> = { operations: [] } as QueryObject<T>
	private model: Model<T>
}
