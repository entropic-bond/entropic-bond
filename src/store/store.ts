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

	private static _dataSource: DataSource
}
