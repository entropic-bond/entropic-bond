import { DataSource, QueryObject, Document } from "./data-source";

export interface JsonRawData {
	[ collection: string ]: {
		[ documentId: string ]: Document
	}
}

export class JsonStream implements DataSource {
	constructor( jsonRawData?: JsonRawData ) {
		this._jsonRawData = jsonRawData;
	}

	setDataStore( rawDataStore: JsonRawData ) {
		this._jsonRawData = rawDataStore;
	}

	findById( id: string, collectionName: string ): Promise< Document > {
		return Promise.resolve( this._jsonRawData[ collectionName ][ id ] )
	}

	save( object: Document, collectionName: string ): Promise< void > {
		this._jsonRawData[ collectionName ][ object.id ] = object
		return Promise.resolve()
	}

	find( queryObject: QueryObject<Document>, collectionName: string ): Promise< Document[] > {
		const matchingDocs = Object.values( this._jsonRawData[ collectionName ] ).filter( 
			doc => this.isQueryMatched( doc, queryObject )
		)
		return Promise.resolve( matchingDocs )
	}

	delete( id: string, collectionName: string ): Promise< void > {
		this._jsonRawData[ collectionName ][ id ] = undefined
		return Promise.resolve()
	}

	get rawData() {
		return this._jsonRawData;
	}

	private isQueryMatched( doc: Document, queryObject: QueryObject<Document> ) {
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
