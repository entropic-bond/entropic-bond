import { JsonDataSource, persistent, Persistent, registerPersistentClass, Store, Model } from '..'

@registerPersistentClass( 'RemovalTestItem' )
class RemovalTestItem extends Persistent {
	set score( value: number ) {
		this._score = value
	}

	get score(): number {
		return this._score
	}

	@persistent private _score: number = 0
}

const collection = 'RemovalTestItem'

const seedData = ()=>({
	[ collection ]: {
		d1: { id: 'd1', score: 20, __className: collection },
		d2: { id: 'd2', score: 30, __className: collection },
		d3: { id: 'd3', score: 5, __className: collection },
	}
}) as any

const queryScoreGt10 = { operations: [{ property: 'score', operator: '>', value: 10 }] } as any

describe( 'JsonDataSource collection removal semantics', ()=>{
	let datasource: JsonDataSource

	beforeEach(()=>{
		datasource = new JsonDataSource( seedData() )
	})

	it( 'REQ-1: reports a document that stops matching the query as a delete', ()=>{
		const listener = vi.fn()
		datasource.onCollectionChange( queryScoreGt10, collection, listener )

		datasource.save({ [ collection ]: [{ id: 'd1', score: 5, __className: collection }] } as any )

		expect( listener ).toHaveBeenCalledTimes( 1 )
		const changes = listener.mock.calls[ 0 ]![ 0 ]
		expect( changes ).toHaveLength( 1 )
		expect( changes[ 0 ] ).toEqual( expect.objectContaining({
			type: 'delete',
			after: expect.objectContaining({ id: 'd1' }),
		}))
	})

	it( 'REQ-2: reports a deleted matching document as a delete to the collection listener', ()=>{
		const listener = vi.fn()
		datasource.onCollectionChange( queryScoreGt10, collection, listener )

		datasource.delete( 'd1', collection )

		expect( listener ).toHaveBeenCalledTimes( 1 )
		const changes = listener.mock.calls[ 0 ]![ 0 ]
		expect( changes ).toHaveLength( 1 )
		expect( changes[ 0 ] ).toEqual( expect.objectContaining({
			type: 'delete',
			after: expect.objectContaining({ id: 'd1' }),
		}))
	})

	it( 'REQ-3: does not notify the collection listener when a non-matching document is deleted', ()=>{
		const listener = vi.fn()
		datasource.onCollectionChange( queryScoreGt10, collection, listener )

		datasource.delete( 'd3', collection )

		expect( listener ).not.toHaveBeenCalled()
	})

	it( 'REQ-4: reports a deleted document as a delete to the document listener', ()=>{
		const listener = vi.fn()
		datasource.onDocumentChange( collection, 'd1', listener )

		datasource.delete( 'd1', collection )

		expect( listener ).toHaveBeenCalledTimes( 1 )
		const change = listener.mock.calls[ 0 ]![ 0 ]
		expect( change ).toEqual( expect.objectContaining({
			type: 'delete',
			after: expect.objectContaining({ id: 'd1' }),
		}))
	})

	it( 'notifies collection listeners when a document is deleted inside a transaction', async ()=>{
		const listener = vi.fn()
		datasource.onCollectionChange( queryScoreGt10, collection, listener )

		await datasource.runTransaction( async handle => {
			await handle.delete( 'd1', collection )
		})

		expect( listener ).toHaveBeenCalledTimes( 1 )
		const changes = listener.mock.calls[ 0 ]![ 0 ]
		expect( changes[ 0 ] ).toEqual( expect.objectContaining({
			type: 'delete',
			after: expect.objectContaining({ id: 'd1' }),
		}))
	})

	it( 'REQ-5: provides the full current query result as a snapshot to collection listeners', ()=>{
		const listener = vi.fn()
		datasource.onCollectionChange( queryScoreGt10, collection, listener )

		datasource.save({ [ collection ]: [{ id: 'd1', score: 5, __className: collection }] } as any )

		expect( listener ).toHaveBeenCalledTimes( 1 )
		const snapshot = listener.mock.calls[ 0 ]![ 1 ]
		expect( snapshot ).toHaveLength( 1 )
		expect( snapshot[ 0 ] ).toEqual( expect.objectContaining({ id: 'd2' }) )
	})

	it( 'REQ-6: provides the snapshot as persistent instances through the model', ()=>{
		Store.useDataSource( datasource )
		const model = Store.getModel<RemovalTestItem>( collection )
		const listener = vi.fn()
		model.onCollectionChange( model.find().where( 'score', '>', 25 ), listener )

		const item = new RemovalTestItem( 'd2' )
		item.score = 40
		model.save( item )

		expect( listener ).toHaveBeenCalledTimes( 1 )
		const snapshot = listener.mock.calls[ 0 ]![ 1 ]
		expect( snapshot ).toHaveLength( 1 )
		expect( snapshot![ 0 ] ).toBeInstanceOf( RemovalTestItem )
		expect( snapshot![ 0 ]!.id ).toBe( 'd2' )
	})
})
