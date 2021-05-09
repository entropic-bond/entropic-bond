import { Persistent } from '../persistent/persistent';
import { DataSource } from './data-source';
import { Model } from './model';

export class Store {
	protected constructor( dataSource: DataSource ){
		if ( !dataSource ) throw( new Error( 'You should register a data source before using the data Store.') );
		this._dataSource = dataSource;
	}

	static get instance() {
		return this._instance || ( this._instance = new this( this._staticDataSource ) );
	}

	static useDataSource( dataSource: DataSource ) {
		this._staticDataSource = dataSource;
		this._instance = undefined;
	}

	get dataSource() {
		return this._dataSource;
	}

	static getModel< T extends Persistent>( classId: T | string ): Model<T> {
		return new Model<T>( this.instance._dataSource, classId )		
	}

	private static _instance: Store = null;
	private static _staticDataSource: DataSource;
	private _dataSource: DataSource;
}
