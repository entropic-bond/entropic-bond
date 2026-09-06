# Entropic Bond — Agent Guide

## Commands

| Action | Command |
|--------|---------|
| Test all | `npm test` (runs `vitest`) |
| Build | `npm run build` (runs `vite build`) |
| Watch build | `npm run watch` |
| Docs | `npm run docs` (runs `typedoc`) |
| Dev cycle | `npm run build` — no lint/typecheck scripts exist |

CI (`master`): `npm ci && npm test && npm run build && npx semantic-release`

## Tests

- Framework: **Vitest 4.x** with `globals: true` — `describe`, `it`, `expect`, `vi` available globally.
- Files: `*.spec.ts` **co-located** next to source files (never `*.test.ts`, never `__tests__/`).
- Mock data source: `JsonDataSource` — use `Store.useDataSource(new JsonDataSource())`. For delay simulation, call `.simulateDelay(N)` and flush with `await datasource.wait()`.
- Spies: `vi.fn()`, `vi.spyOn()` — declare at module level, `.mockReset()` in `beforeEach`.
- Type-level testing: uses `@type-challenges/utils` (`Expect`, `Equal`) — executed via dummy `expect(true).toBeTruthy()`.
- No setup files, no fake timers.

## Key Architecture

- **Entry point**: `src/index.ts` — flat barrel re-exporting all modules.
- **Build output**: `lib/entropic-bond.js` (ESM) + `lib/entropic-bond.umd.cjs` (CJS).
- **Decorators require `experimentalDecorators: true`** in tsconfig.
- **Class hierarchy**: `Persistent` → `EntropicComponent`.
- **`@registerPersistentClass('Name')` is mandatory** on every `Persistent`/`EntropicComponent` subclass.
- **All `@persistent`-decorated properties MUST start with `_`** (e.g., `@persistent private _name: string`). The underscore is stripped during serialization.
- **Accessors required**: private `_` fields + public getter/setter. Use `changeProp()` in setters for observable behavior.
- **Observable pattern**: `entity.onChange(cb)` returns `Unsubscriber`. Use `changeProp()`, `pushAndNotify()`, `removeAndNotify()` in setters.
- **Singletons + strategy pattern**: `Auth` / `ServerAuth` / `CloudFunctions` have `use*Service()` + `.instance`. `Store` is purely static.

## Quirks & Conventions

- **`noImplicitAny: false`** and **`strictFunctionTypes: false`** in tsconfig (TS 6.x compat).
- **`noUncheckedIndexedAccess: true`** — accessing array elements without bounds check will error.
- **`noImplicitOverride: true`** — overriding base class methods requires `override` keyword.
- **`prepare` script** (`npm run build`) — `npm install` triggers a build.
- **`src/index.ts` exports mock/prod code side-by-side** — all mocks re-exported.
- **Samples** in `samples/` have their own `tsconfig.json` (no `../src` included).
- **`lib/` and `coverage/` are gitignored** — output dirs.
- **CI only runs on `master` branch**; pushes trigger full release via semantic-release.

## Code format style

- Use tabsize of 2 spaces (VSCode setting) for indentation.
- Leave spaces around operators, e.g. `a + b`, ` => ` not `a+b`, '=>'.
- Use single quotes for strings, e.g. `'hello'` not `"hello"`.
- Use spaces after commas, e.g. `a, b` not `a,b`.
- Use spaces after colons, e.g. `a: b` not `a:b`.
- Use spaces after semicolons, e.g. `a; b` not `a;b`.
- Use spaces after start grouping tokens '({[' and before closing grouping tokens ')]})', e.g. `{ a }` not `{a}`, unless it's an empty object `{}` or array `[]` or followed by another grouping token'.

## Workflow

- When fixing a bug, improving a feature or creating a new feature, make sure to write tests to cover your changes first and work in TDD (Test-Driven Development) workflow. That means create a failing test before writing the code, write the code to make the test pass, and then refactor.
- When writing test, minimize the use non-existing mocks