import { Callback, Observable } from '../observable/observable'
import { persistent, Persistent, registerPersistentClass } from '../persistent/persistent'
import { CloudStorage, StorableData, UploadControl, UploadProgress } from './cloud-storage'

export enum  StoredFileEvent { stored, pendingDataSet, deleted }
export interface StoredFileChange {
	event: StoredFileEvent
	pendingData?: StorableData
	storedFile: StoredFile
}

export interface StoreParams {
	data?: StorableData, 
	fileName?: string, 
	progress?: UploadProgress, 
	cloudStorageProvider?: CloudStorage 
}

@registerPersistentClass( 'StoredFile' )
export class StoredFile extends Persistent{

	async save({ data, fileName, progress, cloudStorageProvider }: StoreParams = {}): Promise<void> {
		const dataToStore = data || this._pendingData
		if ( !dataToStore ) return
		if ( this._reference ) await this.delete()

		this.provider = cloudStorageProvider || CloudStorage.defaultCloudStorage
		this._originalFileName = fileName || ( dataToStore instanceof File? dataToStore.name : undefined )

		this._reference = await this.provider.save( this.id, dataToStore, progress )
		this._url = await this.provider.getUrl( this._reference )

		this._pendingData = undefined
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
			try {
				this._provider = CloudStorage.createInstance( this._cloudStorageProviderName! )
			} 
			catch {
				this._provider = CloudStorage.defaultCloudStorage
			}
 		}
		return this._provider
	}

	get url() {
		return this._url
	}

	setDataToStore( data: StorableData ) {
		this._pendingData = data
		this._originalFileName = data instanceof File? data.name : undefined
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

	onChange( listenerCallback: Callback<StoredFileChange> ) {
		return this._onChange.subscribe( listenerCallback )
	}

	@persistent private _reference: string | undefined
	@persistent private _url: string | undefined
	@persistent private _cloudStorageProviderName: string | undefined
	@persistent private _originalFileName: string | undefined
	private _provider: CloudStorage | undefined
	private _pendingData: StorableData | undefined
	private _onChange: Observable<StoredFileChange> = new Observable<StoredFileChange>()
}
