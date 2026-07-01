[**entropic-bond**](../README.md)

***

[entropic-bond](../globals.md) / QueryObject

# Type Alias: QueryObject\<T\>

> **QueryObject**\<`T`\> = `object`

Defined in: [store/data-source.ts:52](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/store/data-source.ts#L52)

A representation of a full query

## Param

**operations**

the query operations to be performed

## Param

**limit**

the maximum number of items to be retrieved

## Param

**sort**

sort info

## Param

**sort.order**

the sort order

## Param

**sort.propertyName**

the name of the property to be used for sorting

## Type Parameters

### T

`T`

## Properties

### limit?

> `optional` **limit?**: `number`

Defined in: [store/data-source.ts:54](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/store/data-source.ts#L54)

***

### operations?

> `optional` **operations?**: [`QueryOperation`](QueryOperation.md)\<`T`\>[]

Defined in: [store/data-source.ts:53](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/store/data-source.ts#L53)

***

### sort?

> `optional` **sort?**: `object`

Defined in: [store/data-source.ts:55](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/store/data-source.ts#L55)

#### order

> **order**: [`QueryOrder`](QueryOrder.md)

#### propertyName

> **propertyName**: [`ClassPropNames`](ClassPropNames.md)\<`T`\> \| `string`
