[**entropic-bond**](../README.md)

***

[entropic-bond](../globals.md) / Elements

# Type Alias: Elements\<T\>

> **Elements**\<`T`\> = `T` *extends* `ReadonlyArray`\<`any`\> ? `T`\[`number`\] : `T` *extends* `ArrayLike`\<`any`\> ? `T`\[`number`\] : `T` *extends* `object` ? `T`\[keyof `T`\] : `never`

Defined in: [types/utility-types.ts:23](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/types/utility-types.ts#L23)

## Type Parameters

### T

`T` *extends* `ReadonlyArray`\<`any`\> \| `ArrayLike`\<`any`\> \| `Record`\<`any`, `any`\> \| `any`
