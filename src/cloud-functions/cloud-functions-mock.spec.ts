import { Persistent, persistent, PersistentObject, registerPersistentClass } from '../persistent/persistent'
import { CloudFunctions } from './cloud-functions'
import { CloudFunctionsMock } from './cloud-functions-mock'

@registerPersistentClass( 'Wrapper' )
class ParamWrapper extends Persistent {
	constructor( a?: string, b?: number ) {
		super()
		this._a = a
		this._b = b
	}
	@persistent _a: string
	@persistent _b: number
}

describe( 'Cloud functions', ()=>{

	beforeEach(()=>{
		CloudFunctions.useCloudFunctionsService( new CloudFunctionsMock({
			testNoParam: ():Promise<string> => Promise.resolve( 'test' ),
			testAutoResolve: ( data: PersistentObject<ParamWrapper> ): Promise<PersistentObject<ParamWrapper>> => {
				return Promise.resolve( JSON.parse( JSON.stringify( data ) ) )
			}
		}))

	})

	it( 'should execute test cloud function without params', async ()=>{
		const testNoParam = CloudFunctions.instance.getRawFunction<never, string>( 'testNoParam' )
		const result = await testNoParam()
		expect( result ).toEqual( 'test' )
	})

	it( 'should execute test cloud function with params', async ()=>{
		const testAutoResolve = CloudFunctions.instance.getFunction<ParamWrapper, ParamWrapper>( 'testAutoResolve' )

		const paramWrapper = new ParamWrapper( 'test', 30 )
		const result = await testAutoResolve( paramWrapper )
		expect( result._a ).toEqual( 'test' )
		expect( result._b ).toBe( 30 )
	})
})