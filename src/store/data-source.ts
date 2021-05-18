import { ObjectWithCollections, Persistent } from '../persistent/persistent'
import { SomeClassProps } from '../types/utility-types'

export type PersistentObject = SomeClassProps<Persistent>
export type CollectionsObject = ObjectWithCollections<Persistent>

export type QueryOperator = '==' | '!=' | '<' | '<=' | '>' | '>='

export type QueryObject<T> = {
	[ P in keyof SomeClassProps<T> ]: {
		operator: QueryOperator
		value: T[P]
	}
}

export interface DataSource {
	findById( id: string, collectionName: string ): Promise< PersistentObject >
	find( queryObject: QueryObject<PersistentObject>, collectionName: string ): Promise< PersistentObject[] >
	save( object: CollectionsObject ): Promise< void >
	delete( id: string, collectionName: string ): Promise<void>
}
