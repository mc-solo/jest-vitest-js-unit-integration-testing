import { afterEach, describe, expect, it, vi } from "vitest";
import { createPost, getPost, getPosts } from "../src/api-client";
import { testConfig } from "../config/test.config";
import postsData from "../test-data/posts.json";

// API client error-handling integration tests: every test stubs global
// fetch, so no live call is ever made, exactly like
// tests/api-client.mock.test.ts. Fixtures come from test-data/posts.json
// (status codes, status texts, error messages); the base URL comes
// from config/test.config.ts, never hard-coded.
//
// Note on timeout: src/api-client.ts sets no abort signal of its own,
// so a timeout here means fetch itself rejects with a timeout error
// and the client propagates that rejection unchanged.

function mockFetch(
  json: unknown,
  ok = true,
  status = 200,
  statusText = "OK",
) {
  return vi.fn().mockResolvedValue({
    ok,
    status,
    statusText,
    json: async () => json,
  } as unknown as Response);
}

function mockFetchReject(error: unknown) {
  return vi.fn().mockRejectedValue(error);
}

function mockFetchJsonError(error: unknown) {
  return vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    statusText: "OK",
    json: async () => {
      throw error;
    },
  } as unknown as Response);
}

function timeoutError(): Error {
  const error = new Error(postsData.errorMessages.timeout);
  error.name = postsData.timeoutErrorName;
  return error;
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("getPost error handling (mocked fetch, no live call)", () => {
  it("propagates a network error when fetch rejects", async () => {
    const fetchMock = mockFetchReject(
      new Error(postsData.errorMessages.network),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(getPost(postsData.singlePost.id)).rejects.toThrow(
      postsData.errorMessages.network,
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      `${testConfig.apiBaseUrl}/posts/${postsData.singlePost.id}`,
    );
  });

  it("throws with the status on a 404", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetch(
        postsData.errorPayloads.notFound,
        false,
        postsData.errorStatus.notFound,
        postsData.errorStatusText.notFound,
      ),
    );

    await expect(getPost(postsData.notFoundPostId)).rejects.toThrow(
      `${postsData.errorStatus.notFound} ${postsData.errorStatusText.notFound}`,
    );
  });

  it("propagates a timeout error when fetch rejects with one", async () => {
    const error = timeoutError();
    const fetchMock = mockFetchReject(error);
    vi.stubGlobal("fetch", fetchMock);

    await expect(getPost(postsData.singlePost.id)).rejects.toThrow(
      postsData.errorMessages.timeout,
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(error.name).toBe(postsData.timeoutErrorName);
  });

  it("rejects when the response body is malformed JSON", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetchJsonError(new Error(postsData.errorMessages.malformedJson)),
    );

    await expect(getPost(postsData.singlePost.id)).rejects.toThrow(
      postsData.errorMessages.malformedJson,
    );
  });
});

describe("getPosts error handling (mocked fetch, no live call)", () => {
  it("throws with the status on a 500", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetch(
        postsData.errorPayloads.empty,
        false,
        postsData.errorStatus.serverError,
        postsData.errorStatusText.serverError,
      ),
    );

    await expect(getPosts()).rejects.toThrow(
      `${postsData.errorStatus.serverError} ${postsData.errorStatusText.serverError}`,
    );
  });

  it("rejects when the response body is malformed JSON", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetchJsonError(new Error(postsData.errorMessages.malformedJson)),
    );

    await expect(getPosts()).rejects.toThrow(
      postsData.errorMessages.malformedJson,
    );
  });
});

describe("createPost error handling (mocked fetch, no live call)", () => {
  it("throws with the status on a 500", async () => {
    const fetchMock = mockFetch(
      postsData.errorPayloads.empty,
      false,
      postsData.errorStatus.serverError,
      postsData.errorStatusText.serverError,
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(createPost(postsData.newPost)).rejects.toThrow(
      String(postsData.errorStatus.serverError),
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("propagates a network error when fetch rejects", async () => {
    const fetchMock = mockFetchReject(
      new Error(postsData.errorMessages.network),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(createPost(postsData.newPost)).rejects.toThrow(
      postsData.errorMessages.network,
    );
    expect(fetchMock).toHaveBeenCalledWith(
      `${testConfig.apiBaseUrl}/posts`,
      expect.objectContaining({ method: "POST" }),
    );
  });
});
