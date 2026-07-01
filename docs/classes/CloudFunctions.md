[**entropic-bond**](../README.md)

***

[entropic-bond](../globals.md) / CloudFunctions

# Class: CloudFunctions

Defined in: [cloud-functions/cloud-functions.ts:11](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/cloud-functions/cloud-functions.ts#L11)

## Properties

### error

> `static` **error**: `object`

Defined in: [cloud-functions/cloud-functions.ts:14](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/cloud-functions/cloud-functions.ts#L14)

#### shouldBeRegistered

> **shouldBeRegistered**: `string` = `'You should register a cloud functions service with useCloudFunctionsService static method before using CloudFunctions.'`

## Accessors

### instance

#### Get Signature

> **get** `static` **instance**(): `CloudFunctions`

Defined in: [cloud-functions/cloud-functions.ts:22](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/cloud-functions/cloud-functions.ts#L22)

##### Returns

`CloudFunctions`

## Methods

### getFunction()

> **getFunction**\<`P`, `R`\>(`cloudFunction`): [`CloudFunction`](../type-aliases/CloudFunction.md)\<`P`, `R`\>

Defined in: [cloud-functions/cloud-functions.ts:31](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/cloud-functions/cloud-functions.ts#L31)

#### Type Parameters

##### P

`P`

##### R

`R` = `void`

#### Parameters

##### cloudFunction

`string`

#### Returns

[`CloudFunction`](../type-aliases/CloudFunction.md)\<`P`, `R`\>

***

### getRawFunction()

> **getRawFunction**\<`P`, `R`\>(`cloudFunction`): [`CloudFunction`](../type-aliases/CloudFunction.md)\<`P`, `R`\>

Defined in: [cloud-functions/cloud-functions.ts:27](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/cloud-functions/cloud-functions.ts#L27)

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

***

### useCloudFunctionsService()

> `static` **useCloudFunctionsService**(`cloudFunctionsService`): `void`

Defined in: [cloud-functions/cloud-functions.ts:16](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/cloud-functions/cloud-functions.ts#L16)

#### Parameters

##### cloudFunctionsService

[`CloudFunctionsService`](../interfaces/CloudFunctionsService.md)

#### Returns

`void`
