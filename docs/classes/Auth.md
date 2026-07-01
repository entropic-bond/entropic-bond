[**entropic-bond**](../README.md)

***

[entropic-bond](../globals.md) / Auth

# Class: Auth

Defined in: [auth/auth.ts:38](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/auth/auth.ts#L38)

The Auth class is a singleton that provides a unified interface to the authentication service.
You should register an authentication service by using `Auth.useAuthService` 
method before using the Auth class.

## Extends

- [`AuthService`](AuthService.md)

## Constructors

### Constructor

> `protected` **new Auth**(): `Auth`

Defined in: [auth/auth.ts:41](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/auth/auth.ts#L41)

#### Returns

`Auth`

#### Overrides

[`AuthService`](AuthService.md).[`constructor`](AuthService.md#constructor)

## Properties

### error

> `static` **error**: `object`

Defined in: [auth/auth.ts:39](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/auth/auth.ts#L39)

#### shouldBeRegistered

> **shouldBeRegistered**: `string` = `'You should register an auth service before using Auth.'`

## Accessors

### instance

#### Get Signature

> **get** `static` **instance**(): `Auth`

Defined in: [auth/auth.ts:65](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/auth/auth.ts#L65)

The instance of the Auth class

##### Returns

`Auth`

the authentication service

## Methods

### linkAdditionalProvider()

> **linkAdditionalProvider**(`provider`): `Promise`\<`unknown`\>

Defined in: [auth/auth.ts:162](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/auth/auth.ts#L162)

Links an additional authentication provider to the authenticated user.

#### Parameters

##### provider

[`AuthProvider`](../type-aliases/AuthProvider.md)

the provider to be linked

#### Returns

`Promise`\<`unknown`\>

a promise that resolves when the process is done

#### Example

```ts
// Link a Google account to the auth service
Auth.instance.linkAdditionalProvider({ authProvider: 'google' })
```

#### Overrides

[`AuthService`](AuthService.md).[`linkAdditionalProvider`](AuthService.md#linkadditionalprovider)

***

### login()

> **login**\<`T`\>(`singData`): `Promise`\<[`UserCredentials`](../interfaces/UserCredentials.md)\<`T`\>\>

Defined in: [auth/auth.ts:93](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/auth/auth.ts#L93)

Logs in an existing user

#### Type Parameters

##### T

`T` *extends* [`CredentialsCustomData`](../interfaces/CredentialsCustomData.md)

#### Parameters

##### singData

[`SignData`](../interfaces/SignData.md)

the data to be used to log in the user

#### Returns

`Promise`\<[`UserCredentials`](../interfaces/UserCredentials.md)\<`T`\>\>

a promise that resolves to the user credentials

#### Example

```ts
// Log in an existing user with email and password
Auth.instance.login({ authProvider: 'email', email: 'john@test.com', password: '123456' })
// Log in an existing user with a Google account
Auth.instance.login({ authProvider: 'google'})
```

#### Overrides

[`AuthService`](AuthService.md).[`login`](AuthService.md#login)

***

### logout()

> **logout**(): `Promise`\<`void`\>

Defined in: [auth/auth.ts:101](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/auth/auth.ts#L101)

Logs out the current user

#### Returns

`Promise`\<`void`\>

a promise that resolves when the user is logged out

#### Overrides

[`AuthService`](AuthService.md).[`logout`](AuthService.md#logout)

***

### onAuthStateChange()

> **onAuthStateChange**\<`T`\>(`onChange`): [`Unsubscriber`](../type-aliases/Unsubscriber.md)

Defined in: [auth/auth.ts:142](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/auth/auth.ts#L142)

Adds a listener to be called when the authentication state changes.

#### Type Parameters

##### T

`T` *extends* [`CredentialsCustomData`](../interfaces/CredentialsCustomData.md)

#### Parameters

##### onChange

(`userCredentials`) => `void`

the listener to be called when the authentication state changes.
The listener is called with the user credentials as a parameter.
If the user is logged out, the listener is called with `undefined` as a parameter.

#### Returns

[`Unsubscriber`](../type-aliases/Unsubscriber.md)

a function to remove the listener

#### Example

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

#### Overrides

[`AuthService`](AuthService.md).[`onAuthStateChange`](AuthService.md#onauthstatechange)

***

### refreshToken()

> **refreshToken**(): `Promise`\<`void`\>

Defined in: [auth/auth.ts:122](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/auth/auth.ts#L122)

#### Returns

`Promise`\<`void`\>

#### Overrides

[`AuthService`](AuthService.md).[`refreshToken`](AuthService.md#refreshtoken)

***

### removeAuthStateChange()

> **removeAuthStateChange**\<`T`\>(`onChange`): `void`

Defined in: [auth/auth.ts:150](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/auth/auth.ts#L150)

Removes a listener that was added by `onAuthStateChange` method.

#### Type Parameters

##### T

`T` *extends* [`CredentialsCustomData`](../interfaces/CredentialsCustomData.md)

#### Parameters

##### onChange

(`userCredentials`) => `void`

the listener to be removed

#### Returns

`void`

***

### resendVerificationEmail()

> **resendVerificationEmail**(`email`, `password`, `verificationLink`): `Promise`\<`void`\>

Defined in: [auth/auth.ts:118](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/auth/auth.ts#L118)

Resends the email verification to the user.

#### Parameters

##### email

`string`

##### password

`string`

##### verificationLink

`string`

#### Returns

`Promise`\<`void`\>

a promise that resolves when the process is done

#### Overrides

[`AuthService`](AuthService.md).[`resendVerificationEmail`](AuthService.md#resendverificationemail)

***

### resetEmailPassword()

> **resetEmailPassword**(`email`): `Promise`\<`void`\>

Defined in: [auth/auth.ts:110](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/auth/auth.ts#L110)

Resets the password associated with the email.

#### Parameters

##### email

`string`

the email address of the user to reset the password

#### Returns

`Promise`\<`void`\>

a promise that resolves when the process is done

#### Overrides

[`AuthService`](AuthService.md).[`resetEmailPassword`](AuthService.md#resetemailpassword)

***

### signUp()

> **signUp**\<`T`\>(`singData`): `Promise`\<[`UserCredentials`](../interfaces/UserCredentials.md)\<`T`\>\>

Defined in: [auth/auth.ts:79](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/auth/auth.ts#L79)

Signs up a new user

#### Type Parameters

##### T

`T` *extends* [`CredentialsCustomData`](../interfaces/CredentialsCustomData.md)

#### Parameters

##### singData

[`SignData`](../interfaces/SignData.md)

the data to be used to sign up the user

#### Returns

`Promise`\<[`UserCredentials`](../interfaces/UserCredentials.md)\<`T`\>\>

a promise that resolves to the user credentials

#### Example

```ts
// Sign up a new user with email and password
Auth.instance.signUp({ authProvider: 'email', email: 'john@test.com', password: '123456' })
// Sign up a new user with a Google account
Auth.instance.signUp({ authProvider: 'google'})
```

#### Overrides

[`AuthService`](AuthService.md).[`signUp`](AuthService.md#signup)

***

### unlinkProvider()

> **unlinkProvider**(`provider`): `Promise`\<`unknown`\>

Defined in: [auth/auth.ts:174](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/auth/auth.ts#L174)

Unlinks an authentication provider from the authenticated user.

#### Parameters

##### provider

[`AuthProvider`](../type-aliases/AuthProvider.md)

the provider to be unlinked

#### Returns

`Promise`\<`unknown`\>

a promise that resolves when the process is done

#### Example

```ts
// Unlink the Google account from the auth service
Auth.instance.unlinkProvider({ authProvider: 'google' })
```

#### Overrides

[`AuthService`](AuthService.md).[`unlinkProvider`](AuthService.md#unlinkprovider)

***

### useAuthService()

> `static` **useAuthService**(`authService`): `void`

Defined in: [auth/auth.ts:54](https://github.com/entropic-bond/entropic-bond/blob/dc09b27ce3505d575712f6bd177a18ab8bfa0c33/src/auth/auth.ts#L54)

Registers an authentication service to be used by the Auth class.
You need to register an authentication service before using the Auth class.

#### Parameters

##### authService

[`AuthService`](AuthService.md)

the authentication service to be used by the Auth class

#### Returns

`void`
