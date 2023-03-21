[entropic-bond](../README.md) / [Exports](../modules.md) / JsonDataSource

# Class: JsonDataSource

A concrete implementation of the DataSource interface uses an in-memory data store
initialized by a JSON object.
It is useful for testing purposes.
The data in the JSON object is not persisted.

## Implements

- [`DataSource`](DataSource.md)

## Table of contents

### Constructors

- [constructor](JsonDataSource.md#constructor)

### Accessors

- [rawData](JsonDataSource.md#rawdata)

### Methods

- [count](JsonDataSource.md#count)
- [delete](JsonDataSource.md#delete)
- [find](JsonDataSource.md#find)
- [findById](JsonDataSource.md#findbyid)
- [next](JsonDataSource.md#next)
- [save](JsonDataSource.md#save)
- [setDataStore](JsonDataSource.md#setdatastore)
- [simulateDelay](JsonDataSource.md#simulatedelay)
- [wait](JsonDataSource.md#wait)

## Constructors

### constructor

• **new JsonDataSource**(`jsonRawData?`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `jsonRawData?` | [`JsonRawData`](../interfaces/JsonRawData.md) | the JSON object to be used as data store |

#### Defined in

[store/json-data-source.ts:25](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/store/json-data-source.ts#L25)

## Accessors

### rawData

• `get` **rawData**(): [`JsonRawData`](../interfaces/JsonRawData.md)

#### Returns

[`JsonRawData`](../interfaces/JsonRawData.md)

the raw data store data as a JSON object

#### Defined in

[store/json-data-source.ts:103](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/store/json-data-source.ts#L103)

## Methods

### count

▸ **count**(`queryObject`, `collectionName`): `Promise`<`number`\>

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

#### Implementation of

[DataSource](DataSource.md).[count](DataSource.md#count)

#### Defined in

[store/json-data-source.ts:94](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/store/json-data-source.ts#L94)

___

### delete

▸ **delete**(`id`, `collectionName`): `Promise`<`void`\>

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

#### Implementation of

[DataSource](DataSource.md).[delete](DataSource.md#delete)

#### Defined in

[store/json-data-source.ts:82](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/store/json-data-source.ts#L82)

___

### find

▸ **find**(`queryObject`, `collectionName`): `Promise`<[`DocumentObject`](../modules.md#documentobject)[]\>

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

#### Implementation of

[DataSource](DataSource.md).[find](DataSource.md#find)

#### Defined in

[store/json-data-source.ts:64](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/store/json-data-source.ts#L64)

___

### findById

▸ **findById**(`id`, `collectionName`): `Promise`<[`DocumentObject`](../modules.md#documentobject)\>

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

#### Implementation of

[DataSource](DataSource.md).[findById](DataSource.md#findbyid)

#### Defined in

[store/json-data-source.ts:49](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/store/json-data-source.ts#L49)

___

### next

▸ **next**(`limit?`): `Promise`<[`DocumentObject`](../modules.md#documentobject)[]\>

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

#### Implementation of

[DataSource](DataSource.md).[next](DataSource.md#next)

#### Defined in

[store/json-data-source.ts:87](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/store/json-data-source.ts#L87)

___

### save

▸ **save**(`collections`): `Promise`<`void`\>

Saves a document
Implement the required logic to save the document in your concrete the data source

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `collections` | [`Collections`](../modules.md#collections) | A collection of documents to be saved |

#### Returns

`Promise`<`void`\>

a promise

#### Implementation of

[DataSource](DataSource.md).[save](DataSource.md#save)

#### Defined in

[store/json-data-source.ts:53](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/store/json-data-source.ts#L53)

___

### setDataStore

▸ **setDataStore**(`rawDataStore`): [`JsonDataSource`](JsonDataSource.md)

Set the JSON object to initialize the data store. Use to set the it after 
the constructor has been called.

#### Parameters

| Name | Type |
| :------ | :------ |
| `rawDataStore` | [`JsonRawData`](../interfaces/JsonRawData.md) |

#### Returns

[`JsonDataSource`](JsonDataSource.md)

#### Defined in

[store/json-data-source.ts:34](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/store/json-data-source.ts#L34)

___

### simulateDelay

▸ **simulateDelay**(`miliSeconds`): [`JsonDataSource`](JsonDataSource.md)

Introduce a delay in the execution of operations to simulate a real data source

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `miliSeconds` | `number` | the number of milliseconds to delay the execution of operations |

#### Returns

[`JsonDataSource`](JsonDataSource.md)

a chainable reference to this object

#### Defined in

[store/json-data-source.ts:44](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/store/json-data-source.ts#L44)

___

### wait

▸ **wait**(): `Promise`<`any`[]\>

Wait for all pending promises to be resolved

#### Returns

`Promise`<`any`[]\>

a promise that resolves when all pending promises are resolved

#### Defined in

[store/json-data-source.ts:111](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/store/json-data-source.ts#L111)
