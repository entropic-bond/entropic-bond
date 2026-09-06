# Compare-and-set (transactional) writes — gh-issue-2

## Task description

The persistence API (`DataSource` / `Model`) only supports last-write-wins writes.
`DataSource.save()` is an unconditional write, so any read-then-write operation
has a TOCTOU race and can lose updates. A concrete case: two drivers concurrently
"accept" the same `requested` ride — both pass the precondition check, then both
write, and the last writer silently wins.

This issue adds a compare-and-set primitive: persist a document **only if it still
matches an expected prior state**, exposed through the `DataSource` abstraction
(`runTransaction` with a transaction handle exposing `findById` / `save` / `delete`)
and proxied by `Model` so app/gatekeeper code stays decoupled from the concrete
store.

The Firebase web and Firebase Admin data sources live in consuming repositories and
are out of scope here. This change defines the contract in `DataSource`, implements
it in `JsonDataSource`, and adds the `Model.runTransaction` proxy.

**Result semantics (as decided with the maintainer):** `Model.runTransaction`
resolves with a `Persistent`-derived value (the callback's result) or rejects with
a reason; on a failed precondition / concurrent write it rejects with a
`TransactionConflictError` carrying the stored document when available. The
`DataSource`-level `runTransaction` is generic and follows the same resolve /
reject contract.

**Write primitive (as decided with the maintainer):** there is no `set` in the
transaction handle — writes are done with `save` (merge semantics). A full
document write is a `save` with the complete serialized object.

## Requirements

### REQ-1
`runTransaction` executes a callback with a transaction handle (`findById` / `save` /
`delete`). When the callback's precondition is satisfied and it saves a
document, the document is persisted and the promise resolves with the callback's
result (a `Persistent` instance).

### REQ-2
When the callback's precondition fails, the promise rejects with a conflict reason
carrying the stored document when available, and no write is persisted.

### REQ-3
Concurrent compare-and-set transactions targeting the same document allow exactly
one winner; every loser's promise rejects with a conflict reason and its writes are
not persisted.

### REQ-4
`Model.runTransaction` proxies the underlying data source transaction, exposing
`findById` / `save` / `delete` in terms of `Persistent` instances of the model's
collection, and resolves / rejects with `Persistent`-derived values (never
`DocumentObject`s). It works for root collections and subcollections alike.

### REQ-5
A `Model.runTransaction` `save` also persists the referenced documents of the
written instance, mirroring `Model.save` behavior (no cascade on the conflict
path).

### REQ-6
A transaction `delete` removes the document within the transaction; when the
transaction commits, the document is gone and the promise resolves with the
callback's result.