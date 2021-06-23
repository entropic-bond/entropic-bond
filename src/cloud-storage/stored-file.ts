import { Callback, Observable, Unsubscriber } from '../observable/observable'
import { persistent, Persistent, registerPersistentClass } from '../persistent/persistent'
import { CloudStorage, StorableData, UploadControl } from './cloud-storage'

export enum  StoredFileEvent { stored, pendingDataSet, deleted }
export interface StoredFileChange {
	event: StoredFileEvent
	pendingData?: StorableData
	storedFile: StoredFile
}

@registerPersistentClass( 'StoredFile' )
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
		this._onChange.notify({ event: StoredFileEvent.stored, storedFile: this })
	}

	uploadControl(): UploadControl {
		return this.provider.uploadControl()
	}

	async delete(): Promise<void> {
		if ( !this._reference ) throw new Error( 'Cannot delete a not stored file' )
		await this.provider.delete( this._reference )
		this._reference = undefined
		this._url = undefined
		this._onChange.notify({ event: StoredFileEvent.deleted, storedFile: this })
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

	setDataToStore( data: StorableData ) {
		this._pendingData = data
		this._originalFileName = data instanceof File && data.name
		this._onChange.notify({ 
			event: StoredFileEvent.pendingDataSet, 
			pendingData: data,
			storedFile: this 
		})
		return this
	}

	get originalFileName() {
		return this._originalFileName
	}

	onChange( listenerCallback: Callback<StoredFileChange> ): Unsubscriber {
		return this._onChange.subscribe( listenerCallback )
	}

	@persistent private _reference: string
	@persistent private _url: string
	@persistent private _cloudStorageProviderName: string
	@persistent private _originalFileName: string
	private _provider: CloudStorage
	private _pendingData: StorableData
	private _onChange: Observable<StoredFileChange> = new Observable<StoredFileChange>()
}
