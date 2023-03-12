[entropic-bond](../README.md) / [Exports](../modules.md) / Auth

# Class: Auth

The Auth class is a singleton that provides a unified interface to the authentication service.
You should register an authentication service by using `Auth.useAuthService` 
method before using the Auth class.

## Hierarchy

- [`AuthService`](AuthService.md)

  ↳ **`Auth`**

## Table of contents

### Constructors

- [constructor](Auth.md#constructor)

### Properties

- [error](Auth.md#error)

### Accessors

- [instance](Auth.md#instance)

### Methods

- [linkAdditionalProvider](Auth.md#linkadditionalprovider)
- [login](Auth.md#login)
- [logout](Auth.md#logout)
- [onAuthStateChange](Auth.md#onauthstatechange)
- [removeAuthStateChange](Auth.md#removeauthstatechange)
- [resetEmailPassword](Auth.md#resetemailpassword)
- [signUp](Auth.md#signup)
- [unlinkProvider](Auth.md#unlinkprovider)
- [useAuthService](Auth.md#useauthservice)

## Constructors

### constructor

• `Protected` **new Auth**()

#### Overrides

[AuthService](AuthService.md).[constructor](AuthService.md#constructor)

#### Defined in

[auth/auth.ts:39](https://github.com/entropic-bond/entropic-bond/blob/2d7d466/src/auth/auth.ts#L39)

## Properties

### error

▪ `Static` **error**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `shouldBeRegistered` | `string` |

#### Defined in

[auth/auth.ts:37](https://github.com/entropic-bond/entropic-bond/blob/2d7d466/src/auth/auth.ts#L37)

## Accessors

### instance

• `Static` `get` **instance**(): [`Auth`](Auth.md)

The instance of the Auth class

#### Returns

[`Auth`](Auth.md)

the authentication service

#### Defined in

[auth/auth.ts:63](https://github.com/entropic-bond/entropic-bond/blob/2d7d466/src/auth/auth.ts#L63)

## Methods

### linkAdditionalProvider

▸ **linkAdditionalProvider**(`provider`): `Promise`<`unknown`\>

Links an additional authentication provider to the authenticated user.

**`Example`**

```ts
// Link a Google account to the auth service
Auth.instance.linkAdditionalProvider({ authProvider: 'google' })
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `provider` | [`AuthProvider`](../modules.md#authprovider) | the provider to be linked |

#### Returns

`Promise`<`unknown`\>

a promise that resolves when the process is done

#### Overrides

[AuthService](AuthService.md).[linkAdditionalProvider](AuthService.md#linkadditionalprovider)

#### Defined in

[auth/auth.ts:148](https://github.com/entropic-bond/entropic-bond/blob/2d7d466/src/auth/auth.ts#L148)

___

### login

▸ **login**<`T`\>(`singData`): `Promise`<[`UserCredentials`](../interfaces/UserCredentials.md)<`T`\>\>

Logs in an existing user

**`Example`**

```ts
// Log in an existing user with email and password
Auth.instance.login({ authProvider: 'email', email: 'john@test.com', password: '123456' })
// Log in an existing user with a Google account
Auth.instance.login({ authProvider: 'google'})
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Object` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `singData` | [`SignData`](../interfaces/SignData.md) | the data to be used to log in the user |

#### Returns

`Promise`<[`UserCredentials`](../interfaces/UserCredentials.md)<`T`\>\>

a promise that resolves to the user credentials

#### Overrides

[AuthService](AuthService.md).[login](AuthService.md#login)

#### Defined in

[auth/auth.ts:91](https://github.com/entropic-bond/entropic-bond/blob/2d7d466/src/auth/auth.ts#L91)

___

### logout

▸ **logout**(): `Promise`<`void`\>

Logs out the current user

#### Returns

`Promise`<`void`\>

a promise that resolves when the user is logged out

#### Overrides

[AuthService](AuthService.md).[logout](AuthService.md#logout)

#### Defined in

[auth/auth.ts:99](https://github.com/entropic-bond/entropic-bond/blob/2d7d466/src/auth/auth.ts#L99)

___

### onAuthStateChange

▸ **onAuthStateChange**<`T`\>(`onChange`): [`Unsubscriber`](../modules.md#unsubscriber)

Adds a listener to be called when the authentication state changes.

**`Example`**

```ts
// Add a listener to be called when the authentication state changes
const removeListener = Auth.instance.onAuthStateChange( userCredentials => {
	if ( userCredentials ) {
		// The user is logged in
	} else {
		// The user is logged out
	}
})
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Object` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `onChange` | (`userCredentials`: [`UserCredentials`](../interfaces/UserCredentials.md)<`T`\>) => `void` | the listener to be called when the authentication state changes. The listener is called with the user credentials as a parameter. If the user is logged out, the listener is called with `undefined` as a parameter. |

#### Returns

[`Unsubscriber`](../modules.md#unsubscriber)

a function to remove the listener

#### Overrides

[AuthService](AuthService.md).[onAuthStateChange](AuthService.md#onauthstatechange)

#### Defined in

[auth/auth.ts:128](https://github.com/entropic-bond/entropic-bond/blob/2d7d466/src/auth/auth.ts#L128)

___

### removeAuthStateChange

▸ **removeAuthStateChange**<`T`\>(`onChange`): `void`

Removes a listener that was added by `onAuthStateChange` method.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Object` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `onChange` | (`userCredentials`: [`UserCredentials`](../interfaces/UserCredentials.md)<`T`\>) => `void` | the listener to be removed |

#### Returns

`void`

#### Defined in

[auth/auth.ts:136](https://github.com/entropic-bond/entropic-bond/blob/2d7d466/src/auth/auth.ts#L136)

___

### resetEmailPassword

▸ **resetEmailPassword**(`email`): `Promise`<`void`\>

Resets the password associated with the email.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `email` | `string` | the email address of the user to reset the password |

#### Returns

`Promise`<`void`\>

a promise that resolves when the process is done

#### Overrides

[AuthService](AuthService.md).[resetEmailPassword](AuthService.md#resetemailpassword)

#### Defined in

[auth/auth.ts:108](https://github.com/entropic-bond/entropic-bond/blob/2d7d466/src/auth/auth.ts#L108)

___

### signUp

▸ **signUp**<`T`\>(`singData`): `Promise`<[`UserCredentials`](../interfaces/UserCredentials.md)<`T`\>\>

Signs up a new user

**`Example`**

```ts
// Sign up a new user with email and password
Auth.instance.signUp({ authProvider: 'email', email: 'john@test.com', password: '123456' })
// Sign up a new user with a Google account
Auth.instance.signUp({ authProvider: 'google'})
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Object` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `singData` | [`SignData`](../interfaces/SignData.md) | the data to be used to sign up the user |

#### Returns

`Promise`<[`UserCredentials`](../interfaces/UserCredentials.md)<`T`\>\>

a promise that resolves to the user credentials

#### Overrides

[AuthService](AuthService.md).[signUp](AuthService.md#signup)

#### Defined in

[auth/auth.ts:77](https://github.com/entropic-bond/entropic-bond/blob/2d7d466/src/auth/auth.ts#L77)

___

### unlinkProvider

▸ **unlinkProvider**(`provider`): `Promise`<`unknown`\>

Unlinks an authentication provider from the authenticated user.

**`Example`**

```ts
// Unlink the Google account from the auth service
Auth.instance.unlinkProvider({ authProvider: 'google' })
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `provider` | [`AuthProvider`](../modules.md#authprovider) | the provider to be unlinked |

#### Returns

`Promise`<`unknown`\>

a promise that resolves when the process is done

#### Overrides

[AuthService](AuthService.md).[unlinkProvider](AuthService.md#unlinkprovider)

#### Defined in

[auth/auth.ts:160](https://github.com/entropic-bond/entropic-bond/blob/2d7d466/src/auth/auth.ts#L160)

___

### useAuthService

▸ `Static` **useAuthService**(`authService`): `void`

Registers an authentication service to be used by the Auth class.
You need to register an authentication service before using the Auth class.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `authService` | [`AuthService`](AuthService.md) | the authentication service to be used by the Auth class |

#### Returns

`void`

#### Defined in

[auth/auth.ts:52](https://github.com/entropic-bond/entropic-bond/blob/2d7d466/src/auth/auth.ts#L52)
