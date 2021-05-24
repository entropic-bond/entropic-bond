import { PersistentCollections, Persistent, PersistentObject, Collections } from '../persistent/persistent'
import { SomeClassProps } from '../types/utility-types'

export type DocumentObject = PersistentObject<Persistent>

export type QueryOperator = '==' | '!=' | '<' | '<=' | '>' | '>='

export type QueryObject<T> = {
	[ P in keyof SomeClassProps<T> ]: {
		operator: QueryOperator
		value: T[P]
	}
}

export interface DataSource {
	findById( id: string, collectionName: string ): Promise< DocumentObject >
	find( queryObject: QueryObject<DocumentObject>, collectionName: string ): Promise< DocumentObject[] >
	save( object: Collections ): Promise< void >
	delete( id: string, collectionName: string ): Promise<void>
}
