import { camelCase, replaceValue, snakeCase } from './utils'

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
			vars.people = undefined

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
			expect( camelCase( 'snake-Case' ) ).toEqual( 'snakeCase' )
			expect( camelCase( 'snake_Case' ) ).toEqual( 'snakeCase' )
			expect( camelCase( 'Snake-Case' ) ).toEqual( 'SnakeCase' )
			expect( camelCase( 'Snake_Case' ) ).toEqual( 'SnakeCase' )
		})

		it( 'should return empty string on invalid original string for camel case', ()=>{
			expect( camelCase( undefined ) ).toEqual( '' )
			expect( camelCase( null ) ).toEqual( '' )
			expect( camelCase( '' ) ).toEqual( '' )
		})

		it( 'should convert to snake case', ()=>{
			expect( snakeCase( 'snakeCase' ) ).toEqual( 'snake-case' )
			expect( snakeCase( 'snakeCase', '_' ) ).toEqual( 'snake_case' )
			expect( snakeCase( 'SnakeCase' ) ).toEqual( 'snake-case' )
			expect( snakeCase( 'SnakeCase', '_' ) ).toEqual( 'snake_case' )
		})

		it( 'should return empty string on invalid original string for snake case', ()=>{
			expect( snakeCase( undefined ) ).toEqual( '' )
			expect( snakeCase( null ) ).toEqual( '' )
			expect( snakeCase( '' ) ).toEqual( '' )
		})

	})
})