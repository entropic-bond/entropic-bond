[**entropic-bond**](../README.md)

***

[entropic-bond](../globals.md) / TransactionHandle

# Interface: TransactionHandle

Defined in: [store/data-source.ts:102](https://github.com/entropic-bond/entropic-bond/blob/29400710ffe30b175eeb7acf439ceed3b4724e16/src/store/data-source.ts#L102)

The handle passed to a transaction. It only exposes findById/save/delete: there is
no set — a full document write is a save with the complete serialized object.

## Param

**findById**

retrieves a document by id, pinning its version for the transaction

## Param

**save**

merges the given fields into the document

## Param

**delete**

removes the document

## Methods

### delete()

> **delete**(`id`, `collectionName`): `Promise`\<`void`\>

Defined in: [store/data-source.ts:105](https://github.com/entropic-bond/entropic-bond/blob/29400710ffe30b175eeb7acf439ceed3b4724e16/src/store/data-source.ts#L105)

#### Parameters

##### id

`string`

##### collectionName

`string`

#### Returns

`Promise`\<`void`\>

***

### findById()

> **findById**(`id`, `collectionName`): `Promise`\<[`DocumentObject`](../type-aliases/DocumentObject.md) \| `undefined`\>

Defined in: [store/data-source.ts:103](https://github.com/entropic-bond/entropic-bond/blob/29400710ffe30b175eeb7acf439ceed3b4724e16/src/store/data-source.ts#L103)

#### Parameters

##### id

`string`

##### collectionName

`string`

#### Returns

`Promise`\<[`DocumentObject`](../type-aliases/DocumentObject.md) \| `undefined`\>

***

### save()

> **save**(`id`, `collectionName`, `doc`): `Promise`\<`void`\>

Defined in: [store/data-source.ts:104](https://github.com/entropic-bond/entropic-bond/blob/29400710ffe30b175eeb7acf439ceed3b4724e16/src/store/data-source.ts#L104)

#### Parameters

##### id

`string`

##### collectionName

`string`

##### doc

`Partial`\<[`DocumentObject`](../type-aliases/DocumentObject.md)\>

#### Returns

`Promise`\<`void`\>
