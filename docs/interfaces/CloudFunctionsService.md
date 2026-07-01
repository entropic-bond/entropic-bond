[**entropic-bond**](../README.md)

***

[entropic-bond](../globals.md) / CloudFunctionsService

# Interface: CloudFunctionsService

Defined in: [cloud-functions/cloud-functions.ts:6](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/cloud-functions/cloud-functions.ts#L6)

## Methods

### callFunction()

> **callFunction**\<`P`, `R`\>(`func`, `params`): `Promise`\<`R`\>

Defined in: [cloud-functions/cloud-functions.ts:8](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/cloud-functions/cloud-functions.ts#L8)

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

***

### retrieveFunction()

> **retrieveFunction**\<`P`, `R`\>(`cloudFunction`): [`CloudFunction`](../type-aliases/CloudFunction.md)\<`P`, `R`\>

Defined in: [cloud-functions/cloud-functions.ts:7](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/cloud-functions/cloud-functions.ts#L7)

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
