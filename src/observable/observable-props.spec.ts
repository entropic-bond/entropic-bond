import { ObservableProps } from './observable-props'

class Character extends ObservableProps {
	setName( value: string ) {
		this.changeProp( 'name', value )
		return this
	}

	get name() {
		return this._name
	}

	private _name: string
}

describe('Observable Props', ()=>{
	let hero: Character

	beforeEach(()=>{
		hero = new Character()
	})
	
	it( 'should change properties', ()=>{
		hero.setName( 'Rogue I' )

		expect( hero.name ).toEqual( 'Rogue I' )
	})

	it( 'should notify on change', ()=>{
		const changed = jest.fn()
		hero.onChange( changed )

		hero.setName( 'Rogue I' )

		expect( changed ).toHaveBeenCalledWith({ name: 'Rogue I' })
	})
})