import { afterEach, describe, expect, it, vi } from "vitest";
import { createPost, getPost, getPosts } from "../src/api-client";
import { testConfig } from "../config/test.config";
import postsData from "../test-data/posts.json";
import snapshots from "../test-data/snapshots.json";

// Fully mocked API client tests: every test stubs global fetch, so
// no live call is ever made. The live-network test lives in
// tests/api-client.test.ts instead. Fixtures come from
// test-data/posts.json and test-data/snapshots.json; the base URL
// comes from config/test.config.ts, never hard-coded.

function mockFetch(json: unknown, ok = true, status = 200) {
  return vi.fn().mockResolvedValue({
    ok,
    status,
    statusText: ok ? "OK" : "Not Found",
    json: async () => json,
  } as unknown as Response);
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("getPost (mocked fetch, no live call)", () => {
  it("returns the mocked post and calls the configured URL", async () => {
    const post = snapshots.mockPosts[0];
    const fetchMock = mockFetch(post);
    vi.stubGlobal("fetch", fetchMock);

    const result = await getPost(post.id);

    expect(result).toEqual(post);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      `${testConfig.apiBaseUrl}/posts/${post.id}`,
    );
  });

  it("throws with the status code on a 404", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetch(postsData.errorPayloads.notFound, false, 404),
    );

    await expect(getPost(postsData.notFoundPostId)).rejects.toThrow("404");
  });
});

describe("getPosts (mocked fetch, no live call)", () => {
  it("returns the mocked post list", async () => {
    vi.stubGlobal("fetch", mockFetch(snapshots.mockPosts));

    const result = await getPosts();

    expect(result).toEqual(snapshots.mockPosts);
    expect(fetch).toHaveBeenCalledWith(`${testConfig.apiBaseUrl}/posts`);
  });

  it("returns an empty list when the API returns one", async () => {
    vi.stubGlobal("fetch", mockFetch([]));

    const result = await getPosts();

    expect(result).toEqual([]);
  });
});

describe("createPost (mocked fetch, no live call)", () => {
  it("throws with the status code on a 500 and never sends a live request", async () => {
    const fetchMock = mockFetch(postsData.errorPayloads.empty, false, 500);
    vi.stubGlobal("fetch", fetchMock);

    await expect(createPost(postsData.newPost)).rejects.toThrow("500");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
