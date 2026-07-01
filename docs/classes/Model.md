[**entropic-bond**](../README.md)

***

[entropic-bond](../globals.md) / Model

# Class: Model\<T\>

Defined in: [store/model.ts:10](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/model.ts#L10)

Provides abstraction to the database access. You should gain access to a Model
object through the Store.getModel method instead of its constructor.

## Type Parameters

### T

`T` *extends* [`Persistent`](Persistent.md)

## Constructors

### Constructor

> **new Model**\<`T`\>(`stream`, `persistentClass`, `subCollection?`): `Model`\<`T`\>

Defined in: [store/model.ts:16](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/model.ts#L16)

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

Defined in: [store/model.ts:222](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/model.ts#L222)

***

### error

> `static` **error**: `object`

Defined in: [store/model.ts:11](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/model.ts#L11)

#### invalidQueryOrder

> **invalidQueryOrder**: `string` = `'Cannot add where calls after or calls'`

#### persistentNeedForSubCollection

> **persistentNeedForSubCollection**: `string` = `'The document parameter for a sub-collection should be a Persistent instace'`

## Methods

### count()

> **count**(`queryObject`): `Promise`\<`number`\>

Defined in: [store/model.ts:125](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/model.ts#L125)

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

Defined in: [store/model.ts:83](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/model.ts#L83)

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

Defined in: [store/model.ts:95](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/model.ts#L95)

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

Defined in: [store/model.ts:40](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/model.ts#L40)

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

Defined in: [store/model.ts:135](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/model.ts#L135)

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

Defined in: [store/model.ts:147](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/model.ts#L147)

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

Defined in: [store/model.ts:157](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/model.ts#L157)

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

Defined in: [store/model.ts:139](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/model.ts#L139)

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

Defined in: [store/model.ts:106](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/model.ts#L106)

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

### save()

> **save**(`instance`): `Promise`\<`void`\>

Defined in: [store/model.ts:63](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/model.ts#L63)

Stores an object in the database

#### Parameters

##### instance

`T`

the object instance to store

#### Returns

`Promise`\<`void`\>

a promise
