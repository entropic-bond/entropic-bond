export type UploadProgress = ( uploadedBytes: number, fileSize: number ) => void

type CloudStorageFactory = ()=>CloudStorage

interface CloudStorageFactoryMap { 
	[ cloudStorageProviderName: string ] : CloudStorageFactory 
}

export interface UploadControl {
	pause: ()=>void
	resume: ()=>void
	cancel: ()=>void
	onProgress: ( callback: UploadProgress )=>void
}

export type StorableData = File | Blob | Uint8Array | ArrayBuffer

export abstract class CloudStorage {
	abstract save( id: string, data: StorableData, progress?: UploadProgress ): Promise<string>
	abstract getUrl( reference: string ): Promise<string>
	abstract uploadControl(): UploadControl
	abstract delete( reference: string ): Promise<void>

	static registerCloudStorage( cloudStorageProviderName: string, factory: CloudStorageFactory ) {
		CloudStorage._cloudStorageFactoryMap[ cloudStorageProviderName ] = factory
	}

	static createInstance( providerName: string ) {
		const provider = CloudStorage._cloudStorageFactoryMap[ providerName ]
		if ( !provider ) {
			throw new Error( `You should register the ${ providerName } cloud storage provider prior to use it`)
		}

		return provider()
	}

	get className(): string {
		return this[ '__className' ];
	}

	static useCloudStorage( provider: CloudStorage ) {
		CloudStorage._defaultCloudStorage = provider
	}

	static get defaultCloudStorage() {
		if ( !CloudStorage._defaultCloudStorage ) {
			throw new Error( 'You should define a default cloud storage provider prior to use it')
		}
		return CloudStorage._defaultCloudStorage
	}
	static _defaultCloudStorage: CloudStorage
	private static _cloudStorageFactoryMap: CloudStorageFactoryMap = {}
}

export function registerCloudStorage( cloudStorageProviderName: string, factory: CloudStorageFactory ) {
	CloudStorage.registerCloudStorage( cloudStorageProviderName, factory )
	return ( constructor: Function ) => {
		constructor.prototype.__className = cloudStorageProviderName
	}
}
