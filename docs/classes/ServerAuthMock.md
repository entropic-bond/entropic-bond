[**entropic-bond**](../README.md)

***

[entropic-bond](../globals.md) / ServerAuthMock

# Class: ServerAuthMock

Defined in: [server-auth/server-auth-mock.ts:5](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/server-auth/server-auth-mock.ts#L5)

## Extends

- [`ServerAuthService`](ServerAuthService.md)

## Constructors

### Constructor

> **new ServerAuthMock**(`userCredentials`): `ServerAuthMock`

Defined in: [server-auth/server-auth-mock.ts:6](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/server-auth/server-auth-mock.ts#L6)

#### Parameters

##### userCredentials

[`Collection`](../interfaces/Collection.md)\<[`UserCredentials`](../interfaces/UserCredentials.md)\<[`CredentialsCustomData`](../interfaces/CredentialsCustomData.md)\>\>

#### Returns

`ServerAuthMock`

#### Overrides

[`ServerAuthService`](ServerAuthService.md).[`constructor`](ServerAuthService.md#constructor)

## Accessors

### userCredentials

#### Get Signature

> **get** **userCredentials**(): [`Collection`](../interfaces/Collection.md)\<[`UserCredentials`](../interfaces/UserCredentials.md)\<[`CredentialsCustomData`](../interfaces/CredentialsCustomData.md)\>\>

Defined in: [server-auth/server-auth-mock.ts:40](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/server-auth/server-auth-mock.ts#L40)

##### Returns

[`Collection`](../interfaces/Collection.md)\<[`UserCredentials`](../interfaces/UserCredentials.md)\<[`CredentialsCustomData`](../interfaces/CredentialsCustomData.md)\>\>

## Methods

### deleteUser()

> **deleteUser**(`userId`): `Promise`\<`void`\>

Defined in: [server-auth/server-auth-mock.ts:35](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/server-auth/server-auth-mock.ts#L35)

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

Defined in: [server-auth/server-auth-mock.ts:11](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/server-auth/server-auth-mock.ts#L11)

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

Defined in: [server-auth/server-auth-mock.ts:17](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/server-auth/server-auth-mock.ts#L17)

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

Defined in: [server-auth/server-auth-mock.ts:25](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/server-auth/server-auth-mock.ts#L25)

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
