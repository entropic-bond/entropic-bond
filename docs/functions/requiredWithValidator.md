[**entropic-bond**](../README.md)

***

[entropic-bond](../globals.md) / requiredWithValidator

# Function: requiredWithValidator()

> **requiredWithValidator**\<`T`, `P`\>(`validator?`): (`target`, `property`) => `void`

Defined in: [persistent/persistent.ts:788](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/persistent/persistent.ts#L788)

Decorator to mark the property as required.

## Type Parameters

### T

`T` *extends* [`Persistent`](../classes/Persistent.md)

### P

`P` *extends* `string` \| `number` \| `symbol`

## Parameters

### validator?

`ValidatorFunction`\<`T`, `P`\> = `...`

a function that returns true if the property value is valid. 
By default, the property is valid if it is not undefined and not null.

## Returns

(`target`, `property`) => `void`

## See

required
