[**entropic-bond**](../README.md)

***

[entropic-bond](../globals.md) / PersistentObject

# Type Alias: PersistentObject\<T\>

> **PersistentObject**\<`T`\> = `Omit`\<[`SomeClassProps`](SomeClassProps.md)\<`T`\>, `"className"`\> & `Partial`\<[`DocumentReference`](../interfaces/DocumentReference.md)\> & `object`

Defined in: [persistent/persistent.ts:26](https://github.com/entropic-bond/entropic-bond/blob/29400710ffe30b175eeb7acf439ceed3b4724e16/src/persistent/persistent.ts#L26)

The corresponding type of the plain object of a persistent class.

## Type Declaration

### \_\_className

> **\_\_className**: `string`

### \_\_rootCollections?

> `optional` **\_\_rootCollections?**: [`Collections`](Collections.md)

## Type Parameters

### T

`T` *extends* [`Persistent`](../classes/Persistent.md)
