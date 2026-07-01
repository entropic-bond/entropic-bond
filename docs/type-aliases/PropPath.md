[**entropic-bond**](../README.md)

***

[entropic-bond](../globals.md) / PropPath

# Type Alias: PropPath\<T, AllowedTypes, MaxDepth, Prefix\>

> **PropPath**\<`T`, `AllowedTypes`, `MaxDepth`, `Prefix`\> = `MaxDepth` *extends* `number` ? \{ \[P in keyof T\]: T\[P\] extends Function ? never : T\[P\] extends AllowedTypes ? T\[P\] extends Primitive \| ArrayLike\<any\> ? Concat\<Prefix, P\> : Concat\<Prefix, P\> \| PropPath\<T\[P\] & object, AllowedTypes, Decr\[MaxDepth\], \`$\{Concat\<Prefix, P\>\}.\`\> : never \}\[keyof `T`\] : `never`

Defined in: [types/utility-types.ts:102](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/types/utility-types.ts#L102)

## Type Parameters

### T

`T` *extends* `object`

### AllowedTypes

`AllowedTypes` = `any`

### MaxDepth

`MaxDepth` *extends* `number` = `9`

### Prefix

`Prefix` = `""`
