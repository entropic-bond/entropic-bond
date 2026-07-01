[**entropic-bond**](../README.md)

***

[entropic-bond](../globals.md) / MockCloudStorage

# Class: MockCloudStorage

Defined in: [cloud-storage/mock-cloud-storage.ts:4](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/cloud-storage/mock-cloud-storage.ts#L4)

## Extends

- [`CloudStorage`](CloudStorage.md)

## Constructors

### Constructor

> **new MockCloudStorage**(`pathToMockFiles?`): `MockCloudStorage`

Defined in: [cloud-storage/mock-cloud-storage.ts:5](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/cloud-storage/mock-cloud-storage.ts#L5)

#### Parameters

##### pathToMockFiles?

`string` = `''`

#### Returns

`MockCloudStorage`

#### Overrides

[`CloudStorage`](CloudStorage.md).[`constructor`](CloudStorage.md#constructor)

## Properties

### mockFileSystem

> **mockFileSystem**: `object` = `{}`

Defined in: [cloud-storage/mock-cloud-storage.ts:71](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/cloud-storage/mock-cloud-storage.ts#L71)

***

### \_defaultCloudStorage

> `static` **\_defaultCloudStorage**: [`CloudStorage`](CloudStorage.md)

Defined in: [cloud-storage/cloud-storage.ts:51](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/cloud-storage/cloud-storage.ts#L51)

#### Inherited from

[`CloudStorage`](CloudStorage.md).[`_defaultCloudStorage`](CloudStorage.md#_defaultcloudstorage)

## Accessors

### className

#### Get Signature

> **get** **className**(): `string`

Defined in: [cloud-storage/cloud-storage.ts:37](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/cloud-storage/cloud-storage.ts#L37)

##### Returns

`string`

#### Inherited from

[`CloudStorage`](CloudStorage.md).[`className`](CloudStorage.md#classname)

***

### defaultCloudStorage

#### Get Signature

> **get** `static` **defaultCloudStorage**(): [`CloudStorage`](CloudStorage.md)

Defined in: [cloud-storage/cloud-storage.ts:45](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/cloud-storage/cloud-storage.ts#L45)

##### Returns

[`CloudStorage`](CloudStorage.md)

#### Inherited from

[`CloudStorage`](CloudStorage.md).[`defaultCloudStorage`](CloudStorage.md#defaultcloudstorage)

## Methods

### delete()

> **delete**(`reference`): `Promise`\<`void`\>

Defined in: [cloud-storage/mock-cloud-storage.ts:62](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/cloud-storage/mock-cloud-storage.ts#L62)

#### Parameters

##### reference

`string`

#### Returns

`Promise`\<`void`\>

#### Overrides

[`CloudStorage`](CloudStorage.md).[`delete`](CloudStorage.md#delete)

***

### getUrl()

> **getUrl**(`reference`): `Promise`\<`string`\>

Defined in: [cloud-storage/mock-cloud-storage.ts:58](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/cloud-storage/mock-cloud-storage.ts#L58)

#### Parameters

##### reference

`string`

#### Returns

`Promise`\<`string`\>

#### Overrides

[`CloudStorage`](CloudStorage.md).[`getUrl`](CloudStorage.md#geturl)

***

### save()

> **save**(`id`, `data`): `Promise`\<`string`\>

Defined in: [cloud-storage/mock-cloud-storage.ts:36](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/cloud-storage/mock-cloud-storage.ts#L36)

#### Parameters

##### id

`string`

##### data

[`StorableData`](../type-aliases/StorableData.md)

#### Returns

`Promise`\<`string`\>

#### Overrides

[`CloudStorage`](CloudStorage.md).[`save`](CloudStorage.md#save)

***

### simulateDelay()

> **simulateDelay**(`miliSeconds`): `MockCloudStorage`

Defined in: [cloud-storage/mock-cloud-storage.ts:15](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/cloud-storage/mock-cloud-storage.ts#L15)

Introduce a delay in the execution of operations to simulate a real data source

#### Parameters

##### miliSeconds

`number`

the number of milliseconds to delay the execution of operations

#### Returns

`MockCloudStorage`

a chainable reference to this object

***

### uploadControl()

> **uploadControl**(): [`UploadControl`](../interfaces/UploadControl.md)

Defined in: [cloud-storage/mock-cloud-storage.ts:49](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/cloud-storage/mock-cloud-storage.ts#L49)

#### Returns

[`UploadControl`](../interfaces/UploadControl.md)

#### Overrides

[`CloudStorage`](CloudStorage.md).[`uploadControl`](CloudStorage.md#uploadcontrol)

***

### createInstance()

> `static` **createInstance**(`providerName`): [`CloudStorage`](CloudStorage.md)

Defined in: [cloud-storage/cloud-storage.ts:28](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/cloud-storage/cloud-storage.ts#L28)

#### Parameters

##### providerName

`string`

#### Returns

[`CloudStorage`](CloudStorage.md)

#### Inherited from

[`CloudStorage`](CloudStorage.md).[`createInstance`](CloudStorage.md#createinstance)

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

#### Inherited from

[`CloudStorage`](CloudStorage.md).[`registerCloudStorage`](CloudStorage.md#registercloudstorage)

***

### useCloudStorage()

> `static` **useCloudStorage**(`provider`): `void`

Defined in: [cloud-storage/cloud-storage.ts:41](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/cloud-storage/cloud-storage.ts#L41)

#### Parameters

##### provider

[`CloudStorage`](CloudStorage.md)

#### Returns

`void`

#### Inherited from

[`CloudStorage`](CloudStorage.md).[`useCloudStorage`](CloudStorage.md#usecloudstorage)
