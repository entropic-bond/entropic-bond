[entropic-bond](../README.md) / [Exports](../modules.md) / ServerAuth

# Class: ServerAuth

## Hierarchy

- [`ServerAuthService`](ServerAuthService.md)

  ↳ **`ServerAuth`**

## Table of contents

### Constructors

- [constructor](ServerAuth.md#constructor)

### Properties

- [error](ServerAuth.md#error)

### Accessors

- [instance](ServerAuth.md#instance)

### Methods

- [deleteUser](ServerAuth.md#deleteuser)
- [getUser](ServerAuth.md#getuser)
- [setCustomCredentials](ServerAuth.md#setcustomcredentials)
- [updateUser](ServerAuth.md#updateuser)
- [useServerAuthService](ServerAuth.md#useserverauthservice)

## Constructors

### constructor

• `Protected` **new ServerAuth**()

#### Overrides

[ServerAuthService](ServerAuthService.md).[constructor](ServerAuthService.md#constructor)

#### Defined in

[server-auth/server-auth.ts:17](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/server-auth/server-auth.ts#L17)

## Properties

### error

▪ `Static` **error**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `shouldBeRegistered` | `string` |

#### Defined in

[server-auth/server-auth.ts:15](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/server-auth/server-auth.ts#L15)

## Accessors

### instance

• `Static` `get` **instance**(): [`ServerAuth`](ServerAuth.md)

#### Returns

[`ServerAuth`](ServerAuth.md)

#### Defined in

[server-auth/server-auth.ts:26](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/server-auth/server-auth.ts#L26)

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

[server-auth/server-auth.ts:43](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/server-auth/server-auth.ts#L43)

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

[server-auth/server-auth.ts:31](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/server-auth/server-auth.ts#L31)

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

[server-auth/server-auth.ts:39](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/server-auth/server-auth.ts#L39)

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

[server-auth/server-auth.ts:35](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/server-auth/server-auth.ts#L35)

___

### useServerAuthService

▸ `Static` **useServerAuthService**(`authService`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `authService` | [`ServerAuthService`](ServerAuthService.md) |

#### Returns

`void`

#### Defined in

[server-auth/server-auth.ts:19](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/server-auth/server-auth.ts#L19)
