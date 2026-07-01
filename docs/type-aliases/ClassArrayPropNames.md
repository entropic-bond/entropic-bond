[**entropic-bond**](../README.md)

***

[entropic-bond](../globals.md) / ClassArrayPropNames

# Type Alias: ClassArrayPropNames\<T\>

> **ClassArrayPropNames**\<`T`\> = \{ \[K in keyof T\]: T\[K\] extends unknown\[\] \| Readonly\<unknown\[\]\> ? K : never \}\[keyof `T`\]

Defined in: [types/utility-types.ts:17](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/types/utility-types.ts#L17)

## Type Parameters

### T

`T`
