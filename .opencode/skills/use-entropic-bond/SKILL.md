---
name: use-entropic-bond
description: Guidance on using the entropic-bond library, including persistence (decorators, models, queries), observability (EntropicComponent, changeProp, array helpers), and mock cloud services. Use when writing/refactoring models, implementing change listeners, or configuring/testing decoupled services (Auth, ServerAuth, CloudStorage, CloudFunctions).
---

# Use Entropic Bond

The **Entropic Bond** library is a TypeScript library designed to decouple application business logic from databases, authorization servers, cloud storage, and server functions. This skill teaches you how to model, query, observe, and test application logic with `entropic-bond`.

---

## Workflow Decision Tree

Identify your objective and follow the appropriate guide:

```
                  ┌───────────────────────────────┐
                  │ What are you trying to do?    │
                  └───────────────┬───────────────┘
                                  │
         ┌────────────────────────┼────────────────────────┐
         ▼                        ▼                        ▼
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│ Model & Persist  │    │ Reactive State   │    │ Swappable Cloud  │
│ Class Instances  │    │   Change Event   │    │  Auth & Storage  │
└────────┬─────────┘    └────────┬─────────┘    └────────┬─────────┘
         │                       │                       │
         ▼                       ▼                       ▼
   See Section 1           See Section 2           See Section 3
 (Persistence Guide)    (Observability Guide)    (Services Guide)
```

---

## 1. Quick Start Persistence Cheat-Sheet

To persist data, inherit from `Persistent` and decorate properties.

```ts
import { Persistent, persistent, registerPersistentClass, Store } from 'entropic-bond'

@registerPersistentClass( 'Profile' )
export class Profile extends Persistent {
  @persistent private _nickname: string | undefined

  get nickname(): string | undefined { return this._nickname; }
  set nickname( value: string | undefined ) { this._nickname = value; }
}

// Basic usage
const model = Store.getModel<Profile>( 'Profile' );
const profile = new Profile();
profile.nickname = 'Neo';
await model.save( profile );
```

For detailed decorators (`@persistentReference`, `@persistentReferenceWithCachedProps`), custom collections, advanced queries, and realtime listeners, see [persistence.md](references/persistence.md).

---

## 2. Quick Start Observability Cheat-Sheet

To observe mutations, inherit from `EntropicComponent` and call `changeProp()` in setters.

```ts
import { EntropicComponent, registerPersistentClass, persistent } from 'entropic-bond'

@registerPersistentClass( 'Counter' )
export class Counter extends EntropicComponent {
  @persistent private _value: number = 0

  get value(): number { return this._value; }
  set value( val: number ) { this.changeProp( 'value', val ); }
}

const counter = new Counter();
const unsubscribe = counter.onChange( event => console.log( 'Changed:', event ) );
counter.value = 5; // Triggers subscriber
unsubscribe();
```

For array change notifications (`pushAndNotify`, `removeAndNotify`) and standalone `Observable<T>`, see [observability.md](references/observability.md).

---

## 3. Decoupled Services Cheat-Sheet

Switch between mock services during testing and real cloud implementations in production:

- **Authentication**: SWAP with `AuthMock` via `Auth.useAuthService()`. Use `Auth.instance`.
- **Server Auth**: SWAP with `ServerAuthMock` via `ServerAuth.useServerAuthService()`. Use `ServerAuth.instance`.
- **Cloud Storage**: SWAP with `MockCloudStorage` via `CloudStorage.useCloudStorage()`. Use `CloudStorage.defaultCloudStorage`.
- **Cloud Functions**: SWAP with `CloudFunctionsMock` via `CloudFunctions.useCloudFunctionsService()`.

For exact function signatures and integration examples, see [services.md](references/services.md).

---

