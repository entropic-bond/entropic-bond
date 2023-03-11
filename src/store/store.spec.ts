import { JsonDataSource } from './json-data-source'
import { TestUser } from './mocks/test-user'
import { Store } from './store'
import type { Equal, Expect } from '@type-challenges/utils'

describe( 'Store', ()=>{
	it( 'should throw if not registered data source', ()=>{
		expect(
			()=>Store.getModel( '' ) 
		).toThrow( Store.error.shouldBeRegistered )
	})

	it( 'should allow to register a concrete data source', ()=>{
		Store.useDataSource( new JsonDataSource() )

		expect( ()=>Store.getModel( '' ) ).not.toThrow( Store.error.shouldBeRegistered )
		expect( Store.dataSource ).toBeInstanceOf( JsonDataSource )
	})

	it( 'should return the proper type when populating', async ()=>{
		const populatedArray = await Store.populate([ new TestUser() ])
		const populatedInstance = await Store.populate( new TestUser() )
		
		type cases = [
			Expect<Equal<typeof populatedArray, TestUser[]>>,
			Expect<Equal<typeof populatedInstance, TestUser>>
		]
		expect( true ).toBeTruthy()
	})
})
