import { SomeClassProps } from '../types/utility-types'

export interface StreamDocument {
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

export interface DataStream {
	findById( id: string, collectionName: string ): Promise< StreamDocument >
	find( queryObject: QueryObject<StreamDocument>, collectionName: string ): Promise< StreamDocument[] >
	save( object: StreamDocument, collectionName: string ): Promise< void >
	delete( id: string, collectionName: string ): Promise<void>
}
