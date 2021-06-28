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

	static populate< T extends Persistent>( instance: T | readonly T[] ): Promise<T | T[]> {

		const populateItem = ( item: T ) => {
			const ref: DocumentReference = item[ '__documentReference' ]
			const model = this.getModel( ref.storedInCollection )

			return model.findById( ref.id, item ) 
		}
		
		if ( Array.isArray( instance ) ) {
			const promises = instance.map( item => populateItem( item ) )
			return Promise.all( promises )
		}
		else {
			return populateItem( instance as T )
		}
	}

	private static _dataSource: DataSource
}
