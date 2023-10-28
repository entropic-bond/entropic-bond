import { Persistent, persistent, registerPersistentClass } from '../persistent/persistent'
import { JsonDataSource } from '../store/json-data-source'
import { Model } from '../store/model'
import { Store } from '../store/store'
import { CloudStorage } from './cloud-storage'
import { MockCloudStorage } from './mock-cloud-storage'
import { StoredFile, StoredFileEvent } from './stored-file'

function MockFile(this: any,  data: any[], filename: string ) {
	this.data = data as any[]
	this.name = filename
}

global.File = MockFile as any

@registerPersistentClass( 'Test' )
class Test extends Persistent {

	get file(): StoredFile {
		return this._file
	}
	
	@persistent private _file: StoredFile = new StoredFile()
}

describe( 'Cloud Storage', ()=>{
	let testObj: Test
	let file: StoredFile
	const blobData1 = new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x2c, 0x20, 0x77, 0x6f, 0x72, 0x6c, 0x64, 0x21]);
	const blobData2 = new Uint8Array([0x6c, 0x6c, 0x6f, 0x2c, 0x48, 0x65, 0x20, 0x77, 0x6f, 0x72, 0x6c, 0x64, 0x21]);
	const fileData = new MockFile( [blobData1], 'pepe.dat' )

	const mockCloudStorage = new MockCloudStorage( 'mock-data-folder/' )

	beforeEach(()=>{
		CloudStorage.useCloudStorage( mockCloudStorage )
		testObj = new Test()
		file = new StoredFile()
	})

	afterEach( ()=> mockCloudStorage.mockFileSystem = {} )

	it( 'should save a file from Blob', async ()=>{
		await file.save({ data: blobData1 })
		expect( mockCloudStorage.mockFileSystem[ file.id ] ).toBeDefined()		
		expect( mockCloudStorage.mockFileSystem[ file.id ] ).toEqual( JSON.stringify( blobData1 ) )		
	})
	
	it( 'should save a file from File', async ()=>{
		await file.save({ data: fileData })
		expect( mockCloudStorage.mockFileSystem[ file.id ] ).toBeDefined()		
		expect( mockCloudStorage.mockFileSystem[ file.id ] ).toEqual( JSON.stringify( {data:[blobData1], name: 'pepe.dat'} ) )		
		expect( file.originalFileName ).toEqual( 'pepe.dat'  )
		expect( file.url ).toEqual( 'mock-data-folder/pepe.dat' )
	})
	
	it( 'should get a url', async ()=>{
		await file.save({ data: blobData1 })

		expect( file.url ).toEqual( 'mock-data-folder/' + file.id )
	})
	
	it( 'should report metadata', async ()=>{
		await file.save({ data: blobData1, fileName: 'test.dat' })

		expect( file.originalFileName ).toEqual( 'test.dat' )
		expect( file.provider.className ).toEqual( 'MockCloudStorage' )
	})

	it( 'should delete file', async ()=>{
		await file.save({ data: blobData1 })
		expect( mockCloudStorage.mockFileSystem[ file.id ] ).toBeDefined()		

		await file.delete()
		expect( file.url ).toBeUndefined()
		expect( mockCloudStorage.mockFileSystem[ file.id ] ).not.toBeDefined()		
	})

	it( 'should throw if not stored file', async ()=>{
		let thrown = false
		
		try{
			await file.delete()
		}
		catch {
			thrown = true
		}

		expect( thrown ).toBeTruthy()
	})
	

	it( 'should overwrite file on subsequent writes', async ()=>{
		const deleteSpy = vi.spyOn( file, 'delete' )

		await file.save({ data: 'first write' as any })
		expect( deleteSpy ).not.toHaveBeenCalled()
		expect( mockCloudStorage.mockFileSystem[ file.id ] ).toEqual( '"first write"' )		

		await file.save({ data: 'second write' as any })
		expect( deleteSpy ).toHaveBeenCalled()
		expect( mockCloudStorage.mockFileSystem[ file.id ] ).toEqual( '"second write"' )		
	})

	it( 'should save from pending file', async ()=>{
		file.setDataToStore( fileData )
		await file.save()

		expect( mockCloudStorage.mockFileSystem[ file.id ] ).toBeDefined()		
		expect( mockCloudStorage.mockFileSystem[ file.id ] ).toEqual( JSON.stringify( {data:[blobData1], name: 'pepe.dat'} ) )		
	})

	describe( 'Notify on change', ()=>{
		let spy: vi.Mock

		beforeEach(()=>{
			spy = vi.fn()
			file.onChange( spy )
		})

		afterEach( ()=>	spy.mockClear() )

		it( 'should notify on seting pendind data to store', ()=>{
			file.setDataToStore( fileData )
			expect( spy ).toHaveBeenNthCalledWith( 1, { 
				event: StoredFileEvent.pendingDataSet,
				pendingData: fileData,
				storedFile: file 
			})
		})

		it( 'should notify on data store', async ()=>{
			await file.save( fileData )
			expect( spy ).toHaveBeenNthCalledWith( 1, { 
				event: StoredFileEvent.stored,
				storedFile: file 
			})
		})

		it( 'should notify on delete', async ()=>{
			await file.save( fileData )
			spy.mockClear()

			await file.delete()
			expect( spy ).toHaveBeenNthCalledWith( 1, { 
				event: StoredFileEvent.deleted,
				storedFile: file 
			})
		})
	})	

	describe( 'Streaming', ()=>{
		const database = {}
		let model: Model<Test>
		let testObj: Test

		beforeEach(()=>{
			Store.useDataSource( new JsonDataSource( database ) )
			testObj = new Test()
			model = Store.getModel<Test>( testObj )
		})

		it( 'should save object with StoredFile', async ()=>{
			await testObj.file.save({ data: blobData1, fileName: 'test.dat' })
			await model.save( testObj )

			expect( database[ testObj.className ][ testObj.id ].file ).toBeDefined()
			expect( database[ testObj.className ][ testObj.id ].file.reference ).toEqual( testObj.file.id )
			expect( database[ testObj.className ][ testObj.id ].file.url ).toEqual( 'mock-data-folder/' + testObj.file.id )
			expect( database[ testObj.className ][ testObj.id ].file.cloudStorageProviderName ).toEqual( 'MockCloudStorage' )
			expect( database[ testObj.className ][ testObj.id ].file.originalFileName ).toEqual( 'test.dat' )
		})

		it( 'should load object with StoredFile', async ()=>{
			await testObj.file.save({ data: blobData1, fileName: 'test.dat' })
			await model.save( testObj )

			const newTestObj = await model.findById( testObj.id )

			expect( newTestObj?.file ).toBeInstanceOf( StoredFile )
			expect( newTestObj?.file.url ).toEqual( 'mock-data-folder/' + testObj.file.id )
		})

		it( 'should replace file on save after load', async ()=>{
			const deleteSpy = vi.spyOn( testObj.file, 'delete' )

			await testObj.file.save({ data: blobData1, fileName: 'test.dat' })
			await model.save( testObj )

			const newTestObj = await model.findById( testObj.id )

			expect( newTestObj?.file ).toBeInstanceOf( StoredFile )
			expect( newTestObj?.file.url ).toEqual( 'mock-data-folder/' + testObj.file.id )
			expect( deleteSpy ).not.toHaveBeenCalled()

			testObj.file.setDataToStore( blobData2 )
			await testObj.file.save()

			expect( 
				mockCloudStorage.mockFileSystem[ testObj.file.id ] 
			).toEqual( JSON.stringify( blobData2 ) )

			expect( deleteSpy ).toHaveBeenCalled()
		})		

	})
})