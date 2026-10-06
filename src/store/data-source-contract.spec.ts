import { DataSource, JsonDataSource } from '..'

type DataSourceFactory = () => DataSource

const collection = 'ContractItems'

const matchingQuery = {
	operations: [{ property: 'score', operator: '>', value: 10 }]
} as any

const seed = ( datasource: DataSource )=> datasource.save({
	[ collection ]: [
		{ id: 'd1', score: 20 },
		{ id: 'd2', score: 30 },
		{ id: 'd3', score: 5 },
	] as any
})

const settle = ()=> new Promise<void>( resolve => setTimeout( resolve, 0 ) )

/**
 * Pins the collection subscribe contract for any DataSource implementation.
 * Only uses the DataSource interface (save, delete, onCollectionChange), so
 * plugin data sources (e.g. entropic-bond-firebase) can run the same suite.
 */
export function runDataSourceConformanceTests( name: string, createDataSource: DataSourceFactory ) {
	describe( `${ name } onCollectionChange conformance`, ()=>{

		it( 'Emits the current matching result on subscribe. Issue: #18 [REQ-9]', async ()=>{
			const datasource = createDataSource()
			await seed( datasource )
			const listener = vi.fn()

			datasource.onCollectionChange( matchingQuery, collection, listener )
			await settle()

			expect( listener ).toHaveBeenCalledTimes( 1 )
			const changes = listener.mock.calls[ 0 ]![ 0 ]
			expect( changes.map(( change: any )=> change.type )).toEqual([ 'create', 'create' ])
			expect( changes.map(( change: any )=> change.after.id )).toEqual([ 'd1', 'd2' ])
			expect( changes.every(( change: any )=> !change.before )).toBe( true )

			const snapshot = listener.mock.calls[ 0 ]![ 1 ]
			expect( snapshot.map(( doc: any )=> doc.id )).toEqual([ 'd1', 'd2' ])
		})

		it( 'Emits an empty initial result when nothing matches. Issue: #18 [REQ-9]', async ()=>{
			const datasource = createDataSource()
			await seed( datasource )
			const listener = vi.fn()
			const noMatchQuery = {
				operations: [{ property: 'score', operator: '>', value: 100 }]
			} as any

			datasource.onCollectionChange( noMatchQuery, collection, listener )
			await settle()

			expect( listener ).toHaveBeenCalledTimes( 1 )
			expect( listener.mock.calls[ 0 ]![ 0 ]).toEqual( [] )
			expect( listener.mock.calls[ 0 ]![ 1 ]).toEqual( [] )
		})

		it( 'Reports later changes as deltas with an up-to-date snapshot. Issue: #18 [REQ-9]', async ()=>{
			const datasource = createDataSource()
			await seed( datasource )
			const listener = vi.fn()

			datasource.onCollectionChange( matchingQuery, collection, listener )
			await settle()
			listener.mockClear()

			await datasource.save({ [ collection ]: [{ id: 'd4', score: 40 }] as any })
			await settle()

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
	})
}

runDataSourceConformanceTests( 'JsonDataSource', ()=> new JsonDataSource() )
