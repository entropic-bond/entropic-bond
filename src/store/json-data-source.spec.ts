import { DocumentObject, JsonDataSource, Store } from '..'
import { TestUser } from './mocks/test-user'

describe( 'Json DataSource', ()=>{
	let datasource: JsonDataSource
	const resolveDelay = 50

	describe( 'Delayed promise resolution', ()=>{
	
		beforeEach(()=>{
			datasource = new JsonDataSource({
				collection: { a: { id: 'a' }, b: { id: 'b' }, c: { id: 'c' } }
			}).simulateDelay( resolveDelay )
			Store.useDataSource( datasource )
		})
	
		it( 'should fail if no wait to resolve', async ()=>{
			let result: DocumentObject
			datasource.findById( 'a', 'collection' ).then( data => result = data )
			expect( result ).not.toBeDefined()
			await datasource.wait()
			expect( result ).toBeDefined()
		})
		
		it( 'should wait promises to resolve', async ()=>{
			let result: DocumentObject
			datasource.findById( 'a', 'collection' ).then( data => result = data )
			await datasource.wait()
			expect( result ).toBeDefined()
		})

		it( 'should accumulate promises', async ()=>{
			datasource.findById( 'a', 'collection' )
			datasource.findById( 'b', 'collection' )
			datasource.findById( 'c', 'collection' )
			const promises = await datasource.wait()
			expect( promises ).toHaveLength( 3 )
		})

		it( 'should remove resolved promises', ( done )=>{
			datasource.findById( 'b', 'collection' )
			datasource.findById( 'a', 'collection' )
			setTimeout(
				async ()=>{
					datasource.findById( 'c', 'collection' )
					const promises = await datasource.wait()
					expect( promises ).toHaveLength( 1 )
					done()
				},
				resolveDelay * 3
			)
		})

		it( 'should work with save', async ()=>{
			datasource.save({ testCollection: [{ id: "id" }]})
			await datasource.wait()
			expect( datasource.rawData ).toEqual( expect.objectContaining({
				testCollection: { id: { id: "id" } }
			}))
		})
		
		it( 'should work with model', async ()=>{
			const model = Store.getModel( 'TestUser' )
			model.save( new TestUser('id456') )
			await datasource.wait()
			expect( datasource.rawData.TestUser ).toEqual( expect.objectContaining({
				id456: expect.anything()
			}))
		})
		
	})
})