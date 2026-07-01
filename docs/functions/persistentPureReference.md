[**entropic-bond**](../README.md)

***

[entropic-bond](../globals.md) / persistentPureReference

# Function: persistentPureReference()

> **persistentPureReference**(`target`, `property`, `storeInCollection?`): `void`

Defined in: [persistent/persistent.ts:665](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/persistent/persistent.ts#L665)

Decorator for a property that is a reference to a persistent object. 
In this case, and contrary to the [persistentReference](persistentReference.md) decorator, the reference 
contents is not stored even it has been changed. Only the reference information 
is stored.

## Parameters

### target

[`Persistent`](../classes/Persistent.md)

### property

`string`

### storeInCollection?

`string` \| [`CollectionPathCallback`](../type-aliases/CollectionPathCallback.md)

## Returns

`void`

## See

persistentReference
