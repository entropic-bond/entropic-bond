import { Persistent } from '../persistent/persistent';
import { DataStream } from './data-stream';
import { Model } from './model';

export class Store {
	protected constructor( streamFactory: ()=> DataStream ){
		if ( !streamFactory ) throw( new Error( 'You should register a data stream before using DataSource.') );
		this._stream = streamFactory();
	}

	static get instance() {
		return this._instance || ( this._instance = new this( this._streamFactory ) );
	}

	static registerDataStreamFactory( streamFactory: ()=>DataStream ) {
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
	private static _streamFactory: ()=>DataStream;
	private _stream: DataStream;
}
