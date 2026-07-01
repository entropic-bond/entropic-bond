[**entropic-bond**](../README.md)

***

[entropic-bond](../globals.md) / replaceValue

# Function: replaceValue()

> **replaceValue**(`text`, `values`): `string`

Defined in: [utils/utils.ts:24](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/utils/utils.ts#L24)

Replaces keys found in a string for its values. The keys should be inserted 
inside brackets ${ key } as is done in the string template literals substitutions

## Parameters

### text

`string` \| `null` \| `undefined`

the string template

### values

[`Values`](../interfaces/Values.md)

an object with key-value pairs

## Returns

`string`

the string filled with corresponding values

## Example

```ts
const text = 'Hello ${name}, how are you ${ action }?'
const values = { name: 'John', action: 'today' }
const result = replaceValue( text, values )
// result = 'Hello John, how are you today?'
```
