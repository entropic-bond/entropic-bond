export type ClassMethodNames<T> = {
	[ K in keyof T]: T[K] extends Function? K : never
}[keyof T]

export type ClassMethods<T> = Pick<T, ClassMethodNames<T>>

export type ClassPropNames<T> = {
	[ K in keyof T]: T[K] extends Function? never : K
}[keyof T]

export type ClassProps<T> = Pick<T, ClassPropNames<T>>

export type SomeClassProps<T> = Partial< ClassProps< T > >

export type SomeClassPropNames<T> = Partial< ClassPropNames< T > >

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

export interface Collection<T> {
	[ key: string | symbol ]: T
}

export declare type ClassPropNamesOfType<T, U> = {
	[K in keyof T]: T[K] extends Function? never : T[K] extends U? K : never
}[keyof T];

/**
 * Makes K properties of T required and keeps the rest untouched
 * @example
 * type T = { a?: number, b?: string, c?: boolean, d: number }
 * type R = Require<T, 'a' | 'b'>
 * // R = { a: number, b: string, c?: boolean, d: number }
 */
export type Require<T, K extends keyof T> = T & { [P in K]-?: T[P] }








/*******************************************************************************
 * 
 * SUB-PROPERTIES
 * 
 *******************************************************************************/

type Primitive = string | number | bigint | boolean | undefined | symbol

type Decr = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] // add to a reasonable amount

type Concat<T, U> = `${ string & T }${ string & U }`

export type PropPath<T extends {}, AllowedTypes=any, MaxDepth extends number = 3, Prefix = ''> = MaxDepth extends number? {
	[ P in keyof T ]: T[P] extends Function? never : T[P] extends AllowedTypes? T[P] extends Primitive | ArrayLike<any>
		? Concat<Prefix, P>
		: Concat<Prefix, P> | PropPath <T[P] & {}, AllowedTypes, Decr[MaxDepth], `${ Concat<Prefix, P> }.`> : never
}[ keyof T ] & string: never

export type PropPathType<T, Path, MaxDepth extends number = 2> = MaxDepth extends number
	? Path extends keyof T
		? T[ Path ]
		: Path extends `${ infer PropName}.${ infer SubPropName }`
			? PropName extends keyof T 
				? PropPathType<T[PropName], SubPropName, Decr[MaxDepth]>
				: never
			: never
	: never
