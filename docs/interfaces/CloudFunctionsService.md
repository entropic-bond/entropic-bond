[entropic-bond](../README.md) / [Exports](../modules.md) / CloudFunctionsService

# Interface: CloudFunctionsService

## Implemented by

- [`CloudFunctionsMock`](../classes/CloudFunctionsMock.md)

## Table of contents

### Methods

- [callFunction](CloudFunctionsService.md#callfunction)
- [retrieveFunction](CloudFunctionsService.md#retrievefunction)

## Methods

### callFunction

▸ **callFunction**<`P`, `R`\>(`func`, `params`): `Promise`<`R`\>

#### Type parameters

| Name |
| :------ |
| `P` |
| `R` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `func` | [`CloudFunction`](../modules.md#cloudfunction)<`P`, `R`\> |
| `params` | `P` |

#### Returns

`Promise`<`R`\>

#### Defined in

[cloud-functions/cloud-functions.ts:8](https://github.com/entropic-bond/entropic-bond/blob/2d7d466/src/cloud-functions/cloud-functions.ts#L8)

___

### retrieveFunction

▸ **retrieveFunction**<`P`, `R`\>(`cloudFunction`): [`CloudFunction`](../modules.md#cloudfunction)<`P`, `R`\>

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

[cloud-functions/cloud-functions.ts:7](https://github.com/entropic-bond/entropic-bond/blob/2d7d466/src/cloud-functions/cloud-functions.ts#L7)
