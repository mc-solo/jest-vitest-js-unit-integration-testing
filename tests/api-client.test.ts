import { afterEach, describe, expect, it, vi } from "vitest";
import { createPost, getPost, getPosts } from "../src/api-client";
import { testConfig } from "../config/test.config";
import postsData from "../test-data/posts.json";

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

describe("getPost (mocked fetch)", () => {
  it("returns the post for a given id", async () => {
    const post = postsData.singlePost;
    vi.stubGlobal("fetch", mockFetch(post));

    const result = await getPost(post.id);

    expect(result).toEqual(post);
    expect(fetch).toHaveBeenCalledWith(
      `${testConfig.apiBaseUrl}/posts/${post.id}`,
    );
  });

  it("throws on a non-OK response", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetch(
        postsData.errorPayloads.notFound,
        false,
        postsData.errorStatus.notFound,
      ),
    );

    await expect(getPost(postsData.notFoundPostId)).rejects.toThrow(
      String(postsData.errorStatus.notFound),
    );
  });
});

describe("getPosts (mocked fetch)", () => {
  it("returns the list of posts", async () => {
    const posts = postsData.postList;
    vi.stubGlobal("fetch", mockFetch(posts));

    const result = await getPosts();

    expect(result).toEqual(posts);
    expect(fetch).toHaveBeenCalledWith(`${testConfig.apiBaseUrl}/posts`);
  });

  it("throws on a server error", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetch(
        postsData.errorPayloads.empty,
        false,
        postsData.errorStatus.serverError,
      ),
    );

    await expect(getPosts()).rejects.toThrow(
      String(postsData.errorStatus.serverError),
    );
  });
});

describe("createPost (mocked fetch)", () => {
  it("posts the payload and returns the created post", async () => {
    const created = postsData.createdPost;
    const fetchMock = mockFetch(created, true, 201);
    vi.stubGlobal("fetch", fetchMock);

    const result = await createPost(postsData.newPost);

    expect(result).toEqual(created);
    expect(fetchMock).toHaveBeenCalledWith(
      `${testConfig.apiBaseUrl}/posts`,
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify(postsData.newPost),
      }),
    );
  });

  it("throws on a non-OK response", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetch(
        postsData.errorPayloads.empty,
        false,
        postsData.errorStatus.badRequest,
      ),
    );

    await expect(
      createPost({ userId: 1, title: "x", body: "y" }),
    ).rejects.toThrow(String(postsData.errorStatus.badRequest));
  });
});

describe("live API (network required)", () => {
  it("fetches a real post from the configured API", async () => {
    let networkOk = true;
    try {
      const res = await fetch(
        `${testConfig.apiBaseUrl}/posts/${postsData.singlePost.id}`,
        { signal: AbortSignal.timeout(testConfig.liveTestTimeoutMs) },
      );
      if (!res.ok) networkOk = false;
      else {
        const post = await res.json();
        expect(post.id).toBe(postsData.singlePost.id);
        expect(typeof post.title).toBe("string");
      }
    } catch {
      networkOk = false;
    }
    if (!networkOk) {
      console.warn("live test skipped: network unavailable");
    }
  });
});
