[**entropic-bond**](../README.md)

***

[entropic-bond](../globals.md) / persistentReferenceAt

# Function: persistentReferenceAt()

> **persistentReferenceAt**(`collectionPath`): (`target`, `property`) => `void`

Defined in: [persistent/persistent.ts:594](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/persistent/persistent.ts#L594)

Decorator for a property that is a reference to a persistent object and should be stored
in a specific collection.

## Parameters

### collectionPath

`string` \| `CollectionPathCallback`

the path to the collection where the reference should be stored.

## Returns

(`target`, `property`) => `void`
