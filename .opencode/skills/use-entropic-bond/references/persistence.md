# Entropic Bond — Persistence Reference

This reference documents the persistence mechanisms of the `entropic-bond` library. Use this to design, implement, and query database-mapped entities.

---

## 1. Class & Property Decorators

To persist class instances, classes must extend `Persistent` (or `EntropicComponent`) and use decorators.

### Mandatory Class Registration

Every persistent class **must** be decorated with `@registerPersistentClass( 'ClassName' )`.

```ts
import { Persistent, registerPersistentClass } from 'entropic-bond'

@registerPersistentClass( 'Team' )
export class Team extends Persistent {
  // ...
}
```

### Property Naming and Accessors

1. **Underscore Prefix**: All persistent properties must be private and prefixed with an underscore (e.g., `_name`).
2. **Accessors**: Public access to persistent properties must be provided via getters and setters. Getters and setters do **not** have the underscore.

```ts
import { Persistent, persistent, registerPersistentClass } from 'entropic-bond'

@registerPersistentClass( 'User' )
export class User extends Persistent {
  @persistent private _name: string | undefined

  get name(): string | undefined {
    return this._name;
  }

  set name( value: string | undefined ) {
    this._name = value;
  }
}
```

---

## 2. Property Reference Decorators

### `@persistent`
For standard primitive data types, simple values, arrays of primitives, or inline objects.

### `@persistentReference`
References another persistent class. The reference target is automatically stored in its own collection (derived from its class name).

```ts
import { Persistent, persistent, persistentReference, registerPersistentClass } from 'entropic-bond'

@registerPersistentClass( 'User' )
export class User extends Persistent {
  @persistent private _name: string | undefined
  @persistentReference private _team: Team | undefined

  get team(): Team | undefined {
    return this._team;
  }

  set team( value: Team | undefined ) {
    this._team = value;
  }
}
```

### `@persistentReferenceAt( collectionPath )`
References another persistent class, specifying a custom collection path.

```ts
@persistentReferenceAt( 'groups/special' )
private _group: Group | undefined
```

### `@persistentReferenceWithCachedProps`
References another persistent class, embedding specified primitive fields into the reference object itself to avoid extra queries.

```ts
@registerPersistentClass( 'Employee' )
export class Employee extends Persistent {
  @persistentReferenceWithCachedProps<Team>( [ 'name' ], 'Team' )
  private _team: Team | undefined

  get team(): Team | undefined {
    return this._team;
  }

  set team( value: Team | undefined ) {
    this._team = value;
  }
}
```

### `@persistentPureReference`
A pure reference where the referenced object itself is not persisted when the referencing object is saved. Only the ID and collection path are stored.

```ts
@persistentPureReference
private _friend: User | undefined
```

---

## 3. Database Operations via `Store`

### Initializing the DataSource
Before performing database operations, initialize the global `Store` with a `DataSource`.

```ts
import { Store, JsonDataSource } from 'entropic-bond'

Store.useDataSource( new JsonDataSource() );
```

### Accessing the Model
Querying and mutating instances is performed via `Store.getModel<T>( className )`.

```ts
const userModel = Store.getModel<User>( 'User' );
```

### Basic Mutation Methods

- **`save( entity: T ): Promise<void>`**: Saves or updates the entity in the datasource.
- **`findById( id: string ): Promise<T | undefined>`**: Retrieves an entity by its unique ID.
- **`delete( id: string ): Promise<void>`**: Deletes an entity from the database.

```ts
const user = new User();
user.name = 'Alice';

// Create or Update
await userModel.save( user );

// Retrieve
const foundUser = await userModel.findById( user.id );

// Delete
await userModel.delete( user.id );
```

---

## 4. Query Builder

Use `find()` to start a query. Chain methods together and call `.get()` to retrieve the results.

### Query Methods

- **`.where( prop, operator, value )`**: Filters documents. Operators: `'=='`, `'!=`', `'>'`, `'>='`, `'<'`, `'<='`, `'array-contains'`.
- **`.orderBy( prop, direction )`**: Sorts results. Direction: `'asc'` or `'desc'`.
- **`.limit( number )`**: Restricts the maximum number of returned documents.
- **`.get(): Promise<T[]>`**: Executes the query and returns matching documents.

```ts
const users = await userModel.find()
  .where( 'name', '==', 'Alice' )
  .orderBy( 'created', 'desc' )
  .limit( 10 )
  .get();
```

---

## 5. Realtime Listeners

The `Model` provides methods to listen to document or collection updates.

### Single Document Listener

```ts
const unsubscribe = userModel.onDocumentChange( 'user-id', change => {
  console.log( 'Before:', change.before );
  console.log( 'After:', change.after );
});

// To stop listening
unsubscribe();
```

### Collection Listener

```ts
const query = userModel.find().where( 'status', '==', 'active' );

const unsubscribe = userModel.onCollectionChange( query, change => {
  console.log( 'Collection updated:', change );
});
```
