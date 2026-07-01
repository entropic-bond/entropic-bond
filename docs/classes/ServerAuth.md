[**entropic-bond**](../README.md)

***

[entropic-bond](../globals.md) / ServerAuth

# Class: ServerAuth

Defined in: [server-auth/server-auth.ts:14](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/server-auth/server-auth.ts#L14)

## Extends

- [`ServerAuthService`](ServerAuthService.md)

## Constructors

### Constructor

> `protected` **new ServerAuth**(): `ServerAuth`

Defined in: [server-auth/server-auth.ts:17](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/server-auth/server-auth.ts#L17)

#### Returns

`ServerAuth`

#### Overrides

[`ServerAuthService`](ServerAuthService.md).[`constructor`](ServerAuthService.md#constructor)

## Properties

### error

> `static` **error**: `object`

Defined in: [server-auth/server-auth.ts:15](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/server-auth/server-auth.ts#L15)

#### shouldBeRegistered

> **shouldBeRegistered**: `string` = `'You should register a Server Auth service before using the Server Auth.'`

## Accessors

### instance

#### Get Signature

> **get** `static` **instance**(): `ServerAuth`

Defined in: [server-auth/server-auth.ts:26](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/server-auth/server-auth.ts#L26)

##### Returns

`ServerAuth`

## Methods

### deleteUser()

> **deleteUser**(`userId`): `Promise`\<`void`\>

Defined in: [server-auth/server-auth.ts:43](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/server-auth/server-auth.ts#L43)

#### Parameters

##### userId

`string`

#### Returns

`Promise`\<`void`\>

#### Overrides

[`ServerAuthService`](ServerAuthService.md).[`deleteUser`](ServerAuthService.md#deleteuser)

***

### getUser()

> **getUser**\<`T`\>(`userId`): `Promise`\<[`UserCredentials`](../interfaces/UserCredentials.md)\<`T`\> \| `undefined`\>

Defined in: [server-auth/server-auth.ts:31](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/server-auth/server-auth.ts#L31)

#### Type Parameters

##### T

`T` *extends* [`CustomCredentials`](../interfaces/CustomCredentials.md)

#### Parameters

##### userId

`string`

#### Returns

`Promise`\<[`UserCredentials`](../interfaces/UserCredentials.md)\<`T`\> \| `undefined`\>

#### Overrides

[`ServerAuthService`](ServerAuthService.md).[`getUser`](ServerAuthService.md#getuser)

***

### setCustomCredentials()

> **setCustomCredentials**\<`T`\>(`userId`, `customCredentials`): `Promise`\<`void`\>

Defined in: [server-auth/server-auth.ts:39](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/server-auth/server-auth.ts#L39)

#### Type Parameters

##### T

`T` *extends* [`CustomCredentials`](../interfaces/CustomCredentials.md)

#### Parameters

##### userId

`string`

##### customCredentials

`T`

#### Returns

`Promise`\<`void`\>

#### Overrides

[`ServerAuthService`](ServerAuthService.md).[`setCustomCredentials`](ServerAuthService.md#setcustomcredentials)

***

### updateUser()

> **updateUser**\<`T`\>(`userId`, `credentials`): `Promise`\<[`UserCredentials`](../interfaces/UserCredentials.md)\<`T`\>\>

Defined in: [server-auth/server-auth.ts:35](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/server-auth/server-auth.ts#L35)

#### Type Parameters

##### T

`T` *extends* [`CustomCredentials`](../interfaces/CustomCredentials.md)

#### Parameters

##### userId

`string`

##### credentials

`Partial`\<[`UserCredentials`](../interfaces/UserCredentials.md)\<`T`\>\>

#### Returns

`Promise`\<[`UserCredentials`](../interfaces/UserCredentials.md)\<`T`\>\>

#### Overrides

[`ServerAuthService`](ServerAuthService.md).[`updateUser`](ServerAuthService.md#updateuser)

***

### useServerAuthService()

> `static` **useServerAuthService**(`authService`): `void`

Defined in: [server-auth/server-auth.ts:19](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/server-auth/server-auth.ts#L19)

#### Parameters

##### authService

[`ServerAuthService`](ServerAuthService.md)

#### Returns

`void`
