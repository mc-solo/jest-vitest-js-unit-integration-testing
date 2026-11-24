# Testing

Runner: **Vitest** (the repo is named jest-vitest, but Vitest runs the
suite: it handles TypeScript and ESM out of the box with no extra config).
Config lives in `vitest.config.ts` at the repo root, where Vitest discovers
it automatically.

## What is tested

### `tests/utils.test.ts` — unit tests (25 tests)

Snapshot tests are included: the outputs for the cases in
`test-data/snapshots.json` are recorded in
`tests/__snapshots__/utils.test.ts.snap` on the first run and compared
on every run after that. Update a snapshot only when the code changed
its output on purpose (`vitest run -u`); a mismatch after an
accidental change means fix the code, not the snapshot.

Pure functions in `src/utils.ts`, happy path and edge cases:

| Function | Covered |
| --- | --- |
| `formatPrice` | whole numbers, decimals, rounding, zero, non-finite input throws |
| `slugify` | lowercasing, punctuation removal, dash collapsing, trimming, empty input |
| `isValidEmail` | valid emails from `test-data/users.json`, and every invalid shape (missing `@`, missing domain dot, spaces, empty, leading/trailing dot, double `@`) |
| `calculateDiscount` | 20% off, 0% and 100%, rounding to 2 decimals, invalid price/percent throws |
| `chunkArray` | even chunks, remainder chunk, oversize chunk, empty input, invalid size throws |

### `tests/api-client.test.ts` — integration-style tests (7 tests)

`src/api-client.ts` (`getPost`, `getPosts`, `createPost`) with `fetch`
mocked via `vi.stubGlobal`:

- returns the mocked post / post list / created post
- sends the expected URL (built from `config/test.config.ts`, never hard-coded)
- sends the expected POST method and JSON body for `createPost`
- throws with the status code on 404, 500, and 400 responses

Plus **one live test**: a real `GET` against the configured API
(`{API_BASE_URL}/posts/1`). It needs network. If the network or the API is
unavailable it logs `live test skipped: network unavailable` and passes
instead of failing, so the suite stays green offline.

### `tests/api-client.mock.test.ts` — mocked tests (5 tests)

Same client, fully mocked `fetch`, so **no live call is ever made**:
`getPost` returns the mocked post and calls the configured URL,
throws with the status on a 404; `getPosts` returns the mocked list
and returns an empty list when the API returns one; `createPost`
throws with the status on a 500. Fixtures live in
`test-data/posts.json` and `test-data/snapshots.json`.

### `tests/api-client.errors.test.ts` — error-handling tests (8 tests)

API client error handling, fully mocked `fetch` via `vi.stubGlobal`
exactly like `tests/api-client.mock.test.ts`, so **no live call is
ever made**. Status codes, status texts, and error messages all come
from `test-data/posts.json`; the base URL comes from
`config/test.config.ts`, never hard-coded.

| Case | Covered |
| --- | --- |
| Network error | `getPost` and `createPost` propagate the fetch rejection (message from `errorMessages.network`); the request was still made once, to the configured URL |
| 404 | `getPost` throws `404 Not Found` (status + status text from fixtures) |
| 500 | `getPosts` and `createPost` throw `500 Internal Server Error` |
| Timeout | `getPost` propagates a fetch rejection carrying the timeout error (`errorMessages.timeout`, name `timeoutErrorName`); note the client sets no abort signal of its own, so this is fetch rejecting, not the client timing out |
| Malformed JSON | `getPost` and `getPosts` reject when `res.json()` throws (message from `errorMessages.malformedJson`) |

## Test data

No test data is hard-coded in the test files. Fixtures live in `test-data/`:

- `posts.json` — single post, post list, new/created post, error payloads and status codes, error status texts (`errorStatusText`), error messages (`errorMessages`: network, timeout, malformed JSON) and the timeout error name, the not-found post id
- `users.json` — valid users (emails) and the list of invalid emails
- `expected-values.json` — expected inputs/outputs for `formatPrice`, `slugify`, `calculateDiscount`, `chunkArray`
- `snapshots.json` — inputs for the snapshot tests and the mocked posts for `api-client.mock.test.ts`

To change a fixture, edit the JSON; the tests pick it up with no code change.

## How to run

```bash
npm test              # 45 tests on paper, no coverage report
npm run test:coverage # same suite plus a v8 coverage report (text + html)
npm run test:watch    # watch mode
npm run typecheck     # tsc --noEmit, must pass too
```

## Coverage

Thresholds in `vitest.config.ts`: 100% lines, functions, branches,
statements, raised from 70% (issue #4) to match the verified
level below, so the suite fails if coverage drops. Verified
2026-11-20: **28/28 tests passed, 100% on all four
coverage metrics** (`src/api-client.ts` and `src/utils.ts`).

The snapshot tests (4) and the mocked API client tests (5) were
added after that run and have **not been run yet**, and the error integration work
error-handling tests (8) have **not been run yet** either; the suite
is 45 tests on paper (25 unit + 7 api-client + 5 mocked + 8 errors)
until it is run again. The snapshot file
`tests/__snapshots__/utils.test.ts.snap` exists (created on a
2026-11-23 run).

## Adding a new test

1. If it needs data, add it to `test-data/*.json` first.
2. Put the test in `tests/` (`*.test.ts`), importing from `../src/...`,
   `../config/test.config` (never a hard-coded URL), and `../test-data/...`.
3. Run `npm test` and `npm run typecheck`.
