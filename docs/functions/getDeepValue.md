[**entropic-bond**](../README.md)

***

[entropic-bond](../globals.md) / getDeepValue

# Function: getDeepValue()

> **getDeepValue**\<`T`, `P`\>(`obj`, `path`): `P` *extends* keyof `T` ? `T`\[`P`\] : `P` *extends* `` `${PropName}.${SubPropName}` `` ? `PropName` *extends* keyof `T` ? `SubPropName` *extends* keyof `T`\[`PropName`\] ? `T`\[`PropName`\]\[`SubPropName`\] : `SubPropName` *extends* `` `${PropName}.${SubPropName}` `` ? `PropName` *extends* keyof `T`\[`PropName`\] ? `SubPropName` *extends* keyof `T`\[`PropName`\]\[`PropName`\] ? `T`\[`PropName`\]\[`PropName`\]\[`SubPropName`\] : `SubPropName` *extends* `` `${PropName}.${SubPropName}` `` ? `PropName` *extends* keyof ...\[...\] ? `never` : `never` : `never` : `never` : `never` : `never` : `never`

Defined in: [utils/utils.ts:82](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/utils/utils.ts#L82)

Gets the value of the supproperty in the passed object

## Type Parameters

### T

`T` *extends* `object`

### P

`P` *extends* `string`

## Parameters

### obj

`T`

the object containing the subproperty

### path

`P`

a string containing the subproperty path in dotted notation

## Returns

`P` *extends* keyof `T` ? `T`\[`P`\] : `P` *extends* `` `${PropName}.${SubPropName}` `` ? `PropName` *extends* keyof `T` ? `SubPropName` *extends* keyof `T`\[`PropName`\] ? `T`\[`PropName`\]\[`SubPropName`\] : `SubPropName` *extends* `` `${PropName}.${SubPropName}` `` ? `PropName` *extends* keyof `T`\[`PropName`\] ? `SubPropName` *extends* keyof `T`\[`PropName`\]\[`PropName`\] ? `T`\[`PropName`\]\[`PropName`\]\[`SubPropName`\] : `SubPropName` *extends* `` `${PropName}.${SubPropName}` `` ? `PropName` *extends* keyof ...\[...\] ? `never` : `never` : `never` : `never` : `never` : `never` : `never`

the value of the supproperty in the passed object

## Example

```ts
const obj = { a: { b: { c: 1 } } }
const path = 'a.b.c'
const result = getDeepValue( obj, path )
// result = 1
```
