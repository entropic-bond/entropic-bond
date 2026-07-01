[**entropic-bond**](../README.md)

***

[entropic-bond](../globals.md) / persistentReference

# Function: persistentReference()

> **persistentReference**(`target`, `property`): `void`

Defined in: [persistent/persistent.ts:609](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/persistent/persistent.ts#L609)

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
