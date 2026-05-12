type ApiMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface FetchOptions<T = unknown> {
  method?: ApiMethod;
  body?: T;
  headers?: Record<string, string>;
}

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

// ── Base fetch wrapper ────────────────────────────────────────
export async function apiFetch<TResponse, TBody = unknown>(
  url: string,
  options: FetchOptions<TBody> = {},
): Promise<ApiResponse<TResponse>> {
  const { method = "GET", body, headers = {} } = options;

  try {
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const json = await res.json();

    if (!res.ok) {
      return {
        data: null,
        error: json.message ?? json.error ?? "Something went wrong",
        status: res.status,
      };
    }

    return { data: json, error: null, status: res.status };
  } catch {
    return {
      data: null,
      error: "Network error — please check your connection",
      status: 0,
    };
  }
}

// ── Convenience helpers ───────────────────────────────────────
export const api = {
  get: <T>(url: string) => apiFetch<T>(url),

  post: <T, B = unknown>(url: string, body: B) =>
    apiFetch<T, B>(url, { method: "POST", body }),

  put: <T, B = unknown>(url: string, body: B) =>
    apiFetch<T, B>(url, { method: "PUT", body }),

  patch: <T, B = unknown>(url: string, body: B) =>
    apiFetch<T, B>(url, { method: "PATCH", body }),

  delete: <T>(url: string) => apiFetch<T>(url, { method: "DELETE" }),
};
