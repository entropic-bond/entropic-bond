[**entropic-bond**](../README.md)

***

[entropic-bond](../globals.md) / persistentReference

# Function: persistentReference()

> **persistentReference**(`target`, `property`): `void`

Defined in: [persistent/persistent.ts:609](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/persistent/persistent.ts#L609)

Decorator for a property that is a reference to a persistent object. 
The reference content is automatically stored in a collection. The collection 
is determined by the class name of the decorated property.

## Parameters

### target

[`Persistent`](../classes/Persistent.md)

### property

`string`

## Returns

`void`

## See

persistentPureReference
