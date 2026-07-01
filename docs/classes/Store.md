[**entropic-bond**](../README.md)

***

[entropic-bond](../globals.md) / Store

# Class: Store

Defined in: [store/store.ts:20](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/store.ts#L20)

The store is the main entry point for the data access layer.
It provides methods to retrieve models for collections and subcollections.
It also provides methods to populate property references with actual data from the store.
You need to register a data source before using the store.

## Example

```ts
// Register a data source
Store.useDataSource( new FirestoreDataSource( firebase.firestore() ) )
// Retrieve a model for a collection
const model = Store.getModel( 'User' )
// Retrieve a model for a subcollection
const model = Store.getModelForSubCollection( user, 'Posts' )
// Populate property references
const user = await Store.populate( user )
```

## Properties

### error

> `static` **error**: `object`

Defined in: [store/store.ts:23](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/store.ts#L23)

#### shouldBeRegistered

> **shouldBeRegistered**: `string` = `'You should register a data source before using the data Store.'`

## Accessors

### dataSource

#### Get Signature

> **get** `static` **dataSource**(): [`DataSource`](DataSource.md)

Defined in: [store/store.ts:38](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/store.ts#L38)

The data source currently used by the store

##### Returns

[`DataSource`](DataSource.md)

the data source

## Methods

### getModel()

> `static` **getModel**\<`T`\>(`classId`): [`Model`](Model.md)\<`T`\>

Defined in: [store/store.ts:47](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/store.ts#L47)

Retrieves a model for a collection

#### Type Parameters

##### T

`T` *extends* [`Persistent`](Persistent.md)

#### Parameters

##### classId

`string` \| `T`

the class name or an instance of the document type stored in the collection

#### Returns

[`Model`](Model.md)\<`T`\>

the model for the collection

***

### getModelForSubCollection()

> `static` **getModelForSubCollection**\<`T`\>(`document`, `subCollection`): [`Model`](Model.md)\<`T`\>

Defined in: [store/store.ts:58](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/store.ts#L58)

Retrieves a model for a subcollection

#### Type Parameters

##### T

`T` *extends* [`Persistent`](Persistent.md)

#### Parameters

##### document

[`Persistent`](Persistent.md)

the persistent object that owns the subcollection

##### subCollection

`string`

the name of the subcollection

#### Returns

[`Model`](Model.md)\<`T`\>

the model for the subcollection

***

### isPopulated()

> `static` **isPopulated**\<`T`\>(`instance`): `boolean`

Defined in: [store/store.ts:100](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/store.ts#L100)

Checks if an instance is populated

#### Type Parameters

##### T

`T` *extends* [`Persistent`](Persistent.md)

#### Parameters

##### instance

`T` \| readonly `T`[]

the instance or array of instances to be checked

#### Returns

`boolean`

true if the instance is populated

***

### populate()

> `static` **populate**\<`T`\>(`instance`): `Promise`\<`T`\>

Defined in: [store/store.ts:69](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/store.ts#L69)

Populates property references with actual data from the store.
It will not retrieve data if the instance is already populated

#### Type Parameters

##### T

`T` *extends* [`Persistent`](Persistent.md) \| [`Persistent`](Persistent.md)[]

#### Parameters

##### instance

`T`

the data to be populated.

#### Returns

`Promise`\<`T`\>

the populated instance

***

### useDataSource()

> `static` **useDataSource**(`dataSource`): `void`

Defined in: [store/store.ts:30](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/store/store.ts#L30)

Registers a data source to be used by the store.
You need to register a data source before using the store.

#### Parameters

##### dataSource

[`DataSource`](DataSource.md)

the data source to be used by the store

#### Returns

`void`
