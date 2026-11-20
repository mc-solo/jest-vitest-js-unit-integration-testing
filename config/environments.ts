/**
 * Named test environments.
 *
 * Each environment is just a preset of base URL + timeouts. The active one
 * is picked with TEST_ENV (see config/test.config.ts); individual values
 * can still be overridden with env vars, so no URL ever has to be edited
 * in source code to point the suite at another server.
 */
export interface TestEnvironment {
  name: string;
  apiBaseUrl: string;
  requestTimeoutMs: number;
  liveTestTimeoutMs: number;
}

export const environments: Record<string, TestEnvironment> = {
  default: {
    name: "default",
    apiBaseUrl: "https://jsonplaceholder.typicode.com",
    requestTimeoutMs: 8000,
    liveTestTimeoutMs: 8000,
  },
  local: {
    name: "local",
    apiBaseUrl: "http://localhost:3000",
    requestTimeoutMs: 5000,
    liveTestTimeoutMs: 5000,
  },
  ci: {
    name: "ci",
    apiBaseUrl: "https://jsonplaceholder.typicode.com",
    requestTimeoutMs: 10000,
    liveTestTimeoutMs: 10000,
  },
};

/** Resolve an environment by name; unknown names fall back to "default". */
export function getEnvironment(
  name: string = process.env.TEST_ENV ?? "default",
): TestEnvironment {
  return environments[name] ?? environments.default;
}
