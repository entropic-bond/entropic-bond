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
			testWithoutReturn: ( data: string ): Promise<void> => Promise.resolve()
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

	// it( 'should execute cloud function with params and return as Persistent', async ()=>{
	// 	const testPersistentParamAndReturn = CloudFunctions.instance.getFunction<ParamWrapper, ParamWrapper>( 'testPersistentParamAndReturn' )

	// 	const paramWrapper = new ParamWrapper( 'test', 30 )
	// 	const result = await testPersistentParamAndReturn( paramWrapper )
	// 	expect( result._a ).toEqual( 'test' )
	// 	expect( result._b ).toBe( 30 )
	// })
})