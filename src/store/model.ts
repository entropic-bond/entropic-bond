import { Persistent, PersistentFactory } from '../persistent/persistent'
import { ClassProps } from '../types/utility-types'
import { DataSource, QueryOperator, QueryObject } from './data-source'

export class Model<T extends Persistent>{
	constructor( stream: DataSource, persistentClass: Persistent | string ) {
		this.persistentClassName = persistentClass instanceof Persistent
			? persistentClass.className : persistentClass

		this.createInstance = Persistent.classFactory( this.persistentClassName )
		this._stream = stream
	}

	findById( id: string ): Promise<T> {
		return new Promise<T>( ( resolve, reject ) => {
			this._stream.findById( id, this.persistentClassName )
				.then( data => resolve(  
					this.createInstance().fromObject( data ) as T 
				))
				.catch( error => reject( error ) )
		})
	}
	
	save( object: T ): Promise<void> {
		return new Promise<void>( ( resolve, reject ) => {
			this._stream.save( object.toObject() ) 
			.then( () => resolve() )
			.catch( error => reject( error ) )
		})
	}
	
	delete( id: string ): Promise<void> {
		return this._stream.delete( id, this.persistentClassName )
	}

	find(): Query<T> {
		return new Query<T>( this )
	}

	query( queryObject?: QueryObject<T>): Promise<T[]> {
		return new Promise<T[]>( ( resolve, reject ) => {
			this._stream.find( queryObject, this.persistentClassName )
				.then( data => resolve( 
					data.map( obj => this.createInstance().fromObject( obj ) as T ) 
				))
				.catch( error => reject( error ) )
		})
	}

	readonly persistentClassName: string
	private createInstance: PersistentFactory 
	private _stream: DataSource
}


class Query<T extends Persistent> {
	constructor( model: Model<T> ) {
		this.model = model	
	}

	where<P extends keyof ClassProps<T>>( property: P, operator: QueryOperator, value: T[P] ) {
		this.queryObject[ property ] = {
			operator,
			value
		}

		return this
	}

	get() {
		return this.model.query( this.queryObject )
	}

	private queryObject: QueryObject<T> = {} as QueryObject<T>
	private model: Model<T>
}
