[**entropic-bond**](../README.md)

***

[entropic-bond](../globals.md) / PropPathType

# Type Alias: PropPathType\<T, Path, MaxDepth\>

> **PropPathType**\<`T`, `Path`, `MaxDepth`\> = `MaxDepth` *extends* `number` ? `Path` *extends* keyof `T` ? `T`\[`Path`\] : `Path` *extends* `` `${infer PropName}.${infer SubPropName}` `` ? `PropName` *extends* keyof `T` ? `PropPathType`\<`T`\[`PropName`\], `SubPropName`, `Decr`\[`MaxDepth`\]\> : `never` : `never` : `never`

Defined in: [types/utility-types.ts:110](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/types/utility-types.ts#L110)

## Type Parameters

### T

`T`

### Path

`Path`

### MaxDepth

`MaxDepth` *extends* `number` = `2`
