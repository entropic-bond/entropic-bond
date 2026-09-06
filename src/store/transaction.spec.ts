import { JsonDataSource, Model, persistent, Persistent, registerPersistentClass, Store, TransactionConflictError } from '..'
import { SubClass, TestUser } from './mocks/test-user'

@registerPersistentClass( 'Ride' )
class Ride extends Persistent {
	set status( value: string | undefined ) {
		this._status = value
	}

	get status() {
		return this._status
	}

	set driver( value: string | undefined ) {
		this._driver = value
	}

	get driver() {
		return this._driver
	}

	@persistent private _status: string | undefined
	@persistent private _driver: string | undefined
}

describe( 'runTransaction (gh-issue-2)', ()=>{
	let datasource: JsonDataSource
	let model: Model<Ride>
	const rawData = ()=> datasource.rawData
	const storedRide = ( id = 'ride1' )=> rawData()[ 'Ride' ]?.[ id ] as any

	const requestedRide = ( id = 'ride1' )=> {
		const ride = new Ride( id )
		ride.status = 'requested'
		const obj = ride.toObject() as any
		delete obj.__rootCollections
		datasource.save({ Ride: [ obj ] })
		return ride
	}

	beforeEach( ()=>{
		datasource = new JsonDataSource()
		Store.useDataSource( datasource )
		model = Store.getModel<Ride>( 'Ride' )
	})

	it( 'should persist the document and resolve when the precondition is satisfied REQ-1', async ()=>{
		requestedRide()

		const result = await model.runTransaction( async t => {
			const ride = ( await t.findById( 'ride1' ) )!
			if ( ride.status !== 'requested' || ride.driver ) throw new TransactionConflictError( ride )

			ride.status = 'accepted'
			ride.driver = 'driver1'
			await t.save( ride )
			return ride
		})

		expect( result ).toBeInstanceOf( Ride )
		expect( storedRide()?.status ).toBe( 'accepted' )
		expect( storedRide()?.driver ).toBe( 'driver1' )
	})

	it( 'should reject with conflict and not write when the precondition fails REQ-2', async ()=>{
		const ride = requestedRide()
		ride.status = 'accepted'
		ride.driver = 'driver1'
		const obj = ride.toObject() as any
		delete obj.__rootCollections
		datasource.save({ Ride: [ obj ] })

		let caught: unknown
		try {
			await model.runTransaction( async t => {
				const ride = ( await t.findById( 'ride1' ) )!
				if ( ride.status !== 'requested' || ride.driver ) throw new TransactionConflictError( ride )

				ride.status = 'accepted'
				ride.driver = 'driver2'
				await t.save( ride )
				return ride
			})
		}
		catch ( error ) {
			caught = error
		}

		expect( caught ).toBeInstanceOf( TransactionConflictError )
		expect(( caught as TransactionConflictError ).storedDoc ).toBeInstanceOf( Ride )
		expect( storedRide()?.driver ).toBe( 'driver1' )
		expect( storedRide()?.status ).toBe( 'accepted' )
	})

	it( 'should allow exactly one winner on concurrent compare-and-set REQ-3', async ()=>{
		requestedRide()
		datasource.simulateDelay( 10 )

		const accept = ( driver: string )=> model.runTransaction( async t => {
			const ride = ( await t.findById( 'ride1' ) )!
			if ( ride.status !== 'requested' || ride.driver ) throw new TransactionConflictError( ride )

			ride.status = 'accepted'
			ride.driver = driver
			await t.save( ride )
			return ride
		})

		const [ result1, result2 ] = await Promise.allSettled([ accept( 'driver1' ), accept( 'driver2' ) ])
		await datasource.wait()

		expect( result1.status ).not.toBe( result2.status )

		const winner = result1.status === 'fulfilled' ? result1 : result2
		const loser = winner === result1 ? result2 : result1
		expect( loser.status ).toBe( 'rejected' )
		expect(( loser as PromiseRejectedResult ).reason ).toBeInstanceOf( TransactionConflictError )
		expect((( loser as PromiseRejectedResult ).reason as TransactionConflictError ).storedDoc ).toBeInstanceOf( Ride )

		if ( winner.status === 'fulfilled' ) {
			expect( storedRide()?.driver ).toBe( winner.value.driver )
		}
	})

	it( 'should proxy the transaction through the Model with persistent instances REQ-4', async ()=>{
		requestedRide()

		const result = await model.runTransaction( async t => {
			const ride = ( await t.findById( 'ride1' ) )!
			expect( ride ).toBeInstanceOf( Ride )

			ride.status = 'accepted'
			await t.save( ride )
			return ride
		})

		expect( result ).toBeInstanceOf( Ride )
		expect( storedRide()?.status ).toBe( 'accepted' )
	})

	it( 'should cascade referenced documents on Model update REQ-5', async ()=>{
		const userModel = Store.getModel<TestUser>( 'TestUser' )
		const user = new TestUser( 'user1' )
		user.name = { firstName: 'userFirstName', lastName: 'userLastName', ancestorName: {} }
		user.documentRef = new SubClass( 'driver1' )
		user.documentRef.year = 2045

		const result = await userModel.runTransaction( async t => {
			await t.save( user )
			return user
		})

		expect( result ).toBeInstanceOf( TestUser )
		expect( rawData()[ 'TestUser' ]?.[ 'user1' ] ).toBeDefined()
		expect( rawData()[ 'SubClass' ]?.[ 'driver1' ]?.[ 'year' ] ).toBe( 2045 )
	})

	it( 'should delete a document inside a transaction REQ-6', async ()=>{
		requestedRide()

		const result = await model.runTransaction( async t => {
			const ride = ( await t.findById( 'ride1' ) )!
			await t.delete( ride )
			return ride
		})

		expect( result ).toBeInstanceOf( Ride )
		expect( storedRide() ).toBeUndefined()
	})

	it( 'should merge a partial update keeping untouched fields', async ()=>{
		requestedRide()

		await datasource.runTransaction( async t => {
			await t.save( 'ride1', 'Ride', { driver: 'driver1' } as any )
			return { ok: true }
		})

		expect( storedRide()?.status ).toBe( 'requested' )
		expect( storedRide()?.driver ).toBe( 'driver1' )
	})

	it( 'should return undefined when getting a missing document', async ()=>{
		await model.runTransaction( async t => {
			const ride = await t.findById( 'missing' )
			expect( ride ).toBeUndefined()
			return ride ?? new Ride()
		})
	})

	it( 'should not apply buffered writes when the callback rejects', async ()=>{
		requestedRide()

		await expect(
			model.runTransaction( async t => {
				const ride = ( await t.findById( 'ride1' ) )!
				ride.driver = 'driver1'
				await t.save( ride )
				throw new TransactionConflictError( ride )
			})
		).rejects.toBeInstanceOf( TransactionConflictError )

		expect( storedRide()?.driver ).toBeUndefined()
	})

	it( 'should run transactions on subcollection models', async ()=>{
		const user = new TestUser( 'user1' )
		user.name = { firstName: 'userFirstName', lastName: 'userLastName', ancestorName: {} }
		const userObj = user.toObject() as any
		delete userObj.__rootCollections
		datasource.save({ TestUser: [ userObj ] })

		const subCollectionModel = Store.getModelForSubCollection<SubClass>( user, 'SubClass' )
		const sub = new SubClass( 'sub1' )
		sub.year = 1326

		const result = await subCollectionModel.runTransaction( async t => {
			await t.save( sub )
			return sub
		})

		expect( result ).toBeInstanceOf( SubClass )
		expect( rawData()[ 'TestUser/user1/SubClass' ]?.[ 'sub1' ]?.[ 'year' ] ).toBe( 1326 )
	})
})