export type ClassMethodNames<T> = {
	[ K in keyof T]: T[K] extends Function? K : never
}[keyof T]

export type ClassMethods<T> = Pick<T, ClassMethodNames<T>>

export type ClassPropNames<T> = {
	[ K in keyof T]: T[K] extends Function? never : K
}[keyof T]

export type ClassProps<T> = Pick<T, ClassPropNames<T>>

export type SomeClassProps<T> = Partial< ClassProps< T > >

export type ClassArrayPropNames<T> = {
	[ K in keyof T]: T[K] extends unknown[] | Readonly<unknown[]>? K : never
}[keyof T]

export type ClassArrayProps<T> = Pick<T, ClassArrayPropNames<T>>

export type Elements<
  T extends ReadonlyArray<any> | ArrayLike<any> | Record<any, any>
> = T extends ReadonlyArray<any>
  ? T[number]
  : T extends ArrayLike<any>
  ? T[number]
  : T extends object
  ? T[keyof T]
  : never;

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