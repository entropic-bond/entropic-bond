import { JsonDataSource, Persistent, persistent, registerPersistentClass, Store } from '..'

@registerPersistentClass( 'InitialSnapshotItem' )
class InitialSnapshotItem extends Persistent {
	set score( value: number ) {
		this._score = value
	}

	get score(): number {
		return this._score
	}

	@persistent private _score: number = 0
}

const collection = 'InitialSnapshotItem'

const seedData = ()=>({
	[ collection ]: {
		d1: { id: 'd1', score: 20, __className: collection },
		d2: { id: 'd2', score: 30, __className: collection },
		d3: { id: 'd3', score: 5, __className: collection },
	}
}) as any

const queryScoreGt10 = { operations: [{ property: 'score', operator: '>', value: 10 }] } as any
const queryScoreGt100 = { operations: [{ property: 'score', operator: '>', value: 100 }] } as any

describe( 'Emit the current collection snapshot when subscribing', ()=>{
	let datasource: JsonDataSource

	beforeEach(()=>{
		datasource = new JsonDataSource( seedData() )
	})

	it( 'Emits the current matching result on subscribe. Issue: #18 [REQ-1]', ()=>{
		const listener = vi.fn()
		datasource.onCollectionChange( queryScoreGt10, collection, listener )

		expect( listener ).toHaveBeenCalledTimes( 1 )
	})

	it( 'Reports each initial document as a create change. Issue: #18 [REQ-2]', ()=>{
		const listener = vi.fn()
		datasource.onCollectionChange( queryScoreGt10, collection, listener )

		const changes = listener.mock.calls[ 0 ]![ 0 ]
		expect( changes ).toHaveLength( 2 )
		expect( changes.map(( change: any )=> change.type )).toEqual([ 'create', 'create' ])
		expect( changes.map(( change: any )=> change.after.id )).toEqual([ 'd1', 'd2' ])
		expect( changes.every(( change: any )=> !change.before )).toBe( true )
	})

	it( 'Provides the matching result as the initial snapshot. Issue: #18 [REQ-3]', ()=>{
		const listener = vi.fn()
		datasource.onCollectionChange( queryScoreGt10, collection, listener )

		const snapshot = listener.mock.calls[ 0 ]![ 1 ]
		expect( snapshot.map(( doc: any )=> doc.id )).toEqual([ 'd1', 'd2' ])
	})

	it( 'Emits an empty initial result when nothing matches. Issue: #18 [REQ-4]', ()=>{
		const listener = vi.fn()
		datasource.onCollectionChange( queryScoreGt100, collection, listener )

		expect( listener ).toHaveBeenCalledTimes( 1 )
		expect( listener.mock.calls[ 0 ]![ 0 ]).toEqual( [] )
		expect( listener.mock.calls[ 0 ]![ 1 ]).toEqual( [] )
	})

	it( 'Applies query operations, sort and limit to the initial result. Issue: #18 [REQ-5]', ()=>{
		const listener = vi.fn()
		const query = {
			operations: [{ property: 'score', operator: '>', value: 10 }],
			sort: { order: 'desc', propertyName: 'score' },
			limit: 1,
		} as any
		datasource.onCollectionChange( query, collection, listener )

		const changes = listener.mock.calls[ 0 ]![ 0 ]
		const snapshot = listener.mock.calls[ 0 ]![ 1 ]
		expect( changes.map(( change: any )=> change.after.id )).toEqual([ 'd2' ])
		expect( snapshot.map(( doc: any )=> doc.id )).toEqual([ 'd2' ])
	})

	it( 'Does not replay the initial result on later changes. Issue: #18 [REQ-6]', async ()=>{
		const listener = vi.fn()
		datasource.onCollectionChange( queryScoreGt10, collection, listener )
		listener.mockClear()

		await datasource.save({ [ collection ]: [{ id: 'd4', score: 40, __className: collection }] } as any )

		expect( listener ).toHaveBeenCalledTimes( 1 )
		const changes = listener.mock.calls[ 0 ]![ 0 ]
		expect( changes ).toHaveLength( 1 )
		expect( changes[ 0 ]).toEqual( expect.objectContaining({
			type: 'create',
			after: expect.objectContaining({ id: 'd4' }),
		}) )
		const snapshot = listener.mock.calls[ 0 ]![ 1 ]
		expect( snapshot.map(( doc: any )=> doc.id )).toEqual([ 'd1', 'd2', 'd4' ])
	})

	it( 'Does not replay the initial result to an already subscribed listener', ()=>{
		const listener1 = vi.fn()
		const listener2 = vi.fn()
		datasource.onCollectionChange( queryScoreGt10, collection, listener1 )
		datasource.onCollectionChange( queryScoreGt10, collection, listener2 )

		expect( listener1 ).toHaveBeenCalledTimes( 1 )
		expect( listener2 ).toHaveBeenCalledTimes( 1 )
	})

	it( 'Stops notifying after unsubscribe. Issue: #18 [REQ-7]', async ()=>{
		const listener = vi.fn()
		const uninstall = datasource.onCollectionChange( queryScoreGt10, collection, listener )
		uninstall()
		listener.mockClear()

		await datasource.save({ [ collection ]: [{ id: 'd4', score: 40, __className: collection }] } as any )

		expect( listener ).not.toHaveBeenCalled()
	})

	it( 'Delivers the initial result through a model as persistent instances. Issue: #18 [REQ-8]', ()=>{
		Store.useDataSource( datasource )
		const model = Store.getModel<InitialSnapshotItem>( collection )
		const listener = vi.fn()
		model.onCollectionChange( model.find().where( 'score', '>', 10 ), listener )

		expect( listener ).toHaveBeenCalledTimes( 1 )
		const changes = listener.mock.calls[ 0 ]![ 0 ]
		const snapshot = listener.mock.calls[ 0 ]![ 1 ]
		expect( changes.map(( change: any )=> change.after )).toHaveLength( 2 )
		expect( changes.every(( change: any )=> change.after instanceof InitialSnapshotItem )).toBe( true )
		expect( snapshot ).toHaveLength( 2 )
		expect( snapshot.every(( doc: any )=> doc instanceof InitialSnapshotItem )).toBe( true )
		expect( snapshot.map(( doc: any )=> doc.id )).toEqual([ 'd1', 'd2' ])
	})
})
