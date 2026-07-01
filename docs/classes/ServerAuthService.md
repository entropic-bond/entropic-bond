[**entropic-bond**](../README.md)

***

[entropic-bond](../globals.md) / ServerAuthService

# Abstract Class: ServerAuthService

Defined in: [server-auth/server-auth.ts:7](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/server-auth/server-auth.ts#L7)

## Extended by

- [`ServerAuth`](ServerAuth.md)
- [`ServerAuthMock`](ServerAuthMock.md)

## Constructors

### Constructor

> **new ServerAuthService**(): `ServerAuthService`

#### Returns

`ServerAuthService`

## Methods

### deleteUser()

> `abstract` **deleteUser**(`userId`): `Promise`\<`void`\>

Defined in: [server-auth/server-auth.ts:11](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/server-auth/server-auth.ts#L11)

#### Parameters

##### userId

`string`

#### Returns

`Promise`\<`void`\>

***

### getUser()

> `abstract` **getUser**\<`T`\>(`userId`): `Promise`\<[`UserCredentials`](../interfaces/UserCredentials.md)\<`T`\> \| `undefined`\>

Defined in: [server-auth/server-auth.ts:9](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/server-auth/server-auth.ts#L9)

#### Type Parameters

##### T

`T` *extends* [`CustomCredentials`](../interfaces/CustomCredentials.md)

#### Parameters

##### userId

`string`

#### Returns

`Promise`\<[`UserCredentials`](../interfaces/UserCredentials.md)\<`T`\> \| `undefined`\>

***

### setCustomCredentials()

> `abstract` **setCustomCredentials**\<`T`\>(`userId`, `customCredentials`): `Promise`\<`void`\>

Defined in: [server-auth/server-auth.ts:8](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/server-auth/server-auth.ts#L8)

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

***

### updateUser()

> `abstract` **updateUser**\<`T`\>(`userId`, `credentials`): `Promise`\<[`UserCredentials`](../interfaces/UserCredentials.md)\<`T`\>\>

Defined in: [server-auth/server-auth.ts:10](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/server-auth/server-auth.ts#L10)

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
