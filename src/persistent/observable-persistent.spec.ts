import { CompareFunction, ObservablePersistent } from './observable-persistent'

class Character extends ObservablePersistent {
	setName( value: string ) {
		this.changeProp( 'name', value )
		return this
	}

	get name() {
		return this._name
	}

	pushFriend( name: string, isUnique?: CompareFunction<string> ) {
		return this.pushAndNotify<Character>( 'friends', name, isUnique )
	}

	removeFriend( name: string, isEqual: CompareFunction<string> ) {
		return this.removeAndNotify<Character>( 'friends', name, isEqual )
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
		
		it( 'should remove an element from array member and notify', ()=>{
			const isEqual = ( a: string, b: string ) => a===b
			hero.pushFriend( 'John' )
			hero.pushFriend( 'Jaume' )
			spy.mockReset()
			expect( hero.friends ).toHaveLength( 2 )

			const res = hero.removeFriend( 'John', isEqual )
			expect( res ).toEqual( 'John' )
			expect( hero.friends ).not.toContain( 'John' )
			expect( hero.friends ).toContain( 'Jaume' )
			expect( spy ).toHaveBeenCalledTimes(1)
			expect( spy ).toHaveBeenCalledWith({ friends: ['Jaume'] })
		})
		
		it( 'should not notify on element not removed', ()=>{
			const isEqual = ( a: string, b: string ) => a===b
			hero.pushFriend( 'John' )
			hero.pushFriend( 'Jaume' )
			spy.mockReset()
			expect( hero.friends ).toHaveLength( 2 )

			const res = hero.removeFriend( 'Nobody', isEqual )
			expect( res ).toBeUndefined()
			expect( hero.friends ).toContain( 'John' )
			expect( hero.friends ).toContain( 'Jaume' )
			expect( spy ).not.toHaveBeenCalled()
		})
		
	})
})