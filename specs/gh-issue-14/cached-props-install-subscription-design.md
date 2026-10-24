# Cached props install subscription — design (issue #14)

> Status: **approved** (design gate passed). Implementation proceeds.
>
> Gate answers applied: **D1** `JsonDataSource` notify-time dispatch accepted
> (per-listener event copies; template listeners dispatched after
> document/collection listeners). **D2** new public surface accepted
> (`CachedPropsUpdaterConfig.onRefreshFailure`,
> `CachedPropsUpdater.subscribe( dataSource )`, new install behaviour). **D3**
> handler signature `( error: unknown, change: DocumentChange<DocumentObject> ) => void`.
> **D4** Firestore plugin out of scope (see Limitations). **D5** `subscribe()`
> replaces its own previous subscription. **D6** the `'_' + prop.name` owner
> mutation stays updater-private (JSDoc only). **D7** `docs/` not regenerated.
> **D8** refresh completion uses the existing `afterDocumentChange` callback.

## Abstract

`installCachedPropsUpdater()` becomes the single owner of the cached-props
lifecycle: it constructs the updater, wires the data-source-bound seams and
**subscribes** to the watched collection templates, so no caller-side
`onDocumentTemplateChange → updateProps` bridge is needed.

New / modified entities:

- **`CachedPropsUpdater.subscribe( dataSource ) → Unsubscriber`** (new public
  seam). Registers one `onDocumentTemplateChange` listener per key of
  `collectionsToWatch` and, from then on, resolves and writes **owner**
  documents through that data source instead of `Store.getModel` (the global).
  Install-driven refreshes are fire-and-forget: a rejection is handed to the
  new `onRefreshFailure` config callback and never escapes.
- **`CachedPropsUpdater.ownerModel( collection )`** (new private helper) — the
  one place that decides *which* data source an owner read/write goes through.
- **`CachedPropsUpdaterConfig.onRefreshFailure`** (new optional config
  option) — the failure channel for install-driven refreshes.
- **`JsonDataSource` template listener dispatch** (modified internal) — template
  listeners move from "resolved at subscribe time into `_documentListeners`" to
  a `_templateListeners` registry matched **at notify time**, so a collection
  that appears after install is observed.
- **`CachedPropsUpdater.unsubscribe()`** (new public method) — stops the
  updater's current subscription. The updater is the **single owner** of its
  subscription (`_subscriptionUnsubscriber`); nobody else caches the
  `Unsubscriber` that `subscribe()` returns.
- **`DataSource.installCachedPropsUpdater()`** (modified body) — asks the
  previous updater to `unsubscribe()` before constructing and subscribing the
  next one, so re-install leaves exactly one live subscription.

The abstract `DataSource` contract (`onDocumentTemplateChange`,
`onCollectionChange`, `onDocumentChange`, `resolveCollectionPaths`) is
untouched, so the Firestore plugin keeps compiling. Fan-out internals (paging,
concurrency, transactions, failure draining — issue #19) are untouched.

## Seams and data flow

```mermaid
sequenceDiagram
  participant Host
  participant DS as DataSource (installing)
  participant CPU as CachedPropsUpdater
  participant JDS as JsonDataSource
  participant MS as owner Model
  participant FH as onRefreshFailure

  Host->>DS: installCachedPropsUpdater( config )
  DS->>CPU: new CachedPropsUpdater( config )  (collectionsToWatch built)
  DS->>CPU: resolveCollectionPaths = ds.resolveCollectionPaths (existing)
  DS->>CPU: subscribe( ds )  [REQ-10]
  CPU->>JDS: onDocumentTemplateChange( template, listener ) × watched templates [REQ-11][REQ-15]
  CPU-->>CPU: _ownerDataSource = ds  [REQ-20]
  CPU-->>CPU: _subscriptionUnsubscriber = combined unsubscriber (single owner)
  DS-->>Host: updater

  JDS->>CPU: listener( event with params )  [REQ-13][REQ-14]
  CPU->>CPU: updateProps( template, event )  [REQ-22 seam unchanged]
  CPU->>CPU: resolveCollectionPaths( ownerTemplate( params ) ) [REQ-12]
  CPU->>MS: new Model( _ownerDataSource, ownerCollection ) [REQ-20]
  MS-->>CPU: find / save in the installing data source only
  alt refresh ok
    CPU-->>CPU: afterDocumentChange (once) [REQ-10]
  else save/read/callback rejects
    CPU->>FH: onRefreshFailure( error, event ) [REQ-16][REQ-17]
    CPU-->>CPU: promise settled, subscription kept [REQ-18]
  end

  Host->>DS: installCachedPropsUpdater() again
  DS->>CPU: previous updater.unsubscribe()  [REQ-19]
  Note over CPU: the updater owns (and clears) its own subscription pointer
  Note over DS,CPU: second updater reports; first reports nothing
```

`JsonDataSource` listener dispatch, before → after:

```mermaid
flowchart LR
  subgraph Before
    S1[onDocumentTemplateChange] --> S2[collectionsMatchingTemplate<br/>against _jsonRawData keys NOW]
    S2 --> S3[listener stored in _documentListeners per existing collection]
    S3 --> S4[notifyChange: only existing collections dispatch]
  end
  subgraph After
    A1[onDocumentTemplateChange] --> A2[listener stored in _templateListeners<br/>with its template]
    A3[notifyChange: collectionPath] --> A4{for each template listener:<br/>isStringMatchingTemplate at notify time}
    A4 -->|match| A5[listener { ...event,<br/>params: extractTemplateParams }]
    A4 -->|no match| A6[skip]
  end
```

## Configuration

| Option | Module | Type | Default | Backwards compatibility |
| --- | --- | --- | --- | --- |
| `onRefreshFailure` | `CachedPropsUpdaterConfig` | `( error: unknown, change: DocumentChange<DocumentObject> ) => void` | `undefined` | Optional, additive. Absent ⇒ install-driven failures are contained silently (no rejection, no logging contract). |
| `subscribe( dataSource )` | `CachedPropsUpdater` | method → `Unsubscriber` | — | New method; not required for existing direct-construction hosts. Calling it sets the owner data source; without it owner access falls back to `Store.getModel` (today's behaviour). Calling it again replaces its own previous subscription (the old unsubscriber becomes a no-op). |
| `unsubscribe()` | `CachedPropsUpdater` | method → `void` | — | New method. Stops the updater's live subscription through its own pointer (the single source of truth); install no longer caches the returned `Unsubscriber`. Owner routing is left as it was. |

Nothing else is configurable. `chunkSize`, `concurrency`, `transactional`,
`transactionRetries`, the callback setters, `resolveCollectionPaths` and
`updateProps( documentPath, event )` keep their current shape.

## Plan

1. `JsonDataSource` — add `_templateListeners`; `onDocumentTemplateChange`
   registers one entry and returns an unsubscriber deleting it; `notifyChange`
   dispatches to every template listener whose template matches
   `collectionPath` at notify time, passing a **per-listener copy** of the event
   with `params` extracted. [REQ-13][REQ-14]
2. `CachedPropsUpdater` — add `_ownerDataSource` + private `ownerModel()`;
   `fanOutToCollection` uses it instead of `Store.getModel`. [REQ-20]
3. `CachedPropsUpdater` — add `onRefreshFailure` to the config and store it.
   [REQ-16]
4. `CachedPropsUpdater` — add `subscribe( dataSource ): Unsubscriber`, the public
   `unsubscribe(): void` and the private `onSubscriptionChange( template, event )`
   bridge
   (`updateProps(...).catch( error => { try { this._onRefreshFailure?.( error, event ) } catch {} } )`).
   `subscribe()` first calls `this.unsubscribe()`, so only one subscription is
   ever live per updater and the previously returned unsubscriber becomes a
   no-op (D5). `unsubscribe()` is the only place that invokes the stored
   `Unsubscriber`, which keeps the updater the single owner of its
   subscription. The `try/catch` around the handler means a
   **throwing host handler can never fail the refresh path**, so `[REQ-17]` (no
   unhandled rejection, handled once) holds even when the host's own callback
   throws. [REQ-10][REQ-11][REQ-15][REQ-16][REQ-17][REQ-18][REQ-22]
5. `DataSource.installCachedPropsUpdater` — call
   `this._cachedPropsUpdater?.unsubscribe()` on the previous updater, construct,
   wire `resolveCollectionPaths`, `subscribe( this )` and discard the returned
   `Unsubscriber`: the **updater** owns it. [REQ-10][REQ-19]
6. Tests (`nff-test` owns): new `specs/gh-issue-14` describe block in
   `src/store/cached-props-updater.spec.ts`, a post-subscribe template test in
   `src/store/json-data-source.spec.ts`, the mirrored end-to-end sample spec,
   and removal of the now-double-firing manual bridge in the existing setup
   helpers (`:111`, `:335`). [REQ-10..REQ-20][REQ-22]
7. `samples/08-cached-props.ts` — rename the team, save it, await the refresh
   through the existing `afterDocumentChange` callback, then read the employee's
   cached team name; no `onDocumentTemplateChange` reference. README
   cached-props section states install subscribes and documents the failure
   handler. [REQ-21]

   **D8 correction — how an install refresh completes.** `JsonDataSource.wait()`
   is *not* a completion barrier for install-driven refreshes: with zero
   simulated delay `resolveWithDelay` returns `Promise.resolve` and registers
   nothing, and a delayed `wait()` only snapshots the delays already seen — the
   refresh chain (`updateProps` → page read → owner save) registers new delays
   after that snapshot, and the fan-out is fire-and-forget. The completion
   signal is the **existing `afterDocumentChange` callback**, which the updater
   invokes once per fan-out after every save settled. Samples and tests must
   await that callback (a promise resolved inside it), not `wait()`.

## Changes

| File | Change | Serves |
| --- | --- | --- |
| `src/store/cached-props-updater.ts` | `subscribe( dataSource )`, `unsubscribe()` (single owner of the subscription), private `onSubscriptionChange`, `_ownerDataSource`, private `ownerModel()`, config `onRefreshFailure`, `fanOutToCollection` uses `ownerModel()` | [REQ-10][REQ-11][REQ-15][REQ-16][REQ-17][REQ-18][REQ-20][REQ-22] |
| `src/store/data-source.ts` | `installCachedPropsUpdater` calls the previous updater's `unsubscribe()`, subscribes the new one and keeps no cached `Unsubscriber` | [REQ-10][REQ-19] |
| `src/store/json-data-source.ts` | `_templateListeners` registry + notify-time template matching/dispatch in `notifyChange` | [REQ-13][REQ-14] |
| `src/store/cached-props-updater.spec.ts` | new feature suite; drop manual bridge from helpers | [REQ-10..REQ-18][REQ-22] (test phase) |
| `src/store/json-data-source.spec.ts` | post-subscribe collection notify test | [REQ-13][REQ-14] (test phase) |
| `samples/08-cached-props.ts` | end-to-end refresh without a bridge | [REQ-21] |
| `README.md` | install subscribes; failure handler; manual bridge removed | [REQ-21] |
| `specs/gh-issue-14/cached-props-install-subscription.feature` | unchanged (approved) | — |

No change required for `src/persistent/*`, `src/store/model.ts`,
`src/store/store.ts`, `src/index.ts` (barrel already re-exports both modules).

## Decisions

**(a) Subscribe per watched template key, not one generic 4-segment template.**
`_collectionsToWatch` is already keyed by the very templates `updateProps`
expects; iterating those keys means the listener can pass the key straight
through, so `params` come from the event (`[REQ-11]`) and 1-segment and
parameterized templates are handled uniformly. The test-only generic
`{rootCollection}/{rootDocumentId}/{subCollection}/{subDocumentId}` needs a
translation back to a template key and cannot match collection paths deeper
than 4 segments.
*Strengths:* no key derivation, template keys stay a private implementation
detail, one subscription per watched collection. *Weakness:* N subscriptions
instead of one (small, N ≈ number of referenced collections).

**(b) Notify-time template dispatch inside `JsonDataSource`.**
Template listeners move to `_templateListeners` and `notifyChange` matches
`collectionPath` against each template at notify time. This is the only way to
satisfy `[REQ-13]`/`[REQ-14]` without a new data-source API, and it keeps the
abstract contract (and the Firestore plugin) intact.
*Effect on existing semantics:* a template subscription now also fires for
collections created after it was made (required); each template listener gets
its **own** event object with `params` pre-filled instead of the shared event
being mutated in place; template listeners are invoked after
`_documentListeners`/`_collectionListeners` rather than interleaved in their
insertion order. Unsubscribe semantics are unchanged (listener removed, no
further calls).
*Strengths:* one small internal registry, `onCollectionChange` untouched, no
subscribe-time snapshot to invalidate. *Weaknesses:* every notify now scans the
template list (tiny, in-memory mock); ordering/identity changes are observable
but unspecified.

**(c) The `'_' + prop.name` owner mutation stays an updater-private concern.**
The write lives in `updateOwnerDocument`/`applyUpdate`; a `Persistent` helper
(say `setCachedReference`) would only move it while adding public API no
`[REQ-n]` asks for, and would invite fixing the pre-existing observability
bypass (`changeProp` not called) — out of scope here.
*Strengths:* no new surface, no cross-module churn. *Weakness:* the underscore
convention stays implicit in the updater (documented in JSDoc).

**(d) Failure containment in the subscription bridge, not in the fan-out.**
`onSubscriptionChange` is the only place that touches the rejection:
`.catch( error => { try { this._onRefreshFailure?.( error, event ) } catch {} } )`.
`updateProps` keeps rejecting exactly as issue #19 defined, so direct callers
(and the gh-19 tests) see no change; install-driven refreshes can never produce
an unhandled rejection, and a failure never unsubscribes (`[REQ-18]`). The inner
`try/catch` contains a host handler that itself throws, so `[REQ-17]` (handled
once, no unhandled rejection) cannot fail from host code.
*Strengths:* one containing seam; gh-19 semantics untouched. *Weakness:* an
intentional asymmetry — direct `updateProps` rejects, install-driven refresh
does not.

**(e) Re-install and the per-data-source owner resolver.**
`subscribe( dataSource )` is a single seam that both registers the listeners
and remembers `_ownerDataSource`; `ownerModel()` returns
`new Model( ownerDataSource, collection )` when subscribed and
`Store.getModel( collection )` otherwise. `installCachedPropsUpdater` calls
`unsubscribe()` on the previous updater before constructing the next one.
`updateProps( path, event )` is untouched, so a direct call keeps
working while a subscription is active (`[REQ-22]`).
*Strengths:* install does not depend on `Store.useDataSource` having run (the
sample installs before `useDataSource`); no constructor signature change;
`resolveCollectionPaths` wiring stays where it is. *Weaknesses:* `subscribe`
has two responsibilities (drive + route owners), which must stay documented;
`CachedPropsUpdater` gains a runtime `new Model(...)` edge in an already-cyclic
import graph (used only inside a method body, so resolved at call time).

**(f) One live subscription per updater (D5).** `subscribe()` first calls
`this.unsubscribe()`, which invokes the updater's own stored unsubscriber; it
then registers the fresh listeners and stores the new unsubscriber. Clearing is
guarded by identity, so an older unsubscriber invoked afterwards is a no-op.
`installCachedPropsUpdater` unsubscribes through the **same seam**
(`previousUpdater.unsubscribe()`), so re-install leaves exactly one live
subscription on the data source (`[REQ-19]`).
*Strengths:* `subscribe()` is idempotent for hosts; no duplicate fan-outs; a
single source of truth for the live subscription
(`CachedPropsUpdater._subscriptionUnsubscriber`), so a host that calls
`subscribe()` directly cannot desync the install path from the live listener.
*Weakness:* none material — the guard is two lines.

## Limitations

- **Firestore plugin (D4, out of scope).** The external `entropic-bond-firebase`
  data source still resolves templates at subscribe time, so `[REQ-13]`/`[REQ-14]`
  hold only for `JsonDataSource` in this repo. Plugin hosts need the same
  notify-time template change in the plugin, tracked separately.
- **`docs/` (D7).** Not regenerated by this change; it is stale until the next
  release-time docs run.

## Best practices taken

- **Deep module, small interface**: two new methods (`subscribe`, `unsubscribe`), one config
  option, one private helper; everything else behind the existing
  `updateProps` seam. Deleting `subscribe` would push subscription bookkeeping,
  owner routing and failure containment into every host.
- **Accept dependencies, don't create them**: the data source is injected by
  install; `Store` remains the fallback, never a hard dependency for
  install-driven use.
- **Return results, don't produce side effects**: `subscribe` returns an
  `Unsubscriber` and the updater keeps that one pointer, so the live
  subscription has a single owner; install owns the *updater* lifecycle and
  stops it through `unsubscribe()` rather than caching a copy.
- **Locality**: failure policy, owner routing and template registration change
  in one file each.
- **No new dependencies, no migration, no public contract change** for
  `updateProps` or the abstract `DataSource` methods.

## Risks / open questions (resolved at the gate)

1. **`JsonDataSource` behaviour change — accepted (D1).** Post-subscribe
   collections notify (required by `[REQ-13]`/`[REQ-14]`); per-listener event
   copies and the dispatch order shift are accepted side effects.
2. **New public config/API surface — accepted (D2)** (`onRefreshFailure`,
   `CachedPropsUpdater.subscribe`, new install behaviour).
3. **Failure-handler signature — accepted (D3):**
   `( error: unknown, change: DocumentChange<DocumentObject> ) => void`.
4. **Firestore plugin — out of scope (D4).** See Limitations; the plugin needs
   the same notify-time change separately.
5. **Duplicate-subscribe foot-gun — resolved (D5).** `subscribe()` replaces its
   own previous subscription.
6. **Transitional red suite.** Existing setup helpers at
   `cached-props-updater.spec.ts:111`/`:335` keep the manual bridge, which will
   double-fire once install subscribes; the implementation phase removes the
   bridge wiring (no new tests), the `nff-test` phase adds the `[REQ-n]` tests.
7. **Import cycle.** `new Model(...)` inside `CachedPropsUpdater` adds a runtime
   edge through an existing cycle (`cached-props-updater → store → model →
   data-source → cached-props-updater`); safe because it is call-time only, but
   worth a reviewer's eye.
8. **Docs artifact — not regenerated (D7).** Left as a release task.

## Test phase report (`nff-test`)

Feature suite: `Cached props refresh driven by installCachedPropsUpdater` in
[cached-props-updater.spec.ts](file://src/store/cached-props-updater.spec.ts:700)
(one test per scenario, token = join key) plus the sample mirror in
[cached-props-sample.spec.ts](file://src/store/cached-props-sample.spec.ts:1).

| REQ | Scenario | Test |
| --- | --- | --- |
| [REQ-10](file://src/store/cached-props-updater.spec.ts:767) | installing the updater alone refreshes cached props | `Reproduce: installing the updater alone refreshes cached props` |
| [REQ-11](file://src/store/cached-props-updater.spec.ts:794) | reference in a templated subcollection | `Refresh a reference stored in a templated subcollection with install alone` |
| [REQ-12](file://src/store/cached-props-updater.spec.ts:816) | owner in a templated subcollection | `Refresh an owner stored in a templated subcollection with install alone` |
| [REQ-13](file://src/store/cached-props-updater.spec.ts:837) | watched collection created post-install | `Refresh after a watched collection is created post-install` |
| [REQ-14](file://src/store/cached-props-updater.spec.ts:861) | subcollection created post-install with a new param | `Refresh a subcollection created post-install with a new path parameter` |
| [REQ-15](file://src/store/cached-props-updater.spec.ts:888) | unwatched collection ignored | `Ignore changes in collections no cached prop watches` |
| [REQ-16](file://src/store/cached-props-updater.spec.ts:910) | failure handed to the failure handler | `Hand an install-driven refresh failure to the failure handler` |
| [REQ-17](file://src/store/cached-props-updater.spec.ts:927) | no unhandled rejection | `Leave no unhandled rejection when an install-driven refresh fails` |
| [REQ-18](file://src/store/cached-props-updater.spec.ts:951) | refresh kept after a failure | `Keep refreshing after a failed refresh` |
| [REQ-19](file://src/store/cached-props-updater.spec.ts:976) | re-install replaces the subscription | `Replace the previous subscription when the updater is re-installed` |
| [REQ-20](file://src/store/cached-props-updater.spec.ts:997) | owners routed through the installing data source | `Refresh owners through the data source that installed the updater` |
| [REQ-21](file://src/store/cached-props-sample.spec.ts:57) | cached-prop refresh in the sample, no bridge | `Show a cached-prop refresh in the cached-props sample without a bridge` |
| [REQ-22](file://src/store/cached-props-updater.spec.ts:1018) | direct `updateProps()` still works | `Keep a direct updateProps() call working` |

Supplementary (no `[REQ-n]`):

- [cached-props-updater.spec.ts:1039](file://src/store/cached-props-updater.spec.ts:1039) — `subscribe()` replaces its own previous subscription (D5), old unsubscriber is a no-op.
- [cached-props-updater.spec.ts:1075](file://src/store/cached-props-updater.spec.ts:1075) — a directly constructed updater keeps the `Store` owner fallback of `ownerModel()`.
- [cached-props-updater.spec.ts:1092](file://src/store/cached-props-updater.spec.ts:1092) — `contains a refresh failure when no handler is configured`.
- [cached-props-updater.spec.ts:1120](file://src/store/cached-props-updater.spec.ts:1120) — `contains a throwing failure handler`.
- `re-installs over a manual subscription without leaving two live subscriptions` — regression for W-1: `install → first.subscribe( ds ) → install` leaves one live subscription, so a single rename fans out once and the first updater reports nothing.
- [cached-props-sample.spec.ts:83](file://src/store/cached-props-sample.spec.ts:83) — REQ-21 sample scan pins the call shape (`updater.afterDocumentChange =`), forbids `onDocumentTemplateChange`, and forbids `onDocumentChange`/`onCollectionChange` bridges.
- `replaces its own previous subscription when it subscribes twice` also pins that after `unsubscribe()` a direct `updateProps()` still routes owner writes through the subscribed data source.
- [json-data-source.spec.ts:422](file://src/store/json-data-source.spec.ts:422), [:438](file://src/store/json-data-source.spec.ts:438), [:449](file://src/store/json-data-source.spec.ts:449) — notify-time template dispatch: collection created after subscribing, uninstaller, per-listener `params` copy.

**W-1 fix (lifecycle ownership).** `installCachedPropsUpdater` no longer caches
the `Unsubscriber` returned by `subscribe()`; it calls
`previousUpdater.unsubscribe()`. This closes the defect where
`install → updater.subscribe( ds ) → install` left two live subscriptions and a
stale first updater (replaying the first unsubscriber was already a no-op thanks
to the identity guard). Exactly one source of truth for a live subscription
remains: `CachedPropsUpdater._subscriptionUnsubscriber`.

How a refresh completes in tests (D8): `afterDocumentChange` reports are
collected on the updater and awaited with `vi.waitFor`; `JsonDataSource.wait()`
is never used as the barrier. Reports that updated no document (the empty
report an owner save produces when its reference did not change) are filtered
out by `updatedDocuments.length > 0`.

Refactors applied with the suite green (behaviour unchanged):

- [cached-props-updater.ts:471](file://src/store/cached-props-updater.ts:471) — the private subscription field is now `_subscriptionUnsubscriber` (was `_unsubscribeSubscription`) and the identity guard in the returned unsubscriber is commented, so its intent (an older unsubscriber is a no-op) is readable.
- [json-data-source.ts:274](file://src/store/json-data-source.ts:274) — `createListenerUid()` replaces the `Math.random().toString(36).substring(2,9)` triplication in `onCollectionChange`/`onDocumentChange`/`onDocumentTemplateChange`.
