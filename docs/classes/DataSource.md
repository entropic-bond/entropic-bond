[**entropic-bond**](../README.md)

***

[entropic-bond](../globals.md) / DataSource

# Abstract Class: DataSource

Defined in: [store/data-source.ts:115](https://github.com/entropic-bond/entropic-bond/blob/29400710ffe30b175eeb7acf439ceed3b4724e16/src/store/data-source.ts#L115)

The data source interface.
It defines the methods that must be implemented by a data source
A data source is able to retrieve and save data i.e: from a database, a file, a RestAPI, etc.
You can derive from this class to implement your own data source with the 
A data source is used by the store to retrieve and save data.

## Extended by

- [`JsonDataSource`](JsonDataSource.md)

## Constructors

### Constructor

> **new DataSource**(): `DataSource`

#### Returns

`DataSource`

## Accessors

### cachedPropsUpdater

#### Get Signature

> **get** **cachedPropsUpdater**(): [`CachedPropsUpdater`](CachedPropsUpdater.md) \| `undefined`

Defined in: [store/data-source.ts:208](https://github.com/entropic-bond/entropic-bond/blob/29400710ffe30b175eeb7acf439ceed3b4724e16/src/store/data-source.ts#L208)

##### Returns

[`CachedPropsUpdater`](CachedPropsUpdater.md) \| `undefined`

## Methods

### count()

> `abstract` **count**(`queryObject`, `collectionName`): `Promise`\<`number`\>

Defined in: [store/data-source.ts:194](https://github.com/entropic-bond/entropic-bond/blob/29400710ffe30b175eeb7acf439ceed3b4724e16/src/store/data-source.ts#L194)

Retrieves the number of documents matching the query stored in the query object
Implement the required logic to retrieve the number of documents that match the
requirements in the query object from your concrete the data source

#### Parameters

##### queryObject

[`QueryObject`](../type-aliases/QueryObject.md)\<[`DocumentObject`](../type-aliases/DocumentObject.md)\>

the query object containing the query operations

##### collectionName

`string`

the name of the collection where the documents are stored

#### Returns

`Promise`\<`number`\>

a promise resolving to the number of documents matching the query

#### See

QueryObject

***

### delete()

> `abstract` **delete**(`id`, `collectionName`): `Promise`\<`void`\>

Defined in: [store/data-source.ts:162](https://github.com/entropic-bond/entropic-bond/blob/29400710ffe30b175eeb7acf439ceed3b4724e16/src/store/data-source.ts#L162)

Deletes a document by id
Implement the required logic to delete a document by id from your concrete
data source

#### Parameters

##### id

`string`

the id of the document to be deleted

##### collectionName

`string`

the name of the collection where the document is stored

#### Returns

`Promise`\<`void`\>

a promise

***

### find()

> `abstract` **find**(`queryObject`, `collectionName`): `Promise`\<[`DocumentObject`](../type-aliases/DocumentObject.md)[]\>

Defined in: [store/data-source.ts:144](https://github.com/entropic-bond/entropic-bond/blob/29400710ffe30b175eeb7acf439ceed3b4724e16/src/store/data-source.ts#L144)

Retrieves all documents matching the query stored in the query object
Implement the required logic to retrieve the documents that match the 
requirements in the query object from your concrete the data source

#### Parameters

##### queryObject

[`QueryObject`](../type-aliases/QueryObject.md)\<[`DocumentObject`](../type-aliases/DocumentObject.md)\>

the query object containing the query operations

##### collectionName

`string`

the name of the collection where the documents are stored

#### Returns

`Promise`\<[`DocumentObject`](../type-aliases/DocumentObject.md)[]\>

a promise resolving to an array of document objects. The document object is
a plain object with the properties of the document class.

#### See

 - QueryObject
 - QueryOperation
 - QueryOperator
 - QueryOrder
 - DocumentObject

***

### findById()

> `abstract` **findById**(`id`, `collectionName`): `Promise`\<[`DocumentObject`](../type-aliases/DocumentObject.md)\>

Defined in: [store/data-source.ts:128](https://github.com/entropic-bond/entropic-bond/blob/29400710ffe30b175eeb7acf439ceed3b4724e16/src/store/data-source.ts#L128)

Retrieves a document by id
Implement the required logic to retrieve a document by id from your concrete
the data source

#### Parameters

##### id

`string`

the id of the document to be retrieved

##### collectionName

`string`

the name of the collection where the document is stored

#### Returns

`Promise`\<[`DocumentObject`](../type-aliases/DocumentObject.md)\>

a promise resolving to the document object. The document object is 
a plain object with the properties of the document class.

***

### installCachedPropsUpdater()

> **installCachedPropsUpdater**(`config?`): [`CachedPropsUpdater`](CachedPropsUpdater.md)

Defined in: [store/data-source.ts:202](https://github.com/entropic-bond/entropic-bond/blob/29400710ffe30b175eeb7acf439ceed3b4724e16/src/store/data-source.ts#L202)

#### Parameters

##### config?

[`CachedPropsUpdaterConfig`](../interfaces/CachedPropsUpdaterConfig.md)

#### Returns

[`CachedPropsUpdater`](CachedPropsUpdater.md)

***

### next()

> `abstract` **next**(`limit?`): `Promise`\<[`DocumentObject`](../type-aliases/DocumentObject.md)[]\>

Defined in: [store/data-source.ts:183](https://github.com/entropic-bond/entropic-bond/blob/29400710ffe30b175eeb7acf439ceed3b4724e16/src/store/data-source.ts#L183)

Retrieves the next bunch of documents matching the query stored in the query object
Implement the required logic to retrieve the next bunch of documents that match the
requirements in the query object from your concrete the data source

#### Parameters

##### limit?

`number`

the maximum number of items to be retrieved

#### Returns

`Promise`\<[`DocumentObject`](../type-aliases/DocumentObject.md)[]\>

a promise resolving to an array representing the next bunch of document objects

***

### onCollectionChange()

> `abstract` **onCollectionChange**(`query`, `collectionName`, `listener`): [`Unsubscriber`](../type-aliases/Unsubscriber.md)

Defined in: [store/data-source.ts:196](https://github.com/entropic-bond/entropic-bond/blob/29400710ffe30b175eeb7acf439ceed3b4724e16/src/store/data-source.ts#L196)

#### Parameters

##### query

[`QueryObject`](../type-aliases/QueryObject.md)\<[`DocumentObject`](../type-aliases/DocumentObject.md)\>

##### collectionName

`string`

##### listener

[`CollectionChangeListener`](../type-aliases/CollectionChangeListener.md)\<[`DocumentObject`](../type-aliases/DocumentObject.md)\>

#### Returns

[`Unsubscriber`](../type-aliases/Unsubscriber.md)

***

### onDocumentChange()

> `abstract` **onDocumentChange**(`documentPath`, `documentId`, `listener`): [`Unsubscriber`](../type-aliases/Unsubscriber.md)

Defined in: [store/data-source.ts:198](https://github.com/entropic-bond/entropic-bond/blob/29400710ffe30b175eeb7acf439ceed3b4724e16/src/store/data-source.ts#L198)

#### Parameters

##### documentPath

`string`

##### documentId

`string`

##### listener

[`DocumentChangeListener`](../type-aliases/DocumentChangeListener.md)\<[`DocumentObject`](../type-aliases/DocumentObject.md)\>

#### Returns

[`Unsubscriber`](../type-aliases/Unsubscriber.md)

***

### onDocumentTemplateChange()

> `abstract` **onDocumentTemplateChange**(`collectionTemplate`, `listener`): [`Unsubscriber`](../type-aliases/Unsubscriber.md)

Defined in: [store/data-source.ts:200](https://github.com/entropic-bond/entropic-bond/blob/29400710ffe30b175eeb7acf439ceed3b4724e16/src/store/data-source.ts#L200)

#### Parameters

##### collectionTemplate

`string`

##### listener

[`DocumentChangeListener`](../type-aliases/DocumentChangeListener.md)\<[`DocumentObject`](../type-aliases/DocumentObject.md)\>

#### Returns

[`Unsubscriber`](../type-aliases/Unsubscriber.md)

***

### resolveCollectionPaths()

> `abstract` `protected` **resolveCollectionPaths**(`template`): `Promise`\<`string`[]\>

Defined in: [store/data-source.ts:117](https://github.com/entropic-bond/entropic-bond/blob/29400710ffe30b175eeb7acf439ceed3b4724e16/src/store/data-source.ts#L117)

#### Parameters

##### template

`string`

#### Returns

`Promise`\<`string`[]\>

***

### runTransaction()

> `abstract` **runTransaction**\<`Result`\>(`fn`): `Promise`\<`Result`\>

Defined in: [store/data-source.ts:172](https://github.com/entropic-bond/entropic-bond/blob/29400710ffe30b175eeb7acf439ceed3b4724e16/src/store/data-source.ts#L172)

Runs a compare-and-set transaction. The callback receives a transaction
handle with findById/save/delete. The promise resolves with the callback's
result or rejects with a [TransactionConflictError](TransactionConflictError.md) when a document
read inside the transaction was modified by another writer before commit.

#### Type Parameters

##### Result

`Result`

#### Parameters

##### fn

(`handle`) => `Promise`\<`Result`\>

the transaction callback

#### Returns

`Promise`\<`Result`\>

a promise resolving with the callback's result

***

### save()

> `abstract` **save**(`object`): `Promise`\<`void`\>

Defined in: [store/data-source.ts:152](https://github.com/entropic-bond/entropic-bond/blob/29400710ffe30b175eeb7acf439ceed3b4724e16/src/store/data-source.ts#L152)

Saves a document
Implement the required logic to save the document in your concrete the data source

#### Parameters

##### object

[`Collections`](../type-aliases/Collections.md)

A collection of documents to be saved

#### Returns

`Promise`\<`void`\>

a promise

***

### extractTemplateParams()

> `static` **extractTemplateParams**(`source`, `template`): `Record`\<`string`, `string`\>

Defined in: [store/data-source.ts:295](https://github.com/entropic-bond/entropic-bond/blob/29400710ffe30b175eeb7acf439ceed3b4724e16/src/store/data-source.ts#L295)

#### Parameters

##### source

`string`

##### template

`string`

#### Returns

`Record`\<`string`, `string`\>

***

### isArrayOperator()

> `static` **isArrayOperator**(`operator`): `boolean`

Defined in: [store/data-source.ts:250](https://github.com/entropic-bond/entropic-bond/blob/29400710ffe30b175eeb7acf439ceed3b4724e16/src/store/data-source.ts#L250)

#### Parameters

##### operator

[`QueryOperator`](../type-aliases/QueryOperator.md)

#### Returns

`boolean`

***

### isStringMatchingTemplate()

> `static` **isStringMatchingTemplate**(`template`, `value`): `boolean`

Defined in: [store/data-source.ts:273](https://github.com/entropic-bond/entropic-bond/blob/29400710ffe30b175eeb7acf439ceed3b4724e16/src/store/data-source.ts#L273)

#### Parameters

##### template

`string`

##### value

`string`

#### Returns

`boolean`

***

### toPersistentDocumentChange()

> `static` **toPersistentDocumentChange**\<`T`\>(`change`): [`DocumentChange`](../interfaces/DocumentChange.md)\<`T`\>

Defined in: [store/data-source.ts:254](https://github.com/entropic-bond/entropic-bond/blob/29400710ffe30b175eeb7acf439ceed3b4724e16/src/store/data-source.ts#L254)

#### Type Parameters

##### T

`T` *extends* [`Persistent`](Persistent.md)

#### Parameters

##### change

[`DocumentChange`](../interfaces/DocumentChange.md)\<[`PersistentObject`](../type-aliases/PersistentObject.md)\<`T`\>\>

#### Returns

[`DocumentChange`](../interfaces/DocumentChange.md)\<`T`\>

***

### toPropertyPathOperations()

> `static` **toPropertyPathOperations**\<`T`\>(`operations`): [`QueryOperation`](../type-aliases/QueryOperation.md)\<`T`\>[]

Defined in: [store/data-source.ts:224](https://github.com/entropic-bond/entropic-bond/blob/29400710ffe30b175eeb7acf439ceed3b4724e16/src/store/data-source.ts#L224)

Utility method to convert a query object to a property path query object

#### Type Parameters

##### T

`T` *extends* [`Persistent`](Persistent.md)

#### Parameters

##### operations

[`QueryOperation`](../type-aliases/QueryOperation.md)\<`T`\>[]

the query object to be converted

#### Returns

[`QueryOperation`](../type-aliases/QueryOperation.md)\<`T`\>[]

a property path query object

#### Example

```ts
const queryObject = {
	operations: [{ property: 'name', operator: '==', value: { ancestorName: { father: 'Felipe' }}]
}
const propPathQueryObject = DataSource.toPropertyPathQueryObject( queryObject )
// returned value: [{ property: 'name.ancestorName.father', operator: '==', value: 'Felipe' }]
```

***

### toPropertyPathValue()

> `static` **toPropertyPathValue**(`obj`): \[`string` \| `undefined`, `unknown`\]

Defined in: [store/data-source.ts:262](https://github.com/entropic-bond/entropic-bond/blob/29400710ffe30b175eeb7acf439ceed3b4724e16/src/store/data-source.ts#L262)

#### Parameters

##### obj

`Record`\<`string`, `unknown`\>

#### Returns

\[`string` \| `undefined`, `unknown`\]
