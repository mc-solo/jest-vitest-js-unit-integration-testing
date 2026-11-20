/**
 * Single source of truth for test configuration.
 *
 * Precedence for every value: env var override > TEST_ENV preset
 * (config/environments.ts) > built-in default. Nothing in src/ or tests/
 * hard-codes a URL or a timeout; they import from here instead.
 *
 * Env vars (see .env.example):
 *   TEST_ENV             environment preset: default | local | ci
 *   API_BASE_URL         base URL of the API under test
 *   API_TIMEOUT_MS       request timeout in ms
 *   LIVE_TEST_TIMEOUT_MS timeout in ms for the one live-network test
 */
import { getEnvironment } from "./environments";

function toInt(value: string | undefined, fallback: number): number {
  const parsed = value === undefined ? NaN : Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

const env = getEnvironment();

export const testConfig = {
  environment: env.name,
  apiBaseUrl: process.env.API_BASE_URL ?? env.apiBaseUrl,
  requestTimeoutMs: toInt(process.env.API_TIMEOUT_MS, env.requestTimeoutMs),
  liveTestTimeoutMs: toInt(
    process.env.LIVE_TEST_TIMEOUT_MS,
    env.liveTestTimeoutMs,
  ),
} as const;

/** Convenience export used by src/api-client.ts. */
export const API_BASE_URL = testConfig.apiBaseUrl;
