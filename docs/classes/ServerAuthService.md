[entropic-bond](../README.md) / [Exports](../modules.md) / ServerAuthService

# Class: ServerAuthService

## Hierarchy

- **`ServerAuthService`**

  ↳ [`ServerAuth`](ServerAuth.md)

  ↳ [`ServerAuthMock`](ServerAuthMock.md)

## Table of contents

### Constructors

- [constructor](ServerAuthService.md#constructor)

### Methods

- [deleteUser](ServerAuthService.md#deleteuser)
- [getUser](ServerAuthService.md#getuser)
- [setCustomCredentials](ServerAuthService.md#setcustomcredentials)
- [updateUser](ServerAuthService.md#updateuser)

## Constructors

### constructor

• **new ServerAuthService**()

## Methods

### deleteUser

▸ `Abstract` **deleteUser**(`userId`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `userId` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[server-auth/server-auth.ts:11](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/server-auth/server-auth.ts#L11)

___

### getUser

▸ `Abstract` **getUser**<`T`\>(`userId`): `Promise`<[`UserCredentials`](../interfaces/UserCredentials.md)<`T`\>\>

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

#### Defined in

[server-auth/server-auth.ts:9](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/server-auth/server-auth.ts#L9)

___

### setCustomCredentials

▸ `Abstract` **setCustomCredentials**<`T`\>(`userId`, `customCredentials`): `Promise`<`void`\>

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

#### Defined in

[server-auth/server-auth.ts:8](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/server-auth/server-auth.ts#L8)

___

### updateUser

▸ `Abstract` **updateUser**<`T`\>(`userId`, `credentials`): `Promise`<[`UserCredentials`](../interfaces/UserCredentials.md)<`T`\>\>

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

#### Defined in

[server-auth/server-auth.ts:10](https://github.com/entropic-bond/entropic-bond/blob/c9dd385/src/server-auth/server-auth.ts#L10)
