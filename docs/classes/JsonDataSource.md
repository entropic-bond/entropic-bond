[**entropic-bond**](../README.md)

***

[entropic-bond](../globals.md) / JsonDataSource

# Class: JsonDataSource

Defined in: [store/json-data-source.ts:29](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/json-data-source.ts#L29)

A concrete implementation of the DataSource interface uses an in-memory data store
initialized by a JSON object.
It is useful for testing purposes.
The data in the JSON object is not persisted.

## Extends

- [`DataSource`](DataSource.md)

## Constructors

### Constructor

> **new JsonDataSource**(`jsonRawData?`): `JsonDataSource`

Defined in: [store/json-data-source.ts:34](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/json-data-source.ts#L34)

#### Parameters

##### jsonRawData?

[`JsonRawData`](../interfaces/JsonRawData.md)

the JSON object to be used as data store

#### Returns

`JsonDataSource`

#### Overrides

[`DataSource`](DataSource.md).[`constructor`](DataSource.md#constructor)

## Accessors

### cachedPropsUpdater

#### Get Signature

> **get** **cachedPropsUpdater**(): [`CachedPropsUpdater`](CachedPropsUpdater.md) \| `undefined`

Defined in: [store/data-source.ts:161](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/data-source.ts#L161)

##### Returns

[`CachedPropsUpdater`](CachedPropsUpdater.md) \| `undefined`

#### Inherited from

[`DataSource`](DataSource.md).[`cachedPropsUpdater`](DataSource.md#cachedpropsupdater)

***

### rawData

#### Get Signature

> **get** **rawData**(): [`JsonRawData`](../interfaces/JsonRawData.md)

Defined in: [store/json-data-source.ts:187](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/json-data-source.ts#L187)

##### Returns

[`JsonRawData`](../interfaces/JsonRawData.md)

the raw data store data as a JSON object

## Methods

### count()

> **count**(`queryObject`, `collectionName`): `Promise`\<`number`\>

Defined in: [store/json-data-source.ts:114](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/json-data-source.ts#L114)

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

#### Overrides

[`DataSource`](DataSource.md).[`count`](DataSource.md#count)

***

### delete()

> **delete**(`id`, `collectionName`): `Promise`\<`void`\>

Defined in: [store/json-data-source.ts:100](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/json-data-source.ts#L100)

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

#### Overrides

[`DataSource`](DataSource.md).[`delete`](DataSource.md#delete)

***

### find()

> **find**(`queryObject`, `collectionName`): `Promise`\<[`DocumentObject`](../type-aliases/DocumentObject.md)[]\>

Defined in: [store/json-data-source.ts:80](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/json-data-source.ts#L80)

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

#### Overrides

[`DataSource`](DataSource.md).[`find`](DataSource.md#find)

***

### findById()

> **findById**(`id`, `collectionName`): `Promise`\<[`DocumentObject`](../type-aliases/DocumentObject.md)\>

Defined in: [store/json-data-source.ts:59](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/json-data-source.ts#L59)

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

#### Overrides

[`DataSource`](DataSource.md).[`findById`](DataSource.md#findbyid)

***

### installCachedPropsUpdater()

> **installCachedPropsUpdater**(`config?`): [`CachedPropsUpdater`](CachedPropsUpdater.md)

Defined in: [store/data-source.ts:155](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/data-source.ts#L155)

#### Parameters

##### config?

[`CachedPropsUpdaterConfig`](../interfaces/CachedPropsUpdaterConfig.md)

#### Returns

[`CachedPropsUpdater`](CachedPropsUpdater.md)

#### Inherited from

[`DataSource`](DataSource.md).[`installCachedPropsUpdater`](DataSource.md#installcachedpropsupdater)

***

### next()

> **next**(`limit?`): `Promise`\<[`DocumentObject`](../type-aliases/DocumentObject.md)[]\>

Defined in: [store/json-data-source.ts:107](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/json-data-source.ts#L107)

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

#### Overrides

[`DataSource`](DataSource.md).[`next`](DataSource.md#next)

***

### onCollectionChange()

> **onCollectionChange**(`query`, `collectionName`, `listener`): [`Unsubscriber`](../type-aliases/Unsubscriber.md)

Defined in: [store/json-data-source.ts:120](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/json-data-source.ts#L120)

#### Parameters

##### query

[`QueryObject`](../type-aliases/QueryObject.md)\<[`DocumentObject`](../type-aliases/DocumentObject.md)\>

##### collectionName

`string`

##### listener

[`CollectionChangeListener`](../type-aliases/CollectionChangeListener.md)\<[`DocumentObject`](../type-aliases/DocumentObject.md)\>

#### Returns

[`Unsubscriber`](../type-aliases/Unsubscriber.md)

#### Overrides

[`DataSource`](DataSource.md).[`onCollectionChange`](DataSource.md#oncollectionchange)

***

### onDocumentChange()

> **onDocumentChange**(`collectionName`, `documentId`, `listener`): [`Unsubscriber`](../type-aliases/Unsubscriber.md)

Defined in: [store/json-data-source.ts:145](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/json-data-source.ts#L145)

#### Parameters

##### collectionName

`string`

##### documentId

`string`

##### listener

[`DocumentChangeListener`](../type-aliases/DocumentChangeListener.md)\<[`DocumentObject`](../type-aliases/DocumentObject.md)\>

#### Returns

[`Unsubscriber`](../type-aliases/Unsubscriber.md)

#### Overrides

[`DataSource`](DataSource.md).[`onDocumentChange`](DataSource.md#ondocumentchange)

***

### onDocumentTemplateChange()

> **onDocumentTemplateChange**(`collectionTemplate`, `listener`): [`Unsubscriber`](../type-aliases/Unsubscriber.md)

Defined in: [store/json-data-source.ts:160](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/json-data-source.ts#L160)

#### Parameters

##### collectionTemplate

`string`

##### listener

[`DocumentChangeListener`](../type-aliases/DocumentChangeListener.md)\<[`DocumentObject`](../type-aliases/DocumentObject.md)\>

#### Returns

[`Unsubscriber`](../type-aliases/Unsubscriber.md)

#### Overrides

[`DataSource`](DataSource.md).[`onDocumentTemplateChange`](DataSource.md#ondocumenttemplatechange)

***

### resolveCollectionPaths()

> `protected` **resolveCollectionPaths**(`template`): `Promise`\<`string`[]\>

Defined in: [store/json-data-source.ts:333](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/json-data-source.ts#L333)

#### Parameters

##### template

`string`

#### Returns

`Promise`\<`string`[]\>

#### Overrides

[`DataSource`](DataSource.md).[`resolveCollectionPaths`](DataSource.md#resolvecollectionpaths)

***

### save()

> **save**(`collections`): `Promise`\<`void`\>

Defined in: [store/json-data-source.ts:65](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/json-data-source.ts#L65)

Saves a document
Implement the required logic to save the document in your concrete the data source

#### Parameters

##### collections

[`Collections`](../type-aliases/Collections.md)

#### Returns

`Promise`\<`void`\>

a promise

#### Overrides

[`DataSource`](DataSource.md).[`save`](DataSource.md#save)

***

### setDataStore()

> **setDataStore**(`rawDataStore`): `JsonDataSource`

Defined in: [store/json-data-source.ts:44](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/json-data-source.ts#L44)

Set the JSON object to initialize the data store. Use to set the it after 
the constructor has been called.

#### Parameters

##### rawDataStore

[`JsonRawData`](../interfaces/JsonRawData.md)

the JSON object to be used as data store

#### Returns

`JsonDataSource`

***

### simulateDelay()

> **simulateDelay**(`miliSeconds`): `JsonDataSource`

Defined in: [store/json-data-source.ts:54](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/json-data-source.ts#L54)

Introduce a delay in the execution of operations to simulate a real data source

#### Parameters

##### miliSeconds

`number`

the number of milliseconds to delay the execution of operations

#### Returns

`JsonDataSource`

a chainable reference to this object

***

### simulateError()

> **simulateError**(`error`): `this`

Defined in: [store/json-data-source.ts:206](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/json-data-source.ts#L206)

#### Parameters

##### error

`string` \| [`ErrorOnOperation`](../interfaces/ErrorOnOperation.md) \| `undefined`

#### Returns

`this`

***

### wait()

> **wait**(): `Promise`\<`any`[]\>

Defined in: [store/json-data-source.ts:195](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/json-data-source.ts#L195)

Wait for all pending promises to be resolved

#### Returns

`Promise`\<`any`[]\>

a promise that resolves when all pending promises are resolved

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

#### Inherited from

[`DataSource`](DataSource.md).[`extractTemplateParams`](DataSource.md#extracttemplateparams)

***

### isArrayOperator()

> `static` **isArrayOperator**(`operator`): `boolean`

Defined in: [store/data-source.ts:203](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/data-source.ts#L203)

#### Parameters

##### operator

[`QueryOperator`](../type-aliases/QueryOperator.md)

#### Returns

`boolean`

#### Inherited from

[`DataSource`](DataSource.md).[`isArrayOperator`](DataSource.md#isarrayoperator)

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

#### Inherited from

[`DataSource`](DataSource.md).[`isStringMatchingTemplate`](DataSource.md#isstringmatchingtemplate)

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

#### Inherited from

[`DataSource`](DataSource.md).[`toPersistentDocumentChange`](DataSource.md#topersistentdocumentchange)

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

#### Inherited from

[`DataSource`](DataSource.md).[`toPropertyPathOperations`](DataSource.md#topropertypathoperations)

***

### toPropertyPathValue()

> `static` **toPropertyPathValue**(`obj`): \[`string` \| `undefined`, `unknown`\]

Defined in: [store/data-source.ts:215](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/data-source.ts#L215)

#### Parameters

##### obj

`Record`\<`string`, `unknown`\>

#### Returns

\[`string` \| `undefined`, `unknown`\]

#### Inherited from

[`DataSource`](DataSource.md).[`toPropertyPathValue`](DataSource.md#topropertypathvalue)
