[**entropic-bond**](../README.md)

***

[entropic-bond](../globals.md) / CloudFunctionsMock

# Class: CloudFunctionsMock

Defined in: [cloud-functions/cloud-functions-mock.ts:7](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/cloud-functions/cloud-functions-mock.ts#L7)

## Implements

- [`CloudFunctionsService`](../interfaces/CloudFunctionsService.md)

## Constructors

### Constructor

> **new CloudFunctionsMock**(`registeredFunctions`): `CloudFunctionsMock`

Defined in: [cloud-functions/cloud-functions-mock.ts:8](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/cloud-functions/cloud-functions-mock.ts#L8)

#### Parameters

##### registeredFunctions

[`FunctionCollection`](../interfaces/FunctionCollection.md)

#### Returns

`CloudFunctionsMock`

## Methods

### callFunction()

> **callFunction**\<`P`, `R`\>(`func`, `params`): `Promise`\<`R`\>

Defined in: [cloud-functions/cloud-functions-mock.ts:18](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/cloud-functions/cloud-functions-mock.ts#L18)

#### Type Parameters

##### P

`P`

##### R

`R`

#### Parameters

##### func

[`CloudFunction`](../type-aliases/CloudFunction.md)\<`P`, `R`\>

##### params

`P`

#### Returns

`Promise`\<`R`\>

#### Implementation of

[`CloudFunctionsService`](../interfaces/CloudFunctionsService.md).[`callFunction`](../interfaces/CloudFunctionsService.md#callfunction)

***

### retrieveFunction()

> **retrieveFunction**\<`P`, `R`\>(`cloudFunction`): [`CloudFunction`](../type-aliases/CloudFunction.md)\<`P`, `R`\>

Defined in: [cloud-functions/cloud-functions-mock.ts:12](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/cloud-functions/cloud-functions-mock.ts#L12)

#### Type Parameters

##### P

`P`

##### R

`R`

#### Parameters

##### cloudFunction

`string`

#### Returns

[`CloudFunction`](../type-aliases/CloudFunction.md)\<`P`, `R`\>

#### Implementation of

[`CloudFunctionsService`](../interfaces/CloudFunctionsService.md).[`retrieveFunction`](../interfaces/CloudFunctionsService.md#retrievefunction)
