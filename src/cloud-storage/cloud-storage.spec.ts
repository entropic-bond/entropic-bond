import { Persistent, persistent, registerClassFactory } from '../persistent/persistent'
import { JsonStream } from '../store/json-stream'
import { Model } from '../store/model'
import { Store } from '../store/store'
import { CloudStorage } from './cloud-storage'
import { MockCloudStorage, MockFile } from './mock-cloud-storage'
import { StoredFile } from './stored-file'

@registerClassFactory( 'Test', ()=>new Test() )
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

	const mockCloudStorage = new MockCloudStorage()

	beforeEach(()=>{
		CloudStorage.useCloudStorage( mockCloudStorage )
		testObj = new Test()
		file = new StoredFile()
	})

	afterEach( ()=> mockCloudStorage.mockFileSystem = {} )

	it( 'should save a file from Blob', async ()=>{
		await file.store( blobData1 )
		expect( mockCloudStorage.mockFileSystem[ file.id ] ).toBeDefined()		
		expect( mockCloudStorage.mockFileSystem[ file.id ] ).toEqual( JSON.stringify( blobData1 ) )		
	})
	
	it( 'should save a file from File', async ()=>{
		await file.store( fileData )
		expect( mockCloudStorage.mockFileSystem[ file.id ] ).toBeDefined()		
		expect( mockCloudStorage.mockFileSystem[ file.id ] ).toEqual( JSON.stringify( blobData1 ) )		
		expect( file.originalFileName ).toEqual( 'pepe.dat' )
	})
	
	it( 'should get a url', async ()=>{
		await file.store( blobData1 )

		expect( file.url ).toEqual( 'file://' + file.id )
	})
	
	it( 'should report metadata', async ()=>{
		await file.store( blobData1, 'test.dat' )

		expect( file.originalFileName ).toEqual( 'test.dat' )
		expect( file.provider.className ).toEqual( 'MockCloudStorage' )
	})

	it( 'should delete file', async ()=>{
		await file.store( blobData1 )
		expect( mockCloudStorage.mockFileSystem[ file.id ] ).toBeDefined()		

		await file.delete()
		expect( file.url ).toBeUndefined()
		expect( mockCloudStorage.mockFileSystem[ file.id ] ).not.toBeDefined()		
	})

	it( 'should overwrite file on subsequent writes', async ()=>{
		const deleteSpy = jest.spyOn( file, 'delete' )

		await file.store( 'first write' as any )
		expect( deleteSpy ).not.toHaveBeenCalled()
		expect( mockCloudStorage.mockFileSystem[ file.id ] ).toEqual( '"first write"' )		

		await file.store( 'second write' as any )
		expect( deleteSpy ).toHaveBeenCalled()
		expect( mockCloudStorage.mockFileSystem[ file.id ] ).toEqual( '"second write"' )		
	})

	it( 'should save from pending file', async ()=>{
		file.setDataToStore( fileData )
		await file.store()

		expect( mockCloudStorage.mockFileSystem[ file.id ] ).toBeDefined()		
		expect( mockCloudStorage.mockFileSystem[ file.id ] ).toEqual( JSON.stringify( blobData1 ) )		
	})

	describe( 'Streaming', ()=>{
		const database = {}
		let model: Model<Test>
		let testObj: Test

		beforeEach(()=>{
			Store.useDataSource( new JsonStream( database ) )
			testObj = new Test()
			model = Store.getModel<Test>( testObj )
		})

		it( 'should save object with StoredFile', async ()=>{
			await testObj.file.store( blobData1, 'test.dat' )
			await model.save( testObj )

			expect( database[ testObj.className ][ testObj.id ].file ).toBeDefined()
			expect( database[ testObj.className ][ testObj.id ].file.reference ).toEqual( testObj.file.id )
			expect( database[ testObj.className ][ testObj.id ].file.url ).toEqual( 'file://' + testObj.file.id )
			expect( database[ testObj.className ][ testObj.id ].file.cloudStorageProviderName ).toEqual( 'MockCloudStorage' )
			expect( database[ testObj.className ][ testObj.id ].file.originalFileName ).toEqual( 'test.dat' )
		})

		it( 'should load object with StoredFile', async ()=>{
			await testObj.file.store( blobData1, 'test.dat' )
			await model.save( testObj )

			const newTestObj = await model.findById( testObj.id )

			expect( newTestObj.file ).toBeInstanceOf( StoredFile )
			expect( newTestObj.file.url ).toEqual( 'file://' + testObj.file.id )
		})

		it( 'should replace file on save after load', async ()=>{
			const deleteSpy = jest.spyOn( testObj.file, 'delete' )

			await testObj.file.store( blobData1, 'test.dat' )
			await model.save( testObj )

			const newTestObj = await model.findById( testObj.id )

			expect( newTestObj.file ).toBeInstanceOf( StoredFile )
			expect( newTestObj.file.url ).toEqual( 'file://' + testObj.file.id )
			expect( deleteSpy ).not.toHaveBeenCalled()

			testObj.file.setDataToStore( blobData2 )
			await testObj.file.store()

			expect( 
				mockCloudStorage.mockFileSystem[ testObj.file.id ] 
			).toEqual( JSON.stringify( blobData2 ) )

			expect( deleteSpy ).toHaveBeenCalled()
		})		

	})
})