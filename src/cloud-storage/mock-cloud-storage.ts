import { CloudStorage, registerCloudStorage, StorableData, UploadControl, UploadProgress } from './cloud-storage'

class File {}
export class MockFile extends File {
	constructor( data: BlobPart[], filename: string ) {
		super()
		this.data = data[0] as any
		this.name = filename
	}
	data: Uint8Array
	name: string
	lastModified: any
	size: number
	type: any
	arrayBuffer: any
	slice: any
	stream: any
	text: any
}
global.File = MockFile

@registerCloudStorage( 'MockCloudStorage', ()=>new MockCloudStorage() )
export class MockCloudStorage extends CloudStorage {

	store( id: string, data: StorableData ): Promise<string> {
		const fullPath = id

		if ( this._onProgress ) this._onProgress( 0, 100 )
		this.mockFileSystem[ id ] = JSON.stringify( 
			data instanceof File? data['data'] : data 
		) 
		if ( this._onProgress ) this._onProgress( 100, 100 )

		return Promise.resolve( fullPath )
	}

	uploadControl(): UploadControl {
		return {
			resume: ()=>{},
			pause: ()=>{},
			cancel: ()=>{},
			onProgress: callback => this._onProgress = callback
		}
	}

	getUrl( reference: string ): Promise<string> {
		return Promise.resolve( reference && 'file://' + reference )
	}

	delete( reference: string ) {
		delete this.mockFileSystem[ reference ]
		return Promise.resolve()
	}

	private _onProgress: UploadProgress
	public mockFileSystem = {}
}