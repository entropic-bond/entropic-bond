# Design — Compare-and-set (transactional) writes (gh-issue-2)

## Strategy

The feature must be exposed through the `DataSource` abstraction and proxied by
`Model`, and implemented by `JsonDataSource`. Firebase web/admin data sources are
out of this repository's scope — the contract defined here is what they will
implement in their consuming repos.

Three strategies were considered for the transaction primitive:

1. **Full multi-document transaction API** — `runTransaction(fn)` where `fn` can
   read/write many documents atomically. Correct but complex; Firestore's web SDK
   API differs from Admin in subtle ways (e.g. `get` semantics, retry counts).
2. **Optimistic version check (compare-and-swap) on write** — the transaction
   handle records the version of every document read via `get`; at commit time the
   data source verifies those versions are still current, and on mismatch rejects
   with a conflict reason. This is the minimal primitive that covers the
   ride-accept case and is portable across stores.
3. **Callback-only precondition** — the data source does no version tracking; the
   callback re-reads and re-checks before writing. This is not race-safe when the
   read is delayed (both transactions capture the same stale snapshot and both
   write), so it cannot guarantee "exactly one winner".

**Chosen strategy: 2 (optimistic version check)**, layered under the callback-based
`runTransaction(fn)` API from the issue. The callback expresses the business
precondition (e.g. `status === 'requested' && !driver`) and **rejects with a
`TransactionConflictError`** when it fails; the data source adds the
compare-and-swap safety net so concurrent losers that already wrote inside the
callback still reject with conflict instead of silently overwriting. This mirrors
Firestore's semantics: `transaction.get` pins a version, and a concurrent write
aborts the commit.

**No `set`:** writes are performed through `save` (merge semantics), both at the
`DataSource` level (raw `Partial<DocumentObject>`) and at the `Model` level (a
`Persistent` instance serialized via `toObject()`). A full-document write is a
`save` with the complete serialized object; `JsonDataSource.save` merges into
the existing document (creating it when absent), so save doubles as insert.

## Public contract

```ts
// src/store/data-source.ts

export class TransactionConflictError extends Error {
  storedDoc?: DocumentObject
  constructor( storedDoc?: DocumentObject ) { /* message + storedDoc */ }
}

export interface TransactionHandle {
  findById( id: string, collectionName: string ): Promise<DocumentObject | undefined>
  save( id: string, collectionName: string, doc: Partial<DocumentObject> ): Promise<void>
  delete( id: string, collectionName: string ): Promise<void>
}

export abstract class DataSource {
  // ...
  abstract runTransaction<Result>(
    fn: ( handle: TransactionHandle ) => Promise<Result>
  ): Promise<Result>
}
```

The handle operates on `DocumentObject`s and explicit ids/collection names
(including subcollection paths like `TestUser/1/SubClass`). The `Model` proxy
adapts it to `Persistent` instances so gatekeeper code stays decoupled from the
store.

## Component interaction

```
Application (ride-accept gatekeeper)
   │  const ride = await model.runTransaction( async t => {
   │    const ride = await t.findById( 'ride1' )     // T instance
   │    if ( ride.status !== 'requested' || ride.driver )
   │      throw new TransactionConflictError( ride ) // → REQ-2 rejection
   │    ride.status = 'accepted'; ride.driver = driver
   │    await t.save( ride )                         // cascades references
   │    return ride
   │  })                                             // → resolves with T instance
   ▼
Model.runTransaction           (src/store/model.ts)
   │  adapts handle: findById→Persistent.createInstance, save(instance)→serialize + cascade
   │  __rootCollections, delete→instance.id; converts raw storedDoc in
   │  TransactionConflictError to T instance
   ▼
DataSource.runTransaction      (abstract contract, src/store/data-source.ts)
   ▲
   │  JsonDataSource.runTransaction  (src/store/json-data-source.ts)
   │    · per-transaction closure records { collectionName, id, version } on findById
   │    · save/delete buffer writes (not applied yet)
   │    · fn resolves normally         → verify recorded versions still current
   │                                        mismatch → reject TransactionConflictError(currentDoc)
   │                                        match   → apply buffered writes, bump versions,
   │                                                  notifyChange, resolve with fn's result
   │    · fn rejects (precondition)    → propagate rejection, nothing written
   ▼
   in-memory store (_jsonRawData) + per-document version map
```

## Reference and subcollection behavior

- **References**: `Model.save( instance )` serializes via `instance.toObject()`,
  which collects every referenced document into `__rootCollections`. The proxy
  writes each referenced document (collection + id derived from the serialized
  entry) through `rawHandle.save` in the same transaction — mirroring
  `Model.save`. The reference field in the parent document is already serialized
  as a `DocumentReference` by `toObject()`, so the parent stores a reference while
  the referenced document is persisted in its own collection.
- **Subcollections**: `Model.collectionName` for a subcollection model is a path
  (`TestUser/{id}/SubClass`). The proxy passes `this.collectionName` straight to
  the raw handle, so `findById`/`save`/`delete` work identically for subcollections.
- **Version scope**: the version map is keyed by `collectionName + id`, so writes
  to a subcollection document or a referenced document are tracked independently.

## Proposed changes

- **`src/store/data-source.ts`**
  - Add `TransactionConflictError` (`Error` subclass carrying `storedDoc?`).
  - Add `TransactionHandle` interface (`findById` / `save` / `delete`).
  - Add abstract `runTransaction<Result>( fn )` to `DataSource`.

- **`src/store/json-data-source.ts`**
  - Add `runTransaction` implementation:
    - Per-transaction closure collecting reads (`{ collectionName, id, version }`)
      and buffered writes (`save` | `delete`).
    - `findById` records the current version of the doc and returns a copy of it.
    - `save` / `delete` buffer the write; nothing hits the store yet.
    - On `fn` resolution: if `fn` rejected, propagate (nothing written). If `fn`
      resolved, verify every recorded read still has its recorded version; on
      mismatch reject with `TransactionConflictError` carrying the current doc; on
      match apply the buffered writes, bump versions, emit `notifyChange` for
      parity with `save`, and resolve with `fn`'s result.
  - Track a per-document version map (`_versions`) bumped on every write
    (`save`, `delete`, transaction commit). This makes "exactly one winner" hold
    even under simulated delay.

- **`src/store/model.ts`**
  - Add `Model.runTransaction<A extends T>` proxying to
    `this._stream.runTransaction`:
    - `findById( id )` → `rawHandle.findById( id, this.collectionName )` then
      `Persistent.createInstance` (returns `T | undefined`).
    - `save( instance )` → mirror `Model.save`: serialize via
      `instance.toObject()`, remap the main collection when
      `collectionName !== __className`, then write **every** document in
      `__rootCollections` (the instance plus its references) through
      `rawHandle.save`, so references cascade inside the same transaction.
    - `delete( instance )` → `rawHandle.delete( instance.id, this.collectionName )`.
    - Convert a raw `DocumentObject` `storedDoc` carried by a
      `TransactionConflictError` (version-race path) into a `T` instance before
      rethrowing, so rejections always surface `Persistent`-derived values.

- **`src/index.ts`** — no change needed (types are re-exported via
  `./store/data-source` and `./store/model`).

## Proposed updates

- New spec: `src/store/transaction.spec.ts` with one test per scenario
  (REQ-1..REQ-6) plus supplementary tests (save-merge keeps untouched fields,
  findById of a missing doc, conflict does not leave partial writes, subcollection
  transaction).

## Best practices used

- **Open/Closed**: the new primitive is added to the `DataSource` contract; no
  existing method changes signature.
- **DRY**: the ride-accept gatekeeper logic stays in the app; the library only
  supplies the transaction primitive. `notifyChange` and version bumping are
  shared with `save`; `Model.save` reuses the `toObject()`/`__rootCollections`
  pipeline that `Model.save` already relies on.
- **Decoupling**: `Model` hides store details (ids, collection names, raw docs)
  behind `Persistent` instances; the result and rejections surface `Persistent`
  values only.
- **Testability**: `JsonDataSource` version tracking makes the concurrency
  guarantee testable in-process with `simulateDelay`.

## Tasks

1. Write failing tests in `src/store/transaction.spec.ts` (REQ-1..REQ-6).
2. Add `TransactionConflictError`, `TransactionHandle`, and abstract
   `runTransaction` to `DataSource`.
3. Implement `runTransaction` + version tracking in `JsonDataSource`.
4. Add `Model.runTransaction` proxy with reference cascading (`save`) and
   instance-based `delete`.
5. Run the suite, then refactor and run `npm run build`.

## Strengths

- Minimal, portable primitive that covers the reported lost-update case.
- Guarantees exactly one winner under concurrency, even in the in-memory mock.
- Mirrors Firestore transaction semantics (version pinning on `get`, conflict on
  concurrent write), so the Firebase web/admin implementations can map 1:1.
- Backward compatible: no existing API changes.
- Instance-based Model API: callers never see `DocumentObject`s.
- Single write primitive (`save`) — no set/save duality to get wrong; full
  writes and inserts are `save` with the complete serialized object.

## Weaknesses

- Buffered writes are only visible at commit; a `findById` inside a transaction does
  not see the transaction's own uncommitted `save` (single-document CAS is the
  target use case, so this is acceptable).
- Because `save` merges, fields serialized as absent (null/undefined are omitted
  by `toObject()`) are not cleared; clearing a field requires an explicit write of
  the merged value.
- Version conflicts are reported as a single rejection without a retry loop; heavy
  contention yields losers, as intended by the CAS design.