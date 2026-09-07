[**entropic-bond**](../README.md)

***

[entropic-bond](../globals.md) / camelCase

# Function: camelCase()

> **camelCase**(`str`): `string`

Defined in: [utils/utils.ts:42](https://github.com/entropic-bond/entropic-bond/blob/29400710ffe30b175eeb7acf439ceed3b4724e16/src/utils/utils.ts#L42)

Transforms a string to a camel case format (camelCaseFormat)

## Parameters

### str

`string` \| `null` \| `undefined`

the string to transform. It can be a string with spaces or a 
snake case format

## Returns

`string`

the camel case transformed string

## Example

```ts
const str = 'snake-case-format'
const result = camelCase( str )
// result = 'snakeCaseFormat'
```
