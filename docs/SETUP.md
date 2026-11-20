# Setup

## Requirements

- Node.js 18 or newer (fetch and `AbortSignal.timeout` are used; Node 22 was used for verification)
- npm (comes with Node)

## Install

```bash
npm install
```

## Configure (optional)

No config is needed for the default run: the suite targets the public
JSONPlaceholder API (`https://jsonplaceholder.typicode.com`) with an 8 s
timeout.

To point the suite at another API, copy the example env file and edit it:

```bash
cp .env.example .env
```

| Variable | Default | What it does |
| --- | --- | --- |
| `TEST_ENV` | `default` | Environment preset: `default`, `local`, or `ci` (see `config/environments.ts`) |
| `API_BASE_URL` | preset value | Base URL of the API under test |
| `API_TIMEOUT_MS` | preset value | Request timeout in ms |
| `LIVE_TEST_TIMEOUT_MS` | preset value | Timeout in ms for the live-network test |

Precedence: env var > `TEST_ENV` preset > built-in default.

Note: no `.env` loader is installed, so export the variables in your shell
or prefix the command instead of relying on the `.env` file being read
automatically:

```bash
API_BASE_URL=http://localhost:3000 npm test
```

`.env` is gitignored; never commit real URLs or secrets. `.env.example` is
safe to commit.

## Run

```bash
npm test            # full suite, once
npm run test:watch  # watch mode, re-runs on save
npm run test:coverage
npm run typecheck   # tsc --noEmit
```

See [TESTING.md](TESTING.md) for what is tested, and
[../ARCHITECTURE.md](../ARCHITECTURE.md) for how the folders fit together.
