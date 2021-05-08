import { JsonRawData, JsonStream } from './json-stream'
import { TestUser } from './mocks/test-user'
import { Model } from './model'
import { Store } from './store'
import testData from './mocks/mock-data.json'

describe('Model', ()=>{
	let model: Model< TestUser >
	let testUser: TestUser
	let rawData: JsonRawData

	beforeEach(()=> {
		Store.registerDataStreamFactory( ()=> new JsonStream( JSON.parse( JSON.stringify( testData ) ) ) )
		model = Store.getModel<TestUser>( 'TestUser' )

		testUser = new TestUser()
		testUser.name = {
			firstName: 'testUserFirstName',
			lastName: 'testUserLastName'
		}
		testUser.age = 35
		testUser.skills = [ 'lazy', 'dirty' ]

		rawData = (<JsonStream>Store.instance.dataStream ).rawData
	})

	it( 'should get model from class name string and class instance', ()=>{
		expect( 
			Store.getModel( testUser ).persistentClassName 
		).toEqual( model.persistentClassName )

		expect( model.persistentClassName ).toEqual( 'TestUser' )
	})

	it( 'should find document by id', async ()=>{
		const user = await model.findById( 'user1' )

		expect( user ).toBeInstanceOf( TestUser )
		expect( user.id ).toEqual( 'user1' )
		expect( user.name.firstName ).toEqual( 'userFirstName1' )
	})

	it( 'should write a document', async ()=>{
		await model.save( testUser )

		expect( rawData[ 'TestUser' ][ testUser.id ] ).toEqual(	expect.objectContaining({ 
			name: { 
				firstName: 'testUserFirstName',
				lastName: 'testUserLastName'
			}
		}))
	})	
	
	it( 'should delete a document by id', async ()=>{
		expect( rawData[ 'TestUser' ][ 'user1'] ).toBeDefined()
		await model.delete( 'user1' )

		expect( rawData[ 'TestUser' ][ 'user1' ] ).toBeUndefined()
	})

	describe( 'Generic find', ()=>{
		it( 'should find all admins with query object', async ()=>{
			const admins = await model.find({
				admin: {
					operator: '==',
					value: true
				}
			})

			expect( admins[0] ).toBeInstanceOf( TestUser )
			expect( admins ).toHaveLength( 2 )
		})
	})
})
