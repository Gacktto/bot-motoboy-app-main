// lib/api/fetcher.ts
import { cookieUtils } from "@/lib/utils/cookies";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Performs an authenticated API fetch with optional Next.js revalidation and caching.
 *
 * @template T The expected response type
 * @param path The API endpoint path to fetch
 * @param options Optional fetch request configuration
 * @param nextOptions Optional Next.js specific fetch options like revalidation and cache tags
 * @returns A promise resolving to the parsed JSON response of type T
 * @throws {Error} If the API request fails
 */
export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  nextOptions?: { revalidate?: number; tags?: string[] }
): Promise<T> {
  const authData = cookieUtils.getAuthData();

  const headers = new Headers({
    "Content-Type": "application/json",
    ...options.headers,
  });

  if (authData) {
    headers.set("Authorization", `Bearer ${authData.token}`);
    headers.set("X-User-ID", authData.userId);
  }

  const input = `${baseURL}${path}`;

  const res = await fetch(input, {
    ...options,
    headers,
    next: nextOptions,
    credentials: "include", // Important for cookies
  });

  let data: any;

  try {
    data = await res.json();
  } catch (e) {
    throw new Error("Resposta inválida da API.");
  }

  if (!res.ok) {
    throw new Error(data?.message || `Erro na requisição: ${res.statusText}`);
  }

  return data as T;
}
