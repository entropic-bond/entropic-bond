import { Persistent } from '../persistent/persistent';
import { DataSource } from './data-source';
import { Model } from './model';

export class Store {
	protected constructor( streamFactory: ()=> DataSource ){
		if ( !streamFactory ) throw( new Error( 'You should register a data source before using the data Store.') );
		this._stream = streamFactory();
	}

	static get instance() {
		return this._instance || ( this._instance = new this( this._streamFactory ) );
	}

	static registerDataStreamFactory( streamFactory: ()=>DataSource ) {
		this._streamFactory = streamFactory;
		this._instance = undefined;
	}

	get dataStream() {
		return this._stream;
	}

	static getModel< T extends Persistent>( classId: T | string ): Model<T> {
		return new Model<T>( this.instance._stream, classId )		
	}

	private static _instance: Store = null;
	private static _streamFactory: ()=>DataSource;
	private _stream: DataSource;
}
