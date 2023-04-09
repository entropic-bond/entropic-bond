import { CloudStorage, registerCloudStorage, StorableData, UploadControl, UploadProgress } from './cloud-storage'

@registerCloudStorage( 'MockCloudStorage', ()=>new MockCloudStorage() )
export class MockCloudStorage extends CloudStorage {
	constructor( pathToMockFiles: string = '' ) {
		super()
		this._pathToMockFiles = pathToMockFiles
	}

	save( id: string, data: StorableData ): Promise<string> {
		const fullPath = id

		if ( this._onProgress ) this._onProgress( 0, 100 )

		this.mockFileSystem[ id ] = JSON.stringify( data ) 

		if ( this._onProgress ) this._onProgress( 100, 100 )

		const ref = data instanceof File? data.name : fullPath
		return Promise.resolve( ref )
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
		return Promise.resolve( this._pathToMockFiles + reference )
	}

	delete( reference: string ) {
		delete this.mockFileSystem[ reference ]
		return Promise.resolve()
	}

	private _onProgress: UploadProgress | undefined
	private _pathToMockFiles: string
	public mockFileSystem = {}
}