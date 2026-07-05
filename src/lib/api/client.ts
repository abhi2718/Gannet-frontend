/**
 * Fetch wrapper for the Gannet REST API. Reads the base URL from
 * `NEXT_PUBLIC_API_BASE_URL`, attaches the Bearer token, and normalises the
 * API's envelope:
 *   success → `{ success: true, data, count?, pagination? }`
 *   failure → `{ success: false, message }`  (thrown as an `ApiError`)
 */
import { getToken } from "./token";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export type Pagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

type Envelope<T> = {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
  pagination?: Pagination;
};

/** Error carrying the HTTP status and the API's human-readable `message`. */
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function buildUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${BASE_URL}${path}`;
}

async function request<T>(method: string, path: string, body?: unknown): Promise<Envelope<T>> {
  const token = getToken();
  const res = await fetch(buildUrl(path), {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  let json: Envelope<T> | null = null;
  try {
    json = (await res.json()) as Envelope<T>;
  } catch {
    json = null;
  }

  if (!res.ok || !json?.success) {
    throw new ApiError(json?.message ?? `Request failed (${res.status})`, res.status);
  }
  return json;
}

export const apiGet = <T>(path: string): Promise<T> => request<T>("GET", path).then((e) => e.data);

export const apiPost = <T>(path: string, body?: unknown): Promise<T> =>
  request<T>("POST", path, body).then((e) => e.data);

export const apiPatch = <T>(path: string, body?: unknown): Promise<T> =>
  request<T>("PATCH", path, body).then((e) => e.data);

export const apiDelete = <T>(path: string): Promise<T> =>
  request<T>("DELETE", path).then((e) => e.data);

/** GET a list endpoint, returning the rows plus pagination metadata. */
export async function apiGetPaged<T>(
  path: string,
): Promise<{ data: T[]; count: number; pagination: Pagination | null }> {
  const env = await request<T[]>("GET", path);
  return {
    data: env.data,
    count: env.count ?? env.data.length,
    pagination: env.pagination ?? null,
  };
}
