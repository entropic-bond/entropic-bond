import { persistent, Persistent, persistentRef, registerClassFactory } from '../../persistent/persistent'

interface Name { 
	firstName: string, 
	lastName: string 
}

@registerClassFactory( 'SubClass', ()=>new SubClass() )
export class SubClass extends Persistent {
	set year( value: number ) {
		this._year = value
	}

	get year() {
		return this._year
	}

	@persistent private _year: number
}

@registerClassFactory( 'TestUser', ()=>new TestUser() )
export class TestUser extends Persistent {
	set name( value: Name ) {
		this._name = value
	}

	get name() {
		return this._name
	}

	set age( value: number ) {
		this._age = value
	}

	get age() {
		return this._age
	}

	set admin( value: boolean ) {
		this._admin = value
	}

	get admin() {
		return this._admin
	}

	set skills( value: string[] ) {
		this._skills = value
	}

	get skills() {
		return this._skills
	}

	set documentRef( value: SubClass ) {
		this._documentRef = value
	}

	get documentRef() {
		return this._documentRef
	}

	@persistent private _name: Name
	@persistent private _age: number
	@persistent private _admin: boolean
	@persistent private _skills: string[]
	@persistentRef private _documentRef: SubClass
}

@registerClassFactory( 'DerivedUser', ()=>new DerivedUser() )
export class DerivedUser extends TestUser {
	set salary(value: number) {
		this._salary = value
	}
	
	get salary(): number {
		return this._salary
	}
	
	@persistent private _salary: number
}