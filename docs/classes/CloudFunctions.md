[entropic-bond](../README.md) / [Exports](../modules.md) / CloudFunctions

# Class: CloudFunctions

## Table of contents

### Constructors

- [constructor](CloudFunctions.md#constructor)

### Properties

- [\_cloudFunctionsService](CloudFunctions.md#_cloudfunctionsservice)
- [\_instance](CloudFunctions.md#_instance)
- [error](CloudFunctions.md#error)

### Accessors

- [instance](CloudFunctions.md#instance)

### Methods

- [getFunction](CloudFunctions.md#getfunction)
- [getRawFunction](CloudFunctions.md#getrawfunction)
- [processParam](CloudFunctions.md#processparam)
- [processResult](CloudFunctions.md#processresult)
- [useCloudFunctionsService](CloudFunctions.md#usecloudfunctionsservice)

## Constructors

### constructor

• `Private` **new CloudFunctions**()

#### Defined in

[cloud-functions/cloud-functions.ts:12](https://github.com/entropic-bond/entropic-bond/blob/2a330da/src/cloud-functions/cloud-functions.ts#L12)

## Properties

### \_cloudFunctionsService

▪ `Static` `Private` **\_cloudFunctionsService**: [`CloudFunctionsService`](../interfaces/CloudFunctionsService.md)

#### Defined in

[cloud-functions/cloud-functions.ts:81](https://github.com/entropic-bond/entropic-bond/blob/2a330da/src/cloud-functions/cloud-functions.ts#L81)

___

### \_instance

▪ `Static` `Private` **\_instance**: [`CloudFunctions`](CloudFunctions.md)

#### Defined in

[cloud-functions/cloud-functions.ts:82](https://github.com/entropic-bond/entropic-bond/blob/2a330da/src/cloud-functions/cloud-functions.ts#L82)

___

### error

▪ `Static` **error**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `shouldBeRegistered` | `string` |

#### Defined in

[cloud-functions/cloud-functions.ts:14](https://github.com/entropic-bond/entropic-bond/blob/2a330da/src/cloud-functions/cloud-functions.ts#L14)

## Accessors

### instance

• `Static` `get` **instance**(): [`CloudFunctions`](CloudFunctions.md)

#### Returns

[`CloudFunctions`](CloudFunctions.md)

#### Defined in

[cloud-functions/cloud-functions.ts:22](https://github.com/entropic-bond/entropic-bond/blob/2a330da/src/cloud-functions/cloud-functions.ts#L22)

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

[cloud-functions/cloud-functions.ts:31](https://github.com/entropic-bond/entropic-bond/blob/2a330da/src/cloud-functions/cloud-functions.ts#L31)

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

[cloud-functions/cloud-functions.ts:27](https://github.com/entropic-bond/entropic-bond/blob/2a330da/src/cloud-functions/cloud-functions.ts#L27)

___

### processParam

▸ `Private` **processParam**<`P`\>(`param`): `P` \| [`PersistentObject`](../modules.md#persistentobject)<`P` & [`Persistent`](Persistent.md)\>

#### Type parameters

| Name |
| :------ |
| `P` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `param` | `P` |

#### Returns

`P` \| [`PersistentObject`](../modules.md#persistentobject)<`P` & [`Persistent`](Persistent.md)\>

#### Defined in

[cloud-functions/cloud-functions.ts:41](https://github.com/entropic-bond/entropic-bond/blob/2a330da/src/cloud-functions/cloud-functions.ts#L41)

___

### processResult

▸ `Private` **processResult**<`R`\>(`value`): `R`

#### Type parameters

| Name |
| :------ |
| `R` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `R` \| [`PersistentObject`](../modules.md#persistentobject)<`R` & [`Persistent`](Persistent.md)\> |

#### Returns

`R`

#### Defined in

[cloud-functions/cloud-functions.ts:60](https://github.com/entropic-bond/entropic-bond/blob/2a330da/src/cloud-functions/cloud-functions.ts#L60)

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

[cloud-functions/cloud-functions.ts:16](https://github.com/entropic-bond/entropic-bond/blob/2a330da/src/cloud-functions/cloud-functions.ts#L16)
