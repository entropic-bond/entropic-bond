import { CloudStorage, registerCloudStorage, UploadControl, UploadProgress } from './cloud-storage'

@registerCloudStorage( 'MockCloudStorage', ()=>new MockCloudStorage() )
export class MockCloudStorage extends CloudStorage {

	store( id: string, data: Blob | Uint8Array | ArrayBuffer ): Promise<string> {
		const fullPath = id

		if ( this._onProgress ) this._onProgress( 0, 100 )
		this.mockFileSystem[ id ] = JSON.stringify( data ) 
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