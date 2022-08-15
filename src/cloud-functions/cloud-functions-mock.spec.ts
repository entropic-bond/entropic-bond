import { CloudFunctions } from './cloud-functions'
import { CloudFunctionsMock } from './cloud-functions-mock'

describe( 'Cloud functions', ()=>{

	beforeEach(()=>{
		CloudFunctions.useCloudFunctionsService( new CloudFunctionsMock({
			testNoParam: ()=> Promise.resolve( 'test' ),
			testAutoResolve: ( data: any )=> Promise.resolve( data )
		}) )
	})

	it( 'should execute test cloud function without params', ()=>{
		const testNoParam = CloudFunctions.instance.getFunction( 'testNoParam' )

		expect( testNoParam() ).resolves.toBe( 'test' )
	})

	it( 'should execute test cloud function with params', ()=>{
		const testAutoResolve = CloudFunctions.instance.getFunction( 'testAutoResolve' )

		expect( testAutoResolve({ a: 'test', b: 30 }) ).resolves.toEqual({ a: 'test', b: 30 })
	})
})