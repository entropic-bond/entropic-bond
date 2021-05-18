import { Persistent } from '../persistent/persistent';
import { SomeClassProps } from '../types/utility-types';
import { DataSource, QueryObject, CollectionsObject, PersistentObject } from "./data-source";

export interface JsonRawData {
	[ collection: string ]: {
		[ documentId: string ]: SomeClassProps<Persistent>
	}
}

export class JsonStream implements DataSource {
	constructor( jsonRawData?: JsonRawData ) {
		this._jsonRawData = jsonRawData;
	}

	setDataStore( rawDataStore: JsonRawData ) {
		this._jsonRawData = rawDataStore;
	}

	findById( id: string, collectionName: string ): Promise< PersistentObject > {
		return Promise.resolve( this._jsonRawData[ collectionName ][ id ] )
	}

	save( object: CollectionsObject ): Promise< void > {
		object.__rootCollections.forEach( collection => {
			console.log( collection )
			console.log( this._jsonRawData[ collection.className ] )
			if ( this._jsonRawData[ collection.className ] ) this._jsonRawData[ collection.className ] = {}
			this._jsonRawData[ collection.className ][ collection.id ] = collection
		})

		return Promise.resolve()
	}

	find( queryObject: QueryObject<PersistentObject>, collectionName: string ): Promise< PersistentObject[] > {
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

	private isQueryMatched( doc: PersistentObject, queryObject: QueryObject<PersistentObject> ) {
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
