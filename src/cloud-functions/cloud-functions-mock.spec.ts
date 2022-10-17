import { PersistentObject } from '../persistent/persistent'
import { TestUser } from '../store/mocks/test-user'
import { CloudFunctions } from './cloud-functions'
import { CloudFunctionsMock } from './cloud-functions-mock'

describe( 'Cloud functions', ()=>{

	beforeEach(()=>{
		CloudFunctions.useCloudFunctionsService( new CloudFunctionsMock({
			testNoParam: ():Promise<string> => Promise.resolve( 'test' ),
			testArbitraryParamAndReturn: ( data: any ): Promise<any> => Promise.resolve( data.length ),
			testPersistentParamAndReturn: ( data: PersistentObject<TestUser> ): Promise<PersistentObject<TestUser>> => {
				return Promise.resolve( JSON.parse( JSON.stringify( data ) ) )
			},
			testPersistentParamAndPlainReturn: ( data: PersistentObject<TestUser> ): Promise<number> => {
				return Promise.resolve( data.age )
			},
			testPlainParamAndPersistentReturn: ( data: number ): Promise<PersistentObject<TestUser>> => {
				const user = new TestUser()
				user.age = data
				return Promise.resolve( user )
			},
			testWithoutParam: (): Promise<string> => Promise.resolve( 'Hello from the other side' ),
			testWithoutReturn: ( _data: string ): Promise<void> => Promise.resolve(),
			testArrayParam: ( data: PersistentObject<TestUser>[] ) => Promise.resolve( data.map( d => d.id ) ),
			testObjectParam: ( data: {[key:string]:PersistentObject<TestUser>} ) => Promise.resolve( 
				Object.entries( data ).reduce(( obj, [k,v] ) => {
					obj[k] = v.id
					return obj 
				}, {}) 
			),
			testArrayResult: () => Promise.resolve([ new TestUser('userA').toObject(), new TestUser('userB').toObject() ]),
			testObjectResult: () => Promise.resolve({ user1: new TestUser('userA').toObject(), user2: new TestUser('userB').toObject() })
		}))

	})

	it( 'should execute cloud function without params', async ()=>{
		const testNoParam = CloudFunctions.instance.getRawFunction<never, string>( 'testNoParam' )
		const result = await testNoParam()
		expect( result ).toEqual( 'test' )
	})

	it( 'should execute cloud function with params', async ()=>{
		const testArbitraryParamAndReturn = CloudFunctions.instance.getFunction<string, number>( 'testArbitraryParamAndReturn' )

		const result = await testArbitraryParamAndReturn( 'Hello' )
		expect( result ).toEqual( 5 )
	})

	it( 'should execute cloud function without params', async ()=>{
		const testWithoutReturn = CloudFunctions.instance.getFunction<string>( 'testWithoutReturn' )

		expect( testWithoutReturn( '' ) ).resolves.toBeUndefined()
	})

	it( 'should execute cloud function with void return', async ()=>{
		const testWithoutParam = CloudFunctions.instance.getFunction<string>( 'testWithoutParam' )

		const result = await testWithoutParam()
		expect( result ).toEqual( 'Hello from the other side' )
	})

	it( 'should execute cloud function with params and return as Persistent', async ()=>{
		const testPersistentParamAndReturn = CloudFunctions.instance.getFunction<TestUser, TestUser>( 'testPersistentParamAndReturn' )

		const user = new TestUser()
		user.age = 35
		user.name = { firstName: 'Test User', lastName: 'as a user' }

		const result = await testPersistentParamAndReturn( user )
		expect( result.age ).toBe( 35 )
		expect( result.name ).toEqual({ firstName: 'Test User', lastName: 'as a user' })
	})

	it( 'should execute cloud function with params as Persistent and return as plain', async ()=>{
		const testPersistentParamAndPlainReturn = CloudFunctions.instance.getFunction<TestUser, number>( 'testPersistentParamAndPlainReturn' )

		const user = new TestUser()
		user.age = 35

		const result = await testPersistentParamAndPlainReturn( user )
		expect( result ).toBe( 35 )
	})

	it( 'should execute cloud function with params as plain and return as Persistent', async ()=>{
		const testPlainParamAndPersistentReturn = CloudFunctions.instance.getFunction<number, TestUser>( 'testPlainParamAndPersistentReturn' )

		const result = await testPlainParamAndPersistentReturn( 35 )
		expect( result.age ).toEqual( 35 )
	})

	it( 'should execute cloud function with params as an array of Persistents', async ()=>{
		const testArrayParam = CloudFunctions.instance.getFunction<TestUser[], string[]>( 'testArrayParam' )

		const result = await testArrayParam([
			new TestUser('userA'),
			new TestUser('userB')
		])

		expect( result ).toEqual([ 'userA', 'userB' ])
	})

	it( 'should execute cloud functions that return array of Persistent', async ()=>{
		const testArrayResult = CloudFunctions.instance.getFunction<void, TestUser[]>( 'testArrayResult' )

		const result = await testArrayResult()

		expect( result[0] ).toBeInstanceOf( TestUser )
		expect( result[0].id ).toEqual( 'userA' )
		expect( result[1].id ).toEqual( 'userB' )
	})
	
	it( 'should execute cloud function with params as an object containing Persistents', async ()=>{
		const testObjectParam = CloudFunctions.instance.getFunction<{[key: string]:TestUser}, {[key: string]:string}>( 'testObjectParam' )

		const result = await testObjectParam({
			user1: new TestUser('userA'),
			user2: new TestUser('userB')
	})

		expect( result ).toEqual({ user1: 'userA', user2: 'userB' })
	})

	it( 'should execute cloud functions that return an object with Persistent', async ()=>{
		const testObjectResult = CloudFunctions.instance.getFunction<void, {[key: string]:TestUser}>( 'testObjectResult' )

		const result = await testObjectResult()

		expect( result.user1 ).toBeInstanceOf( TestUser )
		expect( result.user1.id ).toEqual( 'userA' )
		expect( result.user2.id ).toEqual( 'userB' )
	})
	
	
})