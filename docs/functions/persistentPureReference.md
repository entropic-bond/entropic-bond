[**entropic-bond**](../README.md)

***

[entropic-bond](../globals.md) / persistentPureReference

# Function: persistentPureReference()

> **persistentPureReference**(`target`, `property`, `storeInCollection?`): `void`

Defined in: [persistent/persistent.ts:662](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/persistent/persistent.ts#L662)

Decorator for a property that is a reference to a persistent object. 
In this case, and contrary to the

## Parameters

### target

[`Persistent`](../classes/Persistent.md)

### property

`string`

### storeInCollection?

`string` \| `CollectionPathCallback`

## Returns

`void`

## Persistent Reference

decorator, the reference 
contents is not stored even it has been changed. Only the reference information 
is stored.

## See

persistentReference
