[entropic-bond](../README.md) / [Exports](../modules.md) / CloudFunctions

# Class: CloudFunctions

## Table of contents

### Properties

- [error](CloudFunctions.md#error)

### Accessors

- [instance](CloudFunctions.md#instance)

### Methods

- [getFunction](CloudFunctions.md#getfunction)
- [getRawFunction](CloudFunctions.md#getrawfunction)
- [useCloudFunctionsService](CloudFunctions.md#usecloudfunctionsservice)

## Properties

### error

▪ `Static` **error**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `shouldBeRegistered` | `string` |

#### Defined in

[cloud-functions/cloud-functions.ts:14](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/cloud-functions/cloud-functions.ts#L14)

## Accessors

### instance

• `Static` `get` **instance**(): [`CloudFunctions`](CloudFunctions.md)

#### Returns

[`CloudFunctions`](CloudFunctions.md)

#### Defined in

[cloud-functions/cloud-functions.ts:22](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/cloud-functions/cloud-functions.ts#L22)

## Methods

### getFunction

▸ **getFunction**<`P`, `R`\>(`cloudFunction`): [`CloudFunction`](../modules.md#cloudfunction)<`P`, `R`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `P` | `P` |
| `R` | `void` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `cloudFunction` | `string` |

#### Returns

[`CloudFunction`](../modules.md#cloudfunction)<`P`, `R`\>

#### Defined in

[cloud-functions/cloud-functions.ts:31](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/cloud-functions/cloud-functions.ts#L31)

___

### getRawFunction

▸ **getRawFunction**<`P`, `R`\>(`cloudFunction`): [`CloudFunction`](../modules.md#cloudfunction)<`P`, `R`\>

#### Type parameters

| Name |
| :------ |
| `P` |
| `R` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `cloudFunction` | `string` |

#### Returns

[`CloudFunction`](../modules.md#cloudfunction)<`P`, `R`\>

#### Defined in

[cloud-functions/cloud-functions.ts:27](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/cloud-functions/cloud-functions.ts#L27)

___

### useCloudFunctionsService

▸ `Static` **useCloudFunctionsService**(`cloudFunctionsService`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `cloudFunctionsService` | [`CloudFunctionsService`](../interfaces/CloudFunctionsService.md) |

#### Returns

`void`

#### Defined in

[cloud-functions/cloud-functions.ts:16](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/cloud-functions/cloud-functions.ts#L16)
