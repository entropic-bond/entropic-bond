[entropic-bond](../README.md) / [Exports](../modules.md) / AuthService

# Class: AuthService

The AuthService class is an abstract class that defines the interface of an authentication service.
You should derive from this class to implement your own authentication service.

## Hierarchy

- **`AuthService`**

  ↳ [`Auth`](Auth.md)

  ↳ [`AuthMock`](AuthMock.md)

## Table of contents

### Constructors

- [constructor](AuthService.md#constructor)

### Methods

- [linkAdditionalProvider](AuthService.md#linkadditionalprovider)
- [login](AuthService.md#login)
- [logout](AuthService.md#logout)
- [onAuthStateChange](AuthService.md#onauthstatechange)
- [resetEmailPassword](AuthService.md#resetemailpassword)
- [signUp](AuthService.md#signup)
- [unlinkProvider](AuthService.md#unlinkprovider)

## Constructors

### constructor

• **new AuthService**()

## Methods

### linkAdditionalProvider

▸ `Abstract` **linkAdditionalProvider**(`provider`): `Promise`<`unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `provider` | [`AuthProvider`](../modules.md#authprovider) |

#### Returns

`Promise`<`unknown`\>

#### Defined in

[auth/auth.ts:13](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/auth/auth.ts#L13)

___

### login

▸ `Abstract` **login**<`T`\>(`signData`): `Promise`<[`UserCredentials`](../interfaces/UserCredentials.md)<`T`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Object` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `signData` | [`SignData`](../interfaces/SignData.md) |

#### Returns

`Promise`<[`UserCredentials`](../interfaces/UserCredentials.md)<`T`\>\>

#### Defined in

[auth/auth.ts:10](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/auth/auth.ts#L10)

___

### logout

▸ `Abstract` **logout**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[auth/auth.ts:11](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/auth/auth.ts#L11)

___

### onAuthStateChange

▸ `Abstract` **onAuthStateChange**<`T`\>(`onChange`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Object` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `onChange` | (`userCredentials`: [`UserCredentials`](../interfaces/UserCredentials.md)<`T`\>) => `void` |

#### Returns

`void`

#### Defined in

[auth/auth.ts:15](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/auth/auth.ts#L15)

___

### resetEmailPassword

▸ `Abstract` **resetEmailPassword**(`email`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `email` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[auth/auth.ts:12](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/auth/auth.ts#L12)

___

### signUp

▸ `Abstract` **signUp**<`T`\>(`signData`): `Promise`<[`UserCredentials`](../interfaces/UserCredentials.md)<`T`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Object` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `signData` | [`SignData`](../interfaces/SignData.md) |

#### Returns

`Promise`<[`UserCredentials`](../interfaces/UserCredentials.md)<`T`\>\>

#### Defined in

[auth/auth.ts:9](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/auth/auth.ts#L9)

___

### unlinkProvider

▸ `Abstract` **unlinkProvider**(`provider`): `Promise`<`unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `provider` | [`AuthProvider`](../modules.md#authprovider) |

#### Returns

`Promise`<`unknown`\>

#### Defined in

[auth/auth.ts:14](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/auth/auth.ts#L14)
