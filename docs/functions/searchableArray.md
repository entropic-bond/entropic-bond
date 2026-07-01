[**entropic-bond**](../README.md)

***

[entropic-bond](../globals.md) / searchableArray

# Function: searchableArray()

> **searchableArray**(`target`, `property`): `void`

Defined in: [persistent/persistent.ts:770](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/persistent/persistent.ts#L770)

Decorator to make a `Persistent` array property searchable by the 
persistence engine.
When a property is marked as searchable, the persistence engine will
generate internally a new property with the same name but with the suffix `_searchable`
and prefixed with the `_` character. This new property will contain an array
with the `id` of the persistent elements in the original array.

## Parameters

### target

[`Persistent`](../classes/Persistent.md)

### property

`string`

## Returns

`void`
