import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { getRefreshToken } from "./refresh-token.service";
import { useAuthStore } from "../context/auth";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Adiciona token em todas as requisições, se existir
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().user?.accessToken;
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Tenta atualizar o token caso receba erro 401
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalConfig = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;
      try {
        const refreshResponse = await getRefreshToken();
        const newToken = refreshResponse.payload.accessToken;

        useAuthStore.getState().setUser({ accessToken: newToken });

        // Atualiza o cabeçalho da requisição original e refaz a chamada
        originalConfig.headers = {
          ...originalConfig.headers,
          Authorization: `Bearer ${newToken}`,
        };

        return api(originalConfig);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
