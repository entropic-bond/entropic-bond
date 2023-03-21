[entropic-bond](../README.md) / [Exports](../modules.md) / ServerAuthMock

# Class: ServerAuthMock

## Hierarchy

- [`ServerAuthService`](ServerAuthService.md)

  ↳ **`ServerAuthMock`**

## Table of contents

### Constructors

- [constructor](ServerAuthMock.md#constructor)

### Accessors

- [userCredentials](ServerAuthMock.md#usercredentials)

### Methods

- [deleteUser](ServerAuthMock.md#deleteuser)
- [getUser](ServerAuthMock.md#getuser)
- [setCustomCredentials](ServerAuthMock.md#setcustomcredentials)
- [updateUser](ServerAuthMock.md#updateuser)

## Constructors

### constructor

• **new ServerAuthMock**(`userCredentials`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `userCredentials` | [`Collection`](../interfaces/Collection.md)<[`UserCredentials`](../interfaces/UserCredentials.md)<{}\>\> |

#### Overrides

[ServerAuthService](ServerAuthService.md).[constructor](ServerAuthService.md#constructor)

#### Defined in

[server-auth/server-auth-mock.ts:6](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/server-auth/server-auth-mock.ts#L6)

## Accessors

### userCredentials

• `get` **userCredentials**(): [`Collection`](../interfaces/Collection.md)<[`UserCredentials`](../interfaces/UserCredentials.md)<{}\>\>

#### Returns

[`Collection`](../interfaces/Collection.md)<[`UserCredentials`](../interfaces/UserCredentials.md)<{}\>\>

#### Defined in

[server-auth/server-auth-mock.ts:39](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/server-auth/server-auth-mock.ts#L39)

## Methods

### deleteUser

▸ **deleteUser**(`userId`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `userId` | `string` |

#### Returns

`Promise`<`void`\>

#### Overrides

[ServerAuthService](ServerAuthService.md).[deleteUser](ServerAuthService.md#deleteuser)

#### Defined in

[server-auth/server-auth-mock.ts:34](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/server-auth/server-auth-mock.ts#L34)

___

### getUser

▸ **getUser**<`T`\>(`userId`): `Promise`<[`UserCredentials`](../interfaces/UserCredentials.md)<`T`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`CustomCredentials`](../interfaces/CustomCredentials.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `userId` | `string` |

#### Returns

`Promise`<[`UserCredentials`](../interfaces/UserCredentials.md)<`T`\>\>

#### Overrides

[ServerAuthService](ServerAuthService.md).[getUser](ServerAuthService.md#getuser)

#### Defined in

[server-auth/server-auth-mock.ts:11](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/server-auth/server-auth-mock.ts#L11)

___

### setCustomCredentials

▸ **setCustomCredentials**<`T`\>(`userId`, `customCredentials`): `Promise`<`void`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`CustomCredentials`](../interfaces/CustomCredentials.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `userId` | `string` |
| `customCredentials` | `T` |

#### Returns

`Promise`<`void`\>

#### Overrides

[ServerAuthService](ServerAuthService.md).[setCustomCredentials](ServerAuthService.md#setcustomcredentials)

#### Defined in

[server-auth/server-auth-mock.ts:17](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/server-auth/server-auth-mock.ts#L17)

___

### updateUser

▸ **updateUser**<`T`\>(`userId`, `credentials`): `Promise`<[`UserCredentials`](../interfaces/UserCredentials.md)<`T`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`CustomCredentials`](../interfaces/CustomCredentials.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `userId` | `string` |
| `credentials` | `Partial`<[`UserCredentials`](../interfaces/UserCredentials.md)<`T`\>\> |

#### Returns

`Promise`<[`UserCredentials`](../interfaces/UserCredentials.md)<`T`\>\>

#### Overrides

[ServerAuthService](ServerAuthService.md).[updateUser](ServerAuthService.md#updateuser)

#### Defined in

[server-auth/server-auth-mock.ts:24](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/server-auth/server-auth-mock.ts#L24)
