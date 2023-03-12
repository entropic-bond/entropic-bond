[entropic-bond](../README.md) / [Exports](../modules.md) / DataSource

# Class: DataSource

The data source interface.
It defines the methods that must be implemented by a data source
A data source is able to retrieve and save data i.e: from a database, a file, a RestAPI, etc.
You can derive from this class to implement your own data source with the 
A data source is used by the store to retrieve and save data.

## Implemented by

- [`JsonDataSource`](JsonDataSource.md)

## Table of contents

### Constructors

- [constructor](DataSource.md#constructor)

### Methods

- [count](DataSource.md#count)
- [delete](DataSource.md#delete)
- [find](DataSource.md#find)
- [findById](DataSource.md#findbyid)
- [next](DataSource.md#next)
- [save](DataSource.md#save)
- [toPropertyPathOperations](DataSource.md#topropertypathoperations)
- [toPropertyPathValue](DataSource.md#topropertypathvalue)

## Constructors

### constructor

• **new DataSource**()

## Methods

### count

▸ `Abstract` **count**(`queryObject`, `collectionName`): `Promise`<`number`\>

Retrieves the number of documents matching the query stored in the query object
Implement the required logic to retrieve the number of documents that match the
requirements in the query object from your concrete the data source

**`See`**

QueryObject

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `queryObject` | [`QueryObject`](../modules.md#queryobject)<[`DocumentObject`](../modules.md#documentobject)\> | the query object containing the query operations |
| `collectionName` | `string` | the name of the collection where the documents are stored |

#### Returns

`Promise`<`number`\>

a promise resolving to the number of documents matching the query

#### Defined in

[store/data-source.ts:125](https://github.com/entropic-bond/entropic-bond/blob/2a330da/src/store/data-source.ts#L125)

___

### delete

▸ `Abstract` **delete**(`id`, `collectionName`): `Promise`<`void`\>

Deletes a document by id
Implement the required logic to delete a document by id from your concrete
data source

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | the id of the document to be deleted |
| `collectionName` | `string` | the name of the collection where the document is stored |

#### Returns

`Promise`<`void`\>

a promise

#### Defined in

[store/data-source.ts:105](https://github.com/entropic-bond/entropic-bond/blob/2a330da/src/store/data-source.ts#L105)

___

### find

▸ `Abstract` **find**(`queryObject`, `collectionName`): `Promise`<[`DocumentObject`](../modules.md#documentobject)[]\>

Retrieves all documents matching the query stored in the query object
Implement the required logic to retrieve the documents that match the 
requirements in the query object from your concrete the data source

**`See`**

 - QueryObject
 - QueryOperation
 - QueryOperator
 - QueryOrder
 - DocumentObject

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `queryObject` | [`QueryObject`](../modules.md#queryobject)<[`DocumentObject`](../modules.md#documentobject)\> | the query object containing the query operations |
| `collectionName` | `string` | the name of the collection where the documents are stored |

#### Returns

`Promise`<[`DocumentObject`](../modules.md#documentobject)[]\>

a promise resolving to an array of document objects. The document object is
a plain object with the properties of the document class.

#### Defined in

[store/data-source.ts:87](https://github.com/entropic-bond/entropic-bond/blob/2a330da/src/store/data-source.ts#L87)

___

### findById

▸ `Abstract` **findById**(`id`, `collectionName`): `Promise`<[`DocumentObject`](../modules.md#documentobject)\>

Retrieves a document by id
Implement the required logic to retrieve a document by id from your concrete
the data source

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | the id of the document to be retrieved |
| `collectionName` | `string` | the name of the collection where the document is stored |

#### Returns

`Promise`<[`DocumentObject`](../modules.md#documentobject)\>

a promise resolving to the document object. The document object is 
a plain object with the properties of the document class.

#### Defined in

[store/data-source.ts:71](https://github.com/entropic-bond/entropic-bond/blob/2a330da/src/store/data-source.ts#L71)

___

### next

▸ `Abstract` **next**(`limit?`): `Promise`<[`DocumentObject`](../modules.md#documentobject)[]\>

Retrieves the next bunch of documents matching the query stored in the query object
Implement the required logic to retrieve the next bunch of documents that match the
requirements in the query object from your concrete the data source

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `limit?` | `number` | the maximum number of items to be retrieved |

#### Returns

`Promise`<[`DocumentObject`](../modules.md#documentobject)[]\>

a promise resolving to an array representing the next bunch of document objects

#### Defined in

[store/data-source.ts:114](https://github.com/entropic-bond/entropic-bond/blob/2a330da/src/store/data-source.ts#L114)

___

### save

▸ `Abstract` **save**(`object`): `Promise`<`void`\>

Saves a document
Implement the required logic to save the document in your concrete the data source

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `object` | [`Collections`](../modules.md#collections) | A collection of documents to be saved |

#### Returns

`Promise`<`void`\>

a promise

#### Defined in

[store/data-source.ts:95](https://github.com/entropic-bond/entropic-bond/blob/2a330da/src/store/data-source.ts#L95)

___

### toPropertyPathOperations

▸ `Static` **toPropertyPathOperations**<`T`\>(`operations`): [`QueryOperation`](../modules.md#queryoperation)<`T`\>[]

Utility method to convert a query object to a property path query object

**`Example`**

```ts
const queryObject = {
	operations: [{ property: 'name', operator: '==', value: { ancestorName: { father: 'Felipe' }}]
}
const propPathQueryObject = DataSource.toPropertyPathQueryObject( queryObject )
// returned value: [{ property: 'name.ancestorName.father', operator: '==', value: 'Felipe' }]
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`Persistent`](Persistent.md)<`T`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `operations` | [`QueryOperation`](../modules.md#queryoperation)<`T`\>[] |

#### Returns

[`QueryOperation`](../modules.md#queryoperation)<`T`\>[]

a property path query object

#### Defined in

[store/data-source.ts:139](https://github.com/entropic-bond/entropic-bond/blob/2a330da/src/store/data-source.ts#L139)

___

### toPropertyPathValue

▸ `Static` `Private` **toPropertyPathValue**(`obj`): [`string`, `unknown`]

#### Parameters

| Name | Type |
| :------ | :------ |
| `obj` | `Object` |

#### Returns

[`string`, `unknown`]

#### Defined in

[store/data-source.ts:152](https://github.com/entropic-bond/entropic-bond/blob/2a330da/src/store/data-source.ts#L152)
