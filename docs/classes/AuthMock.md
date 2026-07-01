[**entropic-bond**](../README.md)

***

[entropic-bond](../globals.md) / AuthMock

# Class: AuthMock

Defined in: [auth/auth-mock.ts:5](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/auth/auth-mock.ts#L5)

The AuthService class is an abstract class that defines the interface of an authentication service.
You should derive from this class to implement your own authentication service.

## Extends

- [`AuthService`](AuthService.md)

## Constructors

### Constructor

> **new AuthMock**(): `AuthMock`

#### Returns

`AuthMock`

#### Inherited from

[`AuthService`](AuthService.md).[`constructor`](AuthService.md#constructor)

## Accessors

### fakeRegisteredUsers

#### Get Signature

> **get** **fakeRegisteredUsers**(): [`Collection`](../interfaces/Collection.md)\<[`UserCredentials`](../interfaces/UserCredentials.md)\<[`CredentialsCustomData`](../interfaces/CredentialsCustomData.md)\>\>

Defined in: [auth/auth-mock.ts:98](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/auth/auth-mock.ts#L98)

##### Returns

[`Collection`](../interfaces/Collection.md)\<[`UserCredentials`](../interfaces/UserCredentials.md)\<[`CredentialsCustomData`](../interfaces/CredentialsCustomData.md)\>\>

## Methods

### fakeRegisteredUser()

> **fakeRegisteredUser**\<`T`\>(`userCredentials`): `AuthMock`

Defined in: [auth/auth-mock.ts:92](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/auth/auth-mock.ts#L92)

#### Type Parameters

##### T

`T` *extends* [`CredentialsCustomData`](../interfaces/CredentialsCustomData.md)

#### Parameters

##### userCredentials

[`UserCredentials`](../interfaces/UserCredentials.md)\<`T`\>

#### Returns

`AuthMock`

***

### flush()

> **flush**(): `Promise`\<`void`\>

Defined in: [auth/auth-mock.ts:87](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/auth/auth-mock.ts#L87)

#### Returns

`Promise`\<`void`\>

***

### linkAdditionalProvider()

> **linkAdditionalProvider**(`provider`): `Promise`\<`unknown`\>

Defined in: [auth/auth-mock.ts:79](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/auth/auth-mock.ts#L79)

#### Parameters

##### provider

[`AuthProvider`](../type-aliases/AuthProvider.md)

#### Returns

`Promise`\<`unknown`\>

#### Overrides

[`AuthService`](AuthService.md).[`linkAdditionalProvider`](AuthService.md#linkadditionalprovider)

***

### login()

> **login**\<`T`\>(`signData`): `Promise`\<[`UserCredentials`](../interfaces/UserCredentials.md)\<`T`\>\>

Defined in: [auth/auth-mock.ts:30](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/auth/auth-mock.ts#L30)

#### Type Parameters

##### T

`T` *extends* [`CredentialsCustomData`](../interfaces/CredentialsCustomData.md)

#### Parameters

##### signData

[`SignData`](../interfaces/SignData.md)

#### Returns

`Promise`\<[`UserCredentials`](../interfaces/UserCredentials.md)\<`T`\>\>

#### Overrides

[`AuthService`](AuthService.md).[`login`](AuthService.md#login)

***

### logout()

> **logout**(): `Promise`\<`void`\>

Defined in: [auth/auth-mock.ts:47](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/auth/auth-mock.ts#L47)

#### Returns

`Promise`\<`void`\>

#### Overrides

[`AuthService`](AuthService.md).[`logout`](AuthService.md#logout)

***

### onAuthStateChange()

> **onAuthStateChange**\<`T`\>(`onChange`): `void`

Defined in: [auth/auth-mock.ts:42](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/auth/auth-mock.ts#L42)

#### Type Parameters

##### T

`T` *extends* [`CredentialsCustomData`](../interfaces/CredentialsCustomData.md)

#### Parameters

##### onChange

(`userCredentials`) => `void`

#### Returns

`void`

#### Overrides

[`AuthService`](AuthService.md).[`onAuthStateChange`](AuthService.md#onauthstatechange)

***

### refreshToken()

> **refreshToken**(): `Promise`\<`void`\>

Defined in: [auth/auth-mock.ts:75](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/auth/auth-mock.ts#L75)

#### Returns

`Promise`\<`void`\>

#### Overrides

[`AuthService`](AuthService.md).[`refreshToken`](AuthService.md#refreshtoken)

***

### resendVerificationEmail()

> **resendVerificationEmail**(`email`, `_password`, `_verificationLink`): `Promise`\<`void`\>

Defined in: [auth/auth-mock.ts:66](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/auth/auth-mock.ts#L66)

#### Parameters

##### email

`string`

##### \_password

`string`

##### \_verificationLink

`string`

#### Returns

`Promise`\<`void`\>

#### Overrides

[`AuthService`](AuthService.md).[`resendVerificationEmail`](AuthService.md#resendverificationemail)

***

### resetEmailPassword()

> **resetEmailPassword**(`email`): `Promise`\<`void`\>

Defined in: [auth/auth-mock.ts:57](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/auth/auth-mock.ts#L57)

#### Parameters

##### email

`string`

#### Returns

`Promise`\<`void`\>

#### Overrides

[`AuthService`](AuthService.md).[`resetEmailPassword`](AuthService.md#resetemailpassword)

***

### signUp()

> **signUp**\<`T`\>(`signData`): `Promise`\<[`UserCredentials`](../interfaces/UserCredentials.md)\<`T`\>\>

Defined in: [auth/auth-mock.ts:7](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/auth/auth-mock.ts#L7)

#### Type Parameters

##### T

`T` *extends* [`CredentialsCustomData`](../interfaces/CredentialsCustomData.md)

#### Parameters

##### signData

[`SignData`](../interfaces/SignData.md)

#### Returns

`Promise`\<[`UserCredentials`](../interfaces/UserCredentials.md)\<`T`\>\>

#### Overrides

[`AuthService`](AuthService.md).[`signUp`](AuthService.md#signup)

***

### unlinkProvider()

> **unlinkProvider**(`provider`): `Promise`\<`unknown`\>

Defined in: [auth/auth-mock.ts:83](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/auth/auth-mock.ts#L83)

#### Parameters

##### provider

[`AuthProvider`](../type-aliases/AuthProvider.md)

#### Returns

`Promise`\<`unknown`\>

#### Overrides

[`AuthService`](AuthService.md).[`unlinkProvider`](AuthService.md#unlinkprovider)
