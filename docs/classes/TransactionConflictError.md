[**entropic-bond**](../README.md)

***

[entropic-bond](../globals.md) / TransactionConflictError

# Class: TransactionConflictError

Defined in: [store/data-source.ts:88](https://github.com/entropic-bond/entropic-bond/blob/29400710ffe30b175eeb7acf439ceed3b4724e16/src/store/data-source.ts#L88)

Thrown when a transaction cannot commit because a document read inside the
transaction was modified by another writer (or because the transaction
precondition failed).

## Param

**storedDoc**

the current stored document when available

## Extends

- `Error`

## Constructors

### Constructor

> **new TransactionConflictError**(`storedDoc?`): `TransactionConflictError`

Defined in: [store/data-source.ts:89](https://github.com/entropic-bond/entropic-bond/blob/29400710ffe30b175eeb7acf439ceed3b4724e16/src/store/data-source.ts#L89)

#### Parameters

##### storedDoc?

[`Persistent`](Persistent.md) \| [`DocumentObject`](../type-aliases/DocumentObject.md)

#### Returns

`TransactionConflictError`

#### Overrides

`Error.constructor`

## Properties

### message

> **message**: `string`

Defined in: [store/data-source.ts:75](https://github.com/entropic-bond/entropic-bond/blob/29400710ffe30b175eeb7acf439ceed3b4724e16/src/store/data-source.ts#L75)

#### Inherited from

`Error.message`

***

### name

> **name**: `string`

Defined in: [store/data-source.ts:74](https://github.com/entropic-bond/entropic-bond/blob/29400710ffe30b175eeb7acf439ceed3b4724e16/src/store/data-source.ts#L74)

#### Inherited from

`Error.name`

***

### storedDoc?

> `optional` **storedDoc?**: [`Persistent`](Persistent.md) \| [`DocumentObject`](../type-aliases/DocumentObject.md)

Defined in: [store/data-source.ts:89](https://github.com/entropic-bond/entropic-bond/blob/29400710ffe30b175eeb7acf439ceed3b4724e16/src/store/data-source.ts#L89)
