[**entropic-bond**](../README.md)

***

[entropic-bond](../globals.md) / searchableArray

# Function: searchableArray()

> **searchableArray**(`target`, `property`): `void`

Defined in: [persistent/persistent.ts:775](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/persistent/persistent.ts#L775)

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
