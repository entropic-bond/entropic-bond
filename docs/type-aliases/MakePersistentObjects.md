[**entropic-bond**](../README.md)

***

[entropic-bond](../globals.md) / MakePersistentObjects

# Type Alias: MakePersistentObjects\<T\>

> **MakePersistentObjects**\<`T`\> = `{ [A in keyof T]: T[A] extends Persistent ? PersistentObject<T[A]> : MakePersistentObjects<T[A]> }`

Defined in: [persistent/persistent.ts:38](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/persistent/persistent.ts#L38)

The type of the plain object of a persistent class for all the nested properties.

## Type Parameters

### T

`T`
