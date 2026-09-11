[**entropic-bond**](../README.md)

***

[entropic-bond](../globals.md) / Model

# Class: Model\<T\>

Defined in: [store/model.ts:23](https://github.com/entropic-bond/entropic-bond/blob/29400710ffe30b175eeb7acf439ceed3b4724e16/src/store/model.ts#L23)

Provides abstraction to the database access. You should gain access to a Model
object through the Store.getModel method instead of its constructor.

## Type Parameters

### T

`T` *extends* [`Persistent`](Persistent.md)

## Constructors

### Constructor

> **new Model**\<`T`\>(`stream`, `persistentClass`, `subCollection?`): `Model`\<`T`\>

Defined in: [store/model.ts:29](https://github.com/entropic-bond/entropic-bond/blob/29400710ffe30b175eeb7acf439ceed3b4724e16/src/store/model.ts#L29)

#### Parameters

##### stream

[`DataSource`](DataSource.md)

##### persistentClass

`string` \| [`Persistent`](Persistent.md)

##### subCollection?

`string`

#### Returns

`Model`\<`T`\>

## Properties

### collectionName

> `readonly` **collectionName**: `string`

Defined in: [store/model.ts:277](https://github.com/entropic-bond/entropic-bond/blob/29400710ffe30b175eeb7acf439ceed3b4724e16/src/store/model.ts#L277)

***

### error

> `static` **error**: `object`

Defined in: [store/model.ts:24](https://github.com/entropic-bond/entropic-bond/blob/29400710ffe30b175eeb7acf439ceed3b4724e16/src/store/model.ts#L24)

#### invalidQueryOrder

> **invalidQueryOrder**: `string` = `'Cannot add where calls after or calls'`

#### persistentNeedForSubCollection

> **persistentNeedForSubCollection**: `string` = `'The document parameter for a sub-collection should be a Persistent instace'`

## Methods

### count()

> **count**(`queryObject`): `Promise`\<`number`\>

Defined in: [store/model.ts:180](https://github.com/entropic-bond/entropic-bond/blob/29400710ffe30b175eeb7acf439ceed3b4724e16/src/store/model.ts#L180)

Get the amount of documents matching the query

#### Parameters

##### queryObject

[`QueryObject`](../type-aliases/QueryObject.md)\<`T`\>

the QueryObject with the search constrains

#### Returns

`Promise`\<`number`\>

a promise resolving to the amount of matched documents

***

### delete()

> **delete**(`id`): `Promise`\<`void`\>

Defined in: [store/model.ts:96](https://github.com/entropic-bond/entropic-bond/blob/29400710ffe30b175eeb7acf439ceed3b4724e16/src/store/model.ts#L96)

Removes an element from the database by id

#### Parameters

##### id

`string`

the id of the element to be removed

#### Returns

`Promise`\<`void`\>

a promise

***

### find()

> **find**\<`U`\>(): [`Query`](Query.md)\<`U`\>

Defined in: [store/model.ts:150](https://github.com/entropic-bond/entropic-bond/blob/29400710ffe30b175eeb7acf439ceed3b4724e16/src/store/model.ts#L150)

Call find to retrieve a Query object used to define the search conditions

#### Type Parameters

##### U

`U` *extends* [`Persistent`](Persistent.md)

#### Returns

[`Query`](Query.md)\<`U`\>

a Query object

***

### findById()

> **findById**\<`D`\>(`id`, `instance?`): `Promise`\<`D` \| `undefined`\>

Defined in: [store/model.ts:53](https://github.com/entropic-bond/entropic-bond/blob/29400710ffe30b175eeb7acf439ceed3b4724e16/src/store/model.ts#L53)

Finds an stored object in the database by its id. The field id is provided
by the Persistent parent class and it is automatically managed. Therefore,
you should obtain the id by looking at the id field of the object.

#### Type Parameters

##### D

`D` *extends* [`Persistent`](Persistent.md)

#### Parameters

##### id

`string`

the id to look for

##### instance?

`D`

you can pass an instace that will be filled with the found data

#### Returns

`Promise`\<`D` \| `undefined`\>

a promise resolving to an instance with the found data

***

### next()

> **next**\<`U`\>(`limit?`): `Promise`\<`U`[]\>

Defined in: [store/model.ts:190](https://github.com/entropic-bond/entropic-bond/blob/29400710ffe30b175eeb7acf439ceed3b4724e16/src/store/model.ts#L190)

Get the next bunch of documents matching the last query

#### Type Parameters

##### U

`U` *extends* [`Persistent`](Persistent.md)

#### Parameters

##### limit?

`number`

the max amount of documents to retrieve. If not set, uses the
last limit set

#### Returns

`Promise`\<`U`[]\>

a promise resolving to a collection of matched documents

***

### onCollectionChange()

> **onCollectionChange**(`query`, `listener`): [`Unsubscriber`](../type-aliases/Unsubscriber.md)

Defined in: [store/model.ts:202](https://github.com/entropic-bond/entropic-bond/blob/29400710ffe30b175eeb7acf439ceed3b4724e16/src/store/model.ts#L202)

#### Parameters

##### query

[`Query`](Query.md)\<`T`\>

##### listener

[`CollectionChangeListener`](../type-aliases/CollectionChangeListener.md)\<`T`\>

#### Returns

[`Unsubscriber`](../type-aliases/Unsubscriber.md)

***

### onCollectionTemplateChange()

> **onCollectionTemplateChange**(`collectionTemplate`, `listener`): [`Unsubscriber`](../type-aliases/Unsubscriber.md)

Defined in: [store/model.ts:212](https://github.com/entropic-bond/entropic-bond/blob/29400710ffe30b175eeb7acf439ceed3b4724e16/src/store/model.ts#L212)

#### Parameters

##### collectionTemplate

`string`

##### listener

[`DocumentChangeListener`](../type-aliases/DocumentChangeListener.md)\<`T`\>

#### Returns

[`Unsubscriber`](../type-aliases/Unsubscriber.md)

***

### onDocumentChange()

> **onDocumentChange**(`documentId`, `listener`): [`Unsubscriber`](../type-aliases/Unsubscriber.md)

Defined in: [store/model.ts:194](https://github.com/entropic-bond/entropic-bond/blob/29400710ffe30b175eeb7acf439ceed3b4724e16/src/store/model.ts#L194)

#### Parameters

##### documentId

`string`

##### listener

[`DocumentChangeListener`](../type-aliases/DocumentChangeListener.md)\<`T`\>

#### Returns

[`Unsubscriber`](../type-aliases/Unsubscriber.md)

***

### query()

> **query**\<`U`\>(`queryObject?`, `objectType?`): `Promise`\<`U`[]\>

Defined in: [store/model.ts:161](https://github.com/entropic-bond/entropic-bond/blob/29400710ffe30b175eeb7acf439ceed3b4724e16/src/store/model.ts#L161)

Define the search conditions. You pass query operations and how the query
results are returned to the QueryObject

#### Type Parameters

##### U

`U` *extends* [`Persistent`](Persistent.md)

#### Parameters

##### queryObject?

[`QueryObject`](../type-aliases/QueryObject.md)\<`U`\> = `{}`

the QueryObject with the search constrains

##### objectType?

`string` \| `U`

Deprecated! - restricts the search to a specific instances of the class type

#### Returns

`Promise`\<`U`[]\>

a promise resolving to a collection of matched documents

***

### runTransaction()

> **runTransaction**\<`A`\>(`fn`): `Promise`\<`A`\>

Defined in: [store/model.ts:115](https://github.com/entropic-bond/entropic-bond/blob/29400710ffe30b175eeb7acf439ceed3b4724e16/src/store/model.ts#L115)

Runs a compare-and-set transaction proxied to the underlying data source.
The callback receives a handle whose findById/save/delete work with Persistent
instances. The promise resolves with the callback's result or rejects with
a [TransactionConflictError](TransactionConflictError.md) when a document read inside the
transaction was modified by another writer before commit.

#### Type Parameters

##### A

`A` *extends* [`Persistent`](Persistent.md)

#### Parameters

##### fn

(`handle`) => `Promise`\<`A`\>

the transaction callback

#### Returns

`Promise`\<`A`\>

a promise resolving with the callback's result

#### See

 - DataSource.runTransaction
 - ModelTransactionHandle

***

### save()

> **save**(`instance`): `Promise`\<`void`\>

Defined in: [store/model.ts:76](https://github.com/entropic-bond/entropic-bond/blob/29400710ffe30b175eeb7acf439ceed3b4724e16/src/store/model.ts#L76)

Stores an object in the database

#### Parameters

##### instance

`T`

the object instance to store

#### Returns

`Promise`\<`void`\>

a promise
