# Entropic Bond

> Tidy up your messy components

**Entropic Bond** helps your _TypeScript_ software development, both in the frontend and the backend. It is composed by several abstractions that make your code fully decoupled from the database, authorization service or cloud storage provider yet easy to use. In addition, it offers an observer based architecture to intercommunicate your business logic entities efficiently.

## Who needs to focus on a unique backend provider

**Entropic Bond** is designed with the serverless and NoSQL models in mind. This doesn't mean you cannot use it in such scenarios. Moreover, it is an excellent tool to develop _Functions as a Service_ (FaaS). With **Entropic Bond**, you just forget about those implementation details. You only need to focus on developing your domain model.

## Who needs a global state

**Entropic Bond** removes the need to maintain a global state. The underlying architecture is designed in a way that the state is maintained at entity level and the relationship between the entities is provided by a notification infrastructure.

## How to use


Typically, you will derive all your business logic entities from the `EntropicComponent` class. This class provides two main functionalities; persistence and observability.

### API

You can find the API documentation in the [docs/](./docs) directory.

### Persistence

The persistence mechanism allows defining which entities and which properties of those entities should be stored in the database. To make an entity persistent, it should derive from the `EntropicComponent` class or the `Persistent` class. 

In order to allow the persistence mechanism to automatically instantiate entities from the database, you should use the `@registerPersistentClass` decorator passing the class name as a parameter.

The properties or attributes that you want to be streamed should be preceded by the `@persistent` decorator in the attribute declaration. The property name must be private and prefixed with an underscore (_). Access to the public attributes should be done by the use of accessors.

```ts
@registerPersistentClass( 'MyEntity' )
class MyEntity extends Persistent {
	@persistent private _persistentProp1: string
	@persistent private _persistentProp2: boolean
	@persistent private _persistentProp3: AnotherPersistentObject
	@persistent private _persistentProp4: number[]

	private _nonPersistentProp: unknown
	
	// accessors go here ...
}
```

#### Storing and querying the persistent entities

The database abstraction is provided by the `Store` object.

The `Store.getModel` method will return an object with methods to access the database.

```ts
let foundEntity: MyEntity
const myEntity = new MyEntity()
const entityModel = Store.getModel<MyEntity>( 'MyEntity' )

// fill myEntity object with data here ...

await entityModel.save( myEntity )		// saves myEntity in the database

foundEntity = await entityModel.findById( '0340d-349ab' ) // retrieves from database

foundEntity = await entityModel.find().
									.where( 'persistentProp1', '==', 'foo' )
									.where( 'persistentProp2', '==', true )
									.limit( 10 )
									.orderBy( 'persistentProp1', 'desc' )
									.get()														// retrieves from database

entityModel.delete( '0340d-349ab' )									// deletes from database
```

#### Set up the database access

The database access is encapsulated in a `DataSource` object. A concrete implementation of a _JSON_ `DataSource` is provided as `JsonDataSource`. You can use this implementation for testing purposes.

Currently, there is an official plugin to connect to a **Firebase** _Firestore_ database. To install the plugin, run:

```sh
npm i entropic-bond-firebase
```

You can develop new plugins following the plugin developer's section.

You should instantiate the concrete implementation of the `DataSource` and pass it to the `useDataSource` method of the `Store` object.

```ts
Store.useDataSource( new JsonDataSource() )
```

> See the complete example at [samples/01-persistence.ts](./samples/01-persistence.ts)

### Observability

The observability mechanism allows entities to notify when their properties change. Derive your class from `EntropicComponent` (which extends `Persistent`) and use `changeProp` in setters or `pushAndNotify`/`removeAndNotify` for arrays.

```ts
import { EntropicComponent } from 'entropic-bond'

class MyEntity extends EntropicComponent {
  private _name: string = ''

  get name(): string { return this._name }
  set name(value: string) { this.changeProp('name', value) }
}

const entity = new MyEntity()
const unsub = entity.onChange(event => console.log('Changed:', event))

entity.name = 'new value' // triggers the onChange listener
unsub() // removes the listener
```

You can also directly use the generic `Observable<T>` class for standalone observer patterns.

```ts
import { Observable } from 'entropic-bond'

const observable = new Observable<string>()
const unsubscribe = observable.subscribe(event => console.log(event))
observable.notify('hello')
```

> See the complete example at [samples/02-observability.ts](./samples/02-observability.ts)

### Auth

Authentication is abstracted via `AuthService`. Register a concrete implementation and use the `Auth` singleton.

```ts
import { Auth, AuthMock } from 'entropic-bond'

Auth.useAuthService(new AuthMock())

async function example() {
  const user = await Auth.instance.login({ authProvider: 'email', email: 'user@test.com', password: '123456' })
  console.log(user.id, user.email)

  Auth.instance.onAuthStateChange(credentials => {
    console.log('Auth state changed:', credentials)
  })
}
```

Plugins exist for production providers (e.g., Firebase Authentication). To create a custom provider, implement the `AuthService` abstract class.

> See the complete example at [samples/03-auth.ts](./samples/03-auth.ts)

### Server Auth

For admin-level user management (list, update, delete users), use `ServerAuth`.

```ts
import { ServerAuth, ServerAuthMock } from 'entropic-bond'

ServerAuth.useServerAuthService(new ServerAuthMock())

const user = await ServerAuth.instance.getUser('user-id')
await ServerAuth.instance.updateUser('user-id', { name: 'Updated Name' })
await ServerAuth.instance.deleteUser('user-id')
```

> See the complete example at [samples/04-server-auth.ts](./samples/04-server-auth.ts)

### Cloud Storage

File storage is abstracted via `CloudStorage`. Register a provider and use the singleton, or use the `StoredFile` persistent entity.

```ts
import { CloudStorage, MockCloudStorage, StoredFile } from 'entropic-bond'

CloudStorage.useCloudStorage(new MockCloudStorage())

// Direct usage
const url = await CloudStorage.defaultCloudStorage.save('my-file', fileData)
const downloadUrl = await CloudStorage.defaultCloudStorage.getUrl('my-file')

// Or with StoredFile (persistent entity)
const file = new StoredFile()
file.setDataToStore(someBlob)
await file.save()
console.log(file.url)
```

> See the complete example at [samples/05-cloud-storage.ts](./samples/05-cloud-storage.ts)

### Cloud Functions

Call serverless functions through an abstract interface.

```ts
import { CloudFunctions, CloudFunctionsMock } from 'entropic-bond'

const mockService = new CloudFunctionsMock({
  myFunction: async (params) => `Hello ${params.name}`
})
CloudFunctions.useCloudFunctionsService(mockService)

const fn = CloudFunctions.instance.getFunction('myFunction')
const result = await fn({ name: 'World' })
```

> See the complete example at [samples/06-cloud-functions.ts](./samples/06-cloud-functions.ts)

### Realtime document listeners

The `Model` supports realtime updates on documents and collections.

```ts
const model = Store.getModel<MyEntity>('MyEntity')

// Listen to a single document
const unsubscribe1 = model.onDocumentChange('doc-id', change => {
  console.log('Before:', change.before, 'After:', change.after)
})

// Listen to a collection query
const unsubscribe2 = model.onCollectionChange(
  model.find().where('name', '==', 'foo'),
  change => console.log('Collection changed:', change)
)

// Listen to a wildcard collection template
const unsubscribe3 = model.onCollectionTemplateChange('{userId}/Posts', change => {
  console.log('Post changed in', change.collectionPath)
})
```

> See the complete example at [samples/07-realtime-listeners.ts](./samples/07-realtime-listeners.ts)

### DataSource plugins

The persistence layer uses a `DataSource` to communicate with the database. Implement the abstract `DataSource` class to support new backends.

```ts
import { DataSource, Store } from 'entropic-bond'

class MyDatabase extends DataSource {
  // implement all abstract methods: findById, find, save, delete, etc.
}

Store.useDataSource(new MyDatabase())
```

The official Firebase plugin is available as `entropic-bond-firebase`.

```sh
npm i entropic-bond-firebase
```

> See the complete example at [samples/10-datasource-plugin.ts](./samples/10-datasource-plugin.ts)

### Cached property references

When a property holds a reference to another persistent entity, you can embed selected primitive fields directly in the reference to avoid extra queries.

```ts
@registerPersistentClass('Team')
class Team extends EntropicComponent {
  @persistent private _name: string
}

@registerPersistentClass('User')
class User extends EntropicComponent {
  @persistentReferenceWithCachedProps(['_name'], 'Team')
  private _team: Team
}
```

The `CachedPropsUpdater` (installed via `DataSource.installCachedPropsUpdater()`) will propagate changes to cached props across all referencing documents.

> See the complete example at [samples/08-cached-props.ts](./samples/08-cached-props.ts)

### Utility functions

```ts
import { camelCase, snakeCase, replaceValue, getDeepValue } from 'entropic-bond'

camelCase('hello-world')        // 'helloWorld'
snakeCase('helloWorld')         // 'hello-world'
replaceValue('Hi ${name}', { name: 'John' }) // 'Hi John'
```

> See the complete example at [samples/09-utils.ts](./samples/09-utils.ts)

### Samples

Complete, runnable examples are available in the [`samples/`](./samples) directory:

| Section | Sample |
|---------|--------|
| Persistence | [01-persistence.ts](./samples/01-persistence.ts) |
| Observability | [02-observability.ts](./samples/02-observability.ts) |
| Auth | [03-auth.ts](./samples/03-auth.ts) |
| Server Auth | [04-server-auth.ts](./samples/04-server-auth.ts) |
| Cloud Storage | [05-cloud-storage.ts](./samples/05-cloud-storage.ts) |
| Cloud Functions | [06-cloud-functions.ts](./samples/06-cloud-functions.ts) |
| Realtime listeners | [07-realtime-listeners.ts](./samples/07-realtime-listeners.ts) |
| Cached property references | [08-cached-props.ts](./samples/08-cached-props.ts) |
| Utility functions | [09-utils.ts](./samples/09-utils.ts) |
| DataSource plugins | [10-datasource-plugin.ts](./samples/10-datasource-plugin.ts) |
