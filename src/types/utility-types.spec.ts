import type { Equal, Expect } from '@type-challenges/utils'
import { TestPerson, Name, Coordinates, samplePerson } from '../utils/test-utils/test-person'
import { getDeepValue } from '../utils/utils'
import { PropPath, PropPathType } from './utility-types'

const person = samplePerson()


/*******************************************************************************
 * 
 * SUB-PROPERTIES
 * 
 *******************************************************************************/

//@ts-expect-error
const a: PropPath<TestPerson> = 'nothing'

//@ts-expect-error
const b: PropPath<TestPerson> = 'name.nothing'

//@ts-expect-error
const c: PropPath<TestPerson> = 'address.nothing'

//@ts-expect-error
const d: PropPath<TestPerson> = 'address.coordinates.nothing'

//@ts-expect-error
const e: PropPath<TestPerson> = 'address.nothing.x'

//@ts-expect-error
const f: PropPath<TestPerson> = 'nothing.coordinates'

//@ts-expect-error
const g0: PropPath<TestPerson> = 'testMethod'

//@ts-expect-error
const g1: PropPath<TestPerson> = 'address.senderMethod'

const h: PropPath<TestPerson>[] = [
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

//@ts-expect-error
const i: PropPath<TestPerson, number> = 'id'


const j: PropPath<TestPerson, number>[] = [
	'age'
]

type cases0 = [
	Expect<Equal< PropPathType<TestPerson, 'id'>, string>>,
	Expect<Equal< PropPathType<TestPerson, 'age'>, number>>,
	Expect<Equal< PropPathType<TestPerson, 'name'>, Name>>,
	Expect<Equal< PropPathType<TestPerson, 'name.firstName'>, string>>,
	Expect<Equal< PropPathType<TestPerson, 'name.secondName'>, string>>,
	Expect<Equal< PropPathType<TestPerson, 'address'>, typeof person.address>>,
	Expect<Equal< PropPathType<TestPerson, 'address.coordinates'>, Coordinates>>,
	Expect<Equal< PropPathType<TestPerson, 'address.coordinates.x'>, number>>,
	Expect<Equal< PropPathType<TestPerson, 'address.postalAddress'>, string>>,
]

const id =	getDeepValue( person, 'id' )
const age =	getDeepValue( person, 'age' )
const name =	getDeepValue( person, 'name' )
const nameFirstName =	getDeepValue( person, 'name.firstName' )
const nameSecondName =	getDeepValue( person, 'name.secondName' )
const address =	getDeepValue( person, 'address' )
const addressCoordinates =	getDeepValue( person, 'address.coordinates' )
const addressCoordinatesX =	getDeepValue( person, 'address.coordinates.x' )
const addressCoordinatesY =	getDeepValue( person, 'address.coordinates.y' )
const addressPostalAddress =	getDeepValue( person, 'address.postalAddress' )

type cases = [
	Expect<Equal< typeof id, string >>,
	Expect<Equal< typeof age, number >>,
	Expect<Equal< typeof name, Name >>,
	Expect<Equal< typeof nameFirstName, string >>,
	Expect<Equal< typeof nameSecondName, string >>,
	Expect<Equal< typeof address, typeof person.address >>,
	Expect<Equal< typeof addressCoordinates, Coordinates >>,
	Expect<Equal< typeof addressCoordinatesX, number >>,
	Expect<Equal< typeof addressCoordinatesY, number >>,
	Expect<Equal< typeof addressPostalAddress, string >>,
]

it('should compile everything above',()=>{
	expect( true ).toBeTruthy()
})
