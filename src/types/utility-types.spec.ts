import type { Equal, Expect } from '@type-challenges/utils'
import { PropPath, PropPathType } from './utility-types'

interface Name {
	firstName: string
	secondName: string
}

interface Coordinates {
	x: number
	y: number
}

interface Person {
	id: string
	name: Name
	age: number
	address: {
		coordinates: Coordinates
		postalAddress: string
	},
}

const p: Person = {
	id: 'testPersonId',
	age: 34,
	name: {
		firstName: 'Joe',
		secondName: 'Manteca'
	},
	address: {
		coordinates: {
			x: 10,
			y: 20
		},
		postalAddress: 'Madison Av.'
	},
}





/*******************************************************************************
 * 
 * SUB-PROPERTIES
 * 
 *******************************************************************************/

//@ts-expect-error
const a: PropPath<Person> = 'nothing'

//@ts-expect-error
const b: PropPath<Person> = 'name.nothing'

//@ts-expect-error
const c: PropPath<Person> = 'address.nothing'

//@ts-expect-error
const d: PropPath<Person> = 'address.coordinates.nothing'

//@ts-expect-error
const e: PropPath<Person> = 'address.nothing.x'

//@ts-expect-error
const f: PropPath<Person> = 'nothing.coordinates'

const g: PropPath<Person>[] = [
	'name',
	'name.firstName',
	'name.secondName',
	'address',
	'address.coordinates',
	'address.coordinates.x',
	'address.coordinates.y',
	'address.postalAddress',
	'age',
	'id'
]

type cases0 = [
	Expect<Equal< PropPathType<Person, 'id'>, string>>,
	Expect<Equal< PropPathType<Person, 'age'>, number>>,
	Expect<Equal< PropPathType<Person, 'name'>, Name>>,
	Expect<Equal< PropPathType<Person, 'name.firstName'>, string>>,
	Expect<Equal< PropPathType<Person, 'name.secondName'>, string>>,
	Expect<Equal< PropPathType<Person, 'address'>, typeof p.address>>,
	Expect<Equal< PropPathType<Person, 'address.coordinates'>, Coordinates>>,
	Expect<Equal< PropPathType<Person, 'address.coordinates.x'>, number>>,
	Expect<Equal< PropPathType<Person, 'address.postalAddress'>, string>>,
]

function getDeepValue<T extends {}, P extends PropPath<T> & string>( obj: T, path: P ): PropPathType<T, P> {
	return path.split('.').reduce(( acc: {}, prop: string ) => acc[ prop ], obj )
}

const id =	getDeepValue( p, 'id' )
const age =	getDeepValue( p, 'age' )
const name =	getDeepValue( p, 'name' )
const nameFirstName =	getDeepValue( p, 'name.firstName' )
const nameSecondName =	getDeepValue( p, 'name.secondName' )
const address =	getDeepValue( p, 'address' )
const addressCoordinates =	getDeepValue( p, 'address.coordinates' )
const addressCoordinatesX =	getDeepValue( p, 'address.coordinates.x' )
const addressCoordinatesY =	getDeepValue( p, 'address.coordinates.y' )
const addressPostalAddress =	getDeepValue( p, 'address.postalAddress' )

function getValue<T, P extends keyof T>( obj: T, prop: P ): T[P] {
	return obj[ prop ]
}

const swallowVal = getValue( p, 'id' )

type cases = [
	Expect<Equal< typeof id, string >>,
	Expect<Equal< typeof age, number >>,
	Expect<Equal< typeof name, Name >>,
	Expect<Equal< typeof nameFirstName, string >>,
	Expect<Equal< typeof nameSecondName, string >>,
	Expect<Equal< typeof address, typeof p.address >>,
	Expect<Equal< typeof addressCoordinates, Coordinates >>,
	Expect<Equal< typeof addressCoordinatesX, number >>,
	Expect<Equal< typeof addressCoordinatesY, number >>,
	Expect<Equal< typeof addressPostalAddress, string >>,
	Expect<Equal< typeof swallowVal, string >>,
]

it('should compile everything above',()=>{
	expect( true ).toBeTruthy()
})
