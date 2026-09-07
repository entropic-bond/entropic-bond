[**entropic-bond**](../README.md)

***

[entropic-bond](../globals.md) / persistentReferenceAt

# Function: persistentReferenceAt()

> **persistentReferenceAt**(`collectionPath`): (`target`, `property`) => `void`

Defined in: [persistent/persistent.ts:594](https://github.com/entropic-bond/entropic-bond/blob/29400710ffe30b175eeb7acf439ceed3b4724e16/src/persistent/persistent.ts#L594)

Decorator for a property that is a reference to a persistent object and should be stored
in a specific collection.

## Parameters

### collectionPath

`string` \| [`CollectionPathCallback`](../type-aliases/CollectionPathCallback.md)

the path to the collection where the reference should be stored.

## Returns

(`target`, `property`) => `void`
