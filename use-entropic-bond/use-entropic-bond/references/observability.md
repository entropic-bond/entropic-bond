# Entropic Bond — Observability Reference

This reference documents the reactive/observable state features of the `entropic-bond` library. Use this to notify property changes, manage lists, and observe events.

---

## 1. Class Observability with `EntropicComponent`

By deriving your persistent class from `EntropicComponent` rather than `Persistent`, you gain the ability to notify listeners of property modifications.

### Defining Observable Properties

1. **Setter Pattern**: Inside the property setter, call `this.changeProp( 'propertyName', value )`.
2. **Naming Convention**: Pass the camelCase property name (without leading underscore) to `changeProp`. `changeProp` will automatically map it to the private, underscored field (e.g. `_name`).

```ts
import { EntropicComponent, registerPersistentClass, persistent } from 'entropic-bond'

@registerPersistentClass( 'Profile' )
export class Profile extends EntropicComponent {
  @persistent private _status: string = 'offline'

  get status(): string {
    return this._status;
  }

  set status( value: string ) {
    this.changeProp( 'status', value );
  }
}
```

### Listening to Changes

Subscribers can listen to changes with `.onChange()`. It returns an `Unsubscriber` function.

```ts
const profile = new Profile();

// Subscribe
const unsubscribe = profile.onChange( event => {
  console.log( 'Profile changed:', event ); // event is e.g. { status: 'online' }
});

// Mutate state (triggers listener)
profile.status = 'online';

// Unsubscribe
unsubscribe();
```

---

## 2. Array Observability Helpers

Arrays cannot be observed with `changeProp`. Instead, `EntropicComponent` provides two protected helper methods: `pushAndNotify` and `removeAndNotify`.

### `pushAndNotify`

Pushes an element into a private array property and triggers a change notification. Optionally enforces uniqueness.

- **`pushAndNotify( arrayPropName, element, isUnique? )`**
  - `arrayPropName`: Name of the public property (without underscore).
  - `element`: The element to insert.
  - `isUnique`: Optional compare function `( a, b ) => boolean`. If provided, insertion only occurs if the element is unique.

```ts
@registerPersistentClass( 'Team' )
export class Team extends EntropicComponent {
  @persistent private _members: string[] = []

  get members(): readonly string[] {
    return this._members;
  }

  addMember( member: string ): void {
    this.pushAndNotify(
      'members',
      member,
      ( a, b ) => a === b
    );
  }
}
```

### `removeAndNotify`

Removes an element from a private array property and triggers a change notification if successful.

- **`removeAndNotify( arrayPropName, element, isEqual )`**
  - `arrayPropName`: Name of the public property (without underscore).
  - `element`: The element to remove.
  - `isEqual`: Mandatory equality function `( a, b ) => boolean`.

```ts
@registerPersistentClass( 'Team' )
export class Team extends EntropicComponent {
  @persistent private _members: string[] = []

  get members(): readonly string[] {
    return this._members;
  }

  removeMember( member: string ): void {
    this.removeAndNotify(
      'members',
      member,
      ( a, b ) => a === b
    );
  }
}
```

---

## 3. Standalone Observables

For general messaging or non-entity event buses, use the standalone `Observable<T>` class.

### Subscribing and Notifying

- **`subscribe( callback )`**: Registers a listener and returns an `Unsubscriber`.
- **`notify( data )`**: Dispatches the payload to all subscribers.
- **`unsubscribe( callback )`**: Manually removes a specific listener callback.

```ts
import { Observable } from 'entropic-bond'

const bus = new Observable<string>();

const unsubscribe = bus.subscribe( message => {
  console.log( 'Received:', message );
});

// Broadcast
bus.notify( 'Hello world!' );

// Cleanup
unsubscribe();
```
