# jest-vitest-js-unit-integration-testing

Unit and integration testing practice in TypeScript with Vitest. The repo is named jest-vitest, but Vitest is the runner because it works with TypeScript and ESM out of the box with no extra config.

## Folder tree

```text
├── config/            # environments.ts (default/local/ci presets), test.config.ts (resolved config)
├── docs/              # SETUP.md, TESTING.md
├── src/               # api-client.ts, utils.ts (code under test)
├── test-data/         # posts.json, users.json, expected-values.json
├── tests/             # api-client.test.ts, utils.test.ts
├── .env.example       # env vars with safe defaults
├── ARCHITECTURE.md    # folder map, data flow, how to add a test
├── tsconfig.json
└── vitest.config.ts   # kept at root: Vitest auto-discovers it there
```

## What is in here

- `src/utils.ts` - small pure functions: `formatPrice`, `slugify`, `isValidEmail`, `calculateDiscount`, `chunkArray`.
- `src/api-client.ts` - a small fetch client for the JSONPlaceholder API (`getPost`, `getPosts`, `createPost`) with error handling for non-OK responses. The base URL comes from `config/test.config.ts`, never hard-coded.
- `tests/utils.test.ts` - unit tests for every function in `utils.ts`, happy path and edge cases, driven by `test-data/expected-values.json` and `test-data/users.json`.
- `tests/api-client.test.ts` - integration-style tests with mocked `fetch`, plus one live test against the real JSONPlaceholder API that logs a skip warning instead of failing when the network is unavailable. Fixtures live in `test-data/posts.json`.
- `config/` - base URL and timeouts. Pick a preset with `TEST_ENV` (`default`, `local`, `ci`) or override with `API_BASE_URL` / `API_TIMEOUT_MS` / `LIVE_TEST_TIMEOUT_MS` (see `.env.example`).

## Setup

```bash
npm install
cp .env.example .env   # optional, only to change the API URL or timeouts
```

Full setup guide: [docs/SETUP.md](docs/SETUP.md).

## Run

```bash
npm test              # full suite
npm run test:watch    # watch mode
npm run test:coverage # suite + coverage report (thresholds: 70% lines, functions, branches, statements)
npm run typecheck     # tsc --noEmit
```

What is tested and how: [docs/TESTING.md](docs/TESTING.md). How the folders
connect: [ARCHITECTURE.md](ARCHITECTURE.md).

## Verified results (2026-11-20)

- `npm run test:coverage`: **28/28 tests passed** (21 unit + 7 api-client, including the live-network test), **100% coverage** on lines, functions, branches, and statements.
- `npx tsc --noEmit`: **OK**, no errors.
- Env override check: suite still passes 28/28 with `API_BASE_URL=https://example.invalid` (mocked tests follow the configured URL; the live test skips gracefully offline).
