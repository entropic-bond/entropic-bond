[**entropic-bond**](../README.md)

***

[entropic-bond](../globals.md) / requiredWithValidator

# Function: requiredWithValidator()

> **requiredWithValidator**\<`T`, `P`\>(`validator?`): (`target`, `property`) => `void`

Defined in: [persistent/persistent.ts:793](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/persistent/persistent.ts#L793)

Decorator to mark the property as required.

## Type Parameters

### T

`T` *extends* [`Persistent`](../classes/Persistent.md)

### P

`P` *extends* `string` \| `number` \| `symbol`

## Parameters

### validator?

[`ValidatorFunction`](../type-aliases/ValidatorFunction.md)\<`T`, `P`\> = `...`

a function that returns true if the property value is valid. 
By default, the property is valid if it is not undefined and not null.

## Returns

(`target`, `property`) => `void`

## See

required
