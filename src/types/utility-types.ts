export type ClassMethodNames<T> = {
	[ K in keyof T]: T[K] extends Function? K : never
}[keyof T]

export type ClassMethods<T> = Pick<T, ClassMethodNames<T>>

export type ClassPropNames<T> = {
	[ K in keyof T]: T[K] extends Function? never : K
}[keyof T]

export type ClassProps<T> = Pick<T, ClassPropNames<T>>

/*
// How to use 

class A {
	name: string
	age: number

	saySomething() {}
}

const obj: ClassProps<A> = {
	name: '9',
	age: 4,
	saySomething: ()=>{}
}

const funcs: ClassMethods<A> = {
	saySomething: ()=>{},
	name: 'hola'
}

type ClassProps2<T> = {
	[ K in keyof T]: T[K] extends Function? never : T[K]
}

const obj2: ClassProps2<A> = {
	name: '5656',
	saySomething: ()=>{}
}
*/