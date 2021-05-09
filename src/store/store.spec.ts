import { JsonStream } from './json-stream'
import { Store } from './store'

describe( 'Store', ()=>{
	it( 'should throw if not registered data source', ()=>{
		expect( ()=>Store.instance ).toThrow()
	})

	it( 'should allow to register a concrete data source', ()=>{
		Store.useDataSource( new JsonStream() )

		expect( ()=>Store.instance ).not.toThrow()
		expect( Store.instance.dataSource ).toBeInstanceOf( JsonStream )
	})
})