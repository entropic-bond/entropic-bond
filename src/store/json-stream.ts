import { DataStream, StreamDocument } from "./data-stream";

export interface DataStore {
	[ collection: string ]: {
		[ documentId: string ]: StreamDocument
	}
}

export class JsonStream implements DataStream {
	constructor( rawDataStore?: DataStore ) {
		this._rawDataStore = rawDataStore;
	}

	setDataStore( rawDataStore: DataStore ) {
		this._rawDataStore = rawDataStore;
	}

	findById( id: string, collectionName: string ): Promise< StreamDocument > {
		return Promise.resolve( this._rawDataStore[ collectionName ][ id ] )
	}

	save( object: StreamDocument, collectionName: string ): Promise< void > {
		this._rawDataStore[ collectionName ][ object.id ] = object
		return Promise.resolve()
	}

	find( object: StreamDocument, collectionName: string ): Promise< StreamDocument[] > {
		return Promise.resolve(
			Object.values( this._rawDataStore[ collectionName ] ).filter( a => object['res']==='res' )
		)
	}

	delete( id: string, collectionName: string ): Promise< void > {
		this._rawDataStore[ collectionName ][ id ] = undefined
		return Promise.resolve()
	}

	get rawData() {
		return this._rawDataStore;
	}

	private _rawDataStore: DataStore;
}
