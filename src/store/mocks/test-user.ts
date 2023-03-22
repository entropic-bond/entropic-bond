import { persistent, Persistent, persistentReference, persistentReferenceAt, registerPersistentClass } from '../../persistent/persistent'

interface Name { 
	firstName: string, 
	lastName: string 
	ancestorName: {
		father?: string
		mother?: string
	}
}

@registerPersistentClass( 'SubClass' )
export class SubClass extends Persistent {
	set year( value: number ) {
		this._year = value
	}

	get year() {
		return this._year
	}

	@persistent private _year: number
}

@registerPersistentClass( 'TestUser' )
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

	set manyRefs(value: SubClass[]) {
		this._manyRefs = value
	}
	
	get manyRefs(): SubClass[] {
		return this._manyRefs
	}

	set derived( value: DerivedUser ) {
		this._derived = value
	}
	
	get derived(): DerivedUser {
		return this._derived
	}
	
	set manyDerived( value: DerivedUser[] ) {
		this._manyDerived = value
	}
	
	get manyDerived(): DerivedUser[] {
		return this._manyDerived
	}
	
	@persistent private _name: Name
	@persistent private _age: number
	@persistent private _admin: boolean
	@persistent private _skills: string[]
	@persistentReference private _documentRef: SubClass
	@persistentReference private _manyRefs: SubClass[] = []
	@persistentReferenceAt('TestUser') private _derived: DerivedUser
	@persistentReferenceAt('TestUser') private _manyDerived: DerivedUser[]
}

@registerPersistentClass( 'DerivedUser' )
export class DerivedUser extends TestUser {
	set salary(value: number) {
		this._salary = value
	}
	
	get salary(): number {
		return this._salary
	}
	
	@persistent private _salary: number
}