import { DataStream, QueryObject, StreamDocument } from "./data-stream";

export interface JsonRawData {
	[ collection: string ]: {
		[ documentId: string ]: StreamDocument
	}
}

export class JsonStream implements DataStream {
	constructor( jsonRawData?: JsonRawData ) {
		this._jsonRawData = jsonRawData;
	}

	setDataStore( rawDataStore: JsonRawData ) {
		this._jsonRawData = rawDataStore;
	}

	findById( id: string, collectionName: string ): Promise< StreamDocument > {
		return Promise.resolve( this._jsonRawData[ collectionName ][ id ] )
	}

	save( object: StreamDocument, collectionName: string ): Promise< void > {
		this._jsonRawData[ collectionName ][ object.id ] = object
		return Promise.resolve()
	}

	find( queryObject: QueryObject<StreamDocument>, collectionName: string ): Promise< StreamDocument[] > {
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

	private isQueryMatched( doc: StreamDocument, queryObject: QueryObject<StreamDocument> ) {
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
