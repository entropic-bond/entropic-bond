import { Persistent, PersistentObject, Collections } from '../persistent/persistent'
import { ClassPropNames } from '../types/utility-types'

export type DocumentObject = PersistentObject<Persistent>

export type QueryOperator = '==' | '!=' | '<' | '<=' | '>' | '>='

export interface QueryOperation<T> {
	operator: QueryOperator
	value: Partial<T>
}

export type QueryOperations<T> = {
	[ P in ClassPropNames<T> ]?: QueryOperation<T[P]>
}

export type QueryOrder = 'asc' | 'desc'

export type QueryObject<T> = {
	operations?: Partial<QueryOperations<T>>
	limit?: number
	sort?: {
		order: QueryOrder
		propertyName: ClassPropNames<T> | string
	}
}

export abstract class DataSource {
	abstract findById( id: string, collectionName: string ): Promise< DocumentObject >
	abstract find( queryObject: QueryObject<DocumentObject>, collectionName: string ): Promise< DocumentObject[] >
	abstract save( object: Collections ): Promise< void >
	abstract delete( id: string, collectionName: string ): Promise<void>
	abstract next( limit?: number ): Promise< DocumentObject[] >
	abstract prev( limit?: number ): Promise< DocumentObject[] >

	static toPropertyPathOperations<T extends Persistent>( operations: QueryOperations<T> ): [ string, QueryOperation<T>][] {
		return Object.entries( operations ).map(([ propName, operation ]: [string, QueryOperation<T>] ) => {
			const [ path, value ] = this.toPropertyPathValue( operation.value )
			const propPath = `${ propName }${ path? '.'+path : '' }` 
			return [ 
				propPath, 
				{ 
					operator:	operation.operator,
					value
				} as QueryOperation<T>
			]
		})
	}

	static toPropertyPathValue( obj: {} ): [ string, unknown ] {
		if ( typeof obj === 'object' ) {
			const propName = Object.keys( obj )[0]
			const [ propPath, value ] = this.toPropertyPathValue( obj[ propName ] )
			return [ `${ propName }${ propPath? '.'+propPath : '' }`, value ]
		}
		else {
			return [ undefined, obj ]
		}

	}
}
