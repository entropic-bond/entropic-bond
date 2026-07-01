[**entropic-bond**](../README.md)

***

[entropic-bond](../globals.md) / snakeCase

# Function: snakeCase()

> **snakeCase**(`str`, `snakeChar?`): `string`

Defined in: [utils/utils.ts:64](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/utils/utils.ts#L64)

Transforms a string in to a snake case format (snake-case-format)

## Parameters

### str

`string` \| `null` \| `undefined`

the string to transform. It can be a string with spaces or a camel
case format

### snakeChar?

`string` = `'-'`

the character used to separate words. If the passed string is
in camel case and the snakeChar is a space, this will transform the came case
string in to a regular spaced string

## Returns

`string`

the snake case transformed string

## Example

```ts
const str = 'camelCaseFormat'
const result = snakeCase( str )
// result = 'camel-case-format'
```
