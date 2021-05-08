import { persistent, Persistent, registerClassFactory } from '../../persistent/persistent'

interface Name { 
	firstName: string, 
	lastName: string 
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
		this.age = value
	}

	get age() {
		return this.age
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

	@persistent private _name: Name
	@persistent private _age: number
	@persistent private _admin: boolean
	@persistent private _skills: string[]
}
