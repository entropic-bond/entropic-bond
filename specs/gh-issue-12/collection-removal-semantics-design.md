# Design — Align JsonDataSource collection-change removal semantics (gh-issue-12)

## Problem recap

`JsonDataSource` and `FirebaseDatasource` disagree on how a document leaving a
query result is signalled, so consumers cannot be data-source agnostic:

- Firebase (Firestore `docChanges()`) emits `type: 'delete'` for a removal.
- `JsonDataSource` re-emits the *stale* last-matching version as `after` and keeps
  `type: 'update'`, so a consumer must content-compare `before`/`after`.
- Neither data source provides the full current result set on each callback, so
  live-list consumers must maintain fragile per-delta accumulators.

## Strategy

Three decisions had to be made.

### 1. How to detect "the document left the query"

| Option | Assessment |
| --- | --- |
| Compare `JSON.stringify(before) === JSON.stringify(after)` (issue's sketch) | Fragile: a no-op re-save (same content) would be misread as a deletion; also O(n) serialization per change. |
| Compare query membership before vs after | Precise: run the query operations against the old doc and the new doc independently. Cost is bounded by the existing filter logic. |

**Chosen: query membership.** In [`JsonDataSource.onCollectionChange`](file://src/store/json-data-source.ts:171)
the change already carries `before` and `after`. A document is a deletion when
`before` matches the query operations and `after` does not. This is independent of
content equality and matches Firestore's own "stops matching → removed" semantics.

Scope decision (confirmed with the user): **leave-query only** — we correct the
removal signal but deliberately keep "enters the query" as `'update'` (the issue's
proposed mapping), rather than remapping it to `'create'`/Firestore `'added'`.

### 2. How to expose the full snapshot

| Option | Assessment |
| --- | --- |
| Add `snapshot` to `DocumentChange` | Wrong shape: the snapshot is per callback, not per changed document. |
| Second callback argument `( changes, snapshot? )` | Natural, additive, backward compatible with existing `( changes ) => …` listeners. |

**Chosen: optional second argument.** `CollectionChangeListener<T>` becomes
`( changes: DocumentChange<T>[], snapshot?: T[] ) => void`. Because the parameter
is optional, existing listeners (and data sources that have not implemented it,
such as `@entropic-bond/firebase`) keep compiling and working.

### 3. Signalling real `delete()` calls

Today [`JsonDataSource.delete`](file://src/store/json-data-source.ts:101) removes the
document and bumps its version but never notifies listeners; the commit path of
[`runTransaction`](file://src/store/json-data-source.ts:109) has the same gap for its
buffered deletes. The confirmed scope is to notify both channels with `type: 'delete'`
from **both** paths, carrying the removed document in `after` — mirroring Firebase,
which puts the removed doc data in `after` and leaves `before` undefined. Keeping the removed doc in `after` preserves the existing
`after.id === documentId` matching in [`onDocumentChange`](file://src/store/json-data-source.ts:196)
and the `uniqueDocs.length > 0` query filter in `onCollectionChange`, so a delete of
a non-matching document stays silent.

## Component interaction

```
save(doc)
  │  oldValue = store[coll][id]; store[coll][id] = doc; bumpVersion
  ▼
notifyChange(coll, after=doc, before=oldValue, type?)   ──► _documentListeners
  │                                                        _collectionListeners
  │
delete(id)
  │  removed = store[coll][id]; delete store[coll][id]; bumpVersion
  ▼
notifyChange(coll, after=removed, before=removed, type='delete')
  │
  ▼
onCollectionChange finalListener( change )
  │  testDocs = [ change.after, ...(change.before ? [change.before] : []) ]
  │  docs      = retrieveQueryDocs( testDocs, query.operations )   // membership
  │  unique    = dedupe by id
  │  if unique.length === 0 → no notification
  │  snapshot  = querySync( query, collection )   // full current result, after change
  │  type      = resolveChangeType( change, beforeMatches, afterMatches )
  │                change.type === 'delete'        → 'delete'
  │                beforeMatches && !afterMatches  → 'delete'   (REQ-1)
  │                else                           → change.type ('create'|'update')
  │  listener( unique.map( toChange ), snapshot )                 (REQ-5)
  ▼
Model.onCollectionChange
  │  changes.map( toPersistentDocumentChange )
  │  snapshot.map( Persistent.createInstance )
  ▼
application listener( changes: DocumentChange<T>[], snapshot?: T[] )   (REQ-6)
```

Type resolution summary:

| Situation | `before` matches | `after` matches | emitted `type` |
| --- | --- | --- | --- |
| New matching doc saved | n/a | yes | `create` |
| Matching doc changed, still matching | yes | yes | `update` |
| Matching doc stops matching (REQ-1) | yes | no | `delete` |
| Matching doc deleted (REQ-2) | raw `type: 'delete'` | yes (carried) | `delete` |

## Proposed changes

- **`src/store/data-source.ts`**
  - `CollectionChangeListener<T>` gains the optional `snapshot?: T[]` second
    parameter (backward compatible). Document this on the type and on the abstract
    `onCollectionChange` contract.

- **`src/store/json-data-source.ts`**
  - Add a synchronous, side-effect-free query evaluator (e.g. `querySync`) that
    returns the current matching documents without mutating `_lastMatchingDocs` /
    `_cursor` (unlike `find`). Reuse the existing `retrieveQueryDocs` /
    `queryProcessor` logic.
  - In `onCollectionChange`, compute `beforeMatches` / `afterMatches` per emitted
    document and resolve `type` as per the table above, keeping the payload shape
    unchanged; pass the `querySync` snapshot as the listener's second argument.
  - Extend `notifyChange` to accept an explicit `type` (default derived from
    `oldValue`), and call it from `delete()` and the `runTransaction` commit path
    (buffered `delete` writes) with `type: 'delete'` and `after = before = removed`,
    only when a document actually existed.

- **`src/store/model.ts`**
  - `onCollectionChange` maps the snapshot through `Persistent.createInstance`
    so consumers receive `T[]`, consistent with `changes`.

- **`src/index.ts`** — no change (types re-exported via the store barrel).

## Proposed updates

- New spec `src/store/collection-change-removal.spec.ts` with one test per scenario
  (REQ-1..REQ-6), using `JsonDataSource` directly for REQ-1..REQ-5 and a `Model`
  for REQ-6. Assert on the observable `type`, the carried document and the
  snapshot contents — not on private fields. Plus one supplementary test that a
  transactional delete notifies collection listeners with `type: 'delete'`.
- Keep the existing suites green. Notably
  [`model.spec.ts`](file://src/store/model.spec.ts:721) and
  [`json-data-source.spec.ts`](file://src/store/json-data-source.spec.ts:189)
  already assert `type: 'update'` for documents that stay within the query, which
  the membership rule preserves.

## Best practices used

- **Open/Closed**: only additive API change (optional parameter); no existing
  signature or behaviour for add/update changes.
- **DRY**: the snapshot reuses the data source's own filter/query machinery instead
  of a parallel implementation; `delete` reuses `notifyChange`.
- **Decoupling**: consumers key off `change.type` and the snapshot only, so the same
  code runs against `JsonDataSource` and Firebase (which supplies the snapshot from
  `querySnapshot.docs`).
- **Testability**: pure `querySync` and membership-based typing are deterministic
  and need no timers.

## Tasks

1. Write failing tests in `src/store/collection-change-removal.spec.ts` (REQ-1..REQ-6).
2. Add `snapshot?: T[]` to `CollectionChangeListener`.
3. Implement `querySync` + membership-based `type` resolution + snapshot in
   `JsonDataSource.onCollectionChange`.
4. Extend `notifyChange` with an explicit `type` and notify on `delete()` and the
   `runTransaction` commit delete path.
5. Map the snapshot to `Persistent` instances in `Model.onCollectionChange`.
6. Run `npm test`, refactor, then `npm run build`.

## Strengths

- Makes removals explicit, so consumers check `change.type` uniformly across data
  sources; no `JSON.stringify` workarounds.
- Precise removal detection (query membership), robust to content-preserving updates.
- The snapshot lets consumers do simple replacement instead of an incremental
  accumulator, eliminating the class of bugs the issue reports.
- Backward compatible: optional parameter, unchanged payload for existing cases.
- Real deletions now surface to both listener channels, closing a silent gap.

## Weaknesses

- `querySync` runs the query once more per notification; acceptable for an in-memory
  test data source but a cost Firebase implementations avoid (they already have
  `querySnapshot.docs`).
- "Enters the query" is still reported as `'update'` (deliberate scope), so a
  consumer cannot distinguish it from an in-query update — a divergence from
  Firestore's `'added'` that may warrant a follow-up.
- Actual deletions carry the removed doc in `after` (non-undefined) unlike Firebase;
  consumers that only branch on `type` are unaffected, but the payloads are not
  byte-for-byte identical.
- On deletion, `before` and `after` both hold the removed document, so a consumer
  ignoring `type` cannot tell a delete from a no-op update.
- `matchesQuery` evaluates only `query.operations`, while the snapshot applies the
  whole query (including `limit`). For a bounded query a changed document can be
  reported as an `update` while being absent from the snapshot; consumers that
  replace their list wholesale are unaffected.
