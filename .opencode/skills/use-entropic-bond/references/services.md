# Entropic Bond — Services Reference

This reference documents the abstracted cloud service modules: Auth, ServerAuth, CloudStorage, and CloudFunctions.

---

## 1. Authentication (`Auth`)

`Auth` is a client-side authentication abstraction. Concrete providers (like Firebase or a Mock) can be swapped seamlessly.

### Registering and Using Auth

Use `AuthMock` for development and testing.

```ts
import { Auth, AuthMock } from 'entropic-bond'

// Register concrete provider
Auth.useAuthService( new AuthMock() );

// Access the singleton
const auth = Auth.instance;
```

### Common Auth Operations

- **`login( credentials )`**: Authenticate a user.
- **`logout()`**: Sign out the current user.
- **`onAuthStateChange( callback )`**: Listen to authentication state modifications.

```ts
// Login
const user = await Auth.instance.login({
  authProvider: 'email',
  email: 'user@test.com',
  password: 'password123'
});

console.log( 'Logged in user:', user.id, user.email );

// Auth State Listener
const unsubscribe = Auth.instance.onAuthStateChange( credentials => {
  if ( credentials ) {
    console.log( 'User is signed in:', credentials.email );
  } else {
    console.log( 'User is signed out' );
  }
});
```

---

## 2. Server Authentication (`ServerAuth`)

`ServerAuth` provides administrator-level user management (listing, creating, updating, or deleting users).

### Registering and Using ServerAuth

```ts
import { ServerAuth, ServerAuthMock } from 'entropic-bond'

ServerAuth.useServerAuthService( new ServerAuthMock() );
```

### Common Server Auth Operations

- **`getUser( id )`**: Fetch profile or metadata of any user.
- **`updateUser( id, data )`**: Update another user's custom properties.
- **`deleteUser( id )`**: Delete a user account from the server.

```ts
// Retrieve user info
const user = await ServerAuth.instance.getUser( 'user-id-123' );

// Update user details
await ServerAuth.instance.updateUser( 'user-id-123', {
  name: 'Updated Name'
});

// Delete user
await ServerAuth.instance.deleteUser( 'user-id-123' );
```

---

## 3. Cloud Storage (`CloudStorage`)

`CloudStorage` provides file storage and retrieval capability.

### Registering and Using Cloud Storage

```ts
import { CloudStorage, MockCloudStorage } from 'entropic-bond'

CloudStorage.useCloudStorage( new MockCloudStorage() );

const storage = CloudStorage.defaultCloudStorage;
```

### Operations

- **`save( path, fileData )`**: Upload a file/Blob to the specified path.
- **`getUrl( path )`**: Obtain a downloadable URL for a saved file path.

```ts
// Upload a file
const fileUrl = await storage.save( 'avatars/bob.png', bobBlob );

// Get a download link later
const downloadUrl = await storage.getUrl( 'avatars/bob.png' );
```

### `StoredFile` (Persistent Entity)

`StoredFile` is a built-in persistent entity that wraps cloud storage operations under standard persistent models.

```ts
import { StoredFile, Store } from 'entropic-bond'

const file = new StoredFile();
file.setDataToStore( fileBlob );

const fileModel = Store.getModel<StoredFile>( 'StoredFile' );
await fileModel.save( file );

// The file URL is populated automatically
console.log( 'Stored file URL:', file.url );
```

---

## 4. Cloud Functions (`CloudFunctions`)

`CloudFunctions` lets you call remote serverless functions or local mocks uniformly.

### Registering and Using Cloud Functions

Configure `CloudFunctionsMock` with a dictionary of mock function implementations for testing.

```ts
import { CloudFunctions, CloudFunctionsMock } from 'entropic-bond'

const mockFunctions = new CloudFunctionsMock({
  calculateTax: async ( params ) => {
    return params.amount * 0.15;
  }
});

CloudFunctions.useCloudFunctionsService( mockFunctions );
```

### Triggering a Function

Use `.getFunction( name )` to retrieve a callable function wrapper.

```ts
const calculateTax = CloudFunctions.instance.getFunction( 'calculateTax' );

const tax = await calculateTax({ amount: 100 });
console.log( 'Calculated Tax:', tax ); // 15
```
