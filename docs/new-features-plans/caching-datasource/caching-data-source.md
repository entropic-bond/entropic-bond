# CachingDataSource — Client-Side Document Cache

## One-liner

A decorator-pattern DataSource that caches queried documents in client memory and keeps them fresh via real-time listeners, reducing network traffic and improving perceived responsiveness.

## Kind

Feature — new capability for the `entropic-bond` library.

## Problem statement

Applications built with `entropic-bond` fetch documents from the network on every `findById()` and `find()` call, even when the same documents have been read recently. This causes:

- **Redundant network traffic** — repeated reads of the same data waste bandwidth
- **Slow perceived performance** — users wait for network round-trips on every navigation/interaction
- **Higher infrastructure costs** — unnecessary DB reads accumulate

## Goal & success criteria

| Goal | Success criterion |
|------|-------------------|
| Reduce network traffic | Measurable reduction in DB reads for repeated queries |
| Improve perceived responsiveness | Cached data returns instantly (0ms network latency) |
| Lower infrastructure cost | Fewer DB reads translate to measurable cost savings |
| Maintain API compatibility | No breaking changes to existing `Store` / `Model` / `DataSource` interfaces |

## Target users / stakeholders

- **End-users** of applications built with `entropic-bond` — they experience faster page loads and interactions
- **Developers** using the library — they opt in via a simple API call

## In scope

- `CachingDataSource` class extending `DataSource`, wrapping a real DataSource
- Document-level cache keyed by `collectionName:docId`
- Query-result cache keyed by `collection:queryHash`
- Cache-first reads: `findById()` and `find()` return from cache if available, fall through to real DS on miss
- Write-through: `save()` and `delete()` always propagate to real DS
- Auto-registration of real-time listeners on cache miss to keep entries fresh
- Manual invalidation API: `invalidate(docId)`, `invalidateCollection(collection)`, `clear()`
- Configurable eviction strategies: no eviction (default), LRU, TTL, max entries
- Full `DataSource` interface implementation (including `next()`, `count()`, `runTransaction()`)
- Integration with existing `CachedPropsUpdater`

## Non-goals

- **Offline support** — cache does not persist to IndexedDB/localStorage; lost on page reload
- **Server-side caching** — this is purely a client-side feature
- **Automatic write invalidation** — handled by real-time listeners, not explicit invalidation on `save()`
- **Query-level cache invalidation** — conservative approach (invalidate all queries for a collection on any change) is acceptable
- **Cache warming/preloading** — cache is populated lazily on first read

## Assumptions

| Assumption | Tested? |
|------------|---------|
| `onDocumentChange` / `onCollectionChange` fire reliably for both local and remote writes | **Untested** — verify in `JsonDataSource` |
| Cache entries are lightweight enough for in-memory storage at app scale | **Untested** — depends on document sizes and access patterns |
| Query hash is deterministic and collision-free for distinct queries | **Untested** — need robust canonical JSON serialization |
| Real-time listeners can be shared across multiple subscribers | **Assumed** — existing `Unsubscriber` pattern suggests this works |
| `next()` (pagination) can work with cached results | **Assumed** — need to think about cursor state |

## Risks & unknowns

| Risk | Severity | Mitigation |
|------|----------|------------|
| Listener registration overhead — many cached docs = many subscriptions | Medium | Batch collection-level listeners where possible; document listeners only for individually fetched docs |
| Memory growth without eviction | Medium | Default "no limit" with developer API to configure LRU/TTL/max; add warning in docs |
| Query cache staleness window (between remote write and listener firing) | Low | Acceptable inherent async delay |
| `runTransaction` bypass — transactions need fresh data for correctness | Low | Transactions always go to real DS, bypass cache |
| `count()` and `next()` caching complexity | Low | `count()` goes to real DS; `next()` cursor state managed separately |

## Options considered → decision + rationale

| Option | Decision | Rationale |
|--------|----------|-----------|
| Architecture: CachingDataSource vs Model-level vs Store-level | **CachingDataSource** | Fits existing decorator pattern, opt-in, no Store/Model changes, composable with CachedPropsUpdater |
| Cache key: collection:id vs query hash vs hybrid | **Hybrid** (both) | Individual doc cache for `findById()`, query result cache for `find()`. Both needed for full coverage. |
| Eviction: no limit vs LRU vs TTL vs manual | **Manual (default)** with LRU/TTL as config options | Developer knows their app. Simplest default. |
| Listener lifecycle: auto-register vs explicit | **Auto-register on cache miss** | Cache stays fresh automatically. No developer burden. |
| Write invalidation: explicit vs listener-based | **Listener-based** | `onDocumentChange` fires after writes, updating cache automatically. No redundant invalidation needed. |
| Query invalidation: per-query vs per-collection | **Per-collection** (conservative) | Simple, correct. May evict valid results but they're re-fetched on next query. |

## Open questions

1. Should `next()` (pagination) work with cached query results, or always go to real DS?
2. Should there be a max cache size warning or hard limit in the default configuration?
3. How should we handle collection-level listeners — one per collection or one per query?

## Next steps

Hand off to `atomic-specs` to derive `[REQ-n]` requirements and Gherkin scenarios from this brief.
