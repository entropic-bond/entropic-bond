[**entropic-bond**](../README.md)

***

[entropic-bond](../globals.md) / registerPersistentClass

# Function: registerPersistentClass()

> **registerPersistentClass**(`className`, `annotation?`): (`constructor`) => `void`

Defined in: [persistent/persistent.ts:744](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/persistent/persistent.ts#L744)

Decorator to register a persistent class. Entropic Bond needs that you register
all persistent classes that you want to use in any persistent stream.

## Parameters

### className

`string`

the name of the class

### annotation?

`unknown`

an optional annotation that can be used to store additional information

## Returns

(`constructor`) => `void`
