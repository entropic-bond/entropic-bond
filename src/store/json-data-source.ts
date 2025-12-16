import { Unsubscriber } from '../observable/observable'
import { Collections, DocumentChange, DocumentChangeType, Persistent, PersistentObject } from '../persistent/persistent'
import { Collection } from '../types/utility-types'
import { DataSource, DocumentChangeListener, DocumentChangeListenerHandler, DocumentObject, QueryObject, QueryOperation } from "./data-source"

export interface JsonRawData {
	[ collection: string ]: {
		[ documentId: string ]: PersistentObject<Persistent>
	}
}

export interface ErrorOnOperation {
	store: string
	find: string
	findById: string
	delete: string
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
export class JsonDataSource extends DataSource {

	/**
	 * @param jsonRawData the JSON object to be used as data store
	 */
	constructor( jsonRawData?: JsonRawData ) {
		super()
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
		if ( this._simulateError?.findById ) throw new Error( this._simulateError.findById )

		return this.resolveWithDelay( this._jsonRawData[ collectionName ]?.[ id ] )
	}

	save( collections: Collections ): Promise< void > {
		if ( this._simulateError?.store ) throw new Error( this._simulateError.store )

		Object.entries( collections ).forEach(([ collectionName, collection ]) => {
			if ( !this._jsonRawData[ collectionName ] ) this._jsonRawData[ collectionName ] = {}
			collection?.forEach( document => {
				const oldValue = this._jsonRawData[ collectionName ]![ document.id ]
				this._jsonRawData[ collectionName ]![ document.id ] = document
				if ( oldValue )	{
					this.notifyChange( collectionName, document, oldValue )
				}
			})
		})

		return this.resolveWithDelay()
	}

	find( queryObject: QueryObject<DocumentObject>, collectionName: string ): Promise< DocumentObject[] > {
		if ( this._simulateError?.find ) throw new Error( this._simulateError.find )

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

	delete( id: string, collectionName: string ): Promise<void> {
		if ( this._simulateError?.delete ) throw new Error( this._simulateError.delete )

		delete this._jsonRawData[ collectionName ]![ id ]
		return this.resolveWithDelay()
	}

	next( limit?: number ): Promise< DocumentObject[] > {
		if ( limit ) this._lastLimit = limit
		this.incCursor( this._lastLimit )

		return this.resolveWithDelay( this._lastMatchingDocs.slice( this._cursor, this._cursor + this._lastLimit ) )
	}

	count( queryObject: QueryObject<DocumentObject>, collectionName: string ): Promise<number> {
		return this.resolveWithDelay(
			Object.keys( this._jsonRawData[ collectionName ] ?? {} ).length
		)
	}

	override onCollectionChange( query: QueryObject<DocumentObject>, collectionName: string, listener: DocumentChangeListener<DocumentObject> ): Unsubscriber {
		this._collectionListeners[ collectionName ] = ( change: DocumentChange<DocumentObject> ) => {
			if ( !change.after ) return
			const isMatch = this.retrieveQueryDocs([ change.after ], query.operations! ).length > 0
			if ( isMatch ) {
				listener( change )
			}
		}
		return ()=> delete this._serverCollectionListeners[ collectionName ]
	}

	override onDocumentChange( collectionName: string, documentId: string, listener: DocumentChangeListener< DocumentObject > ): Unsubscriber {
		this._documentListeners[ collectionName ] = ( change: DocumentChange<DocumentObject> ) => {
			if ( change.after && change.after.id === documentId ) listener( change )
		}
		return ()=> delete this._serverCollectionListeners[ collectionName ]
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

	simulateError( error: string | ErrorOnOperation | undefined ): this {
		if ( error === undefined ) {
			this._simulateError = undefined
			return this
		}

		if ( typeof error === 'string' ) {
			this._simulateError = {
				store: error,
				find: error,
				findById: error,
				delete: error
			}
		}
		else this._simulateError = error

		return this
	}

	protected override subscribeToDocumentChangeListener( collectionNameToListen: string, listener: DocumentChangeListener<DocumentObject> ): DocumentChangeListenerHandler | undefined {
		delete this._serverCollectionListeners[ collectionNameToListen ]
		this._serverCollectionListeners[ collectionNameToListen ] = listener
		return {
			uninstall: ()=> delete this._serverCollectionListeners[ collectionNameToListen ],
			nativeHandler: listener,
			collectionPath: collectionNameToListen,
		}
	}

	private notifyChange( collectionPath: string, document: DocumentObject, oldValue: DocumentObject | undefined ) {
		const event = {
			before: oldValue,
			after: document,
			collectionPath,
			params: {},
			type: (oldValue? 'update' : 'create') as DocumentChangeType
		}

		this._serverCollectionListeners[ collectionPath ]?.( event )
		this._documentListeners[ collectionPath ]?.( event )
		this._collectionListeners[ collectionPath ]?.( event )
	}

	private decCursor( amount: number ) {
		this._cursor -= amount 
		if ( this._cursor < 0 ) {
			this._cursor = 0
			return true
		}
		return false
	}

	private queryProcessor<T, P extends keyof QueryProcessors>( docs: DocumentObject[], processMethod: P, value: QueryObject<T>[P] ) {

		const processors: QueryProcessors = {

			limit: ( limit: number ) => docs, //.slice( 0, limit ),

			operations: ( operations: QueryOperation<T>[] ) => this.retrieveQueryDocs( docs, operations ),

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

	private retrieveQueryDocs<T>( docs: DocumentObject[], queryOperations: QueryOperation<T>[] ): DocumentObject[] {
		return queryOperations.reduce(( prevDocs, queryOperation, i ) => {
			if ( queryOperation.aggregate ) {
				const aggregate = docs.filter( doc => this.isQueryMatched( doc, queryOperation ) )
				if ( i === 0 ) return aggregate
				else return prevDocs.concat( aggregate )
			}
			else {
				return prevDocs.filter( doc => this.isQueryMatched( doc, queryOperation ) )
			}
		}, docs )
	}

	private deepValue( obj: {}, propertyPath: string /*like person.name.firstName*/) {
		const propChain = propertyPath.split( '.' )
		return propChain.reduce(( value, prop ) => value[ prop ], obj )
	}

	private isQueryMatched<T>( doc: DocumentObject, queryOperation: QueryOperation<T> ) {
		const queryOperator = {
			'==': <U>(a: U, b: U) => a === b,
			'!=': <U>(a: U, b: U) => a !== b,
			'<': <U>(a: U, b: U) => a < b,
			'<=': <U>(a: U, b: U) => a <= b,
			'>': <U>(a: U, b: U) => a > b,
			'>=': <U>(a: U, b: U) => a >= b,
			'containsAny': <U>(a: U[], b: U[]) => a?.some( v => b?.includes( v ) ),
			'contains': <U>(a: U[], b: U) => a?.includes( b ),
		}

		const { property, value, operator } = queryOperation
		const [ propValue, v ] = this.retrieveValuesToCompare( doc, property as string, value )

		return queryOperator[ operator ]( propValue, v )
	}

	private retrieveValuesToCompare( doc: DocumentObject, propertyName: string, value: unknown ): [ any, any ] {
		const propertyValue = doc[ propertyName ]

		if ( propertyValue && typeof value === 'object' && !Array.isArray( value )) {
			const propName = Object.keys( value! )[0]!
			var [ propVal, val ] = this.retrieveValuesToCompare( propertyValue, propName, value?.[ propName ] )
		}

		return [ propVal || propertyValue, val || value ]
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
	private _lastMatchingDocs: DocumentObject[] = []
	private _lastLimit: number = 0
	private _cursor: number = 0
	private _simulateDelay: number = 0
	private _pendingPromises: Promise<any>[] = []
	private _simulateError: ErrorOnOperation | undefined
	private _documentListeners: Collection<DocumentChangeListener<DocumentObject>> = {}
	private _collectionListeners: Collection<DocumentChangeListener<DocumentObject>> = {}
	private _serverCollectionListeners: Collection<DocumentChangeListener<DocumentObject>> = {}
}
