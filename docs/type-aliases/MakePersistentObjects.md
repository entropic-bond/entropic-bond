[**entropic-bond**](../README.md)

***

[entropic-bond](../globals.md) / MakePersistentObjects

# Type Alias: MakePersistentObjects\<T\>

> **MakePersistentObjects**\<`T`\> = `{ [A in keyof T]: T[A] extends Persistent ? PersistentObject<T[A]> : MakePersistentObjects<T[A]> }`

Defined in: [persistent/persistent.ts:38](https://github.com/entropic-bond/entropic-bond/blob/29400710ffe30b175eeb7acf439ceed3b4724e16/src/persistent/persistent.ts#L38)

The type of the plain object of a persistent class for all the nested properties.

## Type Parameters

### T

`T`
