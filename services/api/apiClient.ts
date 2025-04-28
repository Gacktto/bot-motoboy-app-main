import axios from "axios";
import { cookieUtils } from "@/lib/utils/cookies";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,  // Adiciona esta linha para garantir que os cookies sejam enviados
});

apiClient.interceptors.request.use((config) => {
  const authData = cookieUtils.getAuthData();

  if (authData) {
    config.headers.Authorization = `Bearer ${authData.token}`;
    config.headers["X-User-ID"] = authData.userId;
  }

  return config;
});

export { apiClient };
