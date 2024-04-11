import { DocumentObject, JsonDataSource, Model, Store } from '..'
import { TestUser } from './mocks/test-user'

describe( 'Json DataSource', ()=>{
	let datasource: JsonDataSource
	const resolveDelay = 50

	describe( 'Delayed promise resolution', ()=>{
	
		beforeEach(()=>{
			datasource = new JsonDataSource({
				collection: { a: { id: 'a' }, b: { id: 'b' }, c: { id: 'c' } } as any
			}).simulateDelay( resolveDelay )
			Store.useDataSource( datasource )
		})
	
		it( 'should fail if no wait to resolve', async ()=>{
			let result: DocumentObject | undefined = undefined
			datasource.findById( 'a', 'collection' ).then( data => result = data )
			expect( result ).not.toBeDefined()
			await datasource.wait()
			expect( result ).toBeDefined()
		})
		
		it( 'should wait promises to resolve', async ()=>{
			let result: DocumentObject | undefined = undefined
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

		it( 'should remove resolved promises', async ()=>{
			let promises: any

			datasource.findById( 'b', 'collection' )
			datasource.findById( 'a', 'collection' )
			await new Promise<void>( resolve => {
				setTimeout(
					async ()=>{
						datasource.findById( 'c', 'collection' )
						promises = await datasource.wait()
						resolve()
					},
					resolveDelay * 3
				)
			})
			expect( promises ).toHaveLength( 1 )
		})

		it( 'should work with save', async ()=>{
			datasource.save({ testCollection: [{ id: "id" } as any ]})
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

	describe( 'Error simulation', ()=>{
		let model: Model<TestUser>

		beforeAll(()=>{
			datasource = new JsonDataSource({
				collection: { a: { id: 'a' }, b: { id: 'b' }, c: { id: 'c' } } as any
			}).simulateError( 'Simulated error' )
			Store.useDataSource( datasource )
			model = Store.getModel<TestUser>( 'TestUser' )
		})

		it( 'should simulate error on findById', ()=>{
			expect(	model.findById( 'a' )	).rejects.toThrow( 'Simulated error' )
		})

		it( 'should simulate error on find', ()=>{
			expect(	model.find().get() ).rejects.toThrow( 'Simulated error' )
		})

		it( 'should simulate error on save', ()=>{
			expect(	model.save( new TestUser('id') ) ).rejects.toThrow( 'Simulated error' )
		})
		
		it( 'should simulate error on delete', ()=>{
			expect(	model.delete( 'b' ) ).rejects.toThrow( 'Simulated error' )
		})
	})
})