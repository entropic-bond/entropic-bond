[entropic-bond](../README.md) / [Exports](../modules.md) / MockCloudStorage

# Class: MockCloudStorage

## Hierarchy

- [`CloudStorage`](CloudStorage.md)

  ↳ **`MockCloudStorage`**

## Table of contents

### Constructors

- [constructor](MockCloudStorage.md#constructor)

### Properties

- [mockFileSystem](MockCloudStorage.md#mockfilesystem)
- [\_defaultCloudStorage](MockCloudStorage.md#_defaultcloudstorage)

### Accessors

- [className](MockCloudStorage.md#classname)
- [defaultCloudStorage](MockCloudStorage.md#defaultcloudstorage)

### Methods

- [delete](MockCloudStorage.md#delete)
- [getUrl](MockCloudStorage.md#geturl)
- [save](MockCloudStorage.md#save)
- [uploadControl](MockCloudStorage.md#uploadcontrol)
- [createInstance](MockCloudStorage.md#createinstance)
- [registerCloudStorage](MockCloudStorage.md#registercloudstorage)
- [useCloudStorage](MockCloudStorage.md#usecloudstorage)

## Constructors

### constructor

• **new MockCloudStorage**(`pathToMockFiles?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `pathToMockFiles` | `string` | `''` |

#### Overrides

[CloudStorage](CloudStorage.md).[constructor](CloudStorage.md#constructor)

#### Defined in

[cloud-storage/mock-cloud-storage.ts:5](https://github.com/entropic-bond/entropic-bond/blob/2d7d466/src/cloud-storage/mock-cloud-storage.ts#L5)

## Properties

### mockFileSystem

• **mockFileSystem**: `Object` = `{}`

#### Defined in

[cloud-storage/mock-cloud-storage.ts:43](https://github.com/entropic-bond/entropic-bond/blob/2d7d466/src/cloud-storage/mock-cloud-storage.ts#L43)

___

### \_defaultCloudStorage

▪ `Static` **\_defaultCloudStorage**: [`CloudStorage`](CloudStorage.md)

#### Inherited from

[CloudStorage](CloudStorage.md).[_defaultCloudStorage](CloudStorage.md#_defaultcloudstorage)

#### Defined in

[cloud-storage/cloud-storage.ts:50](https://github.com/entropic-bond/entropic-bond/blob/2d7d466/src/cloud-storage/cloud-storage.ts#L50)

## Accessors

### className

• `get` **className**(): `string`

#### Returns

`string`

#### Inherited from

CloudStorage.className

#### Defined in

[cloud-storage/cloud-storage.ts:36](https://github.com/entropic-bond/entropic-bond/blob/2d7d466/src/cloud-storage/cloud-storage.ts#L36)

___

### defaultCloudStorage

• `Static` `get` **defaultCloudStorage**(): [`CloudStorage`](CloudStorage.md)

#### Returns

[`CloudStorage`](CloudStorage.md)

#### Inherited from

CloudStorage.defaultCloudStorage

#### Defined in

[cloud-storage/cloud-storage.ts:44](https://github.com/entropic-bond/entropic-bond/blob/2d7d466/src/cloud-storage/cloud-storage.ts#L44)

## Methods

### delete

▸ **delete**(`reference`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `reference` | `string` |

#### Returns

`Promise`<`void`\>

#### Overrides

[CloudStorage](CloudStorage.md).[delete](CloudStorage.md#delete)

#### Defined in

[cloud-storage/mock-cloud-storage.ts:36](https://github.com/entropic-bond/entropic-bond/blob/2d7d466/src/cloud-storage/mock-cloud-storage.ts#L36)

___

### getUrl

▸ **getUrl**(`reference`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `reference` | `string` |

#### Returns

`Promise`<`string`\>

#### Overrides

[CloudStorage](CloudStorage.md).[getUrl](CloudStorage.md#geturl)

#### Defined in

[cloud-storage/mock-cloud-storage.ts:32](https://github.com/entropic-bond/entropic-bond/blob/2d7d466/src/cloud-storage/mock-cloud-storage.ts#L32)

___

### save

▸ **save**(`id`, `data`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `data` | [`StorableData`](../modules.md#storabledata) |

#### Returns

`Promise`<`string`\>

#### Overrides

[CloudStorage](CloudStorage.md).[save](CloudStorage.md#save)

#### Defined in

[cloud-storage/mock-cloud-storage.ts:10](https://github.com/entropic-bond/entropic-bond/blob/2d7d466/src/cloud-storage/mock-cloud-storage.ts#L10)

___

### uploadControl

▸ **uploadControl**(): [`UploadControl`](../interfaces/UploadControl.md)

#### Returns

[`UploadControl`](../interfaces/UploadControl.md)

#### Overrides

[CloudStorage](CloudStorage.md).[uploadControl](CloudStorage.md#uploadcontrol)

#### Defined in

[cloud-storage/mock-cloud-storage.ts:23](https://github.com/entropic-bond/entropic-bond/blob/2d7d466/src/cloud-storage/mock-cloud-storage.ts#L23)

___

### createInstance

▸ `Static` **createInstance**(`providerName`): [`CloudStorage`](CloudStorage.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `providerName` | `string` |

#### Returns

[`CloudStorage`](CloudStorage.md)

#### Inherited from

[CloudStorage](CloudStorage.md).[createInstance](CloudStorage.md#createinstance)

#### Defined in

[cloud-storage/cloud-storage.ts:28](https://github.com/entropic-bond/entropic-bond/blob/2d7d466/src/cloud-storage/cloud-storage.ts#L28)

___

### registerCloudStorage

▸ `Static` **registerCloudStorage**(`cloudStorageProviderName`, `factory`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `cloudStorageProviderName` | `string` |
| `factory` | `CloudStorageFactory` |

#### Returns

`void`

#### Inherited from

[CloudStorage](CloudStorage.md).[registerCloudStorage](CloudStorage.md#registercloudstorage)

#### Defined in

[cloud-storage/cloud-storage.ts:24](https://github.com/entropic-bond/entropic-bond/blob/2d7d466/src/cloud-storage/cloud-storage.ts#L24)

___

### useCloudStorage

▸ `Static` **useCloudStorage**(`provider`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `provider` | [`CloudStorage`](CloudStorage.md) |

#### Returns

`void`

#### Inherited from

[CloudStorage](CloudStorage.md).[useCloudStorage](CloudStorage.md#usecloudstorage)

#### Defined in

[cloud-storage/cloud-storage.ts:40](https://github.com/entropic-bond/entropic-bond/blob/2d7d466/src/cloud-storage/cloud-storage.ts#L40)
