import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

// Storage key used to persist the JWT token in the browser.
export const TOKEN_STORAGE_KEY = "poke_app_token";

// API helper: wraps HTTP calls to keep components and hooks clean.
export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

// API helper: wraps HTTP calls to keep components and hooks clean.
export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

// API helper: wraps HTTP calls to keep components and hooks clean.
export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

// Shared Axios client configured with API base URL and default headers.
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor: automatically attaches the JWT token to outgoing requests if it exists.
api.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// API helper: wraps HTTP calls to keep components and hooks clean.
export function getApiErrorMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return "Ocurrio un error inesperado";
  }

  const responseData = error.response?.data as
    | { message?: string | string[] }
    | undefined;
  const message = responseData?.message;

  if (Array.isArray(message)) {
    return message[0] ?? "Solicitud invalida";
  }

  if (typeof message === "string" && message.trim()) {
    return message;
  }

  return error.message || "No fue posible completar la solicitud";
}
