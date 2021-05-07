import { JsonStream } from './json-stream'
import { Store } from './store'

describe( 'Store', ()=>{
	it( 'should throw if not registered data stream', ()=>{
		expect( ()=>Store.instance ).toThrow()
	})

	it( 'should allow to register a concrete datastream', ()=>{
		Store.registerDataStreamFactory( ()=> new JsonStream() )

		expect( ()=>Store.instance ).not.toThrow()
		expect( Store.instance.dataStream ).toBeInstanceOf( JsonStream )
	})

	describe('Model', ()=>{
		beforeEach(()=> {
			Store.registerDataStreamFactory( ()=> new JsonStream() )
		})

		// it( )
	})
})