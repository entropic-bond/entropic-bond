import { DocumentObject, JsonDataSource, Model, persistent, Persistent, registerPersistentClass, Store } from '..'
import { TestUser } from './mocks/test-user'

@registerPersistentClass( 'TestCollection' )
class TestCollection extends Persistent {
	set prop( value: string ) {
		this._prop = value
	}
	
	get prop(): string {
		return this._prop
	}
	
	@persistent private _prop: string = this.id
}

@registerPersistentClass( 'TestCollection2' )
class TestCollection2 extends Persistent {}

describe( 'Json DataSource', ()=>{
	let datasource: JsonDataSource
	const resolveDelay = 50

	describe( 'Delayed promise resolution', ()=>{
	
		beforeEach(()=>{
			datasource = new JsonDataSource({
				TestCollection: { a: { id: 'a' }, b: { id: 'b' }, c: { id: 'c' } } as any
			}).simulateDelay( resolveDelay )
			Store.useDataSource( datasource )
		})
	
		it( 'should fail if no wait to resolve', async ()=>{
			let result: DocumentObject | undefined = undefined
			datasource.findById( 'a', 'TestCollection' ).then( data => result = data )
			expect( result ).not.toBeDefined()
			await datasource.wait()
			expect( result ).toBeDefined()
		})
		
		it( 'should wait promises to resolve', async ()=>{
			let result: DocumentObject | undefined = undefined
			datasource.findById( 'a', 'TestCollection' ).then( data => result = data )
			await datasource.wait()
			expect( result ).toBeDefined()
		})

		it( 'should accumulate promises', async ()=>{
			datasource.findById( 'a', 'TestCollection' )
			datasource.findById( 'b', 'TestCollection' )
			datasource.findById( 'c', 'Collection' )
			const promises = await datasource.wait()
			expect( promises ).toHaveLength( 3 )
		})

		it( 'should remove resolved promises', async ()=>{
			let promises: any

			datasource.findById( 'b', 'TestCollection' )
			datasource.findById( 'a', 'TestCollection' )
			await new Promise<void>( resolve => {
				setTimeout(
					async ()=>{
						datasource.findById( 'c', 'Collection' )
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
			datasource = new JsonDataSource({}).simulateError( 'Simulated error' )
			Store.useDataSource( datasource )
			model = Store.getModel<TestUser>( 'TestUser' )
		})

		it( 'should simulate error on findById', async ()=>{
			await expect(	model.findById( 'a' )	).rejects.toThrow( 'Simulated error' )
		})

		it( 'should simulate error on find', async ()=>{
			await expect(	model.find().get() ).rejects.toThrow( 'Simulated error' )
		})

		it( 'should simulate error on save', async ()=>{
			await expect(	model.save( new TestUser('id') ) ).rejects.toThrow( 'Simulated error' )
		})
		
		it( 'should simulate error on delete', async ()=>{
			await expect(	model.delete( 'b' ) ).rejects.toThrow( 'Simulated error' )
		})
	})

	describe( 'Collection listeners', ()=>{
		let model: Model<TestCollection>

		beforeAll(()=>{
			datasource = new JsonDataSource({
				TestCollection: { a: new TestCollection( 'a' ).toObject(), b: new TestCollection( 'b' ).toObject(), c: new TestCollection( 'c' ).toObject() } as any
			})
			Store.useDataSource( datasource )
			model = Store.getModel<TestCollection>( 'TestCollection' )
		})

		it( 'should install a listener', ()=>{
			const listener = vi.fn()
			const uninstall = model.onCollectionChange( model.find(), listener )

			model.save( new TestCollection( 'd' ))
			expect( listener ).toHaveBeenCalledWith([ expect.objectContaining({ after: expect.objectContaining({ id: 'd' }) }) ])
			uninstall()
		})

		it( 'should remove listener', ()=>{
			const listener = vi.fn()
			const uninstall = model.onCollectionChange( model.find(), listener )

			model.save( new TestCollection( 'd' ))
			expect( listener ).toHaveBeenCalledWith([ expect.objectContaining({ after: expect.objectContaining({ id: 'd' }) }) ])

			uninstall()
			listener.mockClear()

			model.save( new TestCollection('e'))
			expect( listener ).not.toHaveBeenCalled()
		})

		it( 'should install several listeners for the same collection', ()=>{
			const listener1 = vi.fn()
			const listener2 = vi.fn()
			const uninstall1 = model.onCollectionChange( model.find(), listener1 )
			const uninstall2 = model.onCollectionChange( model.find(), listener2 )

			model.save( new TestCollection( 'f' ))
			expect( listener1 ).toHaveBeenCalledWith([ expect.objectContaining({ after: expect.objectContaining({ id: 'f' }) }) ])
			expect( listener2 ).toHaveBeenCalledWith([ expect.objectContaining({ after: expect.objectContaining({ id: 'f' }) }) ])

			uninstall1()
			uninstall2()
		})

		it( 'should install several listeners for different collections', ()=>{
			const listener1 = vi.fn()
			const listener2 = vi.fn()
			const uninstall1 = model.onCollectionChange( model.find(), listener1 )
			const model2 = Store.getModel<TestCollection2>( 'TestCollection2' )
			const uninstall2 = model2.onCollectionChange( model2.find(), listener2 )

			model.save( new TestCollection( 'g' ))
			expect( listener1 ).toHaveBeenCalledWith([ expect.objectContaining({ after: expect.objectContaining({ id: 'g' }) }) ])
			expect( listener2 ).not.toHaveBeenCalled()

			listener1.mockClear()
			listener2.mockClear()

			model2.save( new TestCollection2( 'h' ))
			expect( listener1 ).not.toHaveBeenCalled()
			expect( listener2 ).toHaveBeenCalledWith([ expect.objectContaining({ after: expect.objectContaining({ id: 'h' }) }) ])

			uninstall1()
			uninstall2()
		})

		it( 'should notify when document loose query requirements', ()=>{
			const listener = vi.fn()
			const uninstall = model.onCollectionChange( model.find().where( 'prop', '>', 'a' ), listener )
			const doc = new TestCollection('b')
			doc.prop = 'a'
			model.save( doc )

			expect( listener ).toHaveBeenCalled()
			uninstall()
		})

		it( 'should notify when document acquires query requirements', ()=>{
			const listener = vi.fn()
			const uninstall = model.onCollectionChange( model.find().where( 'prop', '>', 'a' ), listener )
			const doc = new TestCollection('a')
			doc.prop = 'b'
			model.save( doc )

			expect( listener ).toHaveBeenCalled()
			uninstall()
		})
	})

	describe( 'Document listeners', ()=>{
		let model: Model<TestCollection>

		beforeAll(()=>{
			datasource = new JsonDataSource({
				TestCollection: { a: new TestCollection( 'a' ).toObject(), b: new TestCollection( 'b' ).toObject(), c: new TestCollection( 'c' ).toObject() } as any
			})
			Store.useDataSource( datasource )
			model = Store.getModel<TestCollection>( 'TestCollection' )
		})

		it( 'should install a listener', ()=>{
			const listener = vi.fn()
			const uninstall = model.onDocumentChange( 'a', listener )

			model.save( new TestCollection( 'a' ))
			expect( listener ).toHaveBeenCalledWith( expect.objectContaining({ after: expect.objectContaining({ id: 'a' }) }) )
			uninstall()
		})

		it( 'should remove listener', ()=>{
			const listener = vi.fn()
			const uninstall = model.onDocumentChange( 'b', listener )

			model.save( new TestCollection( 'b' ))
			expect( listener ).toHaveBeenCalledWith( expect.objectContaining({ after: expect.objectContaining({ id: 'b' }) }) )

			uninstall()
			listener.mockClear()

			model.save( new TestCollection('b'))
			expect( listener ).not.toHaveBeenCalled()
		})

		it( 'should install several listeners for the same document', ()=>{
			const listener1 = vi.fn()
			const listener2 = vi.fn()
			const uninstall1 = model.onDocumentChange( 'c', listener1 )
			const uninstall2 = model.onDocumentChange( 'c', listener2 )

			model.save( new TestCollection( 'c' ))
			expect( listener1 ).toHaveBeenCalledWith( expect.objectContaining({ after: expect.objectContaining({ id: 'c' }) }) )
			expect( listener2 ).toHaveBeenCalledWith( expect.objectContaining({ after: expect.objectContaining({ id: 'c' }) }) )

			uninstall1()
			uninstall2()
		})

		it( 'should install several listeners for different documents', ()=>{
			const listener1 = vi.fn()
			const listener2 = vi.fn()
			const uninstall1 = model.onDocumentChange( 'a', listener1 )
			const uninstall2 = model.onDocumentChange( 'b', listener2 )

			model.save( new TestCollection( 'a' ))
			expect( listener1 ).toHaveBeenCalledWith( expect.objectContaining({ after: expect.objectContaining({ id: 'a' }) }) )
			expect( listener2 ).not.toHaveBeenCalled()

			listener1.mockClear()
			listener2.mockClear()

			model.save( new TestCollection( 'b' ))
			expect( listener1 ).not.toHaveBeenCalled()
			expect( listener2 ).toHaveBeenCalledWith( expect.objectContaining({ after: expect.objectContaining({ id: 'b' }) }) )

			uninstall1()
			uninstall2()
		})
	})
})