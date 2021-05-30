import { Collections, Persistent, PersistentObject } from '../persistent/persistent';
import { DataSource, DocumentObject, QueryObject, QueryOperation, QueryOperations, QueryOrder } from "./data-source";

export interface JsonRawData {
	[ collection: string ]: {
		[ documentId: string ]: PersistentObject<Persistent>
	}
}

type QueryProcessors = {
	[ P in keyof Required<QueryObject<unknown>> ]: Function
}

export class JsonStream implements DataSource {
	constructor( jsonRawData?: JsonRawData ) {
		this._jsonRawData = jsonRawData;
	}

	setDataStore( rawDataStore: JsonRawData ) {
		this._jsonRawData = rawDataStore;
	}

	findById( id: string, collectionName: string ): Promise< DocumentObject > {
		return Promise.resolve( this._jsonRawData[ collectionName ][ id ] )
	}

	save( collections: Collections ): Promise< void > {
		Object.entries( collections ).forEach(([ collectionName, collection ]) => {
			if ( !this._jsonRawData[ collectionName ] ) this._jsonRawData[ collectionName ] = {}
			collection.forEach( document => {
				this._jsonRawData[ collectionName ][ document.id ] = document
			})
		})

		return Promise.resolve()
	}

	find<T extends Persistent>( queryObject: QueryObject<T>, collectionName: string ): Promise< DocumentObject[] > {
		const matchingDocs = Object.entries( queryObject ).reduce(
			( prevDocs, [ processMethod, value ]) => {

				return this.queryProcessor( prevDocs, processMethod as any, value )

			}, Object.values( this._jsonRawData[ collectionName ] )
		)

		return Promise.resolve( matchingDocs )
	}

	delete( id: string, collectionName: string ): Promise< void > {
		delete this._jsonRawData[ collectionName ][ id ]
		return Promise.resolve()
	}

	get rawData() {
		return this._jsonRawData;
	}

	private queryProcessor<T, P extends keyof QueryObject<T>>(
		docs: DocumentObject[], 
		processMethod: P, 
		value: QueryObject<T>[P] 
	) {

		const processors: QueryProcessors = {

			limit: ( limit: number ) => docs.slice( 0, limit ),

			operations: ( operations: QueryOperations<T> ) => docs.filter(
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

	private deepValue( obj: {}, deepProperty: string /*like person.name.firstName*/) {
		const propChain = deepProperty.split( '.' )
		return propChain.reduce(( value, prop ) => value[ prop ], obj )
	}

	private isQueryMatched<T>( doc: DocumentObject, queryOperations: QueryOperations<T> ) {
		const queryOperator = {
			'==': <U>(a: U, b: U) => a === b,
			'!=': <U>(a: U, b: U) => a !== b,
			'<': <U>(a: U, b: U) => a < b,
			'<=': <U>(a: U, b: U) => a <= b,
			'>': <U>(a: U, b: U) => a > b,
			'>=': <U>(a: U, b: U) => a >= b,
		}

		const isMatch = Object.entries( queryOperations ).reduce( ( prevVal, [ key, val ]) => {
			const operation = val as QueryOperation<unknown>
	
			const [ document, value ] = this.retrieveValuesToCompare( doc[ key ], operation.value )

			return prevVal && queryOperator[ operation.operator ]( document, value )
		}, true)

		return isMatch
	}

	private retrieveValuesToCompare( document: DocumentObject, value: unknown ): [ unknown, unknown ] {
		// let doc = document
		// let val = value

		if ( typeof value === 'object' ) {
			const propName = Object.keys( value )[0]
			var [ doc, val ] = this.retrieveValuesToCompare( document && document[ propName ], value[ propName ] )
			// doc = values[0]
			// val = values[1]
		}

		return [ doc || document, val || value ]
	}

	private _jsonRawData: JsonRawData;
}
