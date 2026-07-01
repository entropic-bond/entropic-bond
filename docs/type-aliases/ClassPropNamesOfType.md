[**entropic-bond**](../README.md)

***

[entropic-bond](../globals.md) / ClassPropNamesOfType

# Type Alias: ClassPropNamesOfType\<T, U\>

> **ClassPropNamesOfType**\<`T`, `U`\> = `{ [K in keyof T]: T[K] extends Function ? never : T[K] extends U ? K : never }`\[keyof `T`\]

Defined in: [types/utility-types.ts:70](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/types/utility-types.ts#L70)

## Type Parameters

### T

`T`

### U

`U`
