import { Persistent, PersistentFactory } from '../persistent/persistent'
import { SomeClassProps } from '../types/utility-types'
import { DataStream } from './data-stream'

export class Model<T extends Persistent>{
	constructor( stream: DataStream, persistentClass: Persistent | string ) {
		this.persistentClassName = persistentClass instanceof Persistent
			? persistentClass.className : persistentClass

		this.createInstance = Persistent.classFactory( this.persistentClassName )
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
