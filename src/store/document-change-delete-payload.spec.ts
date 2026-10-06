import { JsonDataSource, persistent, Persistent, registerPersistentClass, Store } from '..'

@registerPersistentClass( 'DocChangeDeleteUser' )
class DocChangeDeleteUser extends Persistent {
	set name( value: string ) {
		this._name = value
	}

	get name(): string {
		return this._name
	}

	@persistent private _name: string = ''
}

const collection = 'DocChangeDeleteUser'

const seedData = ()=>({
	[ collection ]: {
		u1: { id: 'u1', name: 'Alice', __className: collection },
		u2: { id: 'u2', name: 'Bob', __className: collection },
	}
}) as any

describe( 'Align onDocumentChange deletion payload Issue #13', ()=>{
	let datasource: JsonDataSource

	beforeEach(()=>{
		datasource = new JsonDataSource( seedData() )
	})

	it( 'REQ-1: notifies the document listener when the observed document is deleted', ()=>{
		const listener = vi.fn()
		datasource.onDocumentChange( collection, 'u1', listener )

		datasource.delete( 'u1', collection )

		expect( listener ).toHaveBeenCalledTimes( 1 )
	})

	it( 'REQ-2: reports the deletion with type delete and no after payload', ()=>{
		const listener = vi.fn()
		datasource.onDocumentChange( collection, 'u1', listener )

		datasource.delete( 'u1', collection )

		expect( listener ).toHaveBeenCalledTimes( 1 )
		const change = listener.mock.calls[ 0 ]![ 0 ]
		expect( change.type ).toBe( 'delete' )
		expect( change.after ).toBeUndefined()
	})

	it( 'REQ-3: carries the removed document as the before payload of the deletion', ()=>{
		const listener = vi.fn()
		datasource.onDocumentChange( collection, 'u1', listener )

		datasource.delete( 'u1', collection )

		const change = listener.mock.calls[ 0 ]![ 0 ]
		expect( change.before ).toEqual( expect.objectContaining({ id: 'u1', name: 'Alice' }) )
	})

	it( 'REQ-4: ignores deletions of other documents', ()=>{
		const listener = vi.fn()
		datasource.onDocumentChange( collection, 'u1', listener )

		datasource.delete( 'u2', collection )

		expect( listener ).not.toHaveBeenCalled()
	})

	it( 'REQ-5: detects the deletion exactly through a missing after payload', ()=>{
		const listener = vi.fn()
		datasource.onDocumentChange( collection, 'u1', listener )

		datasource.save({ [ collection ]: [{ id: 'u1', name: 'Alicia', __className: collection }] } as any )
		datasource.delete( 'u1', collection )

		expect( listener ).toHaveBeenCalledTimes( 2 )
		const changes = listener.mock.calls.map( call => call[ 0 ] )
		const deletions = changes.filter( change => change.type === 'delete' )
		expect( deletions ).toHaveLength( 1 )
		expect( changes.filter( change => !change.after )).toHaveLength( 1 )
		changes.forEach( change => {
			expect( change.type === 'delete' ).toBe( !change.after )
		})
	})

	it( 'REQ-6: reports a transaction-deleted document with the deletion payload', async ()=>{
		const listener = vi.fn()
		datasource.onDocumentChange( collection, 'u1', listener )

		await datasource.runTransaction( async handle => {
			await handle.delete( 'u1', collection )
		})

		expect( listener ).toHaveBeenCalledTimes( 1 )
		const change = listener.mock.calls[ 0 ]![ 0 ]
		expect( change.type ).toBe( 'delete' )
		expect( change.after ).toBeUndefined()
		expect( change.before ).toEqual( expect.objectContaining({ id: 'u1', name: 'Alice' }) )
	})

	it( 'REQ-7: delivers the deletion as persistent instances through the model', async ()=>{
		Store.useDataSource( datasource )
		const model = Store.getModel<DocChangeDeleteUser>( collection )
		const listener = vi.fn()
		model.onDocumentChange( 'u1', listener )

		await model.delete( 'u1' )

		expect( listener ).toHaveBeenCalledTimes( 1 )
		const change = listener.mock.calls[ 0 ]![ 0 ]
		expect( change.type ).toBe( 'delete' )
		expect( change.after ).toBeUndefined()
		expect( change.before ).toBeInstanceOf( DocChangeDeleteUser )
		expect( change.before!.id ).toBe( 'u1' )
	})
})
