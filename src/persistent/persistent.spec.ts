import { Persistent, persistent, persistentCollection, registerClassFactory } from './persistent';

@registerClassFactory( 'APersistentClass', ()=>new APersistentSubClass() )
class APersistentSubClass extends Persistent {
	@persistent _persistentProp: number
	@persistent _persistentArray: APersistentSubClass[]
	_nonPersistentProp: number
}

class NotRegistered extends Persistent {}

@registerClassFactory( 'Person', ()=> new Person() )
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

	set anObjectProperty( value: APersistentSubClass ) {
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

	set arrayOfPersistent( value: APersistentSubClass[] ) {
		this._arrayOfPersistent = value
	}

	get arrayOfPersistent() {
		return this._arrayOfPersistent
	}

	set subCollection( value: APersistentSubClass ) {
		this._subCollection = value
	}

	get subCollection() {
		return this._subCollection
	}

	@persistent private _name: string;
	@persistent private _salary: number;
	@persistent private _skills: string[]
	@persistent private _anObjectProperty: APersistentSubClass = new APersistentSubClass()
	@persistent private _arrayOfPersistent: APersistentSubClass[]
	@persistent _notRegistered: NotRegistered
	@persistent _arrayOfArray: number[][]
	@persistent _arrayOfPersistentArray: APersistentSubClass[][]
	@persistent _plainObject: { [ key: string ]: unknown }
	@persistentCollection _subCollection: APersistentSubClass
	private _doNotPersist: number;
}

describe( 'Persistent', ()=>{
	let person: Person;
	let obj = {
		name: 'Lisa',
		salary: 2500,
		skills: [ 'lazy', 'messy' ],
		arrayOfArray: [ [5,6], [7,8] ],
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
		person._arrayOfArray = [ [1,2], [3,4] ]
		person._plainObject = {
			prop1: 'aProp1',
			prop2: 1034
		}
		person.subCollection = new APersistentSubClass()
		person.subCollection._persistentProp = 345
	});


	it( 'should provide a flat object with persistent properties', ()=>{
		expect( person.name ).toEqual( 'Maria' );
		expect( person.toObject().name ).toEqual( 'Maria' );
	})

	it( 'should set persistent properties from a flat object', ()=>{
		person.fromObject( obj );

		expect( person.name ).toEqual( 'Lisa' );
		expect( person.salary ).toBe( 2500 );
	})

	it( 'should process number object even when undefined', ()=>{
		person.salary = undefined;
		expect( person.salary ).toBeUndefined();

		person.fromObject( obj );
		expect( person.salary ).toBe( 2500 );
	})

	it( 'should deal with undefined strings', ()=>{
		person.name = undefined;
		expect( person.name ).toBeUndefined();

		expect( person.toObject().name ).toBeUndefined()

		delete obj.name;
		person.fromObject( obj );
		expect( person.name ).toBeUndefined();
	})

	it( 'should persist array properties', ()=>{
		expect( person.toObject().skills ).toEqual([ 'diligent', 'smart' ])
	})

	it( 'should read arrays from stream', ()=>{
		const newPerson = new Person().fromObject( obj )
		expect( newPerson.skills ).toEqual([ 'lazy', 'messy' ])
	})

	it( 'should persist array of array properties', ()=>{
		const obj: any = person.toObject()
		expect( obj.arrayOfArray ).toEqual([ [1,2], [3,4] ])
	})

	it( 'should read arrays of array from stream', ()=>{
		const newPerson = new Person().fromObject( obj )
		expect( newPerson._arrayOfArray ).toEqual([ [5,6], [7,8] ])
	})
	
	it( 'should persist plain object properties', ()=>{
		const obj: any = person.toObject()
		expect( obj.plainObject ).toEqual({
			prop1: 'aProp1',
			prop2: 1034
		})
	})

	it( 'should read plain objects from stream', ()=>{
		const newPerson = new Person().fromObject( obj )
		expect( newPerson._plainObject ).toEqual({
			prop1: 'prop1',
			prop2: 3
		})
	})

	describe( 'Properties instance of Persistent type', ()=>{
		beforeEach(()=>{
			const subObject = new APersistentSubClass()
			subObject._persistentProp = 23
			const subObject2 = new APersistentSubClass()
			subObject._persistentProp = 103

			const a = new APersistentSubClass(), b = new APersistentSubClass()
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
		})

		it( 'should return compound objects as instance of object class', ()=>{
			const obj = JSON.stringify( person.toObject() )
			const newPerson = new Person()
			newPerson.fromObject( JSON.parse( obj ) )

			expect( newPerson.anObjectProperty ).toBeInstanceOf( APersistentSubClass )
		})

		it( 'should throw if class not registered on writing to a stream', ()=>{
			person._notRegistered = new NotRegistered()

			expect( ()=>{
				person.toObject()
			}).toThrow( 'You should register this class prior to streaming it.')
		})

		it( 'should throw if class not registered on reading from stream', ()=>{
			const obj: any = {
				id: 'id',
				anObjectProperty: { __className: 'NotRegistered' }
			}

			expect( ()=>{
				new Person().fromObject( obj )
			}).toThrow( 'You should register class NotRegistered prior to use.' )
		})

		it( 'should persist array of Persistent type properties', ()=>{
			const obj = JSON.stringify( person.toObject() )
			const newPerson = new Person()
			newPerson.fromObject( JSON.parse( obj ) )

			expect( newPerson.arrayOfPersistent[0] ).toBeInstanceOf( APersistentSubClass )

		})

		it( 'should persist persistent array of array of Persistent type properties', ()=>{
			const obj = JSON.stringify( person.toObject() )
			const newPerson = new Person()
			newPerson.fromObject( JSON.parse( obj ) )

			expect( newPerson.arrayOfPersistent[0]._persistentArray[0] ).toBeInstanceOf( APersistentSubClass )

		})

		it( 'should persist array of array of Persistent type properties', ()=>{
			const obj = JSON.stringify( person.toObject() )
			const newPerson = new Person()
			newPerson.fromObject( JSON.parse( obj ) )

			expect( newPerson._arrayOfPersistentArray[0][0] ).toBeInstanceOf( APersistentSubClass )
		})

		it( 'should persist properties of type Persistent in plain object', ()=>{
			const obj = JSON.stringify( person.toObject() )
			const newPerson = new Person()
			newPerson.fromObject( JSON.parse( obj ) )

			expect( newPerson._plainObject.prop1 ).toBeInstanceOf( APersistentSubClass )
		})
	})

	describe( 'SubCollection', ()=>{
		it( 'should mark subcollection object as subcollection', ()=>{
			const obj = person.toObject()

			expect( obj.subCollection[ '__isCollection' ] ).toBeTruthy()
		})
	})
})
