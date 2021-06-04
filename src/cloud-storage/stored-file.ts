import { persistent, Persistent, registerClassFactory } from '../persistent/persistent'
import { CloudStorage, StorableData, UploadControl } from './cloud-storage'

@registerClassFactory( 'StoredFile', ()=>new StoredFile() )
export class StoredFile extends Persistent{

	async store( data?: StorableData, fileName: string = '', cloudStorageProvider?: CloudStorage ): Promise<void> {
		const dataToStore = data || this._pendingData
		if ( !dataToStore ) return
		if ( this._reference ) await this.delete()

		this.provider = cloudStorageProvider || CloudStorage.defaultCloudStorage
		this._originalFileName = fileName || ( dataToStore instanceof File? dataToStore.name : undefined )

		this._reference = await this.provider.store( this.id, dataToStore )
		this._url = await this.provider.getUrl( this._reference )

		this._pendingData = null
	}

	uploadControl(): UploadControl {
		return this.provider.uploadControl()
	}

	async delete(): Promise<void> {
		await this.provider.delete( this._reference )
		this._reference = undefined
		this._url = undefined
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

	setDataToStore( file: StorableData ) {
		this._pendingData = file
		this._originalFileName = file instanceof File && file.name
		return this
	}

	get originalFileName() {
		return this._originalFileName
	}

	@persistent private _reference: string
	@persistent private _url: string
	@persistent private _cloudStorageProviderName: string
	@persistent private _originalFileName: string
	private _provider: CloudStorage
	private _pendingData: StorableData
}
