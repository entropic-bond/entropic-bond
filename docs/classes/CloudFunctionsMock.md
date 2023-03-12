[entropic-bond](../README.md) / [Exports](../modules.md) / CloudFunctionsMock

# Class: CloudFunctionsMock

## Implements

- [`CloudFunctionsService`](../interfaces/CloudFunctionsService.md)

## Table of contents

### Constructors

- [constructor](CloudFunctionsMock.md#constructor)

### Properties

- [\_registeredFunctions](CloudFunctionsMock.md#_registeredfunctions)

### Methods

- [callFunction](CloudFunctionsMock.md#callfunction)
- [retrieveFunction](CloudFunctionsMock.md#retrievefunction)

## Constructors

### constructor

• **new CloudFunctionsMock**(`registeredFunctions`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `registeredFunctions` | `FunctionCollection` |

#### Defined in

[cloud-functions/cloud-functions-mock.ts:8](https://github.com/entropic-bond/entropic-bond/blob/2a330da/src/cloud-functions/cloud-functions-mock.ts#L8)

## Properties

### \_registeredFunctions

• `Private` **\_registeredFunctions**: `FunctionCollection`

#### Defined in

[cloud-functions/cloud-functions-mock.ts:20](https://github.com/entropic-bond/entropic-bond/blob/2a330da/src/cloud-functions/cloud-functions-mock.ts#L20)

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

#### Implementation of

[CloudFunctionsService](../interfaces/CloudFunctionsService.md).[callFunction](../interfaces/CloudFunctionsService.md#callfunction)

#### Defined in

[cloud-functions/cloud-functions-mock.ts:16](https://github.com/entropic-bond/entropic-bond/blob/2a330da/src/cloud-functions/cloud-functions-mock.ts#L16)

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

#### Implementation of

[CloudFunctionsService](../interfaces/CloudFunctionsService.md).[retrieveFunction](../interfaces/CloudFunctionsService.md#retrievefunction)

#### Defined in

[cloud-functions/cloud-functions-mock.ts:12](https://github.com/entropic-bond/entropic-bond/blob/2a330da/src/cloud-functions/cloud-functions-mock.ts#L12)
