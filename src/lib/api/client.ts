/**
 * Thin fetch wrapper around the backend API. Reads the base URL from
 * `NEXT_PUBLIC_API_BASE_URL`. The React Query hooks currently resolve local
 * mock data; swap each one to `apiGet`/`apiPost` once real endpoints exist.
 */
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

function buildUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${BASE_URL}${path}`;
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    throw new Error(`Request failed (${res.status}): ${res.statusText}`);
  }
  return (await res.json()) as T;
}

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(buildUrl(path), {
    ...init,
    method: "GET",
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  return handle<T>(res);
}

export async function apiPost<T>(path: string, body?: unknown, init?: RequestInit): Promise<T> {
  const res = await fetch(buildUrl(path), {
    ...init,
    method: "POST",
    headers: { "Content-Type": "application/json", ...init?.headers },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return handle<T>(res);
}
