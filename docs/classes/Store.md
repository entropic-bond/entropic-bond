[entropic-bond](../README.md) / [Exports](../modules.md) / Store

# Class: Store

The store is the main entry point for the data access layer.
It provides methods to retrieve models for collections and subcollections.
It also provides methods to populate property references with actual data from the store.
You need to register a data source before using the store.

**`Example`**

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

## Table of contents

### Properties

- [error](Store.md#error)

### Accessors

- [dataSource](Store.md#datasource)

### Methods

- [getModel](Store.md#getmodel)
- [getModelForSubCollection](Store.md#getmodelforsubcollection)
- [isPopulated](Store.md#ispopulated)
- [populate](Store.md#populate)
- [useDataSource](Store.md#usedatasource)

## Properties

### error

▪ `Static` **error**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `shouldBeRegistered` | `string` |

#### Defined in

[store/store.ts:23](https://github.com/entropic-bond/entropic-bond/blob/2d7d466/src/store/store.ts#L23)

## Accessors

### dataSource

• `Static` `get` **dataSource**(): [`DataSource`](DataSource.md)

The data source currently used by the store

#### Returns

[`DataSource`](DataSource.md)

the data source

#### Defined in

[store/store.ts:38](https://github.com/entropic-bond/entropic-bond/blob/2d7d466/src/store/store.ts#L38)

## Methods

### getModel

▸ `Static` **getModel**<`T`\>(`classId`): [`Model`](Model.md)<`T`\>

Retrieves a model for a collection

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`Persistent`](Persistent.md)<`T`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `classId` | `string` \| `T` | the class name or an instance of the document type stored in the collection |

#### Returns

[`Model`](Model.md)<`T`\>

the model for the collection

#### Defined in

[store/store.ts:47](https://github.com/entropic-bond/entropic-bond/blob/2d7d466/src/store/store.ts#L47)

___

### getModelForSubCollection

▸ `Static` **getModelForSubCollection**<`T`\>(`document`, `subCollection`): [`Model`](Model.md)<`T`\>

Retrieves a model for a subcollection

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`Persistent`](Persistent.md)<`T`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `document` | [`Persistent`](Persistent.md) | the persistent object that owns the subcollection |
| `subCollection` | `string` | the name of the subcollection |

#### Returns

[`Model`](Model.md)<`T`\>

the model for the subcollection

#### Defined in

[store/store.ts:58](https://github.com/entropic-bond/entropic-bond/blob/2d7d466/src/store/store.ts#L58)

___

### isPopulated

▸ `Static` **isPopulated**<`T`\>(`instance`): `boolean`

Checks if an instance is populated

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`Persistent`](Persistent.md)<`T`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `instance` | `T` \| readonly `T`[] | the instance or array of instances to be checked |

#### Returns

`boolean`

true if the instance is populated

#### Defined in

[store/store.ts:100](https://github.com/entropic-bond/entropic-bond/blob/2d7d466/src/store/store.ts#L100)

___

### populate

▸ `Static` **populate**<`T`\>(`instance`): `Promise`<`T`\>

Populates property references with actual data from the store.
It will not retrieve data if the instance is already populated

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`Persistent`](Persistent.md) \| [`Persistent`](Persistent.md)[] |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `instance` | `T` | the data to be populated. |

#### Returns

`Promise`<`T`\>

the populated instance

#### Defined in

[store/store.ts:69](https://github.com/entropic-bond/entropic-bond/blob/2d7d466/src/store/store.ts#L69)

___

### useDataSource

▸ `Static` **useDataSource**(`dataSource`): `void`

Registers a data source to be used by the store.
You need to register a data source before using the store.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `dataSource` | [`DataSource`](DataSource.md) | the data source to be used by the store |

#### Returns

`void`

#### Defined in

[store/store.ts:30](https://github.com/entropic-bond/entropic-bond/blob/2d7d466/src/store/store.ts#L30)
