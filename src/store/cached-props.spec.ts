import { persistent, Persistent, PersistentProperty, persistentPureReferenceWithCachedProps, registerPersistentClass } from '../persistent/persistent'
import { Store } from './store'
import { Model } from './model'
import { JsonDataSource } from './json-data-source'
import { DocumentChangeListenerHandler } from './data-source'
import { UpdateCachedProps } from './cached-props'

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

	set markAsSeverChange( value: boolean ) {
		this._markAsSeverChange = value
	}
	
	get markAsSeverChange(): boolean {
		return this._markAsSeverChange
	}
	
	
	static propCollectionPath( target: Persistent, prop: PersistentProperty, params?: unknown  ): string {
		return `Root/a/${ target.className }`
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
}

describe( 'Persistent with cached props reference', ()=>{
	let datasource: JsonDataSource
	let modelParent: Model<Parent>
	let modelChild: Model<Child>
	let parent: Parent
	let child: Child
	let handlers: DocumentChangeListenerHandler[]
	let updateCachedProps: UpdateCachedProps
	let allPropsUpdatedCalled: Promise<boolean>

	beforeEach( async ()=>{
		datasource = new JsonDataSource({})
		Store.useDataSource( datasource )
		updateCachedProps = new UpdateCachedProps()
		allPropsUpdatedCalled = new Promise<boolean>( resolve => {
				updateCachedProps.onAllPropsUpdated( () => resolve( true ) )
		})
		handlers = updateCachedProps.installUpdaters()
	})

	afterEach( ()=>{
		updateCachedProps.unistallUpdaters()
	})

	it( 'should register handler for cached props', ()=>{
		expect( handlers ).toEqual( expect.arrayContaining([
			expect.objectContaining({ collectionPath: 'Child' }), 
			expect.objectContaining({ collectionPath: 'Root/a/Child' }),
		]))
		expect( handlers ).toHaveLength( 2 )
	})

	describe( 'Root collection with root prop', ()=>{

		beforeEach( async ()=>{
			datasource.setDataStore({
				Parent: { a: { id: 'a', __className: 'Parent', name: 'a', propInRootForRootCollection: { id: 'a2', __className: 'Child', name: 'a2', __documentReference: { storedInCollection: 'Child' } } }, b: { id: 'b', __className: 'Parent', name: 'b' }, c: { id: 'c', __className: 'Parent', name: 'c' } } as any,
				Child: { a2: { id: 'a2', __className: 'Child', name: 'a2' }, b2: { id: 'b2', __className: 'Child', name: 'b2' }, c2: { id: 'c2', __className: 'Child', name: 'c2' } } as any
			})
			modelParent = Store.getModel<Parent>( 'Parent' )
			modelChild = Store.getModel<Child>( 'Child' )

			parent = ( await modelParent.findById( 'a' ))!
			child = ( await modelChild.findById( 'a2' ))!
		})

		it( 'should update cached props on referenced object change', async ()=>{
			child.name = 'a2-updated'
			modelChild.save( child )

			await allPropsUpdatedCalled

			const updatedParent = ( await modelParent.findById( 'a' ))!
			expect( updatedParent.propInRootForRootCollection?.name ).toBe( 'a2-updated' )
		})
	})

	describe( 'Root collection with subcollection prop', ()=>{

		beforeEach( async ()=>{
			datasource.setDataStore({
				Parent: { a: { id: 'a', __className: 'Parent', name: 'a', propInSubcollectionForRootCollection: { id: 'a2', __className: 'Child', name: 'a2', __documentReference: { storedInCollection: 'Root/a/Child' } } }, b: { id: 'b', __className: 'Parent', name: 'b' }, c: { id: 'c', __className: 'Parent', name: 'c' } } as any,
				'Root/a/Child': { a2: { id: 'a2', __className: 'Child', name: 'a2' }, b2: { id: 'b2', __className: 'Child', name: 'b2' }, c2: { id: 'c2', __className: 'Child', name: 'c2' } } as any
			})

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
			modelParent = Store.getModel<Parent>( 'Parent' )
			modelChild = Store.getModel<Child>( 'Child' )

			parent = ( await modelParent.findById( 'a' ))!
			child = ( await modelChild.findById( 'a2' ))!
		})

		it( 'should notify before and after update', async ()=>{
			updateCachedProps.beforeUpdateDocument(( document: Parent, prop: PersistentProperty ) => {
				document.markAsSeverChange = true
			})
			const spy = vi.fn()
			updateCachedProps.afterUpdateDocument( spy)

			child.name = 'a2-updated'
			await modelChild.save( child )

			await allPropsUpdatedCalled

			const updatedParent = ( await modelParent.findById( 'a' ))!
			expect( updatedParent.propInRootForRootCollection?.name ).toBe( 'a2-updated' )
			expect( updatedParent.markAsSeverChange ).toBe( true )
			expect( spy ).toHaveBeenCalledTimes( 1 )
			expect( spy ).toHaveBeenCalledWith( expect.objectContaining({ id: 'a' }), expect.objectContaining({ name: 'propInRootForRootCollection' }) )
		})
	})

})