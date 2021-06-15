import { Persistent } from '../persistent/persistent';
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

	static populate< T extends Persistent>( instance: T | T[] ): Promise<T | T[]> {
				
		if ( Array.isArray( instance ) ) {
			const storedInCollection = instance[0].getCollectionWhereReferenceIsStored()

			const model = this.getModel( storedInCollection )
			const promises = instance.map( item => model.findById( item.id, item ) )
			return Promise.all( promises )
		}
		else {
			const storedInCollection = instance.getCollectionWhereReferenceIsStored()

			const model = this.getModel( storedInCollection )
			return model.findById( instance.id, instance )
		}
	}

	private static _dataSource: DataSource
}
