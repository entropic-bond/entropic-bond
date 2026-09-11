[**entropic-bond**](../README.md)

***

[entropic-bond](../globals.md) / typeName

# Function: typeName()

> **typeName**(`typeNames`): (`target`, `property`) => `void`

Defined in: [persistent/persistent.ts:805](https://github.com/entropic-bond/entropic-bond/blob/29400710ffe30b175eeb7acf439ceed3b4724e16/src/persistent/persistent.ts#L805)

Decorator to define the type name or type names of a persistent property.
This is useful when the type cannot be inferred automatically by the persistence engine which typically
happens when the property is initialized as null or undefined.

## Parameters

### typeNames

`string` \| `string`[] \| [`PersistentConstructor`](../type-aliases/PersistentConstructor.md)

the type name or the acceptable type names (in case of inheritance) of the property

## Returns

(`target`, `property`) => `void`
