import { Persistent, PersistentObject, Collections } from '../persistent/persistent'
import { ClassPropNames } from '../types/utility-types'

export type DocumentObject = PersistentObject<Persistent>

/**
 * The query operators
 * @param == equal
 * @param != not equal
 * @param < less than
 * @param <= less than or equal
 * @param > greater than
 * @param >= greater than or equal
 */
export type QueryOperator = '==' | '!=' | '<' | '<=' | '>' | '>='

/**
 * A representation of a query operation
 * @param property the name of the property to be used in the query
 * @param operator the operator to be used in the query
 * @param value the value to be used in the query
 */
export type QueryOperation<T> = {
	property: ClassPropNames<T>
	operator: QueryOperator
	value: Partial<T[ClassPropNames<T>]> | {[key:string]: unknown}
}

/**
 * The sort order
 * @param asc ascending order
 * @param desc descending order
 */
export type QueryOrder = 'asc' | 'desc'

/**
 * A representation of a full query
 * @param operations the query operations to be performed
 * @param limit the maximum number of items to be retrieved
 * @param sort sort info
 * @param sort.order the sort order
 * @param sort.propertyName the name of the property to be used for sorting
 */
export type QueryObject<T> = {
	operations?: QueryOperation<T>[]
	limit?: number
	sort?: {
		order: QueryOrder
		propertyName: ClassPropNames<T> | string
	}
}

/**
 * The data source interface.
 * It defines the methods that must be implemented by a data source
 * A data source is able to retrieve and save data i.e: from a database, a file, a RestAPI, etc.
 * You can derive from this class to implement your own data source with the 
 * A data source is used by the store to retrieve and save data.
 */
export abstract class DataSource {

	/**
	 * Retrieves a document by id
	 * Implement the required logic to retrieve a document by id from your concrete
	 * the data source
	 * @param id the id of the document to be retrieved
	 * @param collectionName the name of the collection where the document is stored
	 * @returns a promise resolving to the document object. The document object is 
	 * a plain object with the properties of the document class.
	 */
	abstract findById( id: string, collectionName: string ): Promise< DocumentObject >

	/**
	 * Retrieves all documents matching the query stored in the query object
	 * Implement the required logic to retrieve the documents that match the 
	 * requirements in the query object from your concrete the data source
	 * @param queryObject the query object containing the query operations
	 * @param collectionName the name of the collection where the documents are stored
	 * @returns a promise resolving to an array of document objects. The document object is
	 * a plain object with the properties of the document class.
	 * @see QueryObject
	 * @see QueryOperation
	 * @see QueryOperator
	 * @see QueryOrder
	 * @see DocumentObject
	 */
	abstract find( queryObject: QueryObject<DocumentObject>, collectionName: string ): Promise< DocumentObject[] >

	/**
	 * Saves a document
	 * Implement the required logic to save the document in your concrete the data source
	 * @param object A collection of documents to be saved
	 * @returns a promise
	 */
	abstract save( object: Collections ): Promise< void >

	/**
	 * Deletes a document by id
	 * Implement the required logic to delete a document by id from your concrete
	 * data source
	 * @param id the id of the document to be deleted
	 * @param collectionName the name of the collection where the document is stored
	 * @returns a promise
	 */
	abstract delete( id: string, collectionName: string ): Promise<void>

	/**
	 * Retrieves the next bunch of documents matching the query stored in the query object
	 * Implement the required logic to retrieve the next bunch of documents that match the
	 * requirements in the query object from your concrete the data source
	 * @param limit the maximum number of items to be retrieved
	 * @returns a promise resolving to an array representing the next bunch of document objects
	 */
	abstract next( limit?: number ): Promise< DocumentObject[] >

	/**
	 * Retrieves the number of documents matching the query stored in the query object
	 * Implement the required logic to retrieve the number of documents that match the
	 * requirements in the query object from your concrete the data source
	 * @param queryObject the query object containing the query operations
	 * @param collectionName the name of the collection where the documents are stored
	 * @returns a promise resolving to the number of documents matching the query
	 * @see QueryObject
	 */
	abstract count( queryObject: QueryObject<DocumentObject>, collectionName: string ): Promise<number>

	/**
	 * Utility method to convert a query object to a property path query object
	 * 
	 * @param queryObject the query object to be converted
	 * @returns a property path query object
	 * @example
	 * const queryObject = {
	 * 	operations: [{ property: 'name', operator: '==', value: { ancestorName: { father: 'Felipe' }}]
	 * }
	 * const propPathQueryObject = DataSource.toPropertyPathQueryObject( queryObject )
	 * // returned value: [{ property: 'name.ancestorName.father', operator: '==', value: 'Felipe' }]
	 */
	static toPropertyPathOperations<T extends Persistent>( operations: QueryOperation<T>[] ): QueryOperation<T>[] {
		if ( !operations ) return []
		return operations.map( operation => {
			const [ path, value ] = this.toPropertyPathValue( operation.value )
			const propPath = `${ String( operation.property ) }${ path? '.'+path : '' }` 
			return { 
				property: propPath, 
				operator:	operation.operator,
				value
			} as QueryOperation<T>
		})
	}

	private static toPropertyPathValue( obj: {} ): [ string, unknown ] {
		if ( typeof obj === 'object' ) {
			const propName = Object.keys( obj )[0]
			const [ propPath, value ] = this.toPropertyPathValue( obj[ propName ] )
			return [ `${ propName }${ propPath? '.'+propPath : '' }`, value ]
		}
		else {
			return [ undefined, obj ]
		}

	}
}
