# Entropic Bond — Testing, Mocks, and Formatting Guide

This guide describes how to write correct tests, mock dependencies, format source code, and run workflow scripts within the `entropic-bond` codebase.

---

## 1. Testing Standards

### Testing Stack

- **Framework**: Vitest.
- **Globals**: `describe`, `it`, `expect`, `vi` are globally registered. Do **not** import them explicitly in spec files.
- **File Names**: Test files **must** be named `*.spec.ts` and co-located directly in the same directory as the source file under test. Do not put tests in a separate `__tests__/` directory.

### Testing Database Logic with `JsonDataSource`

Always use `JsonDataSource` for unit tests that require database persistence.

- Call `.simulateDelay( ms )` to test async actions or race conditions.
- Call `await datasource.wait()` to flush and resolve delayed operations.

```ts
import { Store, JsonDataSource } from 'entropic-bond'

describe( 'User persistence', () => {
  let dataSource: JsonDataSource;

  beforeEach( () => {
    dataSource = new JsonDataSource();
    dataSource.simulateDelay( 10 );
    Store.useDataSource( dataSource );
  });

  it( 'should wait for delay to flush', async () => {
    // Perform operations...
    await dataSource.wait();
  });
});
```

### Spies and Mocking

Declare spy mocks at the module level, and call `.mockReset()` or `.mockClear()` inside `beforeEach` to avoid cross-test pollution.

```ts
const spyOnSave = vi.spyOn( JsonDataSource.prototype, 'save' );

beforeEach( () => {
  spyOnSave.mockReset();
});
```

---

## 2. Notification Requirements

Agents working on the codebase **must** execute specific notification commands when complete, or when stopping to prompt the user.

### Action Completion Notification

Run this command immediately upon finishing any assigned engineering task:

```bash
paplay /usr/share/sounds/freedesktop/stereo/complete.oga && curl -H "Priority: max" -d "I finished the task already" ntfy.sh/opencode-josep-1965 > /dev/null 2>&1
```

### Prompting / User Input Notification

Run this command immediately before stopping to ask the user a question or waiting for inputs:

```bash
paplay /usr/share/sounds/freedesktop/stereo/complete.oga && curl -H "Priority: max" -d "I need your input" ntfy.sh/opencode-josep-1965 > /dev/null 2>&1
```

---

## 3. Code Formatting & Style Guidelines

Rigorously adhere to these visual spacing and syntax rules in all codebase contributions and test examples:

1. **Indentation**: Tab size of **2 spaces** (no hard tabs).
2. **String Quotes**: Use single quotes (`'hello'`) instead of double quotes (`"hello"`).
3. **Spaces around Operators**: Put spaces around mathematical and logical operators (e.g., `a + b`, `=>`). Do **not** write `a+b` or `=>` without surrounding spaces.
4. **Spaces after Separators**: Put spaces after commas, colons, and semicolons (e.g., `a, b`, `a: b`, `a; b`).
5. **Grouping Bracket Spacing**:
   - Put spaces after start grouping tokens (`(`, `{`, `[`) and before closing grouping tokens (`)`, `}`, `]`).
   - Example: `{ a }` instead of `{a}`.
   - Exception: Empty groupings `{}` and `[]`, or when grouping tokens are immediately nested (e.g., `[[ 1 ]]`).

---

## 4. Key CLI Commands

| Action | Command |
|--------|---------|
| Test all | `npm test` (runs vitest) |
| Build project | `npm run build` (runs vite build) |
| Watch build | `npm run watch` |
| Generate docs | `npm run docs` (runs typedoc) |
| Dev loop | `npm run build` (No separate lint/typecheck script exist) |
