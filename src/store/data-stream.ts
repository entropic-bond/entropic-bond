export interface StreamDocument {
	id: string
	[ key: string ]: unknown
}

export interface DataStream {
	findById( id: string, collectionName: string ): Promise< StreamDocument >
	find( fieldsToMatch: StreamDocument, collectionName: string ): Promise< StreamDocument[] >
	save( object: StreamDocument, collectionName: string ): Promise< void >
	delete( id: string, collectionName: string ): Promise<void>
}
