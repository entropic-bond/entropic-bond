[**entropic-bond**](../README.md)

***

[entropic-bond](../globals.md) / ModelTransactionHandle

# Interface: ModelTransactionHandle\<T\>

Defined in: [store/model.ts:13](https://github.com/entropic-bond/entropic-bond/blob/29400710ffe30b175eeb7acf439ceed3b4724e16/src/store/model.ts#L13)

The handle passed to a Model.runTransaction callback. All operations work with
Persistent instances of the model's collection, never with raw document objects.

## Param

**findById**

retrieves an instance by id, pinning its version for the transaction

## Param

**save**

merges the serialized instance (and its referenced documents) into the collection

## Param

**delete**

removes the instance's document

## Type Parameters

### T

`T` *extends* [`Persistent`](../classes/Persistent.md)

## Methods

### delete()

> **delete**(`instance`): `Promise`\<`void`\>

Defined in: [store/model.ts:16](https://github.com/entropic-bond/entropic-bond/blob/29400710ffe30b175eeb7acf439ceed3b4724e16/src/store/model.ts#L16)

#### Parameters

##### instance

`T`

#### Returns

`Promise`\<`void`\>

***

### findById()

> **findById**(`id`): `Promise`\<`T` \| `undefined`\>

Defined in: [store/model.ts:14](https://github.com/entropic-bond/entropic-bond/blob/29400710ffe30b175eeb7acf439ceed3b4724e16/src/store/model.ts#L14)

#### Parameters

##### id

`string`

#### Returns

`Promise`\<`T` \| `undefined`\>

***

### save()

> **save**(`instance`): `Promise`\<`void`\>

Defined in: [store/model.ts:15](https://github.com/entropic-bond/entropic-bond/blob/29400710ffe30b175eeb7acf439ceed3b4724e16/src/store/model.ts#L15)

#### Parameters

##### instance

`T`

#### Returns

`Promise`\<`void`\>
