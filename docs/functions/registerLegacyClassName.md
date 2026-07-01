[**entropic-bond**](../README.md)

***

[entropic-bond](../globals.md) / registerLegacyClassName

# Function: registerLegacyClassName()

> **registerLegacyClassName**(`legacyName`): (`constructor`) => `void`

Defined in: [persistent/persistent.ts:761](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/persistent/persistent.ts#L761)

Decorator to register a legacy name for a persistent class. This is useful when you want to
be able to load old data that was stored with a different class name.

## Parameters

### legacyName

`string`

the legacy name of the class

## Returns

(`constructor`) => `void`
