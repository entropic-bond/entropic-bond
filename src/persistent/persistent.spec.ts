import { Persistent, persistent, registerClassFactory } from './persistent';

class NotRegistered {
	value: number
}

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

	set notRegistered( value: NotRegistered ) {
		this._notRegistered = value
	}

	get notRegistered() {
		return this._notRegistered
	}

	@persistent private _name: string;
	@persistent private _salary: number;
	@persistent private _notRegistered: NotRegistered = new NotRegistered()
	private _doNotPersist: number;
}

describe( 'Persistent', ()=>{
	let person: Person;
	let obj = {
		name: 'Lisa',
		salary: 2500
	}

	beforeEach(()=>{
		person = new Person()
		person.name = 'Maria'
		person.salary = 3000;
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

	it( 'should deal with null number values', ()=>{
		person.salary = null;
		expect( person.salary ).toBeNull();

		expect( person.toObject().salary ).toBeNull()

		obj.salary = null;

		person.fromObject( obj );
		expect( person.salary ).toBeNull();
	})

	it( 'should deal with null string values', ()=>{
		person.name = null;
		expect( person.name ).toBeNull();

		expect( person.toObject().name ).toBeNull()

		obj.name = null;
		person.fromObject( obj );
		expect( person.name ).toBeNull();
	})

	it( 'should deal with undefined strings', ()=>{
		person.name = undefined;
		expect( person.name ).toBeUndefined();

		expect( person.toObject().name ).toBeUndefined()

		delete obj.name;
		person.fromObject( obj );
		expect( person.name ).toBeUndefined();
	})
	
	xdescribe( 'Compound persistent types', ()=>{
		beforeEach(()=>{
			const notRegistered = new NotRegistered()
			notRegistered.value = 23

			person.notRegistered = notRegistered
		})

		it( 'should return compound objects as instance of object class', ()=>{
			const obj = JSON.stringify( person.toObject() )
			const newPerson = new Person()
			newPerson.fromObject( JSON.parse( obj ) )

			expect( newPerson.notRegistered ).toBeInstanceOf( NotRegistered )
		})

		it( 'should throw if class not registered', ()=>{

			expect( ()=>{
				const obj = person.toObject()
				person.fromObject( obj )
			}).toThrow()
		})
	})
})
