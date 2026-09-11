import { CloudStorage, registerCloudStorage, StorableData, UploadControl, UploadProgress } from './cloud-storage'

@registerCloudStorage( 'MockCloudStorage', ()=>new MockCloudStorage() )
export class MockCloudStorage extends CloudStorage {
	constructor( pathToMockFiles: string = '' ) {
		super()
		this._pathToMockFiles = pathToMockFiles
	}

	/**
	 * Introduce a delay in the execution of operations to simulate a real data source
	 * @param miliSeconds the number of milliseconds to delay the execution of operations
	 * @returns a chainable reference to this object
	 */
	simulateDelay( miliSeconds: number ) {
		this._simulateDelay = miliSeconds
		return this
	}

	private resolveWithDelay<T>( data?: T ): Promise<T> {
		if ( this._simulateDelay <= 0 ) return Promise.resolve( data! )

		const promise = new Promise<T>( resolve => {
			setTimeout(
				()=> resolve( data! ),
				this._simulateDelay
			)
		})
		this._pendingPromises.push( promise )
		promise.finally(
			()=> this._pendingPromises = this._pendingPromises.filter( p => p === promise )
		)
		return promise
	}

	save( id: string, data: StorableData ): Promise<string> {
		const fullPath = id

		if ( this._onProgress ) this._onProgress( 0, 100 )

		this.mockFileSystem[ id ] = JSON.stringify( data ) 

		if ( this._onProgress ) this._onProgress( 100, 100 )

		const ref = data instanceof File? data.name : fullPath
		return this.resolveWithDelay( ref )
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
		return this.resolveWithDelay<void>()
	}

	private _simulateDelay: number = 0
	private _pendingPromises: Promise<any>[] = []
	private _onProgress: UploadProgress | undefined
	private _pathToMockFiles: string
	public mockFileSystem = {}
}