import { samplePerson, TestPerson } from './test-utils/test-person'
import { camelCase, getDeepValue, replaceValue, snakeCase } from './utils'

describe( 'Utils', ()=>{
	describe( 'replaceValues', ()=>{
		const text = 'The population of ${country} is ${ people} million \
											and the GDP is $${ gdpValue } million'
		const expected = 'The population of U.S.A. is 100 million \
											and the GDP is $1000 million'
		const vars = {
			country: 'U.S.A.',
			people: '100',
			gdpValue: '1000'
		}

		it( 'should replace vars as a template literal', ()=>{
			expect( replaceValue( text, vars ) ).toEqual( expected )
		})

		it( 'should replace vars with empty value', ()=>{
			vars.country = ''
			vars.people = undefined as any

			expect( 
				replaceValue( 
					'The population of ${country} is ${ people} million', 
					vars 
				) 
			).toEqual( 'The population of  is  million' )
		})

		it( 'should resturn empty string on falsy', ()=>{
			expect( replaceValue( undefined, vars ) ).toEqual( '' )
			expect( replaceValue( null, vars ) ).toEqual( '' )
			expect( replaceValue( '', vars ) ).toEqual( '' )
		})
		
	})
	
	describe( 'Camel/Snake case', ()=>{
	
		it( 'should convert to camel case', ()=>{
			expect( camelCase( 'snake_case' ) ).toEqual( 'snakeCase' )
			expect( camelCase( 'snake-case' ) ).toEqual( 'snakeCase' )
			expect( camelCase( 'snake case' ) ).toEqual( 'snakeCase' )
			expect( camelCase( 'snake-Case' ) ).toEqual( 'snakeCase' )
			expect( camelCase( 'snake_Case' ) ).toEqual( 'snakeCase' )
			expect( camelCase( 'snake Case' ) ).toEqual( 'snakeCase' )
			expect( camelCase( 'Snake-Case' ) ).toEqual( 'SnakeCase' )
			expect( camelCase( 'Snake_Case' ) ).toEqual( 'SnakeCase' )
			expect( camelCase( 'Snake Case' ) ).toEqual( 'SnakeCase' )
		})

		it( 'should return empty string on invalid original string for camel case', ()=>{
			expect( camelCase( undefined ) ).toEqual( '' )
			expect( camelCase( null ) ).toEqual( '' )
			expect( camelCase( '' ) ).toEqual( '' )
		})

		it( 'should convert to snake case', ()=>{
			expect( snakeCase( 'snakeCase', '_' ) ).toEqual( 'snake_case' )
			expect( snakeCase( 'SnakeCase' ) ).toEqual( 'snake-case' )
			expect( snakeCase( 'SnakeCase', '_' ) ).toEqual( 'snake_case' )
			expect( snakeCase( 'snake case' ) ).toEqual( 'snake-case' )
			expect( snakeCase( 'snake Case' ) ).toEqual( 'snake-case' )
			expect( snakeCase( 'Snake Case' ) ).toEqual( 'snake-case' )
		})

		it( 'should return empty string on invalid original string for snake case', ()=>{
			expect( snakeCase( undefined ) ).toEqual( '' )
			expect( snakeCase( null ) ).toEqual( '' )
			expect( snakeCase( '' ) ).toEqual( '' )
		})

	})

	describe( 'Get subProp value', ()=>{
		let person: TestPerson
		beforeEach(()=>{
			person = JSON.parse( JSON.stringify( samplePerson() ) )
		})
	
		it( 'should get swallow value', ()=>{
			expect( getDeepValue( person, 'age' ) ).toEqual( person.age )
		})

		it( 'should get 1 level value', ()=>{
			expect( getDeepValue( person, 'name.firstName' ) ).toEqual( person.name.firstName )
		})

		it( 'should get 2 level value', ()=>{
			expect( getDeepValue( person, 'address.coordinates.x' ) ).toEqual( person.address.coordinates.x )
		})
	})
})