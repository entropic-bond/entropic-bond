[**entropic-bond**](../README.md)

***

[entropic-bond](../globals.md) / PersistentObject

# Type Alias: PersistentObject\<T\>

> **PersistentObject**\<`T`\> = `Omit`\<[`SomeClassProps`](SomeClassProps.md)\<`T`\>, `"className"`\> & `Partial`\<[`DocumentReference`](../interfaces/DocumentReference.md)\> & `object`

Defined in: [persistent/persistent.ts:26](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/persistent/persistent.ts#L26)

The corresponding type of the plain object of a persistent class.

## Type Declaration

### \_\_className

> **\_\_className**: `string`

### \_\_rootCollections?

> `optional` **\_\_rootCollections?**: [`Collections`](Collections.md)

## Type Parameters

### T

`T` *extends* [`Persistent`](../classes/Persistent.md)
