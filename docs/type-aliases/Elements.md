[**entropic-bond**](../README.md)

***

[entropic-bond](../globals.md) / Elements

# Type Alias: Elements\<T\>

> **Elements**\<`T`\> = `T` *extends* `ReadonlyArray`\<`any`\> ? `T`\[`number`\] : `T` *extends* `ArrayLike`\<`any`\> ? `T`\[`number`\] : `T` *extends* `object` ? `T`\[keyof `T`\] : `never`

Defined in: [types/utility-types.ts:23](https://github.com/entropic-bond/entropic-bond/blob/29400710ffe30b175eeb7acf439ceed3b4724e16/src/types/utility-types.ts#L23)

## Type Parameters

### T

`T` *extends* `ReadonlyArray`\<`any`\> \| `ArrayLike`\<`any`\> \| `Record`\<`any`, `any`\> \| `any`
