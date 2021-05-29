import { Persistent, PersistentObject, Collections } from '../persistent/persistent'
import { ClassPropNames, SomeClassProps } from '../types/utility-types'

export type DocumentObject = PersistentObject<Persistent>

export type QueryOperator = '==' | '!=' | '<' | '<=' | '>' | '>='

export interface QueryOperation<T> {
	operator: QueryOperator
	value: T
}

export type QueryOperations<T> = {
	[ P in keyof SomeClassProps<T> ]: QueryOperation<T[P]>
}

export type QueryOrder = 'asc' | 'desc'

export type QueryObject<T> = {
	operations?: QueryOperations<T>
	limit?: number
	sort?: {
		order: QueryOrder
		propertyName: ClassPropNames<T>
	}
}

export interface DataSource {
	findById( id: string, collectionName: string ): Promise< DocumentObject >
	find<T extends Persistent>( queryObject: QueryObject<T>, collectionName: string ): Promise< DocumentObject[] >
	save( object: Collections ): Promise< void >
	delete( id: string, collectionName: string ): Promise<void>
}
