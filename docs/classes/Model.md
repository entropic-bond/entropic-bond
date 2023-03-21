[entropic-bond](../README.md) / [Exports](../modules.md) / Model

# Class: Model<T\>

Provides abstraction to the database access. You should gain access to a Model
object through the Store.getModel method instead of its constructor.

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`Persistent`](Persistent.md) |

## Table of contents

### Constructors

- [constructor](Model.md#constructor)

### Properties

- [collectionName](Model.md#collectionname)
- [error](Model.md#error)

### Methods

- [count](Model.md#count)
- [delete](Model.md#delete)
- [find](Model.md#find)
- [findById](Model.md#findbyid)
- [next](Model.md#next)
- [query](Model.md#query)
- [save](Model.md#save)

## Constructors

### constructor

• **new Model**<`T`\>(`stream`, `persistentClass`, `subCollection?`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`Persistent`](Persistent.md)<`T`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `stream` | [`DataSource`](DataSource.md) |
| `persistentClass` | `string` \| [`Persistent`](Persistent.md) |
| `subCollection?` | `string` |

#### Defined in

[store/model.ts:12](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/store/model.ts#L12)

## Properties

### collectionName

• `Readonly` **collectionName**: `string`

#### Defined in

[store/model.ts:150](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/store/model.ts#L150)

___

### error

▪ `Static` **error**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `persistentNeedForSubCollection` | `string` |

#### Defined in

[store/model.ts:10](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/store/model.ts#L10)

## Methods

### count

▸ **count**(`queryObject`): `Promise`<`number`\>

Get the amount of documents matching the query

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `queryObject` | [`QueryObject`](../modules.md#queryobject)<`T`\> | the QueryObject with the search constrains |

#### Returns

`Promise`<`number`\>

a promise resolving to the amount of matched documents

#### Defined in

[store/model.ts:116](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/store/model.ts#L116)

___

### delete

▸ **delete**(`id`): `Promise`<`void`\>

Removes an element from the database by id

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | the id of the element to be removed |

#### Returns

`Promise`<`void`\>

a promise

#### Defined in

[store/model.ts:79](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/store/model.ts#L79)

___

### find

▸ **find**<`U`\>(): `Query`<`U`\>

Call find to retrieve a Query object used to define the search conditions

#### Type parameters

| Name | Type |
| :------ | :------ |
| `U` | extends [`Persistent`](Persistent.md)<`U`\> |

#### Returns

`Query`<`U`\>

a Query object

#### Defined in

[store/model.ts:87](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/store/model.ts#L87)

___

### findById

▸ **findById**<`D`\>(`id`, `instance?`): `Promise`<`D`\>

Finds an stored object in the database by its id. The field id is provided
by the Persistent parent class and it is automatically managed. Therefore,
you should obtain the id by looking at the id field of the object.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `D` | extends [`Persistent`](Persistent.md)<`D`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | the id to look for |
| `instance?` | `D` | you can pass an instace that will be filled with the found data |

#### Returns

`Promise`<`D`\>

a promise resolving to an instance with the found data

#### Defined in

[store/model.ts:36](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/store/model.ts#L36)

___

### next

▸ **next**<`U`\>(`limit?`): `Promise`<`U`[]\>

Get the next bunch of documents matching the last query

#### Type parameters

| Name | Type |
| :------ | :------ |
| `U` | extends [`Persistent`](Persistent.md)<`U`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `limit?` | `number` | the max amount of documents to retrieve. If not set, uses the last limit set |

#### Returns

`Promise`<`U`[]\>

a promise resolving to a collection of matched documents

#### Defined in

[store/model.ts:126](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/store/model.ts#L126)

___

### query

▸ **query**<`U`\>(`queryObject?`, `objectType?`): `Promise`<`U`[]\>

Define the search conditions. You pass query operations and how the query
results are returned to the QueryObject

#### Type parameters

| Name | Type |
| :------ | :------ |
| `U` | extends [`Persistent`](Persistent.md)<`U`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `queryObject` | [`QueryObject`](../modules.md#queryobject)<`U`\> | the QueryObject with the search constrains |
| `objectType?` | `string` \| `U` | - |

#### Returns

`Promise`<`U`[]\>

a promise resolving to a collection of matched documents

#### Defined in

[store/model.ts:97](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/store/model.ts#L97)

___

### save

▸ **save**(`instance`): `Promise`<`void`\>

Stores an object in the database

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `instance` | `T` | the object instance to store |

#### Returns

`Promise`<`void`\>

a promise

#### Defined in

[store/model.ts:59](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/store/model.ts#L59)
