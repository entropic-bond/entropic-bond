[entropic-bond](../README.md) / [Exports](../modules.md) / CloudStorage

# Class: CloudStorage

## Hierarchy

- **`CloudStorage`**

  ↳ [`MockCloudStorage`](MockCloudStorage.md)

## Table of contents

### Constructors

- [constructor](CloudStorage.md#constructor)

### Properties

- [\_defaultCloudStorage](CloudStorage.md#_defaultcloudstorage)

### Accessors

- [className](CloudStorage.md#classname)
- [defaultCloudStorage](CloudStorage.md#defaultcloudstorage)

### Methods

- [delete](CloudStorage.md#delete)
- [getUrl](CloudStorage.md#geturl)
- [save](CloudStorage.md#save)
- [uploadControl](CloudStorage.md#uploadcontrol)
- [createInstance](CloudStorage.md#createinstance)
- [registerCloudStorage](CloudStorage.md#registercloudstorage)
- [useCloudStorage](CloudStorage.md#usecloudstorage)

## Constructors

### constructor

• **new CloudStorage**()

## Properties

### \_defaultCloudStorage

▪ `Static` **\_defaultCloudStorage**: [`CloudStorage`](CloudStorage.md)

#### Defined in

[cloud-storage/cloud-storage.ts:50](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/cloud-storage/cloud-storage.ts#L50)

## Accessors

### className

• `get` **className**(): `string`

#### Returns

`string`

#### Defined in

[cloud-storage/cloud-storage.ts:36](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/cloud-storage/cloud-storage.ts#L36)

___

### defaultCloudStorage

• `Static` `get` **defaultCloudStorage**(): [`CloudStorage`](CloudStorage.md)

#### Returns

[`CloudStorage`](CloudStorage.md)

#### Defined in

[cloud-storage/cloud-storage.ts:44](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/cloud-storage/cloud-storage.ts#L44)

## Methods

### delete

▸ `Abstract` **delete**(`reference`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `reference` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[cloud-storage/cloud-storage.ts:22](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/cloud-storage/cloud-storage.ts#L22)

___

### getUrl

▸ `Abstract` **getUrl**(`reference`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `reference` | `string` |

#### Returns

`Promise`<`string`\>

#### Defined in

[cloud-storage/cloud-storage.ts:20](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/cloud-storage/cloud-storage.ts#L20)

___

### save

▸ `Abstract` **save**(`id`, `data`, `progress`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `data` | [`StorableData`](../modules.md#storabledata) |
| `progress` | [`UploadProgress`](../modules.md#uploadprogress) |

#### Returns

`Promise`<`string`\>

#### Defined in

[cloud-storage/cloud-storage.ts:19](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/cloud-storage/cloud-storage.ts#L19)

___

### uploadControl

▸ `Abstract` **uploadControl**(): [`UploadControl`](../interfaces/UploadControl.md)

#### Returns

[`UploadControl`](../interfaces/UploadControl.md)

#### Defined in

[cloud-storage/cloud-storage.ts:21](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/cloud-storage/cloud-storage.ts#L21)

___

### createInstance

▸ `Static` **createInstance**(`providerName`): [`CloudStorage`](CloudStorage.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `providerName` | `string` |

#### Returns

[`CloudStorage`](CloudStorage.md)

#### Defined in

[cloud-storage/cloud-storage.ts:28](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/cloud-storage/cloud-storage.ts#L28)

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

#### Defined in

[cloud-storage/cloud-storage.ts:24](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/cloud-storage/cloud-storage.ts#L24)

___

### useCloudStorage

▸ `Static` **useCloudStorage**(`provider`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `provider` | [`CloudStorage`](CloudStorage.md) |

#### Returns

`void`

#### Defined in

[cloud-storage/cloud-storage.ts:40](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/cloud-storage/cloud-storage.ts#L40)
