import type { Entry } from "@/server/db/schema";

export type PublicEntry = Omit<Entry, "userId">;
export type Stats = { plantCount: number; stampCount: number };

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "Request failed.");
  return data as T;
}

export const api = {
  signup: (email: string, password: string) =>
    request<{ user: { id: string; email: string } }>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  login: (email: string, password: string) =>
    request<{ user: { id: string; email: string } }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  logout: () => request<{ ok: true }>("/api/auth/logout", { method: "POST" }),

  stats: () => request<Stats>("/api/stats"),

  listEntries: () => request<{ entries: PublicEntry[] }>("/api/entries"),

  saveEntry: (body: string, kind: "stamped" | "planted") =>
    request<{ entry: PublicEntry }>("/api/entries", {
      method: "POST",
      body: JSON.stringify({ body, kind }),
    }),

  deleteEntry: (id: string) =>
    request<{ ok: true }>(`/api/entries/${id}`, { method: "DELETE" }),
};
