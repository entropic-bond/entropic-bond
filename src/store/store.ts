import { DocumentReference, Persistent } from '../persistent/persistent';
import { DataSource } from './data-source';
import { Model } from './model';

/**
 * The store is the main entry point for the data access layer.
 * It provides methods to retrieve models for collections and subcollections.
 * It also provides methods to populate property references with actual data from the store.
 * You need to register a data source before using the store.
 * @example
 * // Register a data source
 * Store.useDataSource( new FirestoreDataSource( firebase.firestore() ) )
 * // Retrieve a model for a collection
 * const model = Store.getModel( 'User' )
 * // Retrieve a model for a subcollection
 * const model = Store.getModelForSubCollection( user, 'Posts' )
 * // Populate property references
 * const user = await Store.populate( user )
 */
export class Store {
	private constructor(){}

	static error = { shouldBeRegistered: 'You should register a data source before using the data Store.' }

	/**
	 * Registers a data source to be used by the store.
	 * You need to register a data source before using the store.
	 * @param dataSource the data source to be used by the store
	 */
	static useDataSource( dataSource: DataSource ) {
		this._dataSource = dataSource
	}

	/**
	 * The data source currently used by the store
	 * @returns the data source
	 */
	static get dataSource() {
		return Store._dataSource
	}

	/**
	 * Retrieves a model for a collection
	 * @param classId the class name or an instance of the document type stored in the collection
	 * @returns the model for the collection
	 */
	static getModel< T extends Persistent>( classId: T | string ): Model<T> {
		if ( !Store._dataSource ) throw new Error( this.error.shouldBeRegistered )
		return new Model<T>( Store._dataSource, classId )		
	}

	/**
	 * Retrieves a model for a subcollection 
	 * @param document the persistent object that owns the subcollection
	 * @param subCollection the name of the subcollection
	 * @returns the model for the subcollection
	 */
	static getModelForSubCollection< T extends Persistent>( document: Persistent, subCollection: string ): Model<T> {
		if ( !Store._dataSource ) throw new Error( this.error.shouldBeRegistered )
		return new Model<T>( Store._dataSource, document, subCollection )		
	}

	/**
	 * Populates property references with actual data from the store.
	 * It will not retrieve data if the instance is already populated
	 * @param instance the data to be populated.
	 * @returns the populated instance
	 */
	static async populate<T extends Persistent | Persistent[]>( instance: T ): Promise<T> {
		if ( !instance ) return undefined as any
		
		const populateItem = async ( item: Persistent ) => {
			const ref: DocumentReference = item as any
			if ( !ref.__documentReference ) return item
			const model = this.getModel( ref.__documentReference.storedInCollection )

			const populated = await model.findById( ref.id, item ) 
			if ( populated ) {
				populated['__documentReference' ] = undefined
			}
			return populated
		}
		
		if ( Array.isArray( instance ) ) {
			const items = await Promise.all(
				instance.map( item => populateItem( item ) )
			)
			return items.filter( item => item ) as T
		}
		else {
			return populateItem( instance ) as Promise<T>
		}
	}

	/**
	 * Checks if an instance is populated
	 * @param instance the instance or array of instances to be checked
	 * @returns true if the instance is populated
	 */
	static isPopulated< T extends Persistent>( instance: T | readonly T[] ): boolean {
		if ( Array.isArray( instance ) ) {
			return instance.reduce(
				( prevVal, item ) => prevVal && item['__documentReference'] === undefined,
				true 
			)
		}
		else {
			return instance['__documentReference'] === undefined
		}
	}

	private static _dataSource: DataSource
}
