import { Persistent, persistent, persistentReference, persistentReferenceAt, registerPersistentClass, persistentPureReferenceWithCachedProps, persistentReferenceWithCachedProps, registerLegacyClassName, searchableArray, required, requiredWithValidator } from './persistent'

interface InnerObject {
	nonPersistedReferences: PersistentClass[]
}
const beforeSerialize = vi.fn()
const afterDeserialize = vi.fn()

@registerLegacyClassName( 'LegacyClassName' )
@registerPersistentClass( 'PersistentClass' )
class PersistentClass extends Persistent {
	protected override beforeSerialize(): void { beforeSerialize() }
	protected override afterDeserialize(): void { afterDeserialize() }
	set persistentProp( val: number | undefined ) { this._persistentProp = val }
	get persistentProp() { return this._persistentProp }
	set personPureRef( value: Person | undefined ) { this._personPureRef = value }
	get personPureRef() { return this._personPureRef }
	set persistentArray( value: PersistentClass[] | undefined ) { this._persistentArray = value }
	get persistentArray() { return this._persistentArray }
	@persistent _persistentProp: number | undefined
	@persistent @searchableArray _persistentArray: PersistentClass[] | undefined
	@persistentPureReferenceWithCachedProps<Person>([ 'name', 'salary' ]) _personPureRef: Person | undefined
	_nonPersistentProp: number | undefined
}

// @ts-expect-error
persistentPureReferenceWithCachedProps<PersistentClass>([ 'persistentArray' ])

class NotRegistered extends Persistent {}

@registerPersistentClass( 'Person' )
class Person extends Persistent {
	protected override beforeSerialize(): void {
		beforeSerialize()
	}

	protected override afterDeserialize(): void {
		afterDeserialize()
	}

	set name( value: string | undefined ) {
		this._name = value
	}

	get name() {
		return this._name
	}

	set salary( value: number | undefined ) {
		this._salary = value
	}

	get salary() {
		return this._salary
	}

	set doNotPersist( value: number | undefined ) {
		this._doNotPersist = value
	}

	get doNotPersist() {
		return this._doNotPersist
	}

	set anObjectProperty( value: PersistentClass ) {
		this._anObjectProperty = value
	}

	get anObjectProperty() {
		return this._anObjectProperty
	}

	set skills( value: string[] | undefined ) {
		this._skills = value
	}

	get skills() {
		return this._skills
	}

	set arrayOfPersistent( value: PersistentClass[] | undefined ) {
		this._arrayOfPersistent = value
	}

	get arrayOfPersistent() {
		return this._arrayOfPersistent
	}

	set document( value: PersistentClass | undefined ) {
		this._document = value
	}

	get document() {
		return this._document
	}

	set arrayOfRefs(value: PersistentClass[]) {
		this._arrayOfRefs = value
	}
	
	get arrayOfRefs(): PersistentClass[] {
		return this._arrayOfRefs
	}
	
	set persistentObject( value: InnerObject | undefined ) {
		this._persistentObject = value
	}

	get persistentObject() {
		return this._persistentObject
	}

	@required @persistent private _name?: string
	@persistent private _salary?: number
	@requiredWithValidator(
		( val, propInfo, instace ) => !!val && val.length > 0 && propInfo.name === 'skills' && instace.id === 'person9'
	) @persistent private _skills: string[] | undefined
	@persistent private _anObjectProperty: PersistentClass = new PersistentClass()
	@persistent private _arrayOfPersistent: PersistentClass[] | undefined
	@persistent _notRegistered: NotRegistered | undefined
	@persistent _arrayOfArray: number[][] | undefined
	@persistent _arrayOfPersistentArray: PersistentClass[][] | undefined
	@persistent _plainObject: { [ key: string ]: unknown } | undefined
	@persistentReference _document: PersistentClass | undefined
	@persistentReferenceAt('ArbitraryCollectionName') _docAtArbitraryCollection: PersistentClass | undefined
	@persistentReferenceAt(( value, prop ) => `ArbitraryCollectionName/${ value.className }/${ prop.name }` ) _docAtArbitraryCollectionRefFunc: PersistentClass | undefined
	@persistentReference private _arrayOfRefs: PersistentClass[] = []
	@persistent private _persistentObject: InnerObject | undefined
	@persistentReferenceWithCachedProps<PersistentClass>([ 'persistentProp' ], value => `ArbitraryCollectionName/${ value.className }` ) _referenceWithStoredValues: PersistentClass | undefined
	private _doNotPersist: number | undefined
}


interface	CustomAnnotation {
	menu: string 
	subType: string
	showInDashboard: boolean
}

@registerPersistentClass( 'WithAnnotations', { 
	menu: 'main', 
	subType: 'NiceClass',
	showInDashboard: false
} as CustomAnnotation )
export class WithAnnotations extends PersistentClass {}

@registerPersistentClass( 'WithAnnotations2', { 
	menu: 'main', 
	subType: 'UglyClass',
	showInDashboard: false
}as CustomAnnotation)
export class WithAnnotations2 extends PersistentClass {}

@registerPersistentClass( 'WithAnnotations3', { 
	menu: 'subMenu', 
	showInDashboard: true
}as CustomAnnotation)
export class WithAnnotations3 extends PersistentClass {}


abstract class AbstractClass extends Persistent {
	abstract pp(): any
}

@registerPersistentClass( 'ConcreteClass' )
class ConcreteClass extends AbstractClass {
	pp(){}
}

@registerPersistentClass( 'ErrorProducer' )
class ErrorProducer extends Persistent {
	@persistentPureReferenceWithCachedProps<PersistentClass>([ 'persistentProp' ]) _errors: string[] = []
}

describe( 'Persistent', ()=>{
	let person: Person
	let newPerson: Person
	let obj = {
		__className: 'Person',
		name: 'Lisa',
		salary: 2500,
		skills: [ 'lazy', 'messy' ],
		arrayOfArray: [ [ 5, 6 ], [ 7, 8 ] ],
		plainObject: {
			prop1: 'prop1',
			prop2: 3
		}
	}

	beforeEach(()=>{
		person = new Person( 'person1' )
		person.name = 'Maria'
		person.salary = 3000
		person.skills = [ 'diligent', 'smart' ]
		person._arrayOfArray = [ [ 1, 2 ], [ 3, 4 ] ]
		person._plainObject = {
			prop1: 'aProp1',
			prop2: 1034
		}
		newPerson = Persistent.createInstance<Person>( obj )
	})

	it( 'should keep a persistent properties list for each class', ()=>{
		const a = new Person( 'person2' )
		const b = new PersistentClass()

		// we are testing a decorator that manipulates the class definition. 
		// Therefore we need to access the decorator created private properties
		// in order to test the behaviour of the decorator
		expect( a[ '_persistentProperties' ] ).toEqual( expect.arrayContaining([
			{ name: '_name', validator: expect.any( Function ) },
			{ name: '_skills', validator: expect.any( Function ) }
		]))
		expect( b[ '_persistentProperties' ] ).not.toEqual( expect.arrayContaining( [ expect.objectContaining({
			name: '_name'
		})]))
		expect( a[ '_persistentProperties' ] ).not.toEqual( expect.arrayContaining([ expect.objectContaining({
			name: '_persistentProp'
		})]))
		expect( b[ '_persistentProperties' ] ).toEqual( expect.arrayContaining( [ {
			name: '_persistentProp'
		} ] ) )
	})

	it( 'should provide a flat object with persistent properties', ()=>{
		expect( person.name ).toEqual( 'Maria' )
		expect( person.toObject().name ).toEqual( 'Maria' )
	})

	it( 'should set persistent properties from a flat object', ()=>{
		person.fromObject( obj )

		expect( person.name ).toEqual( 'Lisa' )
		expect( person.salary ).toBe( 2500 )
	})

	it( 'should process number object even when undefined', ()=>{
		person.salary = undefined
		expect( person.salary ).toBeUndefined()

		person.fromObject( obj )
		expect( person.salary ).toBe( 2500 )
	})

	it( 'should fill properties from arbitrary object', ()=>{
		person.name = 'meganito'
		person.salary = 32
		person.fromObject({
			name: 'fulanito changed',
			salary: 4839,
			foo: 'bar'
		})

		expect( person.name ).toBe( 'fulanito changed' )
		expect( person.salary ).toBe( 4839 )
		expect( (person as any).foo ).not.toBeDefined()
	})

	it( 'should persist number with value of 0', ()=>{
		person.salary = 0
		const object = person.toObject()

		expect( object.salary ).toBe( 0 )
		
		const newPerson = new Person( 'person3' )
		newPerson.fromObject( object )
		expect( newPerson.salary ).toBe( 0 )
	})

	it( 'should deal with undefined strings', ()=>{
		person.name = undefined
		expect( person.name ).toBeUndefined()

		expect( person.toObject().name ).toBeUndefined()

		delete (obj as any).name
		person.fromObject( obj )
		expect( person.name ).toBeUndefined()
	})

	it( 'should persist array properties', ()=>{
		expect( person.toObject().skills ).toEqual( [ 'diligent', 'smart' ] )
	})

	it( 'should read arrays from stream', ()=>{
		expect( newPerson.skills ).toEqual( [ 'lazy', 'messy' ] )
	})

	it( 'should persist array of array properties', ()=>{
		const obj: any = person.toObject()
		expect( obj.arrayOfArray ).toEqual( [ [ 1, 2 ], [ 3, 4 ] ] )
	})

	it( 'should read arrays of array from stream', ()=>{
		expect( newPerson._arrayOfArray ).toEqual( [ [ 5, 6 ], [ 7, 8 ] ] )
	})

	it( 'should persist plain object properties', ()=>{
		const obj: any = person.toObject()
		expect( obj.plainObject ).toEqual( {
			prop1: 'aProp1',
			prop2: 1034
		})
	})

	it( 'should read plain objects from stream', ()=>{
		expect( newPerson._plainObject ).toEqual( {
			prop1: 'prop1',
			prop2: 3
		})
	})

	it( 'should deal with undefined values', ()=>{
		obj.plainObject.prop1 = undefined as any
		obj.plainObject.prop2 = null as any
		let aPerson: Person

		expect( ()=>{ aPerson = new Person( 'person4' ).fromObject( obj ) } ).not.toThrow()
		aPerson = new Person( 'person4' ).fromObject( obj )
		expect( aPerson._plainObject!.prop1 ).toBeUndefined()
		expect( aPerson._plainObject!.prop2 ).toBeNull()
	})

	it( 'should not throw on null property when toObject', ()=>{
		newPerson._plainObject!.prop1 = null

		expect( ()=>{
			newPerson.toObject()
		}).not.toThrow()
	})

	it( 'should not throw on null property when toObject', ()=>{
		newPerson._plainObject!.prop1 = undefined

		expect( ()=>{
			newPerson.toObject()
		}).not.toThrow()
	})

	it( 'should throw with object info if not available on creating a persistent instance', ()=>{
		expect(()=>{
			Persistent.createInstance({ id: 'id' } as any )
		}).toThrow( 'You should provide a class name.' )
	})

	it( 'should clone persistent properties of an instance into this instance', ()=>{
		const instace = new Person( 'personId' )
		instace.clone( person )

		expect( instace.id ).toBe( 'personId' )
		expect( instace.name ).toBe( 'Maria')
	})
	

	describe( 'Properties instance of Persistent type', ()=>{
		beforeEach(()=>{
			const subObject = new PersistentClass()
			subObject._persistentProp = 23
			const subObject2 = new PersistentClass()
			subObject._persistentProp = 103

			const a = new PersistentClass(), b = new PersistentClass()
			a._persistentProp = 205
			b._persistentProp = 206
			subObject._persistentArray = [ a, b ]

			person.anObjectProperty = subObject
			person.arrayOfPersistent = [ subObject, subObject2 ]
			person._arrayOfPersistentArray = [ [ subObject, subObject2 ], [ subObject2, subObject ] ]
			person._plainObject = {
				prop1: subObject,
				prop2: subObject2
			}

			const obj = JSON.stringify( person.toObject() )
			newPerson = Persistent.createInstance<Person>( JSON.parse( obj ) )
		})

		it( 'should return compound objects as instance of object class', ()=>{
			expect( newPerson.anObjectProperty ).toBeInstanceOf( PersistentClass )
		})

		it( 'should throw if class not registered on writing to a stream', ()=>{
			person._notRegistered = new NotRegistered()

			expect(()=>{
				person.toObject()
			}).toThrow( 'You should register this class prior to streaming it.' )
		})

		it( 'should throw if class not registered on reading from stream', ()=>{
			const obj: any = {
				id: 'id',
				anObjectProperty: { __className: 'NotRegistered' }
			}

			expect(()=>{
				new Person( 'person5' ).fromObject( obj )
			}).toThrow( 'You should register class NotRegistered prior to use.' )
		})

		it( 'should persist array of Persistent type properties', ()=>{
			expect( newPerson.arrayOfPersistent?.[ 0 ] ).toBeInstanceOf( PersistentClass )
		})

		it( 'should persist persistent array of array of Persistent type properties', ()=>{
			expect( newPerson.arrayOfPersistent?.[ 0 ]?._persistentArray?.[ 0 ] ).toBeInstanceOf( PersistentClass )
		})

		it( 'should persist array of array of Persistent type properties', ()=>{
			expect( newPerson._arrayOfPersistentArray?.[ 0 ]?.[ 0 ] ).toBeInstanceOf( PersistentClass )
		})

		it( 'should persist properties of type Persistent in plain object', ()=>{
			expect( newPerson._plainObject?.prop1 ).toBeInstanceOf( PersistentClass )
		})

		it( 'should return registered properties', ()=>{
			expect( new PersistentClass().getPersistentProperties() ).toEqual([
				{ name: 'id' }, 
				{ name: 'persistentProp' }, 
				{ name: 'persistentArray', searchableArray: true },
				{ name: 'personPureRef', isReference: true, isPureReference: true, cachedProps: [ 'name', 'salary' ] }
			])

			expect( new Person( 'person6' ).getPersistentProperties() ).toEqual( expect.arrayContaining([
				{ name: 'name', validator: expect.any( Function ) },
				{ name: 'document', isReference: true },
				{ name: 'docAtArbitraryCollection', isReference: true, storeInCollection: 'ArbitraryCollectionName' }
			]))
		})
		
	})

	describe( 'Document as reference', ()=>{
		let ref1: PersistentClass, ref2: PersistentClass

		beforeEach(()=>{
			person.document = new PersistentClass()
			person.document._persistentProp = 345
			person._docAtArbitraryCollection = new PersistentClass()
			person._docAtArbitraryCollection._persistentProp = 3989
			person._docAtArbitraryCollectionRefFunc = person._docAtArbitraryCollection
			ref1 = new PersistentClass(); ref1._persistentProp = 2091
			ref2 = new PersistentClass(); ref2._persistentProp = 2092
			person.arrayOfRefs.push( ref1 )
			person.arrayOfRefs.push( ref2 )
			person._referenceWithStoredValues = new PersistentClass(); person._referenceWithStoredValues._persistentProp = 2093
			const obj = JSON.stringify( person.toObject() )
			newPerson = Persistent.createInstance<Person>( JSON.parse( obj ) )
		})

		it( 'should create an object at root level', ()=>{
			const persistentClassDocs = person.toObject().__rootCollections?.[ 'PersistentClass' ]

			expect( persistentClassDocs ).toEqual( expect.arrayContaining([
				expect.objectContaining({ persistentProp: 345 })
			]))
			expect( newPerson.document ).toBeInstanceOf( PersistentClass )
			expect( newPerson.document?.persistentProp ).toBeUndefined()
		})

		it( 'should create root reference collection with arbitrary name', ()=>{
			const collectionDocs = person.toObject().__rootCollections?.[ 'ArbitraryCollectionName' ]

			expect( collectionDocs ).toEqual( expect.arrayContaining([
				expect.objectContaining({ persistentProp: 3989 })
			]))
			expect( newPerson._docAtArbitraryCollection ).toBeInstanceOf( PersistentClass )
			expect( newPerson._docAtArbitraryCollection?.persistentProp ).toBeUndefined()
		})
		
		it( 'should create root reference collection with arbitrary name based on function call', ()=>{
			const collectionDocs = person.toObject().__rootCollections?.[ 'ArbitraryCollectionName/PersistentClass/_docAtArbitraryCollectionRefFunc' ]
			expect( collectionDocs	).toBeDefined()

			expect( collectionDocs ).toEqual( expect.arrayContaining([
				expect.objectContaining({ persistentProp: 3989 })
			]))
			expect( newPerson._docAtArbitraryCollection ).toBeInstanceOf( PersistentClass )
			expect( newPerson._docAtArbitraryCollection?.persistentProp ).toBeUndefined()
		})
		

		it( 'should not create root reference for existing references', ()=>{
			expect( Object.values(
				newPerson.toObject().__rootCollections as any
			)).toHaveLength( 1 )
		})
		
		it( 'should read swallow object document as reference', ()=>{
			expect( newPerson.document ).toBeInstanceOf( PersistentClass )
			expect( newPerson.document?.id ).toEqual( person.document?.id )
			expect( newPerson.document?.['__documentReference'] ).toEqual({
				storedInCollection: 'PersistentClass'
			})
			expect( newPerson.document?.persistentProp ).toBeUndefined()
		})

		it( 'should save existing refs properly', ()=>{
			const res = newPerson.toObject()

			expect( res.document ).not.toBeInstanceOf( PersistentClass )
			expect( res.document ).toEqual({
				__className: 'PersistentClass',
				id: newPerson.document?.id,
				__documentReference: { storedInCollection: 'PersistentClass' },
			})
		})

		it( 'should not store pure references', ()=>{
			person.anObjectProperty.personPureRef = new Person( 'person7' )
			const obj = person.toObject()

			expect( obj.__rootCollections?.['Person'] ).toHaveLength( 1 )
			expect( obj.__rootCollections?.['Person']?.[0]?.id ).not.toEqual( 'person7' )
		})
			
		it( 'should fill reference object when store pure reference', ()=>{
			const personPureRef =new Person( 'person7' )
			personPureRef.name = 'James'
			personPureRef.salary = 5643
			person.anObjectProperty.personPureRef = personPureRef
			const obj = person.toObject()

			expect( obj.anObjectProperty?.personPureRef ).toEqual({
				__className: 'Person',
				id: personPureRef.id,
				__documentReference: { storedInCollection: 'Person' },
				name: 'James',
				salary: 5643
			})
			
			expect( obj.__rootCollections?.Person?.[ 0 ]?.['anObjectProperty'].personPureRef ).toEqual({
				__className: 'Person',
				id: personPureRef.id,
				__documentReference: { storedInCollection: 'Person' },
				name: 'James',
				salary: 5643
			})
		})

		it( 'should NOT fill reference object when store pure reference and value is undefined', ()=>{
			const personPureRef =new Person( 'person7' )
			personPureRef.name = undefined
			personPureRef.salary = 5643
			person.anObjectProperty.personPureRef = personPureRef
			const obj = person.toObject()

			expect( obj.anObjectProperty?.personPureRef ).toEqual({
				__className: 'Person',
				id: personPureRef.id,
				__documentReference: { storedInCollection: 'Person' },
				salary: 5643
			})
			expect( obj.anObjectProperty?.personPureRef ).not.toHaveProperty( 'name' )
		})

		it( 'should create an instance from pure reference with the referenced persistent props', ()=>{
			const personPureRef =new Person( 'person7' )
			personPureRef.name = 'James'
			personPureRef.salary = 5643
			person.anObjectProperty.personPureRef = personPureRef
			const obj = person.toObject()
			const instance = Persistent.createInstance( obj )

			expect( instance.anObjectProperty.personPureRef ).toBeInstanceOf( Person )
			expect( instance.anObjectProperty.personPureRef?.name ).toEqual( 'James' )
			expect( instance.anObjectProperty.personPureRef?.salary ).toBe( 5643 )
		})
		

		it( 'should store values of persistentReferenceWithCachedProps', ()=>{
			const obj = person.toObject()

			expect( obj.__rootCollections?.Person?.[0]?.id ).toEqual( person.id )
			expect( obj['referenceWithStoredValues'] ).toEqual({
				__className: 'PersistentClass',
				id: person._referenceWithStoredValues?.id,
				__documentReference: { storedInCollection: 'ArbitraryCollectionName/PersistentClass' },
				persistentProp: 2093
			})
			
			const referenceWithValuesInRootCollections = obj.__rootCollections?.['ArbitraryCollectionName/PersistentClass']?.find( 
				persistent => persistent.id === person._referenceWithStoredValues?.id 
			)

			expect( referenceWithValuesInRootCollections ).toEqual({
				__className: 'PersistentClass',
				id: person._referenceWithStoredValues?.id,
				persistentProp: 2093
			})
		})

		it( 'should not store values of persistentReferenceWithCachedProps if value is undefined', ()=>{
			person._referenceWithStoredValues!.persistentProp = undefined as any
			const obj = person.toObject()

			expect( obj['referenceWithStoredValues'] ).toEqual({
				__className: 'PersistentClass',
				id: person._referenceWithStoredValues?.id,
				__documentReference: { storedInCollection: 'ArbitraryCollectionName/PersistentClass' },
			})
			expect( obj['referenceWithStoredValues'] ).not.toHaveProperty( 'persistentProp' )
		})

		it( 'should create an instance from reference with the referenced persistent props', ()=>{
			const obj = person.toObject()
			const instance = Persistent.createInstance( obj )

			expect( instance._referenceWithStoredValues ).toBeInstanceOf( PersistentClass )
			expect( instance._referenceWithStoredValues?.persistentProp ).toBe( 2093 )
		})

		describe( 'Array of references', ()=>{
		
			it( 'should create an object with array of refs', ()=>{
				const obj = person.toObject()

				expect( obj.arrayOfRefs ).toHaveLength( 2 )
				expect( obj.arrayOfRefs?.[0] ).toEqual({
					id: ref1.id,
					__className: 'PersistentClass',
					__documentReference: {
						storedInCollection: 'PersistentClass'
					}
				})
			})

			it( 'should create root reference collection with references in array of references', ()=>{
				const persistentClassDocs = person.toObject().__rootCollections?.[ 'PersistentClass' ]

				expect( persistentClassDocs ).toEqual( expect.arrayContaining([
					expect.objectContaining({	id: ref1.id }),
					expect.objectContaining({	id: ref2.id }),
				]))
			})

			it( 'should deal with arrays of refs', ()=>{
				expect( newPerson.arrayOfRefs ).toHaveLength( 2 )
				expect( newPerson.arrayOfRefs[0]?.persistentProp ).toBeUndefined()
				expect( newPerson.arrayOfRefs ).toEqual( expect.arrayContaining([ 
					expect.objectContaining({ 
						id: ref1.id,
						__className: 'PersistentClass',
						__documentReference: {
							storedInCollection: 'PersistentClass'
						}
					}),
					expect.objectContaining({ 
						id: ref2.id,
						__className: 'PersistentClass',
						__documentReference: {
							storedInCollection: 'PersistentClass'
						}
					})
				]))
			})

			it( 'should produce proper formed references from object', ()=>{
				const personObj = person.toObject()

				personObj.persistentObject = {
					nonPersistedReferences: [{
						id: ref1.id,
						__className: 'PersistentClass',
						__documentReference: {
							storedInCollection: 'PersistentClass'
						}
					} as any ]
				}

				const newPerson = Persistent.createInstance<Person>( personObj )

				const obj = newPerson.toObject()
				expect( obj.persistentObject?.nonPersistedReferences ).toHaveLength( 1 )
				expect( obj.persistentObject?.nonPersistedReferences[0]?.id ).toBeDefined()
				expect( obj.persistentObject?.nonPersistedReferences[0]?.['__className'] ).toBeDefined()
				expect( obj.persistentObject?.nonPersistedReferences[0]?.['__documentReference'] ).toBeDefined()
				expect( obj.persistentObject?.nonPersistedReferences[0]?.persistentProp ).not.toBeDefined()
			})
		})
		
	})

	describe( 'Annotations', ()=>{

		it( 'should allow register persistent class with arbitrary annotations', ()=>{
			expect( Persistent.annotations( WithAnnotations ) ).toEqual({
				menu: 'main', 
				subType: 'NiceClass',
				showInDashboard: false
			})
		})

		it( 'should check if a property is required', ()=>{
			const person = new Person( 'person8' )
			expect( person.isRequired( 'name' ) ).toBe( true )
			expect( person.isRequired( 'salary' ) ).toBe( false )
		})

		it( 'should validate non required properties', ()=>{
			const person = new Person( 'person9' )
			expect( person.isPropValueValid('salary') ).toBeTruthy()
		})

		it( 'should validate a required properties', ()=>{
			const person = new Person( 'person9' )
			person.name = 'A test name'
			expect( person.isPropValueValid('name') ).toBeTruthy()
		})

		it( 'should fail validation of an empty required properties', ()=>{
			const person = new Person( 'person9' )
			expect( person.isPropValueValid('name') ).toBeFalsy()
		})

		it( 'should fail validation of an empty required with validator properties', ()=>{
			const person = new Person( 'person9' )
			expect( person.isPropValueValid('skills') ).toBeFalsy()
		})

		it( 'should fail validation of an non passing validator properties', ()=>{
			const person = new Person( 'person9' )
			person.skills = []
			expect( person.isPropValueValid('skills') ).toBeFalsy()
		})

		it( 'should pass validation of a filled required with validator properties', ()=>{
			const person = new Person( 'person9' )
			person.skills = [ 'a skill' ]
			expect( person.isPropValueValid('skills') ).toBeTruthy()
		})
	})

	describe( 'Persistent Class collection retrieval', ()=>{

		it( 'should retrieve all registered classes by class name', ()=>{
			expect( Persistent.registeredClasses() ).toHaveLength( 7 )
			expect( Persistent.registeredClasses() ).toContain( 'Person' )
			expect( Persistent.registeredClasses() ).toContain( 'PersistentClass' )
			expect( Persistent.registeredClasses() ).toContain( 'LegacyClassName' )
		})
		
		it( 'should retrieve classes by type', ()=>{
			expect( Persistent.classesExtending( PersistentClass ) ).toHaveLength( 5 )
			expect( Persistent.classesExtending( PersistentClass ) ).toContain( 'PersistentClass' )
			expect( Persistent.classesExtending( PersistentClass ) ).toContain( 'LegacyClassName' )
			expect( Persistent.classesExtending( PersistentClass ) ).toContain( 'WithAnnotations' )
			expect( Persistent.classesExtending( PersistentClass ) ).toContain( 'WithAnnotations3' )
		})

		it( 'should retrieve classes by abstract class', ()=>{
			expect( Persistent.classesExtending( AbstractClass ) ).toHaveLength( 1 )
			expect( Persistent.classesExtending( AbstractClass ) ).toContain( 'ConcreteClass' )
		})
		
		it( 'should retrieve property info', ()=>{
			expect( Persistent.propInfo<Person>( 'Person', 'name' ) ).toEqual({
				name: 'name', validator: expect.any( Function )
			})
		})
	})

	describe( 'Persistent instantation', ()=>{

		it( 'should create an instance of a registered class', ()=>{
			const instance = Persistent.createInstance({ __className: 'PersistentClass', id: 'testPersistent' } )
			expect( instance ).toBeInstanceOf( PersistentClass )
			expect( instance.id ).toEqual( 'testPersistent' )
		})

		it( 'should create an instance of a registered legacy class', ()=>{
			const instance = Persistent.createInstance({ __className: 'LegacyClassName', id: 'testPersistent' } )
			expect( instance ).toBeInstanceOf( PersistentClass )
			expect( instance.id ).toEqual( 'testPersistent' )
		})

		it( 'should not create persistent objects with legacy name', ()=>{
			const instance = new PersistentClass( 'testPersistent' )

			expect( instance.toObject().__className ).toBe( 'PersistentClass' )
		})

		it( 'should create a reference from a plain object', ()=>{
			const instance = Persistent.createReference({ __className: 'PersistentClass', id: 'testPersistent', __documentReference:{ storedInCollection: 'PersistentClass' } } )
			expect( instance ).toBeInstanceOf( PersistentClass )
			expect( instance.id ).toEqual( 'testPersistent' )
			expect( instance['__documentReference'] ).toEqual({ storedInCollection: 'PersistentClass' })
		})

		it( 'should create a reference from a plain object without explicit __documentReference object', ()=>{
			const instance = Persistent.createReference({ __className: 'PersistentClass', id: 'testPersistent' } )
			expect( instance ).toBeInstanceOf( PersistentClass )
			expect( instance.id ).toEqual( 'testPersistent' )
			expect( instance['__documentReference'] ).toEqual({ storedInCollection: 'PersistentClass' })
		})

	})

	describe( 'Before and after serialize hooks', ()=>{
		beforeEach(()=>{
			beforeSerialize.mockReset()
			afterDeserialize.mockReset()
		})

		it( 'should call beforeSerialize hook', ()=>{
			person.toObject()
			expect( beforeSerialize ).toHaveBeenCalledTimes( 2 )
		})

		it( 'should call afterDeserialize hook', ()=>{
			const obj = person.toObject()
			Persistent.createInstance<Person>( obj )
			expect( afterDeserialize ).toHaveBeenCalledTimes( 2 )
		})
	})

	describe( 'Make array field searchable by property', ()=>{
		it( 'should create a searchable array field', ()=>{
			const instance = new PersistentClass( 'testPersistent' )
			instance.persistentArray = [
				new PersistentClass( 'testPersistent0' ),
				new PersistentClass( 'testPersistent1' ),
				new PersistentClass( 'testPersistent2' ),
			]
			const obj = instance.toObject()

			expect( obj[Persistent.searchableArrayNameFor( 'persistentArray' )] ).toEqual([
				'testPersistent0',
				'testPersistent1',
				'testPersistent2',
			])
		})
	})

	describe( 'Cached props in references', ()=>{
		it( 'should retrieve cached props', ()=>{
			const props = Persistent.getSystemRegisteredReferencesWithCachedProps()
			expect( props ).toEqual({
				LegacyClassName: [	expect.objectContaining({ cachedProps: [ 'name', 'salary' ] }) ],
				PersistentClass: [	expect.objectContaining({ cachedProps: [ 'name', 'salary' ] }) ],
				Person: [	expect.objectContaining({ cachedProps: [ 'persistentProp' ] }) ],
				WithAnnotations: [	expect.objectContaining({ cachedProps: [ 'name', 'salary' ] }) ],
				WithAnnotations2: [	expect.objectContaining({ cachedProps: [ 'name', 'salary' ] }) ],
				WithAnnotations3: [	expect.objectContaining({ cachedProps: [ 'name', 'salary' ] }) ],
				ErrorProducer: [	expect.objectContaining({ cachedProps: [ 'persistentProp' ] }) ],
			})
		})

		it( 'should throw when cached props are of an array type', ()=>{
			expect(()=>{
				new ErrorProducer().toObject()
			}).toThrow( 'Cached props are not allowed in array references' )
		})
	})
})
