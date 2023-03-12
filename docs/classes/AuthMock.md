[entropic-bond](../README.md) / [Exports](../modules.md) / AuthMock

# Class: AuthMock

The AuthService class is an abstract class that defines the interface of an authentication service.
You should derive from this class to implement your own authentication service.

## Hierarchy

- [`AuthService`](AuthService.md)

  ↳ **`AuthMock`**

## Table of contents

### Constructors

- [constructor](AuthMock.md#constructor)

### Accessors

- [fakeRegisteredUsers](AuthMock.md#fakeregisteredusers)

### Methods

- [fakeRegisteredUser](AuthMock.md#fakeregistereduser)
- [flush](AuthMock.md#flush)
- [linkAdditionalProvider](AuthMock.md#linkadditionalprovider)
- [login](AuthMock.md#login)
- [logout](AuthMock.md#logout)
- [onAuthStateChange](AuthMock.md#onauthstatechange)
- [resetEmailPassword](AuthMock.md#resetemailpassword)
- [signUp](AuthMock.md#signup)
- [unlinkProvider](AuthMock.md#unlinkprovider)

## Constructors

### constructor

• **new AuthMock**()

#### Inherited from

[AuthService](AuthService.md).[constructor](AuthService.md#constructor)

## Accessors

### fakeRegisteredUsers

• `get` **fakeRegisteredUsers**(): [`Collection`](../interfaces/Collection.md)<[`UserCredentials`](../interfaces/UserCredentials.md)<{}\>\>

#### Returns

[`Collection`](../interfaces/Collection.md)<[`UserCredentials`](../interfaces/UserCredentials.md)<{}\>\>

#### Defined in

[auth/auth-mock.ts:85](https://github.com/entropic-bond/entropic-bond/blob/2d7d466/src/auth/auth-mock.ts#L85)

## Methods

### fakeRegisteredUser

▸ **fakeRegisteredUser**<`T`\>(`userCredentials`): [`AuthMock`](AuthMock.md)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Object` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `userCredentials` | [`UserCredentials`](../interfaces/UserCredentials.md)<`T`\> |

#### Returns

[`AuthMock`](AuthMock.md)

#### Defined in

[auth/auth-mock.ts:79](https://github.com/entropic-bond/entropic-bond/blob/2d7d466/src/auth/auth-mock.ts#L79)

___

### flush

▸ **flush**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[auth/auth-mock.ts:74](https://github.com/entropic-bond/entropic-bond/blob/2d7d466/src/auth/auth-mock.ts#L74)

___

### linkAdditionalProvider

▸ **linkAdditionalProvider**(`provider`): `Promise`<`unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `provider` | [`AuthProvider`](../modules.md#authprovider) |

#### Returns

`Promise`<`unknown`\>

#### Overrides

[AuthService](AuthService.md).[linkAdditionalProvider](AuthService.md#linkadditionalprovider)

#### Defined in

[auth/auth-mock.ts:66](https://github.com/entropic-bond/entropic-bond/blob/2d7d466/src/auth/auth-mock.ts#L66)

___

### login

▸ **login**<`T`\>(`signData`): `Promise`<[`UserCredentials`](../interfaces/UserCredentials.md)<`T`\>\>

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

#### Overrides

[AuthService](AuthService.md).[login](AuthService.md#login)

#### Defined in

[auth/auth-mock.ts:30](https://github.com/entropic-bond/entropic-bond/blob/2d7d466/src/auth/auth-mock.ts#L30)

___

### logout

▸ **logout**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Overrides

[AuthService](AuthService.md).[logout](AuthService.md#logout)

#### Defined in

[auth/auth-mock.ts:47](https://github.com/entropic-bond/entropic-bond/blob/2d7d466/src/auth/auth-mock.ts#L47)

___

### onAuthStateChange

▸ **onAuthStateChange**<`T`\>(`onChange`): `void`

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

#### Overrides

[AuthService](AuthService.md).[onAuthStateChange](AuthService.md#onauthstatechange)

#### Defined in

[auth/auth-mock.ts:42](https://github.com/entropic-bond/entropic-bond/blob/2d7d466/src/auth/auth-mock.ts#L42)

___

### resetEmailPassword

▸ **resetEmailPassword**(`email`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `email` | `string` |

#### Returns

`Promise`<`void`\>

#### Overrides

[AuthService](AuthService.md).[resetEmailPassword](AuthService.md#resetemailpassword)

#### Defined in

[auth/auth-mock.ts:57](https://github.com/entropic-bond/entropic-bond/blob/2d7d466/src/auth/auth-mock.ts#L57)

___

### signUp

▸ **signUp**<`T`\>(`signData`): `Promise`<[`UserCredentials`](../interfaces/UserCredentials.md)<`T`\>\>

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

#### Overrides

[AuthService](AuthService.md).[signUp](AuthService.md#signup)

#### Defined in

[auth/auth-mock.ts:7](https://github.com/entropic-bond/entropic-bond/blob/2d7d466/src/auth/auth-mock.ts#L7)

___

### unlinkProvider

▸ **unlinkProvider**(`provider`): `Promise`<`unknown`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `provider` | [`AuthProvider`](../modules.md#authprovider) |

#### Returns

`Promise`<`unknown`\>

#### Overrides

[AuthService](AuthService.md).[unlinkProvider](AuthService.md#unlinkprovider)

#### Defined in

[auth/auth-mock.ts:70](https://github.com/entropic-bond/entropic-bond/blob/2d7d466/src/auth/auth-mock.ts#L70)
