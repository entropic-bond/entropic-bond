import { JsonStream } from './json-stream'
import { TestUser } from './mocks/test-user'
import { Model } from './model'
import { Store } from './store'
import testData from './mocks/mock-data.json'

describe('Model', ()=>{
	let model: Model< TestUser >
	let testUser: TestUser

	beforeEach(()=> {
		Store.registerDataStreamFactory( ()=> new JsonStream( testData ) )
		model = Store.getModel<TestUser>( 'TestUser' )
		testUser = new TestUser()
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

	
	
})
