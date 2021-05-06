import { SomeClassProps } from '../types/utility-types';
import { Persistent, PersistentFactory } from '../persistent/persistent';
import { DataStream } from './data-stream';

class Model<T extends Persistent>{
	constructor( stream: DataStream, persistentClass: Persistent | string ) {
		this.persistentClassName = persistentClass instanceof Persistent
			? persistentClass.className : persistentClass

		this.createInstance = Persistent.factoryMap[ this.persistentClassName ]
		this._stream = stream
	}

	findById( id: string ): Promise< T > {
		return new Promise<T>( ( resolve, reject ) => {
			this._stream.findById( id, this.persistentClassName )
				.then( data => resolve(  
					this.createInstance().fromObject( data ) as T 
				))
				.catch( error => reject( error ) )
		})
	}

	find( fieldsToMatch: SomeClassProps<T> ): Promise< T[] > {
		return new Promise<T[]>( ( resolve, reject ) => {
			this._stream.find( fieldsToMatch as any, this.persistentClassName )
				.then( data => resolve( 
					data.map( obj => this.createInstance().fromObject( obj ) as T ) 
				))
				.catch( error => reject( error ) )
		})
	}

	save( object: T ): Promise<void> {
		return new Promise<void>( ( resolve, reject ) => {
			this._stream.save( object as any, this.persistentClassName ) 
				.then( data => resolve() )
				.catch( error => reject( error ) )
		})
	}

	delete( id: string ): Promise<void> {
		return this._stream.delete( id, this.persistentClassName )
	}

	readonly persistentClassName: string
	private createInstance: PersistentFactory 
	private _stream: DataStream
}

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

	static getModel< T extends Persistent>( classId: T | string ) {
		return new Model( this.instance._stream, classId )		
	}

	private static _instance: Store = null;
	private static _streamFactory: ()=>DataStream;
	private _stream: DataStream;
}
