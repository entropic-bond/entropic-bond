import { SomeClassProps } from '../types/utility-types'
import { Persistent, persistent, persistentReference, persistentReferenceAt, registerClassFactory } from './persistent'

@registerClassFactory( 'PersistentClass', () => new PersistentClass() )
class PersistentClass extends Persistent {
	get persistentProp() { return this._persistentProp }
	@persistent _persistentProp: number
	@persistent _persistentArray: PersistentClass[]
	_nonPersistentProp: number
}

class NotRegistered extends Persistent {}

@registerClassFactory( 'Person', () => new Person() )
class Person extends Persistent {
	set name( value: string ) {
		this._name = value
	}

	get name() {
		return this._name
	}

	set salary( value: number ) {
		this._salary = value
	}

	get salary() {
		return this._salary
	}

	set doNotPersist( value: number ) {
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

	set skills( value: string[] ) {
		this._skills = value
	}

	get skills() {
		return this._skills
	}

	set arrayOfPersistent( value: PersistentClass[] ) {
		this._arrayOfPersistent = value
	}

	get arrayOfPersistent() {
		return this._arrayOfPersistent
	}

	set document( value: PersistentClass ) {
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
	
	@persistent private _name: string
	@persistent private _salary: number
	@persistent private _skills: string[]
	@persistent private _anObjectProperty: PersistentClass = new PersistentClass()
	@persistent private _arrayOfPersistent: PersistentClass[]
	@persistent _notRegistered: NotRegistered
	@persistent _arrayOfArray: number[][]
	@persistent _arrayOfPersistentArray: PersistentClass[][]
	@persistent _plainObject: { [ key: string ]: unknown }
	@persistentReference _document: PersistentClass
	@persistentReferenceAt('ArbitraryCollectionName') _docAtArbitraryCollection: PersistentClass
	@persistentReference private _arrayOfRefs: PersistentClass[] = []
	private _doNotPersist: number
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
		person = new Person()
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
		const a = new Person()
		const b = new PersistentClass()

		// we are testing a decorator that manipulates the class definition. 
		// Therefore we need to access the decorator created private properties
		// in order to test the behaviour of the decorator
		expect( a[ '_persistentProperties' ] ).toEqual( expect.arrayContaining( [ {
			name: '_name'
		} ] ) )
		expect( b[ '_persistentProperties' ] ).not.toEqual( expect.arrayContaining( [ {
			name: '_name'
		} ] ) )
		expect( a[ '_persistentProperties' ] ).not.toEqual( expect.arrayContaining( [ {
			name: '_persistentProp'
		} ] ) )
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

	it( 'should deal with undefined strings', ()=>{
		person.name = undefined
		expect( person.name ).toBeUndefined()

		expect( person.toObject().name ).toBeUndefined()

		delete obj.name
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

		it( 'should set loaded flag', ()=>{
			const obj = JSON.stringify( person.toObject() )
			const newPerson = new Person()

			expect( newPerson.wasLoaded ).toBeFalsy()

			newPerson.fromObject( JSON.parse( obj ) )

			expect( newPerson.wasLoaded ).toBeTruthy()
			expect( newPerson.anObjectProperty.wasLoaded ).toBeTruthy()
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
				new Person().fromObject( obj )
			}).toThrow( 'You should register class NotRegistered prior to use.' )
		})

		it( 'should persist array of Persistent type properties', ()=>{
			expect( newPerson.arrayOfPersistent[ 0 ] ).toBeInstanceOf( PersistentClass )
		})

		it( 'should persist persistent array of array of Persistent type properties', ()=>{
			expect( newPerson.arrayOfPersistent[ 0 ]._persistentArray[ 0 ] ).toBeInstanceOf( PersistentClass )
		})

		it( 'should persist array of array of Persistent type properties', ()=>{
			expect( newPerson._arrayOfPersistentArray[ 0 ][ 0 ] ).toBeInstanceOf( PersistentClass )
		})

		it( 'should persist properties of type Persistent in plain object', ()=>{
			expect( newPerson._plainObject.prop1 ).toBeInstanceOf( PersistentClass )
		})
	})

	describe( 'Document as reference', ()=>{
		let ref1: PersistentClass, ref2: PersistentClass

		beforeEach(()=>{
			person.document = new PersistentClass()
			person.document._persistentProp = 345
			person._docAtArbitraryCollection = new PersistentClass()
			person._docAtArbitraryCollection._persistentProp = 3989
			ref1 = new PersistentClass(); ref1._persistentProp = 2091
			ref2 = new PersistentClass(); ref2._persistentProp = 2092
			person.arrayOfRefs.push( ref1 )
			person.arrayOfRefs.push( ref2 )
			const obj = JSON.stringify( person.toObject() )
			newPerson = Persistent.createInstance<Person>( JSON.parse( obj ) )
		})

		it( 'should create an object at root level', ()=>{
			const persistentClassDocs = person.toObject().__rootCollections[ 'PersistentClass' ]

			expect( persistentClassDocs ).toEqual( expect.arrayContaining([
				expect.objectContaining({ persistentProp: 345 })
			]))
			expect( newPerson.document ).toBeInstanceOf( PersistentClass )
			expect( newPerson.document.persistentProp ).toBeUndefined()
		})

		it( 'should create root reference collection with arbitrary name', ()=>{
			const collectionDocs = person.toObject().__rootCollections[ 'ArbitraryCollectionName' ]

			expect( collectionDocs ).toEqual( expect.arrayContaining([
				expect.objectContaining({ persistentProp: 3989 })
			]))
			expect( newPerson._docAtArbitraryCollection ).toBeInstanceOf( PersistentClass )
			expect( newPerson._docAtArbitraryCollection.persistentProp ).toBeUndefined()
		})
		
		
		it( 'should read swallow object document as reference', ()=>{
			expect( newPerson.document ).toBeInstanceOf( PersistentClass )
			expect( newPerson.wasLoaded ).toBeTruthy()
			expect( newPerson.document.wasLoaded ).toBeFalsy()
			expect( newPerson.document.id ).toEqual( person.document.id )
			expect( newPerson.document.persistentProp ).toBeUndefined()
		})
		
		describe( 'Array of references', ()=>{
		
			it( 'should create an object with array of refs', ()=>{
				const obj = person.toObject()

				expect( obj.arrayOfRefs ).toHaveLength( 2 )
				expect( obj.arrayOfRefs[0] ).toEqual({
					__documentRef: {
						collection: 'PersistentClass',
						className: 'PersistentClass',
						id: ref1.id
					}
				})
			})

			it( 'should create root reference collection with references in array of references', ()=>{
				const persistentClassDocs = person.toObject().__rootCollections[ 'PersistentClass' ]

				expect( persistentClassDocs ).toEqual( expect.arrayContaining([
					expect.objectContaining({	id: ref1.id }),
					expect.objectContaining({	id: ref2.id }),
				]))
			})

			it( 'should deal with arrays of refs', ()=>{
				expect( newPerson.arrayOfRefs ).toHaveLength( 2 )
				expect( newPerson.arrayOfRefs[0].wasLoaded ).toBeFalsy()
				expect( newPerson.arrayOfRefs[0].persistentProp ).toBeUndefined()
				expect( newPerson.arrayOfRefs ).toEqual( expect.arrayContaining([ 
					expect.objectContaining({ id: ref1.id }),
					expect.objectContaining({ id: ref2.id })
				]))
			})
		})
		
	})
})
