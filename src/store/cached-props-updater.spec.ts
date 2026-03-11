import { persistent, Persistent, PersistentProperty, persistentPureReferenceWithCachedProps, registerPersistentClass } from '../persistent/persistent'
import { Store } from './store'
import { Model } from './model'
import { JsonDataSource } from './json-data-source'
import { CachedPropsUpdater, UpdatedResults } from './cached-props-updater'

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

describe.skip( 'Persistent with cached props reference', ()=>{
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

			const { updatedResult, propsToUpdate } = await allPropsUpdatedCalled

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
			expect( spy ).toHaveBeenCalledWith( expect.objectContaining({ id: 'a' }), expect.objectContaining({ name: 'propInRootForRootCollection' }) )
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