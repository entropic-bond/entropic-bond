import { Persistent, PersistentObject } from '../persistent/persistent';
import { CollectionsDocument, DataSource, DocumentObject, QueryObject } from "./data-source";

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

	save( object: CollectionsDocument ): Promise< void > {
		object.__rootCollections.forEach( collection => {
			if ( this._jsonRawData[ collection.__className ] ) this._jsonRawData[ collection.__className ] = {}
			this._jsonRawData[ collection.__className ][ collection.id ] = collection
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
		this._jsonRawData[ collectionName ][ id ] = undefined
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
