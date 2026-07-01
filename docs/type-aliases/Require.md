[**entropic-bond**](../README.md)

***

[entropic-bond](../globals.md) / Require

# Type Alias: Require\<T, K\>

> **Require**\<`T`, `K`\> = `T` & `{ [P in K]-?: T[P] }`

Defined in: [types/utility-types.ts:81](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/types/utility-types.ts#L81)

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
