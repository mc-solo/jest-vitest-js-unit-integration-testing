# jest-vitest-js-unit-integration-testing

Unit and integration testing practice in TypeScript with Vitest. The repo is named jest-vitest, but Vitest is the runner because it works with TypeScript and ESM out of the box with no extra config.

## What is in here

- `src/utils.ts` - small pure functions: `formatPrice`, `slugify`, `isValidEmail`, `calculateDiscount`, `chunkArray`.
- `src/api-client.ts` - a small fetch client for the JSONPlaceholder API (`getPost`, `getPosts`, `createPost`) with error handling for non-OK responses.
- `tests/utils.test.ts` - unit tests for every function in `utils.ts`, happy path and edge cases.
- `tests/api-client.test.ts` - integration-style tests with mocked `fetch`, plus one live test against the real JSONPlaceholder API that logs a skip warning instead of failing when the network is unavailable.

## Install

```bash
npm install
```

## Run tests

```bash
npm test
```

Watch mode:

```bash
npm run test:watch
```

Coverage (thresholds: 70% lines, functions, branches, statements):

```bash
npm run test:coverage
```
