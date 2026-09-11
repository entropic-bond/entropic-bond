[**entropic-bond**](../README.md)

***

[entropic-bond](../globals.md) / Require

# Type Alias: Require\<T, K\>

> **Require**\<`T`, `K`\> = `T` & `{ [P in K]-?: T[P] }`

Defined in: [types/utility-types.ts:81](https://github.com/entropic-bond/entropic-bond/blob/29400710ffe30b175eeb7acf439ceed3b4724e16/src/types/utility-types.ts#L81)

Makes K properties of T required and keeps the rest untouched

## Type Parameters

### T

`T`

### K

`K` *extends* keyof `T`

## Example

```ts
type T = { a?: number, b?: string, c?: boolean, d: number }
type R = Require<T, 'a' | 'b'>
// R = { a: number, b: string, c?: boolean, d: number }
```
