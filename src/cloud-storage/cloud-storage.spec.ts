import { Persistent, persistent, registerClassFactory } from '../persistent/persistent'
import { JsonStream } from '../store/json-stream'
import { Model } from '../store/model'
import { Store } from '../store/store'
import { CloudStorage } from './cloud-storage'
import { MockCloudStorage } from './mock-cloud-storage'
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
	const fileData = new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x2c, 0x20, 0x77, 0x6f, 0x72, 0x6c, 0x64, 0x21]);
	const mockCloudStorage = new MockCloudStorage()

	beforeEach(()=>{
		CloudStorage.useCloudStorage( mockCloudStorage )
		testObj = new Test()
		file = new StoredFile()
	})

	afterEach( ()=> mockCloudStorage.mockFileSystem = {} )

	it( 'should save a file', async ()=>{
		await file.store( fileData )
		expect( mockCloudStorage.mockFileSystem[ file.id ] ).toBeDefined()		
		expect( mockCloudStorage.mockFileSystem[ file.id ] ).toEqual( JSON.stringify( fileData ) )		
	})
	
	it( 'should get a url', async ()=>{
		await file.store( fileData )

		expect( file.url ).toEqual( 'file://' + file.id )
	})
	
	it( 'should report metadata', async ()=>{
		await file.store( fileData, 'test.dat' )

		expect( file.originalFileName ).toEqual( 'test.dat' )
		expect( file.provider.className ).toEqual( 'MockCloudStorage' )
	})

	it( 'should delete file', async ()=>{
		await file.store( fileData )
		expect( mockCloudStorage.mockFileSystem[ file.id ] ).toBeDefined()		

		await file.delete()
		expect( file.url ).toBeUndefined()
		expect( await file.refreshUrl() ).toBeUndefined()
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
			await testObj.file.store( fileData, 'test.dat' )
			await model.save( testObj )

			expect( database[ testObj.className ][ testObj.id ].file ).toBeDefined()
			expect( database[ testObj.className ][ testObj.id ].file.reference ).toEqual( testObj.file.id )
			expect( database[ testObj.className ][ testObj.id ].file.url ).toEqual( 'file://' + testObj.file.id )
			expect( database[ testObj.className ][ testObj.id ].file.cloudStorageProviderName ).toEqual( 'MockCloudStorage' )
			expect( database[ testObj.className ][ testObj.id ].file.originalFileName ).toEqual( 'test.dat' )
		})

		it( 'should save object with StoredFile', async ()=>{
			await testObj.file.store( fileData, 'test.dat' )
			await model.save( testObj )

			const newTestObj = await model.findById( testObj.id )

			expect( newTestObj.file ).toBeInstanceOf( StoredFile )
			expect( newTestObj.file.url ).toEqual( 'file://' + testObj.file.id )
		})		
	})
})