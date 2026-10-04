import { DocumentObject } from './data-source'
import { QueryCursor } from './query-cursor'

const docs = [ 'd1', 'd2', 'd3', 'd4', 'd5' ].map( id => ({ id }) as DocumentObject )

describe( 'QueryCursor', ()=>{
	it( 'should return pages of the given size and advance the cursor', async ()=>{
		const cursor = new QueryCursor( docs, 2 )

		expect(( await cursor.next() ).map( doc => doc.id )).toEqual([ 'd1', 'd2' ])
		expect(( await cursor.next() ).map( doc => doc.id )).toEqual([ 'd3', 'd4' ])
		expect(( await cursor.next() ).map( doc => doc.id )).toEqual([ 'd5' ])
		expect( await cursor.next() ).toEqual([])
	})

	it( 'should use the limit passed to next from the current position', async ()=>{
		const cursor = new QueryCursor( docs, 2 )
		await cursor.next()

		expect(( await cursor.next( 3 ) ).map( doc => doc.id )).toEqual([ 'd3', 'd4', 'd5' ])
	})

	it( 'should return every document in the first page when no limit is set', async ()=>{
		const cursor = new QueryCursor( docs )

		expect(( await cursor.next() ).map( doc => doc.id )).toEqual([ 'd1', 'd2', 'd3', 'd4', 'd5' ])
		expect( await cursor.next() ).toEqual([])
	})

	it( 'should resolve pages through the injected resolver', async ()=>{
		const resolver = vi.fn( async ( page: DocumentObject[] ) => page )
		const cursor = new QueryCursor( docs, 1, resolver )

		await cursor.next()

		expect( resolver ).toHaveBeenCalledWith([ docs[0] ])
	})
})
