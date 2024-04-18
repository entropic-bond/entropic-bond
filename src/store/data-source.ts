import { Store } from './store'
import { Persistent, PersistentObject, Collections, PersistentProperty } from '../persistent/persistent'
import { ClassPropNames } from '../types/utility-types'

export type DocumentObject = PersistentObject<Persistent>

/**
 * The query operators
 * @param == equal
 * @param != not equal
 * @param < less than
 * @param <= less than or equal
 * @param > greater than
 * @param >= greater than or equal
 * @param contains array contains
 * @param containsAny array contains any
 * @param in in
 * @param !in not in
 */
export type QueryOperator = '==' | '!=' | '<' | '<=' | '>' | '>=' | 'contains' | 'containsAny'// | 'in' | '!in'

/**
 * A representation of a query operation
 * @param property the name of the property to be used in the query
 * @param operator the operator to be used in the query
 * @param value the value to be used in the query
 * @param aggregate if true, the query results will be aggregated using an `or` operator
 */
export type QueryOperation<T> = {
	property: ClassPropNames<T>
	operator: QueryOperator
	value: Partial<T[ClassPropNames<T>]> | {[key:string]: unknown}
	aggregate?: boolean
}

/**
 * The sort order
 * @param asc ascending order
 * @param desc descending order
 */
export type QueryOrder = 'asc' | 'desc'

/**
 * A representation of a full query
 * @param operations the query operations to be performed
 * @param limit the maximum number of items to be retrieved
 * @param sort sort info
 * @param sort.order the sort order
 * @param sort.propertyName the name of the property to be used for sorting
 */
export type QueryObject<T> = {
	operations?: QueryOperation<T>[]
	limit?: number
	sort?: {
		order: QueryOrder
		propertyName: ClassPropNames<T> | string
	}
}

type PersistentPropertyCollection = {
	[className: string]: PersistentProperty[]
}

export type DocumentListenerUninstaller = () => void

interface DocumentChange {
	before: DocumentObject | undefined
	after: DocumentObject,
}

export type DocumentChangeListerner = ( change: DocumentChange ) => void
export interface DocumentChangeListernerHandler {
	uninstall: DocumentListenerUninstaller
	nativeHandler: unknown
	collectionPath: string
}

type CachedPropsUpdateCallback = ( doc: Persistent, prop: PersistentProperty, collectionPath: string )=>void

export interface CachedPropsUpdaterConfig {
	onUpdate?: CachedPropsUpdateCallback
	noThrowOnNonImplementedListener?: boolean
	documentChangeListerner?: ( prop: PersistentProperty, listener: DocumentChangeListerner ) => DocumentChangeListernerHandler | undefined
}

/**
 * The data source interface.
 * It defines the methods that must be implemented by a data source
 * A data source is able to retrieve and save data i.e: from a database, a file, a RestAPI, etc.
 * You can derive from this class to implement your own data source with the 
 * A data source is used by the store to retrieve and save data.
 */
export abstract class DataSource {
	installCachedPropsUpdaters( config: CachedPropsUpdaterConfig = {} ): DocumentChangeListernerHandler[] {
		this.onUpdate = config.onUpdate
		const handlers: DocumentChangeListernerHandler[] = []
		const referencesWithStoredProps = DataSource.getSystemRegisteredReferencesWithStoredProps()

		Object.entries( referencesWithStoredProps ).forEach(([ className, props ]) => {
			props.forEach( propInfo => {
				if ( !propInfo.storeInCollection ) return
					
				let listenerHandler: DocumentChangeListernerHandler | undefined
				
				if ( config.documentChangeListerner ) {
					listenerHandler = config.documentChangeListerner( propInfo, e => this.onDocumentChange( e, propInfo, className ) )
				}
				else {
					listenerHandler = this.subscribeToDocumentChangeListerner( propInfo, e => this.onDocumentChange( e, propInfo, className ) )
				}

				if ( !listenerHandler ) {
					if ( config.noThrowOnNonImplementedListener ) throw new Error( `The method documentChangeListerner has not been implemented in the concrete data source` )
				}
				else handlers.push( listenerHandler )
			})
		})

		return handlers
	}

	/**
	 * Installs a document change listener
	 * Implement the required logic to install a listener that will be called
	 * when a document is changed in your concrete the data source
	 * @param prop the property that has a reference to a persistent object
	 * @param listener the listener to be called when a document is changed
	 * @returns a function that uninstalls the listener. If the returned value is undefined
	 * the method documentChangeListerner has not been implemented in the concrete data source
	 */
	protected subscribeToDocumentChangeListerner( prop: PersistentProperty, listener: DocumentChangeListerner ): DocumentChangeListernerHandler | undefined {
		return undefined
	}

	/**
	 * Retrieves a document by id
	 * Implement the required logic to retrieve a document by id from your concrete
	 * the data source
	 * @param id the id of the document to be retrieved
	 * @param collectionName the name of the collection where the document is stored
	 * @returns a promise resolving to the document object. The document object is 
	 * a plain object with the properties of the document class.
	 */
	abstract findById( id: string, collectionName: string ): Promise< DocumentObject >

	/**
	 * Retrieves all documents matching the query stored in the query object
	 * Implement the required logic to retrieve the documents that match the 
	 * requirements in the query object from your concrete the data source
	 * @param queryObject the query object containing the query operations
	 * @param collectionName the name of the collection where the documents are stored
	 * @returns a promise resolving to an array of document objects. The document object is
	 * a plain object with the properties of the document class.
	 * @see QueryObject
	 * @see QueryOperation
	 * @see QueryOperator
	 * @see QueryOrder
	 * @see DocumentObject
	 */
	abstract find( queryObject: QueryObject<DocumentObject>, collectionName: string ): Promise< DocumentObject[] >

	/**
	 * Saves a document
	 * Implement the required logic to save the document in your concrete the data source
	 * @param object A collection of documents to be saved
	 * @returns a promise
	 */
	abstract save( object: Collections ): Promise< void >

	/**
	 * Deletes a document by id
	 * Implement the required logic to delete a document by id from your concrete
	 * data source
	 * @param id the id of the document to be deleted
	 * @param collectionName the name of the collection where the document is stored
	 * @returns a promise
	 */
	abstract delete( id: string, collectionName: string ): Promise<void>

	/**
	 * Retrieves the next bunch of documents matching the query stored in the query object
	 * Implement the required logic to retrieve the next bunch of documents that match the
	 * requirements in the query object from your concrete the data source
	 * @param limit the maximum number of items to be retrieved
	 * @returns a promise resolving to an array representing the next bunch of document objects
	 */
	abstract next( limit?: number ): Promise< DocumentObject[] >

	/**
	 * Retrieves the number of documents matching the query stored in the query object
	 * Implement the required logic to retrieve the number of documents that match the
	 * requirements in the query object from your concrete the data source
	 * @param queryObject the query object containing the query operations
	 * @param collectionName the name of the collection where the documents are stored
	 * @returns a promise resolving to the number of documents matching the query
	 * @see QueryObject
	 */
	abstract count( queryObject: QueryObject<DocumentObject>, collectionName: string ): Promise<number>

	/**
	 * Utility method to convert a query object to a property path query object
	 * 
	 * @param queryObject the query object to be converted
	 * @returns a property path query object
	 * @example
	 * const queryObject = {
	 * 	operations: [{ property: 'name', operator: '==', value: { ancestorName: { father: 'Felipe' }}]
	 * }
	 * const propPathQueryObject = DataSource.toPropertyPathQueryObject( queryObject )
	 * // returned value: [{ property: 'name.ancestorName.father', operator: '==', value: 'Felipe' }]
	 */
	static toPropertyPathOperations<T extends Persistent>( operations: QueryOperation<T>[] ): QueryOperation<T>[] {
		if ( !operations ) return []

		return operations.map( operation => {

			if ( DataSource.isArrayOperator( operation.operator ) && operation.value[0] instanceof Persistent ) {
				return {
					property: Persistent.searchableArrayNameFor( operation.property as string ),
					operator: operation.operator,
					value: ( operation.value as unknown as Persistent[] ).map( v => v.id ) as any,
					aggregate: operation.aggregate
				} as QueryOperation<T>
			}

			const [ path, value ] = this.toPropertyPathValue( operation.value )
			const propPath = `${ String( operation.property ) }${ path? '.'+path : '' }` 

			return { 
				property: propPath, 
				operator:	operation.operator,
				value,
				aggregate: operation.aggregate
			} as QueryOperation<T>
		})
	}

	static isArrayOperator( operator: QueryOperator ): boolean {
		return operator === 'containsAny' || operator === 'contains' //|| operator === 'in' || operator === '!in'  
	}

	private static toPropertyPathValue( obj: {} ): [ string | undefined, unknown ] {
		if ( typeof obj === 'object' && !Array.isArray( obj ) ) {
			const propName = Object.keys( obj )[0]!
			const [ propPath, value ] = this.toPropertyPathValue( obj[ propName ] )
			return [ `${ propName }${ propPath? '.'+propPath : '' }`, value ]
		}
		else {
			return [ undefined, obj ]
		}
	}

	private async onDocumentChange( event: DocumentChange, prop: PersistentProperty, collectionPath: string ) {
		if ( !event.before || !prop.cachedProps ) return
		const model = Store.getModel<any>( collectionPath )
		let query = model.find()

		prop.cachedProps.forEach( persistentPropName => {
			const oldValue = event.before![ persistentPropName ]
			const newValue = event.after[ persistentPropName ]
			if ( oldValue !== newValue ) {
				query = query.orDeepProp( `${ prop.name }.${ persistentPropName }`, '==', oldValue )
			}
		})

		const result = await query.get()
		return Promise.all([
			result.map( async document =>{
				prop.cachedProps?.forEach( async persistentPropName => {
					const oldValue = event.before![ persistentPropName ]
					const newValue = event.after[ persistentPropName ]
					if ( oldValue !== newValue ) {
						document[ `_${ prop.name }` ][ `_${ persistentPropName }` ] = newValue
						await model.save( document )
						this.onUpdate?.( document, prop, collectionPath )
					}
				})
			})
		])
	}

	private static getSystemRegisteredReferencesWithStoredProps(): PersistentPropertyCollection {
		const systemRegisteredClasses = Persistent.registeredClasses()
		const referencesWithStoredProps = systemRegisteredClasses.reduce(( referencesWithStoredProps, className ) => {
			const inst = Persistent.createInstance( className )
			const propsWithStoredValue = inst.getPersistentProperties().filter( 
				propInfo => propInfo.cachedProps
			)
			if ( propsWithStoredValue.length > 0 ) referencesWithStoredProps[className] = propsWithStoredValue
			return referencesWithStoredProps
		}, {} as PersistentPropertyCollection )
		
		return referencesWithStoredProps
	}

	private onUpdate: CachedPropsUpdateCallback | undefined
}
