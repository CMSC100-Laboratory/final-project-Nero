const API_BASE = import.meta.env.VITE_API_URL || "";

export async function apiFetch(path: string, options?: RequestInit): Promise<Response> {
  const headers = new Headers(options?.headers);

  if (options?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(`${API_BASE}${path}`, {
    credentials: "include",
    ...options,
    headers,
  });
}
