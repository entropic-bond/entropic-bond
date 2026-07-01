[**entropic-bond**](../README.md)

***

[entropic-bond](../globals.md) / camelCase

# Function: camelCase()

> **camelCase**(`str`): `string`

Defined in: [utils/utils.ts:42](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/utils/utils.ts#L42)

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
