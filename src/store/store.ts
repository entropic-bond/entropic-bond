import { DocumentReference, Persistent } from '../persistent/persistent';
import { DataSource } from './data-source';
import { Model } from './model';

export class Store {
	private constructor(){}

	static error = { shouldBeRegistered: 'You should register a data source before using the data Store.' }

	static useDataSource( dataSource: DataSource ) {
		this._dataSource = dataSource
	}

	static get dataSource() {
		return Store._dataSource
	}

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

	static async populate< T extends Persistent>( instance: T | readonly T[] ): Promise<T | T[]> {
		if ( !instance ) return
		
		const populateItem = async ( item: T ) => {
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
			const promises = instance.map( item => populateItem( item ) )
			const items = await Promise.all( promises )
			return items.filter( item => item )
		}
		else {
			return populateItem( instance as T )
		}
	}

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
