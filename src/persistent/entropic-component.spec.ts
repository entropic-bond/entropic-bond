import { CompareFunction, EntropicComponent } from './entropic-component'

class Character extends EntropicComponent {
	setName( value: string ) {
		this.changeProp( 'name', value )
		return this
	}

	get name() {
		return this._name
	}

	pushFriend( name: string, isUnique?: CompareFunction<string> ) {
		return this.pushAndNotify( 'friends', name, isUnique )
	}

	removeFriend( name: string, isEqual: CompareFunction<string> ) {
		return this.removeAndNotify( 'friends', name, isEqual )
	}

	get friends(): readonly string[] {
		return this._friends
	}

	private _friends: string[] = []
	private _name: string = ''
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
		const changed = vi.fn()
		hero.onChange( changed )

		hero.setName( 'Rogue I' )

		expect( changed ).toHaveBeenCalledWith({ name: 'Rogue I' })
	})

	it( 'should return a unsubscribe function on subscription', ()=>{
		const changed = vi.fn()

		const unsubscribe = hero.onChange( changed )
		unsubscribe()
		hero.setName( 'Rogue II' )

		expect( changed ).not.toHaveBeenCalled()
	})

	describe( 'Array Props', ()=>{
		let spy = vi.fn()
	
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

class A extends EntropicComponent {
	addArray1( value: string ): string | undefined {
		const retVal = this.pushAndNotify( 'array1s', value, ( a, b ) => a !== b )

		//@ts-expect-error
		this.pushAndNotify( 'nonExistingMember', value, ( a, b ) => a !== b )
		//@ts-expect-error
		this.pushAndNotify( 'array1s', 1, ( a, b ) => a !== b )
		//@ts-expect-error
		this.pushAndNotify( 'array1s', true, ( a, b ) => a !== b )
		//@ts-expect-error
		this.pushAndNotify( 'array1s', {}, ( a, b ) => a !== b )
		//@ts-expect-error
		this.pushAndNotify( 'array1s', [], ( a, b ) => a !== b )
		//@ts-expect-error
		this.pushAndNotify( 'array1s', value, ( a, b ) => a.isNothingHere !== b )

		return retVal
	}
	
	removeArray1( value: string ): string | undefined {
		const retVal = this.removeAndNotify( 'array1s', value, ( a, b ) => a === b )

		//@ts-expect-error
		this.removeAndNotify( 'nonExistingMember', value, ( a, b ) => a !== b )
		//@ts-expect-error
		this.removeAndNotify( 'array1s', 1, ( a, b ) => a !== b )
		//@ts-expect-error
		this.removeAndNotify( 'array1s', true, ( a, b ) => a !== b )
		//@ts-expect-error
		this.removeAndNotify( 'array1s', {}, ( a, b ) => a !== b )
		//@ts-expect-error
		this.removeAndNotify( 'array1s', [], ( a, b ) => a !== b )
		//@ts-expect-error
		this.removeAndNotify( 'array1s', value, ( a, b ) => a.isNothingHere !== b )

		return retVal
	}

	addArray2( value: number ): number | undefined {
		//@ts-expect-error
		return this.pushAndNotify( 'intProp', value, ( a, b ) => a !== b )
	}

	removeArray2( value: number ): number | undefined {
		//@ts-expect-error
		return this.removeAndNotify( 'intProp', value, ( a, b ) => a === b )
	}

	set intProp( value: number ) {
		this._intProp = value
	}
	
	get intProp(): number {
		return this._intProp
	}
	
	get array1s(): Readonly<string[]> {
		return this._array1s
	}
	
	private _intProp: number = 0
	private _array1s: string[] = []
}