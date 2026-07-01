[**entropic-bond**](../README.md)

***

[entropic-bond](../globals.md) / ClassArrayPropNames

# Type Alias: ClassArrayPropNames\<T\>

> **ClassArrayPropNames**\<`T`\> = \{ \[K in keyof T\]: T\[K\] extends unknown\[\] \| Readonly\<unknown\[\]\> ? K : never \}\[keyof `T`\]

Defined in: [types/utility-types.ts:17](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/types/utility-types.ts#L17)

## Type Parameters

### T

`T`
