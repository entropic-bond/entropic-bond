import { DataStream, StreamDocument } from "./data-stream";

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

	find( object: StreamDocument, collectionName: string ): Promise< StreamDocument[] > {
		return Promise.resolve(
			Object.values( this._jsonRawData[ collectionName ] ).filter( a => object['res']==='res' )
		)
	}

	delete( id: string, collectionName: string ): Promise< void > {
		this._jsonRawData[ collectionName ][ id ] = undefined
		return Promise.resolve()
	}

	get rawData() {
		return this._jsonRawData;
	}

	private _jsonRawData: JsonRawData;
}
