export interface Name {
	firstName: string
	secondName: string
}

export interface Coordinates {
	x: number
	y: number
}

export interface TestPerson {
	id: string
	name: Name
	age: number
	address: {
		coordinates: Coordinates
		postalAddress: string
		senderMethod: ()=>void
	},
	testMethod: ()=>void
}

export function samplePerson(): TestPerson {
	return ({
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
			postalAddress: 'Madison Av.',
			senderMethod(){}
		},
		testMethod(){}
	})
}

