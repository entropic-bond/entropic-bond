# Entropic Bond

> Tidy up your messy components

**Entropic Bond** helps your _TypeScript_ software development, both in the frontend and the backend. It is composed by several abstractions that make your code fully decoupled from the database, authorization service or cloud storage provider yet easy to use. In addition, it offers an observer based architecture to intercommunicate your business logic entities efficiently.

## Who needs to focus on a unique backend provider

**Entropic Bond** is designed with the serverless and NoSQL models in mind. This doesn't mean you cannot use it in such scenarios. Moreover, it is an excellent tool to develop _Functions as a Service_ (FaaS). With **Entropic Bond**, you just forget about those implementation details. You only need to focus on developing your domain model.

## Who needs a global state

**Entropic Bond** removes the need to maintain a global state. The underlying architecture is designed in a way that the state is maintained at entity level and the relationship between the entities is provided by a notification infrastructure.

## How to use

Typically, you will derive all your business logic entities from the `EntropicComponent` class. This class provides two main functionalities; persistence and observability.

### Persistence

The persistence mechanism allows defining which entities and which properties of those entities should be stored in the database. To make an entity persistent, it should derive from the `EntropicComponent` class or the `Persistent` class. 

In order to allow the persistence mechanism to automatically instantiate entities from the database, you should use the `@registerPersistentClass` decorator passing the class name and a function that produces new instances of the class.

The properties or attributes that you want to be streamed should be preceded by the `@persistent` decorator in the attribute declaration and the attribute name is expected to be private and prefixed with an underscore (_). Access to the public attributes should be done using accessors.

```ts
@registerPersistentClass( 'MyEntity' )
class MyEntity extends EntropicBond {
	@persistent private _persistentProp1: string
	@persistent private _persistentProp2: boolean
	@persistent private _persistentProp3: AnotherPersistentObject
	@persistent private _persistentProp4: number[]

	private _nonPersistentProp: unknown
	
	// accessors go here ...
}
```

#### Storing and querying the persistent entities

The database abstraction is provided by the `Store` object. To learn how to set up a concrete database, [see below](setup_the_database_access).

The `Store.getModel` method will produce and object with methods to access the data in the database.

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

You can develop new plugins following the [plugin developer's](plugin_development) section.

You should instantiate the concrete implementation of the `DataSource` and pass it to the `useDataSource` method of the `Store` object.

```ts
Store.useDataSource( new JsonDataSource() )
```

### Observability



