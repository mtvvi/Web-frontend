import { Body, ResponseType, fetch as tauriFetch } from "@tauri-apps/api/http";
import { isTauriEnvironment } from "../utils/env";

interface RequestOptions {
  method: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
}

const defaultHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

async function request<T>(url: string, options: RequestOptions): Promise<T> {
  if (isTauriEnvironment()) {
    const response = await tauriFetch<T>(url, {
      method: options.method,
      responseType: ResponseType.JSON,
      headers: { ...defaultHeaders, ...options.headers },
      body: options.body ? Body.json(options.body) : undefined,
    });

    if (response.ok) {
      return response.data as T;
    }

    throw new Error(`Desktop request failed: ${response.status}`);
  }

  const response = await fetch(url, {
    method: options.method,
    headers: { ...defaultHeaders, ...options.headers },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new Error(errorBody || `Request failed with ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const getJson = async <T>(url: string) => request<T>(url, { method: "GET" });
export const postJson = async <T>(url: string, body?: unknown) =>
  request<T>(url, { method: "POST", body });
