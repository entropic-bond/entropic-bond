[**entropic-bond**](../README.md)

***

[entropic-bond](../globals.md) / DataSource

# Abstract Class: DataSource

Defined in: [store/data-source.ts:80](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/data-source.ts#L80)

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

Defined in: [store/data-source.ts:161](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/data-source.ts#L161)

##### Returns

[`CachedPropsUpdater`](CachedPropsUpdater.md) \| `undefined`

## Methods

### count()

> `abstract` **count**(`queryObject`, `collectionName`): `Promise`\<`number`\>

Defined in: [store/data-source.ts:147](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/data-source.ts#L147)

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

Defined in: [store/data-source.ts:127](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/data-source.ts#L127)

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

Defined in: [store/data-source.ts:109](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/data-source.ts#L109)

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

Defined in: [store/data-source.ts:93](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/data-source.ts#L93)

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

Defined in: [store/data-source.ts:155](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/data-source.ts#L155)

#### Parameters

##### config?

[`CachedPropsUpdaterConfig`](../interfaces/CachedPropsUpdaterConfig.md)

#### Returns

[`CachedPropsUpdater`](CachedPropsUpdater.md)

***

### next()

> `abstract` **next**(`limit?`): `Promise`\<[`DocumentObject`](../type-aliases/DocumentObject.md)[]\>

Defined in: [store/data-source.ts:136](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/data-source.ts#L136)

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

Defined in: [store/data-source.ts:149](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/data-source.ts#L149)

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

Defined in: [store/data-source.ts:151](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/data-source.ts#L151)

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

Defined in: [store/data-source.ts:153](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/data-source.ts#L153)

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

Defined in: [store/data-source.ts:82](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/data-source.ts#L82)

#### Parameters

##### template

`string`

#### Returns

`Promise`\<`string`[]\>

***

### save()

> `abstract` **save**(`object`): `Promise`\<`void`\>

Defined in: [store/data-source.ts:117](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/data-source.ts#L117)

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

Defined in: [store/data-source.ts:248](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/data-source.ts#L248)

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

Defined in: [store/data-source.ts:203](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/data-source.ts#L203)

#### Parameters

##### operator

[`QueryOperator`](../type-aliases/QueryOperator.md)

#### Returns

`boolean`

***

### isStringMatchingTemplate()

> `static` **isStringMatchingTemplate**(`template`, `value`): `boolean`

Defined in: [store/data-source.ts:226](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/data-source.ts#L226)

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

Defined in: [store/data-source.ts:207](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/data-source.ts#L207)

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

Defined in: [store/data-source.ts:177](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/data-source.ts#L177)

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

Defined in: [store/data-source.ts:215](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/data-source.ts#L215)

#### Parameters

##### obj

`Record`\<`string`, `unknown`\>

#### Returns

\[`string` \| `undefined`, `unknown`\]
