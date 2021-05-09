import { SomeClassProps } from '../types/utility-types'

export interface Document {
	id: string
	[ key: string ]: unknown
}

export type QueryOperator = '==' | '!=' | '<' | '<=' | '>' | '>='

export type QueryObject<T> = {
	[ P in keyof SomeClassProps<T> ]: {
		operator: QueryOperator
		value: T[P]
	}
}

export interface DataSource {
	findById( id: string, collectionName: string ): Promise< Document >
	find( queryObject: QueryObject<Document>, collectionName: string ): Promise< Document[] >
	save( object: Document, collectionName: string ): Promise< void >
	delete( id: string, collectionName: string ): Promise<void>
}
