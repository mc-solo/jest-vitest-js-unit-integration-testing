import { API_BASE_URL } from "../config/test.config";

// Base URL comes from config/test.config.ts (TEST_ENV preset, overridable
// with API_BASE_URL). Never hard-code a URL here.
const BASE_URL = API_BASE_URL;

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface NewPost {
  userId: number;
  title: string;
  body: string;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export async function getPost(id: number): Promise<Post> {
  const res = await fetch(`${BASE_URL}/posts/${id}`);
  return handleResponse<Post>(res);
}

export async function getPosts(): Promise<Post[]> {
  const res = await fetch(`${BASE_URL}/posts`);
  return handleResponse<Post[]>(res);
}

export async function createPost(post: NewPost): Promise<Post> {
  const res = await fetch(`${BASE_URL}/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  });
  return handleResponse<Post>(res);
}
