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
	set year( value: number | undefined ) {
		this._year = value
	}

	get year() {
		return this._year
	}

	@persistent private _year: number | undefined
}

@registerPersistentClass( 'TestUser' )
export class TestUser extends Persistent {
	set name( value: Name | undefined ) {
		this._name = value
	}

	get name() {
		return this._name
	}

	set age( value: number | undefined ) {
		this._age = value
	}

	get age() {
		return this._age
	}

	set admin( value: boolean | undefined ) {
		this._admin = value
	}

	get admin() {
		return this._admin
	}

	set skills( value: string[] | undefined ) {
		this._skills = value
	}

	get skills() {
		return this._skills
	}

	set documentRef( value: SubClass | undefined ) {
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

	set derived( value: DerivedUser | undefined ) {
		this._derived = value
	}
	
	get derived(): DerivedUser | undefined {
		return this._derived
	}
	
	set manyDerived( value: DerivedUser[] ) {
		this._manyDerived = value
	}
	
	get manyDerived(): DerivedUser[] {
		return this._manyDerived
	}
	
	@persistent private _name: Name | undefined
	@persistent private _age: number | undefined
	@persistent private _admin: boolean | undefined
	@persistent private _skills: string[] | undefined
	@persistentReference private _documentRef: SubClass | undefined
	@persistentReference private _manyRefs: SubClass[] = []
	@persistentReferenceAt('TestUser') private _derived: DerivedUser | undefined
	@persistentReferenceAt('TestUser') private _manyDerived: DerivedUser[] = []
}

@registerPersistentClass( 'DerivedUser' )
export class DerivedUser extends TestUser {
	set salary(value: number | undefined ) {
		this._salary = value
	}
	
	get salary(): number | undefined {
		return this._salary
	}
	
	@persistent private _salary: number | undefined
}