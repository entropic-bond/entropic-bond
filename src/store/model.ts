import { Persistent, PersistentObject } from '../persistent/persistent'
import { ClassProps } from '../types/utility-types'
import { DataSource, QueryOperator, QueryObject } from './data-source'

export class Model<T extends Persistent>{
	constructor( stream: DataSource, persistentClass: Persistent | string ) {
		this.persistentClassName = persistentClass instanceof Persistent
			? persistentClass.className : persistentClass

		this._stream = stream
	}

	findById( id: string, instance?: T ): Promise<T> {
		if ( !instance ) instance = Persistent.classFactory( this.persistentClassName )() as T

		return new Promise<T>( ( resolve, reject ) => {
			this._stream.findById( id, this.persistentClassName )
				.then( data => resolve(  
					instance.fromObject( data as PersistentObject<T> ) 
				))
				.catch( error => reject( error ) )
		})
	}
	
	save( instance: T ): Promise<void> {
		return new Promise<void>( ( resolve, reject ) => {
			this._stream.save( instance.toObject() ) 
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
					data.map( obj => Persistent.createInstance<T>( obj as any )) 
				))
				.catch( error => reject( error ) )
		})
	}

	readonly persistentClassName: string
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

	instanceOf<U extends T>( classId: U | string ) {
		const className = classId instanceof Persistent? classId.className : classId
		this.queryObject[ '__className' ] = {
			operator: '==',
			value: className
		}
	}

	get() {
		return this.model.query( this.queryObject )
	}

	private queryObject: QueryObject<T> = {} as QueryObject<T>
	private model: Model<T>
}
