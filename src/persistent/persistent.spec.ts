import { SomeClassProps } from '../types/utility-types';
import { Persistent, persistent, registerClassFactory } from './persistent';

@registerClassFactory( 'APersistentClass', ()=>new APersistentSubClass() )
class APersistentSubClass extends Persistent {
	@persistent _persistentProp: number
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

	@persistent private _name: string;
	@persistent private _salary: number;
	@persistent private _skills: string[]
	@persistent private _anObjectProperty: APersistentSubClass = new APersistentSubClass()
	@persistent private _arrayOfPersistent: APersistentSubClass[]
	@persistent _notRegistered: NotRegistered
	private _doNotPersist: number;
}

describe( 'Persistent', ()=>{
	let person: Person;
	let obj = {
		name: 'Lisa',
		salary: 2500,
		skills: [ 'lazy', 'messy' ]
	}

	beforeEach(()=>{
		person = new Person()
		person.name = 'Maria'
		person.salary = 3000;
		person.skills = [ 'diligent', 'smart' ]
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
	
	describe( 'Properties instance of Persistent type', ()=>{
		beforeEach(()=>{
			const subObject = new APersistentSubClass()
			subObject._persistentProp = 23
			const subObject2 = new APersistentSubClass()
			subObject._persistentProp = 103

			person.anObjectProperty = subObject
			person.arrayOfPersistent = [ subObject, subObject2 ]
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

		it( 'should persist array of array of Persistent type properties', ()=>{
			const obj = JSON.stringify( person.toObject() )
			const newPerson = new Person()
			newPerson.fromObject( JSON.parse( obj ) )

			expect( newPerson.arrayOfPersistent[0][0] ).toBeInstanceOf( APersistentSubClass )

		})
	})
})
