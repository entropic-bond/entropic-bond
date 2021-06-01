import { persistent, Persistent, registerClassFactory } from '../persistent/persistent'
import { CloudStorage, UploadControl } from './cloud-storage'

@registerClassFactory( 'StoredFile', ()=>new StoredFile() )
export class StoredFile extends Persistent{

	async store( data: any, fileName: string = '', cloudStorageProvider?: CloudStorage ): Promise<void> {
		this.provider = cloudStorageProvider || CloudStorage.defaultCloudStorage
		this._originalFileName = fileName

		this._reference = await this.provider.store( this.id, data )
		this._url = await this.provider.getUrl( this._reference )
	}

	async refreshUrl(): Promise<string> {
		return this.provider.getUrl( this._reference )
	}

	uploadControl(): UploadControl {
		return this.provider.uploadControl()
	}

	delete(): Promise<void> {
		return this.provider.delete( this._reference )
	}

	set provider( value: CloudStorage ) {
		this._provider = value
		this._cloudStorageProviderName = value.className
	}

	get provider() {
		if ( !this._provider ) {
			this._provider = CloudStorage.createInstance( this._cloudStorageProviderName )
		}
		return this._provider
	}

	get url() {
		return this._url
	}

	get originalFileName() {
		return this._originalFileName
	}

	@persistent private _reference: string
	@persistent private _url: string
	@persistent private _cloudStorageProviderName: string
	@persistent private _originalFileName: string
	private _provider: CloudStorage
}
