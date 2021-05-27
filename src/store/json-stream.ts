import { Collections, Persistent, PersistentObject } from '../persistent/persistent';
import { DataSource, DocumentObject, QueryObject } from "./data-source";

export interface JsonRawData {
	[ collection: string ]: {
		[ documentId: string ]: PersistentObject<Persistent>
	}
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

	find( queryObject: QueryObject<DocumentObject>, collectionName: string ): Promise< DocumentObject[] > {
		const matchingDocs = Object.values( this._jsonRawData[ collectionName ] ).filter( 
			doc => this.isQueryMatched( doc, queryObject )
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

	private isQueryMatched( doc: DocumentObject, queryObject: QueryObject<DocumentObject> ) {
		const queryOperator = {
			'==': <T>(a: T, b: T) => a === b,
			'!=': <T>(a: T, b: T) => a !== b,
			'<': <T>(a: T, b: T) => a < b,
			'<=': <T>(a: T, b: T) => a <= b,
			'>': <T>(a: T, b: T) => a > b,
			'>=': <T>(a: T, b: T) => a >= b,
		}

		return Object.entries( queryObject ).reduce( ( prevVal, [ key, value ]) => {
			return prevVal && queryOperator[ value.operator ]( doc[ key ], value.value )
		}, true)
	}

	private _jsonRawData: JsonRawData;
}
