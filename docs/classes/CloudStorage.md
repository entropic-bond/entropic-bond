[**entropic-bond**](../README.md)

***

[entropic-bond](../globals.md) / CloudStorage

# Abstract Class: CloudStorage

Defined in: [cloud-storage/cloud-storage.ts:18](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/cloud-storage/cloud-storage.ts#L18)

## Extended by

- [`MockCloudStorage`](MockCloudStorage.md)

## Constructors

### Constructor

> **new CloudStorage**(): `CloudStorage`

#### Returns

`CloudStorage`

## Properties

### \_defaultCloudStorage

> `static` **\_defaultCloudStorage**: `CloudStorage`

Defined in: [cloud-storage/cloud-storage.ts:51](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/cloud-storage/cloud-storage.ts#L51)

## Accessors

### className

#### Get Signature

> **get** **className**(): `string`

Defined in: [cloud-storage/cloud-storage.ts:37](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/cloud-storage/cloud-storage.ts#L37)

##### Returns

`string`

***

### defaultCloudStorage

#### Get Signature

> **get** `static` **defaultCloudStorage**(): `CloudStorage`

Defined in: [cloud-storage/cloud-storage.ts:45](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/cloud-storage/cloud-storage.ts#L45)

##### Returns

`CloudStorage`

## Methods

### delete()

> `abstract` **delete**(`reference`): `Promise`\<`void`\>

Defined in: [cloud-storage/cloud-storage.ts:22](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/cloud-storage/cloud-storage.ts#L22)

#### Parameters

##### reference

`string`

#### Returns

`Promise`\<`void`\>

***

### getUrl()

> `abstract` **getUrl**(`reference`): `Promise`\<`string`\>

Defined in: [cloud-storage/cloud-storage.ts:20](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/cloud-storage/cloud-storage.ts#L20)

#### Parameters

##### reference

`string`

#### Returns

`Promise`\<`string`\>

***

### save()

> `abstract` **save**(`id`, `data`, `progress?`): `Promise`\<`string`\>

Defined in: [cloud-storage/cloud-storage.ts:19](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/cloud-storage/cloud-storage.ts#L19)

#### Parameters

##### id

`string`

##### data

[`StorableData`](../type-aliases/StorableData.md)

##### progress?

[`UploadProgress`](../type-aliases/UploadProgress.md)

#### Returns

`Promise`\<`string`\>

***

### uploadControl()

> `abstract` **uploadControl**(): [`UploadControl`](../interfaces/UploadControl.md)

Defined in: [cloud-storage/cloud-storage.ts:21](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/cloud-storage/cloud-storage.ts#L21)

#### Returns

[`UploadControl`](../interfaces/UploadControl.md)

***

### createInstance()

> `static` **createInstance**(`providerName`): `CloudStorage`

Defined in: [cloud-storage/cloud-storage.ts:28](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/cloud-storage/cloud-storage.ts#L28)

#### Parameters

##### providerName

`string`

#### Returns

`CloudStorage`

***

### registerCloudStorage()

> `static` **registerCloudStorage**(`cloudStorageProviderName`, `factory`): `void`

Defined in: [cloud-storage/cloud-storage.ts:24](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/cloud-storage/cloud-storage.ts#L24)

#### Parameters

##### cloudStorageProviderName

`string`

##### factory

[`CloudStorageFactory`](../type-aliases/CloudStorageFactory.md)

#### Returns

`void`

***

### useCloudStorage()

> `static` **useCloudStorage**(`provider`): `void`

Defined in: [cloud-storage/cloud-storage.ts:41](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/cloud-storage/cloud-storage.ts#L41)

#### Parameters

##### provider

`CloudStorage`

#### Returns

`void`
