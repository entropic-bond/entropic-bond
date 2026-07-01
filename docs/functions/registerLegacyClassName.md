[**entropic-bond**](../README.md)

***

[entropic-bond](../globals.md) / registerLegacyClassName

# Function: registerLegacyClassName()

> **registerLegacyClassName**(`legacyName`): (`constructor`) => `void`

Defined in: [persistent/persistent.ts:756](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/persistent/persistent.ts#L756)

Decorator to register a legacy name for a persistent class. This is useful when you want to
be able to load old data that was stored with a different class name.

## Parameters

### legacyName

`string`

the legacy name of the class

## Returns

(`constructor`) => `void`
