[**entropic-bond**](../README.md)

***

[entropic-bond](../globals.md) / QueryOperation

# Type Alias: QueryOperation\<T\>

> **QueryOperation**\<`T`\> = `object`

Defined in: [store/data-source.ts:30](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/store/data-source.ts#L30)

A representation of a query operation

## Param

**property**

the name of the property to be used in the query

## Param

**operator**

the operator to be used in the query

## Param

**value**

the value to be used in the query

## Param

**aggregate**

if true, the query results will be aggregated using an `or` operator

## Type Parameters

### T

`T`

## Properties

### aggregate?

> `optional` **aggregate?**: `boolean`

Defined in: [store/data-source.ts:34](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/store/data-source.ts#L34)

***

### operator

> **operator**: [`QueryOperator`](QueryOperator.md)

Defined in: [store/data-source.ts:32](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/store/data-source.ts#L32)

***

### property

> **property**: [`ClassPropNames`](ClassPropNames.md)\<`T`\>

Defined in: [store/data-source.ts:31](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/store/data-source.ts#L31)

***

### value

> **value**: `Partial`\<`T`\[[`ClassPropNames`](ClassPropNames.md)\<`T`\>\]\> \| \{\[`key`: `string`\]: `unknown`; \}

Defined in: [store/data-source.ts:33](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/store/data-source.ts#L33)
