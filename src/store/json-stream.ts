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
					return a[ propertyName ] > b[ propertyName ]? 1 : -1 
				}
				else {
					return a[ propertyName ] < b[ propertyName ]? 1 : -1
				}
			})
		}

		return processors[ processMethod ]( value )
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
	
			const [ document, value ] = this.retrieveValuesToCompare( doc[ key ], operation )

			return prevVal && queryOperator[ operation.operator ]( document, value )
		}, true)

		return isMatch
	}

	private retrieveValuesToCompare( doc: DocumentObject, operation: QueryOperation<unknown> ): [ unknown, unknown ] {
		let document = doc
		let value = operation.value

		if ( typeof operation.value === 'object' ) {
			Object.keys( operation.value ).forEach(	propName => {
				document = document[ propName ] 
				value = value[ propName ]
			})
		}

		return [ document, value ]
	}

	private _jsonRawData: JsonRawData;
}
