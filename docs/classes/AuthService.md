[**entropic-bond**](../README.md)

***

[entropic-bond](../globals.md) / AuthService

# Abstract Class: AuthService

Defined in: [auth/auth.ts:8](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/auth/auth.ts#L8)

The AuthService class is an abstract class that defines the interface of an authentication service.
You should derive from this class to implement your own authentication service.

## Extended by

- [`Auth`](Auth.md)
- [`AuthMock`](AuthMock.md)

## Constructors

### Constructor

> **new AuthService**(): `AuthService`

#### Returns

`AuthService`

## Methods

### linkAdditionalProvider()

> `abstract` **linkAdditionalProvider**(`provider`): `Promise`\<`unknown`\>

Defined in: [auth/auth.ts:14](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/auth/auth.ts#L14)

#### Parameters

##### provider

[`AuthProvider`](../type-aliases/AuthProvider.md)

#### Returns

`Promise`\<`unknown`\>

***

### login()

> `abstract` **login**\<`T`\>(`signData`): `Promise`\<[`UserCredentials`](../interfaces/UserCredentials.md)\<`T`\>\>

Defined in: [auth/auth.ts:10](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/auth/auth.ts#L10)

#### Type Parameters

##### T

`T` *extends* [`CredentialsCustomData`](../interfaces/CredentialsCustomData.md)

#### Parameters

##### signData

[`SignData`](../interfaces/SignData.md)

#### Returns

`Promise`\<[`UserCredentials`](../interfaces/UserCredentials.md)\<`T`\>\>

***

### logout()

> `abstract` **logout**(): `Promise`\<`void`\>

Defined in: [auth/auth.ts:11](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/auth/auth.ts#L11)

#### Returns

`Promise`\<`void`\>

***

### onAuthStateChange()

> `abstract` **onAuthStateChange**\<`T`\>(`onChange`): `void`

Defined in: [auth/auth.ts:16](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/auth/auth.ts#L16)

#### Type Parameters

##### T

`T` *extends* [`CredentialsCustomData`](../interfaces/CredentialsCustomData.md)

#### Parameters

##### onChange

(`userCredentials`) => `void`

#### Returns

`void`

***

### refreshToken()

> `abstract` **refreshToken**(): `Promise`\<`void`\>

Defined in: [auth/auth.ts:13](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/auth/auth.ts#L13)

#### Returns

`Promise`\<`void`\>

***

### resendVerificationEmail()

> `abstract` **resendVerificationEmail**(`email`, `password`, `verificationLink`): `Promise`\<`void`\>

Defined in: [auth/auth.ts:17](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/auth/auth.ts#L17)

#### Parameters

##### email

`string`

##### password

`string`

##### verificationLink

`string`

#### Returns

`Promise`\<`void`\>

***

### resetEmailPassword()

> `abstract` **resetEmailPassword**(`email`): `Promise`\<`void`\>

Defined in: [auth/auth.ts:12](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/auth/auth.ts#L12)

#### Parameters

##### email

`string`

#### Returns

`Promise`\<`void`\>

***

### signUp()

> `abstract` **signUp**\<`T`\>(`signData`): `Promise`\<[`UserCredentials`](../interfaces/UserCredentials.md)\<`T`\>\>

Defined in: [auth/auth.ts:9](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/auth/auth.ts#L9)

#### Type Parameters

##### T

`T` *extends* [`CredentialsCustomData`](../interfaces/CredentialsCustomData.md)

#### Parameters

##### signData

[`SignData`](../interfaces/SignData.md)

#### Returns

`Promise`\<[`UserCredentials`](../interfaces/UserCredentials.md)\<`T`\>\>

***

### unlinkProvider()

> `abstract` **unlinkProvider**(`provider`): `Promise`\<`unknown`\>

Defined in: [auth/auth.ts:15](https://github.com/entropic-bond/entropic-bond/blob/4d716a2f7964001188c69f59fec8baa07c622216/src/auth/auth.ts#L15)

#### Parameters

##### provider

[`AuthProvider`](../type-aliases/AuthProvider.md)

#### Returns

`Promise`\<`unknown`\>
