// lib/api/apiRawPost.ts
import { cookieUtils } from "@/lib/utils/cookies";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export async function apiRawPost<T = any>(
  path: string,
  body: any
): Promise<T> {
  const authData = cookieUtils.getAuthData();

  if (!authData) {
    throw new Error("Usuário não autenticado.");
  }

  const res = await fetch(`${baseURL}${path}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${authData.token}`,
      "x-user-id": authData.userId,
      "user-id": authData.userId, // algumas APIs esperam com ambos
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Ocorreu um erro ao criar o contato.");
  }

  return data as T;
}
