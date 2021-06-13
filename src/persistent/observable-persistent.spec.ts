import { ObservablePersistent } from './observable-persistent'

class Character extends ObservablePersistent {
	setName( value: string ) {
		this.changeProp( 'name', value )
		return this
	}

	get name() {
		return this._name
	}

	pushFriend( name: string, isUnique?: (a: string, b: string)=>boolean ) {
		return this.pushElement<Character>( 'friends', name, isUnique )
	}

	get friends(): readonly string[] {
		return this._friends
	}

	private _friends: string[] = []
	private _name: string
}

describe('Observable Persistent', ()=>{
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

	it( 'should return callback reference on subscription', ()=>{
		const changed = jest.fn()
		expect( hero.onChange( changed ) ).toBe( changed )
	})

	describe( 'Array Props', ()=>{
		let spy = jest.fn()
	
		beforeEach(()=>{
			hero.onChange( spy )
		})
	
		afterEach(()=>{
			hero.removeOnChange( spy )
			spy.mockClear()
		})
	
		it( 'should insert element in array member and notify', ()=>{
			const res = hero.pushFriend( 'John' )
			
			expect( res ).toEqual( 'John' )
			expect( hero.friends ).toContain( 'John' )
			expect( spy ).toHaveBeenCalledTimes(1)
			expect( spy ).toHaveBeenCalledWith({ friends: ['John'] })
		})

		it( 'should insert different elements in array member', ()=>{
			expect( hero.pushFriend( 'John' ) ).toBeDefined()
			expect( hero.pushFriend( 'Jaume' ) ).toBeDefined()
			
			expect( hero.friends ).toContain( 'John' )
			expect( hero.friends ).toContain( 'Jaume' )
			expect( spy ).toHaveBeenCalledTimes(2)
		})

		it( 'should insert different elements in array member with check function', ()=>{
			const isUnique = ( a: string, b: string ) => a!==b
			
			expect( hero.pushFriend( 'John', isUnique ) ).toBeDefined()
			expect( hero.pushFriend( 'Jaume', isUnique ) ).toBeDefined()
			
			expect( hero.friends ).toContain( 'John' )
			expect( hero.friends ).toContain( 'Jaume' )
			expect( spy ).toHaveBeenCalledTimes(2)
		})

		it( 'should not insert repeated elements in array member with check function', ()=>{
			const isUnique = ( a: string, b: string ) => a!==b
			
			expect( hero.pushFriend( 'John', isUnique ) ).toBeDefined()
			expect( hero.pushFriend( 'John', isUnique ) ).not.toBeDefined()
			
			expect( hero.friends ).toContain( 'John' )
			expect( hero.friends ).toHaveLength( 1 )
			expect( spy ).toHaveBeenCalledTimes( 1 )
		})
	})
})