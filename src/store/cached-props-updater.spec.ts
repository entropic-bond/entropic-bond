import { persistent, Persistent, PersistentProperty, persistentPureReferenceWithCachedProps, registerPersistentClass, searchableArray, DocumentChange } from '../persistent/persistent'
import { Store } from './store'
import { Model } from './model'
import { JsonDataSource } from './json-data-source'
import { CachedPropsUpdater, CachedPropsUpdaterConfig, UpdatedResults } from './cached-props-updater'
import { DocumentObject } from './data-source'
import { QueryCursor } from './query-cursor'

interface AllPropsUpdatedCallbackResult {
	updatedResult: UpdatedResults
	propsToUpdate: PersistentProperty[]
}

@registerPersistentClass( 'Root' )
class Root extends Persistent {
}

@registerPersistentClass('Child')
class Child extends Persistent {
	set name(value: string ) {
		this._name = value
	}

	get name(): string {
		return this._name
	}
	
	@persistent private _name: string = ''
}

@registerPersistentClass('Parent')
class Parent extends Persistent {
	set propInRootForRootCollection( value: Child | undefined ) {
		this._propInRootForRootCollection = value
	}

	get propInRootForRootCollection(): Child | undefined {
		return this._propInRootForRootCollection
	}

	set propInRootForSubcollection( value: Child | undefined ) {
		this._propInRootForSubcollection = value
	}
	
	get propInRootForSubcollection(): Child | undefined {
		return this._propInRootForSubcollection
	}

	set propInSubcollectionForSubcollection( value: Child | undefined ) {
		this._propInSubcollectionForSubcollection = value
	}
	
	get propInSubcollectionForSubcollection(): Child | undefined {
		return this._propInSubcollectionForSubcollection
	}

	set propInSubcollectionForRootCollection( value: Child | undefined ) {
		this._propInSubcollectionForRootCollection = value
	}
	
	get propInSubcollectionForRootCollection(): Child | undefined {
		return this._propInSubcollectionForRootCollection
	}

	// set propWithMultipleTypes( value: Child | undefined ) {
	// 	this._propWithMultipleTypes = value
	// }
	
	// get propWithMultipleTypes(): Child | undefined {
	// 	return this._propWithMultipleTypes
	// }

	set markAsSeverChange( value: boolean ) {
		this._markAsSeverChange = value
	}
	
	get markAsSeverChange(): boolean {
		return this._markAsSeverChange
	}


	static propCollectionPath( target: Persistent, prop: PersistentProperty, params?: Record<string, any> ): string {
		const customerId = params?.customerId
		if ( customerId ) return `Root/${ customerId }/${ target.className }`
		else return `Root/{customerId}/${ target.className }`
	}
	
	static thisCollectionPath( target: Persistent, prop: PersistentProperty, params?: any ): string {
		// return `Root/a/Parent` // in general, we can use the same function for parent and prop collection path
		return Parent.propCollectionPath( target, prop, params )
	}
	
	@persistent private _markAsSeverChange: boolean = false
	@persistentPureReferenceWithCachedProps<Child>(['name'], 'Child') private _propInRootForRootCollection: Child | undefined
	@persistentPureReferenceWithCachedProps<Child>(['name'], 'Child', Parent.propCollectionPath, Parent.thisCollectionPath ) private _propInSubcollectionForSubcollection: Child | undefined
	@persistentPureReferenceWithCachedProps<Child>(['name'], 'Child', undefined, Parent.thisCollectionPath ) private _propInRootForSubcollection: Child | undefined
	@persistentPureReferenceWithCachedProps<Child>(['name'], 'Child', Parent.propCollectionPath ) private _propInSubcollectionForRootCollection: Child | undefined
	// @persistentPureReferenceWithCachedProps<Child>(['name'], ['Parent', 'Child'], Parent.propCollectionPath, Parent.thisCollectionPath ) private _propWithMultipleTypes: Child | undefined
}

describe( 'Persistent with cached props reference', ()=>{
	let datasource: JsonDataSource
	let modelParent: Model<Parent>
	let modelChild: Model<Child>
	let parent: Parent
	let child: Child
	let cachedPropsUpdater: CachedPropsUpdater
	let allPropsUpdatedCalled: Promise<AllPropsUpdatedCallbackResult>

	function setupUpdateCachedPropsUpdater() {
		cachedPropsUpdater = datasource.installCachedPropsUpdater()
		allPropsUpdatedCalled = new Promise<AllPropsUpdatedCallbackResult>( resolve => {
			cachedPropsUpdater.afterDocumentChange = ( updatedResult, propsToUpdate ) => resolve({ 
				updatedResult: updatedResult!, 
				propsToUpdate: propsToUpdate! 
			})
		})
	}

	beforeEach(()=>{
		datasource = new JsonDataSource({})
		Store.useDataSource( datasource )
	})

	it( 'should register handler for cached props', async ()=>{
		setupUpdateCachedPropsUpdater()

		const collectionsToWatchNames = Object.keys( cachedPropsUpdater.collectionsToWatch )
		expect( collectionsToWatchNames ).toEqual(['Child', 'Root/{customerId}/Child' ])
		expect( collectionsToWatchNames ).toHaveLength( 2 )
	})

	describe( 'Root collection with root prop', ()=>{

		beforeEach( async ()=>{
			datasource.setDataStore({
				Parent: { a: { id: 'a', __className: 'Parent', name: 'a', propInRootForRootCollection: { id: 'a2', __className: 'Child', name: 'a2', __documentReference: { storedInCollection: 'Child' } } }, b: { id: 'b', __className: 'Parent', name: 'b' }, c: { id: 'c', __className: 'Parent', name: 'c' } } as any,
				Child: { a2: { id: 'a2', __className: 'Child', name: 'a2' }, b2: { id: 'b2', __className: 'Child', name: 'b2' }, c2: { id: 'c2', __className: 'Child', name: 'c2' } } as any
			})
			setupUpdateCachedPropsUpdater()
			modelParent = Store.getModel<Parent>( 'Parent' )
			modelChild = Store.getModel<Child>( 'Child' )

			parent = ( await modelParent.findById( 'a' ))!
			child = ( await modelChild.findById( 'a2' ))!
		})

		it( 'should update cached props on referenced object change', async ()=>{
			child.name = 'a2-updated'
			modelChild.save( child )

			const { updatedResult } = await allPropsUpdatedCalled

			const updatedParent = ( await modelParent.findById( 'a' ))!
			expect( updatedParent.propInRootForRootCollection?.name ).toBe( 'a2-updated' )

			expect( updatedResult ).toEqual({
				Parent: {
					totalDocumentsToUpdate: 1,
					updatedDocuments: [ 'a' ],
					documentsToUpdate: [ 'a' ]
				}
			})
		})	
	})

	describe( 'Root collection with subcollection prop', ()=>{

		beforeEach( async ()=>{
			datasource.setDataStore({
				Parent: { a: { id: 'a', __className: 'Parent', name: 'a', propInSubcollectionForRootCollection: { id: 'a2', __className: 'Child', name: 'a2', __documentReference: { storedInCollection: 'Root/a/Child' } } }, b: { id: 'b', __className: 'Parent', name: 'b' }, c: { id: 'c', __className: 'Parent', name: 'c' } } as any,
				'Root/a/Child': { a2: { id: 'a2', __className: 'Child', name: 'a2' }, b2: { id: 'b2', __className: 'Child', name: 'b2' }, c2: { id: 'c2', __className: 'Child', name: 'c2' } } as any
			})

			setupUpdateCachedPropsUpdater()
			modelParent = Store.getModel<Parent>( 'Parent' )
			parent = ( await modelParent.findById( 'a' ))!
			modelChild = Store.getModelForSubCollection<Child>( new Root('a'), 'Child' )
			child = ( await modelChild.findById( 'a2' ))!
		})

		it( 'should update cached props on referenced object change', async ()=>{
			child.name = 'a2-updated'
			await modelChild.save( child )

			await allPropsUpdatedCalled

			const updatedParent = ( await modelParent.findById( 'a' ))!
			expect( updatedParent.propInSubcollectionForRootCollection?.name ).toBe( 'a2-updated' )
		})
	})

	describe( 'SubCollection with Root collection prop', ()=>{

		beforeEach( async ()=>{
			datasource.setDataStore({
				'Root/a/Parent': { a: { id: 'a', __className: 'Parent', name: 'a', propInRootForSubcollection: { id: 'a2', __className: 'Child', name: 'a2', __documentReference: { storedInCollection: 'Child' } } }, b: { id: 'b', __className: 'Parent', name: 'b' }, c: { id: 'c', __className: 'Parent', name: 'c' } } as any,
				Child: { a2: { id: 'a2', __className: 'Child', name: 'a2' }, b2: { id: 'b2', __className: 'Child', name: 'b2' }, c2: { id: 'c2', __className: 'Child', name: 'c2' } } as any
			})

			setupUpdateCachedPropsUpdater()
			modelParent = Store.getModelForSubCollection<Parent>( new Root('a'), 'Parent' )
			parent = ( await modelParent.findById( 'a' ))!
			modelChild = Store.getModel<Child>( 'Child' )
			child = ( await modelChild.findById( 'a2' ))!
		})

		it( 'should update cached props on referenced object change', async ()=>{
			child.name = 'a2-updated'
			await modelChild.save( child )

			await allPropsUpdatedCalled

			const updatedParent = ( await modelParent.findById( 'a' ))!
			expect( updatedParent.propInRootForSubcollection?.name ).toBe( 'a2-updated' )
		})
	})

	describe( 'SubCollection with subcollection prop', ()=>{

		beforeEach( async ()=>{
			datasource.setDataStore({
				'Root/a/Parent': { a: { id: 'a', __className: 'Parent', name: 'a', propInSubcollectionForSubcollection: { id: 'a2', __className: 'Child', name: 'a2', __documentReference: { storedInCollection: 'Root/a/Child' } } }, b: { id: 'b', __className: 'Parent', name: 'b' }, c: { id: 'c', __className: 'Parent', name: 'c' } } as any,
				'Root/a/Child': { a2: { id: 'a2', __className: 'Child', name: 'a2' }, b2: { id: 'b2', __className: 'Child', name: 'b2' }, c2: { id: 'c2', __className: 'Child', name: 'c2' } } as any
			})
			
			setupUpdateCachedPropsUpdater()
			modelParent = Store.getModelForSubCollection<Parent>( new Root('a'), 'Parent' )
			parent = ( await modelParent.findById( 'a' ))!
			modelChild = Store.getModelForSubCollection<Child>( new Root('a'), 'Child' )
			child = ( await modelChild.findById( 'a2' ))!
		})

		it( 'should update cached props on referenced object change', async ()=>{
			child.name = 'a2-updated'
			await modelChild.save( child )

			await allPropsUpdatedCalled

			const updatedParent = ( await modelParent.findById( 'a' ))!
			expect( updatedParent.propInSubcollectionForSubcollection?.name ).toBe( 'a2-updated' )
		})
	})

	describe( 'Notifications collection with root prop', ()=>{

		beforeEach( async ()=>{
			datasource.setDataStore({
				Parent: { a: { id: 'a', __className: 'Parent', name: 'a', propInRootForRootCollection: { id: 'a2', __className: 'Child', name: 'a2', __documentReference: { storedInCollection: 'Child' } } }, b: { id: 'b', __className: 'Parent', name: 'b' }, c: { id: 'c', __className: 'Parent', name: 'c' } } as any,
				Child: { a2: { id: 'a2', __className: 'Child', name: 'a2' }, b2: { id: 'b2', __className: 'Child', name: 'b2' }, c2: { id: 'c2', __className: 'Child', name: 'c2' } } as any
			})
			
			setupUpdateCachedPropsUpdater()
			modelParent = Store.getModel<Parent>( 'Parent' )
			modelChild = Store.getModel<Child>( 'Child' )

			parent = ( await modelParent.findById( 'a' ))!
			child = ( await modelChild.findById( 'a2' ))!
		})

		it( 'should notify before and after update', async ()=>{
			cachedPropsUpdater.beforeUpdateDocument =( document: Parent, prop: PersistentProperty ) => {
				document.markAsSeverChange = true
			}
			const spy = vi.fn()
			cachedPropsUpdater.afterUpdateDocument = spy

			child.name = 'a2-updated'
			await modelChild.save( child )

			await allPropsUpdatedCalled

			const updatedParent = ( await modelParent.findById( 'a' ))!
			expect( updatedParent.propInRootForRootCollection?.name ).toBe( 'a2-updated' )
			expect( updatedParent.markAsSeverChange ).toBe( true )
			expect( spy ).toHaveBeenCalledTimes( 1 )
			expect( spy ).toHaveBeenCalledWith( expect.objectContaining({ id: 'a' }), expect.objectContaining({ name: 'propInRootForRootCollection' }), expect.objectContaining({ id: 'a2' }) )
		})

		it( 'should notify before document change', async ()=>{
			const beforeSpy = vi.fn()
			cachedPropsUpdater.beforeDocumentChange = beforeSpy

			child.name = 'a2-updated'
			await modelChild.save( child )

			await allPropsUpdatedCalled

			expect( beforeSpy ).toHaveBeenCalledTimes( 1 )
			expect( beforeSpy ).toHaveBeenCalledWith( expect.objectContaining({ after: expect.objectContaining({ id: 'a2' }) }), expect.arrayContaining([ expect.objectContaining({ name: 'propInRootForRootCollection' }) ]) )
		})

	})

})

describe( 'Cached props fan-out resource safety. Issue: #19 [REQ-1][REQ-2][REQ-3][REQ-4][REQ-5][REQ-6]', ()=>{
	let datasource: JsonDataSource
	let updater: CachedPropsUpdater

	beforeEach(()=>{
		datasource = new JsonDataSource({})
		Store.useDataSource( datasource )
	})

	afterEach(()=>{
		vi.restoreAllMocks()
	})

	function seedOwners( ownerCount: number ) {
		const parents: Record<string, DocumentObject> = {}
		for ( let i = 0; i < ownerCount; i++ ) {
			parents[ `p${ i }` ] = {
				id: `p${ i }`,
				__className: 'Parent',
				propInRootForRootCollection: { id: 'a2', __className: 'Child', name: 'a2', __documentReference: { storedInCollection: 'Child' } }
			} as unknown as DocumentObject
		}

		datasource.setDataStore({
			Parent: parents,
			Child: { a2: { id: 'a2', __className: 'Child', name: 'a2' } } as any
		} as any)
	}

	function setupUpdater( config?: CachedPropsUpdaterConfig ) {
		// These resource-safety specs instrument the legacy whole-document save,
		// so they pin it explicitly; the transactional owner path (the default)
		// is covered by the Issue #25 suite below.
		updater = datasource.installCachedPropsUpdater({ transactional: false, ...config })
		return updater
	}

	function sourceEvent( before: DocumentObject, after: DocumentObject ): DocumentChange<DocumentObject> {
		return { before, after, type: 'update', params: {}, collectionPath: 'Child' }
	}

	function nameChangedEvent() {
		return sourceEvent(
			{ id: 'a2', __className: 'Child', name: 'a2' } as DocumentObject,
			{ id: 'a2', __className: 'Child', name: 'a2-updated' } as DocumentObject
		)
	}

	function countUpdatedParents() {
		return Object.values( datasource.rawData.Parent ?? {} )
			.filter(( doc: any ) => doc.propInRootForRootCollection?.name === 'a2-updated' )
			.length
	}

	function instrumentSaves( delayMs: number ) {
		const originalSave = datasource.save.bind( datasource )
		let inFlight = 0
		const stats = { maxInFlight: 0, calls: 0 }
		vi.spyOn( datasource, 'save' ).mockImplementation( async collections => {
			stats.calls++
			inFlight++
			stats.maxInFlight = Math.max( stats.maxInFlight, inFlight )
			try {
				if ( delayMs > 0 ) await new Promise( resolve => setTimeout( resolve, delayMs ) )
				await originalSave( collections )
			}
			finally {
				inFlight--
			}
		})
		return stats
	}

	it( 'Leave the owner collection untouched when no cached prop changed. Issue: #19 [REQ-1]', async ()=>{
		seedOwners( 40 )
		setupUpdater()
		const findSpy = vi.spyOn( datasource, 'find' )
		const report = new Promise<UpdatedResults>( resolve => {
			updater.afterDocumentChange = results => resolve( results! )
		})

		const child = ( await Store.getModel<Child>( 'Child' ).findById( 'a2' ) )!
		await Store.getModel<Child>( 'Child' ).save( child )

		const updatedResult = await report
		expect( findSpy ).not.toHaveBeenCalled()
		expect( updatedResult ).toEqual( {} )
	})

	it( 'Keep saves in flight within chunkSize times concurrency. Issue: #19 [REQ-2]', async ()=>{
		seedOwners( 40 )
		setupUpdater({ chunkSize: 5, concurrency: 2 })
		const findSpy = vi.spyOn( datasource, 'find' )
		const stats = instrumentSaves( 10 )

		await updater.updateProps( 'Child', nameChangedEvent() )

		// chunkSize x concurrency = 5 x 2 = 10
		expect( findSpy.mock.calls[0]![0].limit ).toBe( 5 )
		expect( stats.maxInFlight ).toBeLessThanOrEqual( 10 )
		expect( stats.maxInFlight ).toBeGreaterThan( 5 )
		expect( stats.calls ).toBe( 40 )
		expect( countUpdatedParents() ).toBe( 40 )
	})

	it( 'Resolve only after every save has settled. Issue: #19 [REQ-3]', async ()=>{
		seedOwners( 40 )
		setupUpdater()
		instrumentSaves( 5 )

		await updater.updateProps( 'Child', nameChangedEvent() )

		expect( countUpdatedParents() ).toBe( 40 )
	})

	it( 'Report updated documents only after they completed. Issue: #19 [REQ-4]', async ()=>{
		seedOwners( 40 )
		setupUpdater()
		instrumentSaves( 5 )
		let reported: UpdatedResults | undefined
		let updatedAtReportTime = -1
		updater.afterDocumentChange = results => {
			reported = results
			updatedAtReportTime = countUpdatedParents()
		}

		await updater.updateProps( 'Child', nameChangedEvent() )

		expect( updatedAtReportTime ).toBe( 40 )
		expect( reported?.Parent?.totalDocumentsToUpdate ).toBe( 40 )
		expect( reported?.Parent?.updatedDocuments ).toHaveLength( 40 )
		expect( reported?.Parent?.documentsToUpdate ).toHaveLength( 40 )
		expect( [ ...reported!.Parent!.updatedDocuments ].sort() ).toEqual(
			Array.from({ length: 40 }, ( _, i ) => `p${ i }` ).sort()
		)
	})

	it( 'Reject the returned promise when an owner save fails. Issue: #19 [REQ-5]', async ()=>{
		seedOwners( 40 )
		setupUpdater()
		const reportSpy = vi.fn()
		updater.afterDocumentChange = reportSpy
		vi.spyOn( datasource, 'save' ).mockImplementation(() => Promise.reject( new Error( 'owner save failed' ) ))

		const unhandled: unknown[] = []
		const onUnhandled = ( reason: unknown ) => unhandled.push( reason )
		const nodeProcess = ( globalThis as any ).process
		nodeProcess.on( 'unhandledRejection', onUnhandled )
		try {
			await expect( updater.updateProps( 'Child', nameChangedEvent() ) ).rejects.toThrow( 'owner save failed' )
			await new Promise( resolve => setTimeout( resolve, 50 ) )
			expect( unhandled ).toEqual( [] )
			expect( reportSpy ).not.toHaveBeenCalled()
		}
		finally {
			nodeProcess.off( 'unhandledRejection', onUnhandled )
		}
	})

	it( 'Ignore an event for a document the updater is writing. Issue: #19 [REQ-6]', async ()=>{
		seedOwners( 3 )
		datasource.simulateDelay( 200 )
		setupUpdater()
		const findSpy = vi.spyOn( datasource, 'find' )
		const saveSpy = vi.spyOn( datasource, 'save' )
		const reports: UpdatedResults[] = []
		updater.afterDocumentChange = results => reports.push( results! )

		const fanOut = updater.updateProps( 'Child', nameChangedEvent() )

		await vi.waitFor(()=> expect( saveSpy ).toHaveBeenCalled() )
		const inFlightEvent = sourceEvent(
			{ id: 'p0', __className: 'Child', name: 'a2' } as DocumentObject,
			{ id: 'p0', __className: 'Child', name: 'a2-updated' } as DocumentObject
		)
		await updater.updateProps( 'Child', inFlightEvent )
		expect( findSpy ).toHaveBeenCalledTimes( 1 )
		expect( reports ).toHaveLength( 0 )

		await fanOut
		expect( reports ).toHaveLength( 1 )

		await updater.updateProps( 'Child', inFlightEvent )
		expect( findSpy ).toHaveBeenCalledTimes( 2 )
	})

	it( 'Process the document again once the failed write has settled. Issue: #19 [REQ-6]', async ()=>{
		seedOwners( 3 )
		setupUpdater()
		const findSpy = vi.spyOn( datasource, 'find' )
		const originalSave = datasource.save.bind( datasource )
		let saveCalls = 0
		vi.spyOn( datasource, 'save' ).mockImplementation( collections => {
			saveCalls++
			return saveCalls === 1
				? Promise.reject( new Error( 'owner save failed' ) )
				: originalSave( collections )
		})

		await expect( updater.updateProps( 'Child', nameChangedEvent() ) ).rejects.toThrow( 'owner save failed' )

		await updater.updateProps( 'Child', sourceEvent(
			{ id: 'p0', __className: 'Child', name: 'a2' } as DocumentObject,
			{ id: 'p0', __className: 'Child', name: 'a2-updated' } as DocumentObject
		))
		expect( findSpy ).toHaveBeenCalledTimes( 2 )
	})

	it( 'Does not request another page when the first page holds every match', async ()=>{
		seedOwners( 3 )
		setupUpdater()
		const nextSpy = vi.spyOn( QueryCursor.prototype, 'next' )

		await updater.updateProps( 'Child', nameChangedEvent() )

		expect( nextSpy ).toHaveBeenCalledTimes( 1 )
		expect( countUpdatedParents() ).toBe( 3 )
	})

	it( 'Reject only after the failing page saves have settled. Issue: #19 [REQ-7]', async ()=>{
		seedOwners( 40 )
		setupUpdater({ chunkSize: 5, concurrency: 1 })
		const originalSave = datasource.save.bind( datasource )
		let calls = 0
		let settled = 0
		vi.spyOn( datasource, 'save' ).mockImplementation( collections => {
			calls++
			if ( calls === 1 ) {
				return Promise.reject( new Error( 'first owner save failed' ) ).finally(()=> settled++ )
			}
			return new Promise< void >( resolve => setTimeout( resolve, 50 ) )
				.then(()=> originalSave( collections ) )
				.finally(()=> settled++ )
		})

		await expect( updater.updateProps( 'Child', nameChangedEvent() ) ).rejects.toThrow( 'first owner save failed' )

		// chunkSize = 5: the whole failing page settled before updateProps rejected
		expect( settled ).toBe( 5 )
		// and the failing page aborted the run before the next page was pulled
		expect( calls ).toBe( 5 )
	})

	it( 'Stop pulling pages when an owner page read fails. Issue: #19 [REQ-8]', async ()=>{
		seedOwners( 40 )
		setupUpdater({ chunkSize: 5, concurrency: 2 })
		const realNext = QueryCursor.prototype.next
		let nextCalls = 0
		vi.spyOn( QueryCursor.prototype, 'next' ).mockImplementation( function( this: QueryCursor, limit?: number ) {
			nextCalls++
			return nextCalls === 2
				? Promise.reject( new Error( 'owner page read failed' ) )
				: realNext.call( this, limit )
		})
		const saveSpy = vi.spyOn( datasource, 'save' )

		await expect( updater.updateProps( 'Child', nameChangedEvent() ) ).rejects.toThrow( 'owner page read failed' )

		// next #1 = first page, #2 = the failing read; no page is read after it
		expect( nextCalls ).toBeLessThanOrEqual( 3 )
		expect( saveSpy.mock.calls.length ).toBeLessThan( 40 )
	})

	it( 'Honour a total cap set before the owner query runs', async ()=>{
		seedOwners( 40 )
		setupUpdater({ chunkSize: 5, concurrency: 2 })
		updater.beforeQueryOwnerCollection = query => query.limit( 2 )
		const saveSpy = vi.spyOn( datasource, 'save' )

		await updater.updateProps( 'Child', nameChangedEvent() )

		expect( saveSpy ).toHaveBeenCalledTimes( 2 )
		expect( countUpdatedParents() ).toBe( 2 )
	})

	it( 'Sanitize chunkSize and concurrency to at least one', async ()=>{
		seedOwners( 5 )
		setupUpdater({ chunkSize: 0, concurrency: 0 })
		const saveSpy = vi.spyOn( datasource, 'save' )

		await updater.updateProps( 'Child', nameChangedEvent() )

		expect( saveSpy ).toHaveBeenCalledTimes( 5 )
		expect( countUpdatedParents() ).toBe( 5 )
	})

	it( 'Update every owner document with transactional saves [REQ-2]', async ()=>{
		seedOwners( 40 )
		setupUpdater({ chunkSize: 5, concurrency: 2, transactional: true })

		await updater.updateProps( 'Child', nameChangedEvent() )

		expect( countUpdatedParents() ).toBe( 40 )
	})

})
@registerPersistentClass('ArrayParent')
class ArrayParent extends Persistent {
	set refs( value: Child[] ) {
		this._refs = value
	}

	get refs(): Child[] {
		return this._refs
	}

	@searchableArray @persistentPureReferenceWithCachedProps<Child>( ['name'], 'Child' ) private _refs: Child[] = []
}

describe( 'Transactional owner updates prevent lost updates [REQ-1][REQ-2]', ()=>{
	let datasource: JsonDataSource
	let updater: CachedPropsUpdater

	beforeEach(()=>{
		datasource = new JsonDataSource({})
		Store.useDataSource( datasource )
		datasource.setDataStore({
			ArrayParent: {
				p: {
					id: 'p',
					__className: 'ArrayParent',
					refs: [
						{ id: 'a', __className: 'Child', name: 'a', __documentReference: { storedInCollection: 'Child' } },
						{ id: 'b', __className: 'Child', name: 'b', __documentReference: { storedInCollection: 'Child' } }
					],
					__refs_searchable: [ 'a', 'b' ]
				}
			} as any,
			Child: {
				a: { id: 'a', __className: 'Child', name: 'a' },
				b: { id: 'b', __className: 'Child', name: 'b' }
			} as any
		})
	})

	afterEach(()=>{
		vi.restoreAllMocks()
	})

	const childEvent = ( id: string, from: string, to: string ): DocumentChange<DocumentObject> => ({
		before: { id, __className: 'Child', name: from } as DocumentObject,
		after: { id, __className: 'Child', name: to } as DocumentObject,
		type: 'update',
		params: {},
		collectionPath: 'Child'
	})

	const storedRefNames = ()=> ( datasource.rawData[ 'ArrayParent' ]?.[ 'p' ] as any )?.refs?.map(( ref: any )=> ref.name )

	async function renameBothConcurrently( config?: CachedPropsUpdaterConfig ) {
		datasource.simulateDelay( 10 )
		updater = datasource.installCachedPropsUpdater( config )
		await Promise.all([
			updater.updateProps( 'Child', childEvent( 'a', 'a', 'a-updated' ) ),
			updater.updateProps( 'Child', childEvent( 'b', 'b', 'b-updated' ) ),
		])
		await datasource.wait()
	}

	it( 'Lose one of two concurrent owner renames with the legacy batch save [REQ-1]', async ()=>{
		await renameBothConcurrently({ transactional: false })

		// one write clobbers the other: only one rename survives
		const names = storedRefNames()
		expect( names.filter(( name: string )=> name === 'a-updated' || name === 'b-updated' ) ).toHaveLength( 1 )
	})

	it( 'Keep both concurrent owner renames with transactional updates by default [REQ-2]', async ()=>{
		await renameBothConcurrently()

		expect( storedRefNames() ).toEqual( [ 'a-updated', 'b-updated' ] )
	})
})

@registerPersistentClass( 'Unwatched' )
class Unwatched extends Persistent {
	set name( value: string ) {
		this._name = value
	}

	get name(): string {
		return this._name
	}

	@persistent private _name: string = ''
}

/**
 * Covers the issue #14 feature: installing the cached-props updater subscribes to
 * the watched collection templates, so cached props refresh without a caller-side
 * listener bridge. Most tests install the updater through the data source and
 * await the `afterDocumentChange` callback to know the refresh completed (the
 * `JsonDataSource.wait()` method is not a barrier for install-driven refreshes).
 */
describe( 'Cached props refresh driven by installCachedPropsUpdater', ()=>{
	let datasource: JsonDataSource

	beforeEach(()=>{
		datasource = new JsonDataSource({})
		Store.useDataSource( datasource )
	})

	afterEach(()=>{
		vi.restoreAllMocks()
	})

	/** Collects every `afterDocumentChange` report, empty ones included. */
	function watchAfterDocumentChange( updater: CachedPropsUpdater ): UpdatedResults[] {
		const reports: UpdatedResults[] = []
		updater.afterDocumentChange = results => reports.push( results ?? {} )
		return reports
	}

	/** Only the reports that actually updated an owner document. */
	function updatedReports( reports: UpdatedResults[] ): UpdatedResults[] {
		return reports.filter( report => Object.values( report ).some( result => result.updatedDocuments.length > 0 ))
	}

	async function waitForUpdatedReports( reports: UpdatedResults[], count = 1 ) {
		await vi.waitFor(()=> expect( updatedReports( reports ) ).toHaveLength( count ))
	}

	/** Lets any fire-and-forget refresh settle, to assert that nothing else reports. */
	const settle = () => new Promise( resolve => setTimeout( resolve, 20 ))

	function ownerChildModel( customerId: string ) {
		return Store.getModelForSubCollection<Child>( new Root( customerId ), 'Child' )
	}

	function ownerParentModel( customerId: string ) {
		return Store.getModelForSubCollection<Parent>( new Root( customerId ), 'Parent' )
	}

	async function renameChild( childId: string, name: string, model: Model<Child> = Store.getModel<Child>( 'Child' ) ) {
		const child = ( await model.findById( childId ) )!
		child.name = name
		await model.save( child )
	}

	function rootOwnerAndChildData() {
		return {
			Parent: {
				a: { id: 'a', __className: 'Parent', name: 'a', propInRootForRootCollection: { id: 'a2', __className: 'Child', name: 'a2', __documentReference: { storedInCollection: 'Child' } } },
				b: { id: 'b', __className: 'Parent', name: 'b' },
				c: { id: 'c', __className: 'Parent', name: 'c' },
			},
			Child: {
				a2: { id: 'a2', __className: 'Child', name: 'a2' },
				b2: { id: 'b2', __className: 'Child', name: 'b2' },
				c2: { id: 'c2', __className: 'Child', name: 'c2' },
			}
		}
	}

	/**
	 * Rejects the first `failures` owner transactions, so an install-driven refresh
	 * fails exactly as a rejected owner save does.
	 */
	function failOwnerTransactions( failures = 1 ) {
		const originalRunTransaction = datasource.runTransaction.bind( datasource )
		let remaining = failures
		vi.spyOn( datasource, 'runTransaction' ).mockImplementation(( fn: any )=> {
			if ( remaining > 0 ) {
				remaining--
				return Promise.reject( new Error( 'owner save failed' ) )
			}
			return originalRunTransaction( fn )
		})
	}

	it( 'Reproduce: installing the updater alone refreshes cached props. Issue: #14 [REQ-10]', async ()=>{
		const seed = rootOwnerAndChildData()
		datasource.setDataStore( seed as any )
		// install is the only wiring: no caller-side onDocumentTemplateChange bridge
		const updater = datasource.installCachedPropsUpdater()
		const reports = watchAfterDocumentChange( updater )

		await renameChild( 'a2', 'a2-updated' )

		await waitForUpdatedReports( reports )
		await settle()

		const stored = datasource.rawData[ 'Parent' ]!
		expect(( stored[ 'a' ] as any ).propInRootForRootCollection.name ).toBe( 'a2-updated' )
		expect( stored[ 'b' ] ).toEqual( seed.Parent.b )
		expect( stored[ 'c' ] ).toEqual( seed.Parent.c )

		expect( updatedReports( reports ) ).toHaveLength( 1 )
		expect( updatedReports( reports )[ 0 ] ).toEqual({
			Parent: {
				totalDocumentsToUpdate: 1,
				updatedDocuments: [ 'a' ],
				documentsToUpdate: [ 'a' ]
			}
		})
	})

	it( 'Refresh a reference stored in a templated subcollection with install alone. Issue: #14 [REQ-11]', async ()=>{
		datasource.setDataStore({
			Parent: {
				a: { id: 'a', __className: 'Parent', name: 'a', propInSubcollectionForRootCollection: { id: 'a2', __className: 'Child', name: 'a2', __documentReference: { storedInCollection: 'Root/a/Child' } } },
				b: { id: 'b', __className: 'Parent', name: 'b' },
				c: { id: 'c', __className: 'Parent', name: 'c' },
			},
			'Root/a/Child': {
				a2: { id: 'a2', __className: 'Child', name: 'a2' },
				b2: { id: 'b2', __className: 'Child', name: 'b2' },
			}
		} as any )
		const updater = datasource.installCachedPropsUpdater()
		const reports = watchAfterDocumentChange( updater )

		await renameChild( 'a2', 'a2-updated', ownerChildModel( 'a' ) )
		await waitForUpdatedReports( reports )

		const owner = ( await Store.getModel<Parent>( 'Parent' ).findById( 'a' ) )!
		expect( owner.propInSubcollectionForRootCollection?.name ).toBe( 'a2-updated' )
	})

	it( 'Refresh an owner stored in a templated subcollection with install alone. Issue: #14 [REQ-12]', async ()=>{
		datasource.setDataStore({
			'Root/a/Parent': {
				a: { id: 'a', __className: 'Parent', name: 'a', propInRootForSubcollection: { id: 'a2', __className: 'Child', name: 'a2', __documentReference: { storedInCollection: 'Child' } } },
				b: { id: 'b', __className: 'Parent', name: 'b' },
			},
			Child: {
				a2: { id: 'a2', __className: 'Child', name: 'a2' },
				b2: { id: 'b2', __className: 'Child', name: 'b2' },
			}
		} as any )
		const updater = datasource.installCachedPropsUpdater()
		const reports = watchAfterDocumentChange( updater )

		await renameChild( 'a2', 'a2-updated' )
		await waitForUpdatedReports( reports )

		const owner = ( await ownerParentModel( 'a' ).findById( 'a' ) )!
		expect( owner.propInRootForSubcollection?.name ).toBe( 'a2-updated' )
	})

	it( 'Refresh after a watched collection is created post-install. Issue: #14 [REQ-13]', async ()=>{
		// nothing is stored yet: install happens before any collection exists
		const updater = datasource.installCachedPropsUpdater()
		const reports = watchAfterDocumentChange( updater )
		const childModel = Store.getModel<Child>( 'Child' )
		const parentModel = Store.getModel<Parent>( 'Parent' )

		const child = new Child( 'a2' )
		child.name = 'a2'
		await childModel.save( child )

		const owner = new Parent( 'a' )
		owner.propInRootForRootCollection = child
		await parentModel.save( owner )

		child.name = 'a2-updated'
		await childModel.save( child )

		await waitForUpdatedReports( reports )

		const storedOwner = ( await parentModel.findById( 'a' ) )!
		expect( storedOwner.propInRootForRootCollection?.name ).toBe( 'a2-updated' )
	})

	it( 'Refresh a subcollection created post-install with a new path parameter. Issue: #14 [REQ-14]', async ()=>{
		// a collection matching the watched template exists, another one appears later
		datasource.setDataStore({
			'Root/b/Child': { b2: { id: 'b2', __className: 'Child', name: 'b2' } }
		} as any )
		const updater = datasource.installCachedPropsUpdater()
		const reports = watchAfterDocumentChange( updater )
		const childModel = ownerChildModel( 'a' )
		const parentModel = ownerParentModel( 'a' )

		const child = new Child( 'a2' )
		child.name = 'a2'
		await childModel.save( child )

		const owner = new Parent( 'a' )
		owner.propInSubcollectionForSubcollection = child
		await parentModel.save( owner )

		child.name = 'a2-updated'
		await childModel.save( child )

		await waitForUpdatedReports( reports )

		const storedOwner = ( await parentModel.findById( 'a' ) )!
		expect( storedOwner.propInSubcollectionForSubcollection?.name ).toBe( 'a2-updated' )
	})

	it( 'Ignore changes in collections no cached prop watches. Issue: #14 [REQ-15]', async ()=>{
		datasource.setDataStore( rootOwnerAndChildData() as any )
		const updater = datasource.installCachedPropsUpdater()
		const findSpy = vi.spyOn( datasource, 'find' )
		const updateSpy = vi.spyOn( updater, 'updateProps' )
		const beforeSpy = vi.fn()
		const afterSpy = vi.fn()
		updater.beforeDocumentChange = beforeSpy
		updater.afterDocumentChange = afterSpy

		// Unwatched is registered without cached-prop references: its collection is not watched
		const unwatched = new Unwatched( 'u1' )
		unwatched.name = 'u1'
		await Store.getModel<Unwatched>( 'Unwatched' ).save( unwatched )
		await settle()

		expect( findSpy ).not.toHaveBeenCalled()
		expect( updateSpy ).not.toHaveBeenCalled()
		expect( beforeSpy ).not.toHaveBeenCalled()
		expect( afterSpy ).not.toHaveBeenCalled()
	})

	it( 'Hand an install-driven refresh failure to the failure handler. Issue: #14 [REQ-16]', async ()=>{
		datasource.setDataStore( rootOwnerAndChildData() as any )
		const failures: { error: unknown, change: DocumentChange<DocumentObject> }[] = []
		datasource.installCachedPropsUpdater({
			onRefreshFailure: ( error, change ) => failures.push({ error, change })
		})
		failOwnerTransactions()

		// the referenced document save itself succeeds: only the owner refresh fails
		await renameChild( 'a2', 'a2-updated' )

		await vi.waitFor(()=> expect( failures ).toHaveLength( 1 ))
		expect(( failures[ 0 ]!.error as Error ).message ).toBe( 'owner save failed' )
		expect( failures[ 0 ]!.change.collectionPath ).toBe( 'Child' )
		expect( failures[ 0 ]!.change.after?.id ).toBe( 'a2' )
	})

	it( 'Leave no unhandled rejection when an install-driven refresh fails. Issue: #14 [REQ-17]', async ()=>{
		datasource.setDataStore( rootOwnerAndChildData() as any )
		const onRefreshFailure = vi.fn()
		datasource.installCachedPropsUpdater({ onRefreshFailure })
		failOwnerTransactions()
		const unhandled: unknown[] = []
		const onUnhandled = ( reason: unknown ) => unhandled.push( reason )
		const nodeProcess = ( globalThis as any ).process
		nodeProcess.on( 'unhandledRejection', onUnhandled )
		try {
			await renameChild( 'a2', 'a2-updated' )

			await vi.waitFor(()=> expect( onRefreshFailure ).toHaveBeenCalledTimes( 1 ))
			await settle()

			expect( onRefreshFailure ).toHaveBeenCalledTimes( 1 )
			expect(( onRefreshFailure.mock.calls[ 0 ]![ 0 ] as Error ).message ).toBe( 'owner save failed' )
			expect( unhandled ).toEqual( [] )
		}
		finally {
			nodeProcess.off( 'unhandledRejection', onUnhandled )
		}
	})

	it( 'Keep refreshing after a failed refresh. Issue: #14 [REQ-18]', async ()=>{
		datasource.setDataStore( rootOwnerAndChildData() as any )
		const onRefreshFailure = vi.fn()
		const updater = datasource.installCachedPropsUpdater({ onRefreshFailure })
		const reports = watchAfterDocumentChange( updater )
		failOwnerTransactions( 1 )

		await renameChild( 'a2', 'a2-first-attempt' )
		await vi.waitFor(()=> expect( onRefreshFailure ).toHaveBeenCalledTimes( 1 ))
		expect( updatedReports( reports ) ).toHaveLength( 0 )

		await renameChild( 'a2', 'a2-second-attempt' )
		await waitForUpdatedReports( reports )

		const ownerModel = Store.getModel<Parent>( 'Parent' )
		const storedOwner = ( await ownerModel.findById( 'a' ) )!
		expect( storedOwner.propInRootForRootCollection?.name ).toBe( 'a2-second-attempt' )

		// still subscribed: the next change refreshes again
		await renameChild( 'a2', 'a2-third-attempt' )
		await waitForUpdatedReports( reports, 2 )
		const refreshedOwner = ( await ownerModel.findById( 'a' ) )!
		expect( refreshedOwner.propInRootForRootCollection?.name ).toBe( 'a2-third-attempt' )
	})

	it( 'Replace the previous subscription when the updater is re-installed. Issue: #14 [REQ-19]', async ()=>{
		datasource.setDataStore( rootOwnerAndChildData() as any )
		const firstUpdater = datasource.installCachedPropsUpdater()
		const firstReports = watchAfterDocumentChange( firstUpdater )

		const secondUpdater = datasource.installCachedPropsUpdater()
		expect( secondUpdater ).not.toBe( firstUpdater )
		const secondReports = watchAfterDocumentChange( secondUpdater )

		await renameChild( 'a2', 'a2-updated' )

		await waitForUpdatedReports( secondReports )
		await settle()

		expect( updatedReports( secondReports ) ).toHaveLength( 1 )
		expect( firstReports ).toEqual( [] )

		const storedOwner = ( await Store.getModel<Parent>( 'Parent' ).findById( 'a' ) )!
		expect( storedOwner.propInRootForRootCollection?.name ).toBe( 'a2-updated' )
	})

	it( 'Refresh owners through the data source that installed the updater. Issue: #14 [REQ-20]', async ()=>{
		const dataSourceA = datasource
		datasource.setDataStore( rootOwnerAndChildData() as any )
		const updater = dataSourceA.installCachedPropsUpdater()
		const reports = watchAfterDocumentChange( updater )

		const dataSourceB = new JsonDataSource( rootOwnerAndChildData() as any )
		Store.useDataSource( dataSourceB )

		const childModelInA = new Model<Child>( dataSourceA, 'Child' )
		await renameChild( 'a2', 'a2-updated', childModelInA )

		await waitForUpdatedReports( reports )

		const ownerInA = ( await new Model<Parent>( dataSourceA, 'Parent' ).findById( 'a' ) )!
		expect( ownerInA.propInRootForRootCollection?.name ).toBe( 'a2-updated' )

		const ownerInB = ( await new Model<Parent>( dataSourceB, 'Parent' ).findById( 'a' ) )!
		expect( ownerInB.propInRootForRootCollection?.name ).toBe( 'a2' )
	})

	it( 'Keep a direct updateProps() call working. Issue: #14 [REQ-22]', async ()=>{
		datasource.setDataStore( rootOwnerAndChildData() as any )
		const updater = datasource.installCachedPropsUpdater()
		const event: DocumentChange<DocumentObject> = {
			before: { id: 'a2', __className: 'Child', name: 'a2' } as DocumentObject,
			after: { id: 'a2', __className: 'Child', name: 'a2-direct' } as DocumentObject,
			type: 'update',
			params: {},
			collectionPath: 'Child'
		}

		await updater.updateProps( 'Child', event )

		const storedOwner = ( await Store.getModel<Parent>( 'Parent' ).findById( 'a' ) )!
		expect( storedOwner.propInRootForRootCollection?.name ).toBe( 'a2-direct' )
	})

	describe( 'Supplementary install-subscription coverage', ()=>{

		const resolveExistingCollection = async ( template: string ) => [ template ]

		it( 'replaces its own previous subscription when it subscribes twice', async ()=>{
			datasource.setDataStore( rootOwnerAndChildData() as any )
			const updater = new CachedPropsUpdater()
			updater.resolveCollectionPaths = resolveExistingCollection
			const firstUnsubscribe = updater.subscribe( datasource )
			const reports = watchAfterDocumentChange( updater )
			const secondUnsubscribe = updater.subscribe( datasource )

			await renameChild( 'a2', 'a2-first-rename' )
			await waitForUpdatedReports( reports )
			await settle()

			// subscribe() replaced its own previous subscription: one refresh, not two
			expect( updatedReports( reports ) ).toHaveLength( 1 )

			// an unsubscriber replaced by a newer subscription is a no-op
			firstUnsubscribe()
			await renameChild( 'a2', 'a2-second-rename' )
			await waitForUpdatedReports( reports, 2 )

			secondUnsubscribe()

			// unsubscribing stops the refreshes but keeps the owner routing of the
			// stopped subscription: a direct updateProps() still writes through it
			await updater.updateProps( 'Child', {
				before: { id: 'a2', __className: 'Child', name: 'a2-second-rename' } as DocumentObject,
				after: { id: 'a2', __className: 'Child', name: 'a2-after-unsubscribe' } as DocumentObject,
				type: 'update',
				params: {},
				collectionPath: 'Child'
			})

			const storedOwner = ( await new Model<Parent>( datasource, 'Parent' ).findById( 'a' ) )!
			expect( storedOwner.propInRootForRootCollection?.name ).toBe( 'a2-after-unsubscribe' )
		})

		it( 'keeps a directly constructed updater working through the Store data source', async ()=>{
			datasource.setDataStore( rootOwnerAndChildData() as any )
			const updater = new CachedPropsUpdater()
			updater.resolveCollectionPaths = resolveExistingCollection

			await updater.updateProps( 'Child', {
				before: { id: 'a2', __className: 'Child', name: 'a2' } as DocumentObject,
				after: { id: 'a2', __className: 'Child', name: 'a2-updated' } as DocumentObject,
				type: 'update',
				params: {},
				collectionPath: 'Child'
			})

			const storedOwner = ( await Store.getModel<Parent>( 'Parent' ).findById( 'a' ) )!
			expect( storedOwner.propInRootForRootCollection?.name ).toBe( 'a2-updated' )
		})

		it( 'contains a refresh failure when no handler is configured', async ()=>{
			datasource.setDataStore( rootOwnerAndChildData() as any )
			const updater = datasource.installCachedPropsUpdater()
			const reports = watchAfterDocumentChange( updater )
			failOwnerTransactions( 1 )
			const unhandled: unknown[] = []
			const onUnhandled = ( reason: unknown ) => unhandled.push( reason )
			const nodeProcess = ( globalThis as any ).process
			nodeProcess.on( 'unhandledRejection', onUnhandled )
			try {
				await renameChild( 'a2', 'a2-first-attempt' )
				await vi.waitFor(()=> expect( datasource.runTransaction ).toHaveBeenCalled() )
				await settle()

				expect( unhandled ).toEqual( [] )
				expect( updatedReports( reports ) ).toHaveLength( 0 )

				// the subscription survives the contained failure
				await renameChild( 'a2', 'a2-second-attempt' )
				await waitForUpdatedReports( reports )
				const storedOwner = ( await Store.getModel<Parent>( 'Parent' ).findById( 'a' ) )!
				expect( storedOwner.propInRootForRootCollection?.name ).toBe( 'a2-second-attempt' )
			}
			finally {
				nodeProcess.off( 'unhandledRejection', onUnhandled )
			}
		})

		it( 'contains a throwing failure handler', async ()=>{
			datasource.setDataStore( rootOwnerAndChildData() as any )
			const onRefreshFailure = vi.fn(()=> { throw new Error( 'handler failed' ) })
			const updater = datasource.installCachedPropsUpdater({ onRefreshFailure })
			const reports = watchAfterDocumentChange( updater )
			failOwnerTransactions( 1 )
			const unhandled: unknown[] = []
			const onUnhandled = ( reason: unknown ) => unhandled.push( reason )
			const nodeProcess = ( globalThis as any ).process
			nodeProcess.on( 'unhandledRejection', onUnhandled )
			try {
				await renameChild( 'a2', 'a2-first-attempt' )
				await vi.waitFor(()=> expect( onRefreshFailure ).toHaveBeenCalledTimes( 1 ))
				await settle()

				expect( unhandled ).toEqual( [] )
				expect( updatedReports( reports ) ).toHaveLength( 0 )

				// the subscription survives both the failed refresh and the throwing handler
				await renameChild( 'a2', 'a2-second-attempt' )
				await waitForUpdatedReports( reports )
				const storedOwner = ( await Store.getModel<Parent>( 'Parent' ).findById( 'a' ) )!
				expect( storedOwner.propInRootForRootCollection?.name ).toBe( 'a2-second-attempt' )
			}
			finally {
				nodeProcess.off( 'unhandledRejection', onUnhandled )
			}
		})

		it( 're-installs over a manual subscription without leaving two live subscriptions', async ()=>{
			datasource.setDataStore( rootOwnerAndChildData() as any )
			const first = datasource.installCachedPropsUpdater()
			const firstReports = watchAfterDocumentChange( first )

			// a host call replaces the subscription created by the first install
			first.subscribe( datasource )

			const second = datasource.installCachedPropsUpdater()
			const secondReports = watchAfterDocumentChange( second )
			const runTransactionSpy = vi.spyOn( datasource, 'runTransaction' )

			// one rename must fan out once: two live subscriptions would double it
			await renameChild( 'a2', 'a2-updated' )

			await waitForUpdatedReports( secondReports )
			await settle()

			expect( runTransactionSpy.mock.calls.length ).toBe( 1 )
			expect( updatedReports( secondReports ) ).toHaveLength( 1 )
			expect( firstReports ).toEqual( [] )

			const storedOwner = ( await new Model<Parent>( datasource, 'Parent' ).findById( 'a' ) )!
			expect( storedOwner.propInRootForRootCollection?.name ).toBe( 'a2-updated' )
		})
	})

})
