[**entropic-bond**](../README.md)

***

[entropic-bond](../globals.md) / PropPathType

# Type Alias: PropPathType\<T, Path, MaxDepth\>

> **PropPathType**\<`T`, `Path`, `MaxDepth`\> = `MaxDepth` *extends* `number` ? `Path` *extends* keyof `T` ? `T`\[`Path`\] : `Path` *extends* `` `${infer PropName}.${infer SubPropName}` `` ? `PropName` *extends* keyof `T` ? `PropPathType`\<`T`\[`PropName`\], `SubPropName`, [`Decr`](Decr.md)\[`MaxDepth`\]\> : `never` : `never` : `never`

Defined in: [types/utility-types.ts:110](https://github.com/entropic-bond/entropic-bond/blob/29400710ffe30b175eeb7acf439ceed3b4724e16/src/types/utility-types.ts#L110)

## Type Parameters

### T

`T`

### Path

`Path`

### MaxDepth

`MaxDepth` *extends* `number` = `2`
