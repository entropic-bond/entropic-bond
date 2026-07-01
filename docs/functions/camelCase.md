[**entropic-bond**](../README.md)

***

[entropic-bond](../globals.md) / camelCase

# Function: camelCase()

> **camelCase**(`str`): `string`

Defined in: [utils/utils.ts:42](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/utils/utils.ts#L42)

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
