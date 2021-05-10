import { JsonStream } from './json-stream'
import { Store } from './store'

describe( 'Store', ()=>{
	it( 'should throw if not registered data source', ()=>{
		expect(
			()=>Store.getModel( '' ) 
		).toThrow( Store.error.shouldBeRegistered )
	})

	it( 'should allow to register a concrete data source', ()=>{
		Store.useDataSource( new JsonStream() )

		expect( ()=>Store.getModel( '' ) ).not.toThrow( Store.error.shouldBeRegistered )
		expect( Store.dataSource ).toBeInstanceOf( JsonStream )
	})
})