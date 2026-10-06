import { persistent, Persistent, PersistentProperty, persistentPureReferenceWithCachedProps, registerPersistentClass, DocumentChange } from '../persistent/persistent'
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
		datasource.onDocumentTemplateChange( '{rootCollection}/{rootDocumentId}/{subCollection}/{subDocumentId}', event => {
			const { rootCollection, subCollection } = event.params!
			const documentPath = subCollection? `${ rootCollection }/{customerId}/${ subCollection }` : rootCollection
			cachedPropsUpdater.updateProps( documentPath, event )
		})
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
		updater = datasource.installCachedPropsUpdater( config )
		datasource.onDocumentTemplateChange( '{rootCollection}/{rootDocumentId}/{subCollection}/{subDocumentId}', event => {
			const { rootCollection, subCollection } = event.params!
			const documentPath = subCollection? `${ rootCollection }/{customerId}/${ subCollection }` : rootCollection
			updater.updateProps( documentPath, event )
		})
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

})