import { Collections, Persistent, PersistentObject } from '../persistent/persistent';
import { DataSource, DocumentObject, QueryObject, QueryOperation } from "./data-source";

export interface JsonRawData {
	[ collection: string ]: {
		[ documentId: string ]: PersistentObject<Persistent>
	}
}

type QueryProcessors = {
	[ P in keyof Required<QueryObject<unknown>> ]: Function
}

/**
 * A concrete implementation of the DataSource interface uses an in-memory data store
 * initialized by a JSON object.
 * It is useful for testing purposes.
 * The data in the JSON object is not persisted.
 */
export class JsonDataSource implements DataSource {

	/**
	 * @param jsonRawData the JSON object to be used as data store
	 */
	constructor( jsonRawData?: JsonRawData ) {
		if ( jsonRawData ) this._jsonRawData = jsonRawData;
	}

	/**
	 * Set the JSON object to initialize the data store. Use to set the it after 
	 * the constructor has been called.
	 * @param jsonRawData the JSON object to be used as data store
	 */
	setDataStore( rawDataStore: JsonRawData ) {
		this._jsonRawData = rawDataStore;
		return this
	}

	/**
	 * Introduce a delay in the execution of operations to simulate a real data source
	 * @param miliSeconds the number of milliseconds to delay the execution of operations
	 * @returns a chainable reference to this object
	 */
	simulateDelay( miliSeconds: number ) {
		this._simulateDelay = miliSeconds
		return this
	}

	findById( id: string, collectionName: string ): Promise< DocumentObject > {
		return this.resolveWithDelay( this._jsonRawData[ collectionName ][ id ] )
	}

	save( collections: Collections ): Promise< void > {
		Object.entries( collections ).forEach(([ collectionName, collection ]) => {
			if ( !this._jsonRawData[ collectionName ] ) this._jsonRawData[ collectionName ] = {}
			collection.forEach( document => {
				this._jsonRawData[ collectionName ][ document.id! ] = document
			})
		})

		return this.resolveWithDelay()
	}

	find( queryObject: QueryObject<DocumentObject>, collectionName: string ): Promise< DocumentObject[] > {
		const rawDataArray = Object.values( this._jsonRawData[ collectionName ] || {} )
		if ( !queryObject ) return this.resolveWithDelay( rawDataArray )
		
		this._lastLimit = queryObject.limit || 0
		this._cursor = 0

		this._lastMatchingDocs = Object.entries( queryObject ).reduce(
			( prevDocs, [ processMethod, value ]) => {

				return this.queryProcessor( prevDocs, processMethod as any, value )

			}, Object.values( rawDataArray )
		)

		return this.resolveWithDelay( this._lastMatchingDocs.slice( 0, queryObject.limit ) )
	}

	delete( id: string, collectionName: string ): Promise< void > {
		delete this._jsonRawData[ collectionName ][ id ]
		return this.resolveWithDelay()
	}

	next( limit?: number ): Promise< DocumentObject[] > {
		if ( limit ) this._lastLimit = limit
		this.incCursor( this._lastLimit )

		return this.resolveWithDelay( this._lastMatchingDocs.slice( this._cursor, this._cursor + this._lastLimit ) )
	}

	count( queryObject: QueryObject<DocumentObject>, collectionName: string ): Promise<number> {
		return this.resolveWithDelay(
			Object.keys( this._jsonRawData[ collectionName ] ).length
		)
	}

	/**
	 * @returns the raw data store data as a JSON object
	 */
	get rawData() {
		return this._jsonRawData
	}

	/**
	 * Wait for all pending promises to be resolved
	 * @returns a promise that resolves when all pending promises are resolved
	 */
	wait() {
		return Promise.all([ ...this._pendingPromises ])
	}

	private incCursor( amount: number ) {
		this._cursor += amount 
		if ( this._cursor > this._lastMatchingDocs.length ) {
			this._cursor = this._lastMatchingDocs.length
		}
	}

	private decCursor( amount: number ) {
		this._cursor -= amount 
		if ( this._cursor < 0 ) {
			this._cursor = 0
			return true
		}
		return false
	}

	private queryProcessor<T, P extends keyof QueryProcessors>(
		docs: DocumentObject[], 
		processMethod: P, 
		value: QueryObject<T>[P] 
	) {

		const processors: QueryProcessors = {

			limit: ( limit: number ) => docs,//.slice( 0, limit ),

			operations: ( operations: QueryOperation<T>[] ) => docs.filter(
				doc => this.isQueryMatched( doc, operations )
			),

			sort: ({ order, propertyName }) => docs.sort( ( a, b ) => {
				if ( order === 'asc' ) {
					return this.deepValue( a, propertyName ) > this.deepValue( b, propertyName )? 1 : -1 
				}
				else {
					return this.deepValue( a, propertyName ) < this.deepValue( b, propertyName )? 1 : -1
				}
			})
		}

		return processors[ processMethod ]( value )
	}

	private deepValue( obj: {}, propertyPath: string /*like person.name.firstName*/) {
		const propChain = propertyPath.split( '.' )
		return propChain.reduce(( value, prop ) => value[ prop ], obj )
	}

	private isQueryMatched<T>( doc: DocumentObject, queryOperations: QueryOperation<T>[] ) {
		const queryOperator = {
			'==': <U>(a: U, b: U) => a === b,
			'!=': <U>(a: U, b: U) => a !== b,
			'<': <U>(a: U, b: U) => a < b,
			'<=': <U>(a: U, b: U) => a <= b,
			'>': <U>(a: U, b: U) => a > b,
			'>=': <U>(a: U, b: U) => a >= b,
		}

		const isMatch = queryOperations.reduce( ( prevVal, val ) => {
			const { property, value, operator } = val as QueryOperation<unknown>
	
			const [ document, v ] = this.retrieveValuesToCompare( doc[property], value )

			return prevVal && queryOperator[ operator ]( document, v )
		}, true)

		return isMatch
	}

	private retrieveValuesToCompare( document: DocumentObject, value: unknown ): [ unknown, unknown ] {
		if ( typeof value === 'object' ) {
			const propName = Object.keys( value! )[0]
			var [ doc, val ] = this.retrieveValuesToCompare( document && document[ propName ], value?.[ propName ] )
		}

		return [ doc || document, val || value ]
	}

	private resolveWithDelay<T>( data?: T ): Promise<T> {
		if ( this._simulateDelay <=0 ) return Promise.resolve( data! )

		const promise = new Promise<T>( resolve => {
			setTimeout(
				()=> resolve( data! ),
				this._simulateDelay
			)
		})
		this._pendingPromises.push( promise )
		promise.finally(
			()=> this._pendingPromises = this._pendingPromises.filter( p => p === promise )
		)
		return promise
	}

	private _jsonRawData: JsonRawData = {}
	private _lastMatchingDocs: DocumentObject[]
	private _lastLimit: number = 0
	private _cursor: number
	private _simulateDelay: number = 0
	private _pendingPromises: Promise<any>[] = []
}
