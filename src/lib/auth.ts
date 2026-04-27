const DEFAULT_API_BASE =
  typeof window !== "undefined" ? window.location.origin : "http://localhost:3001";
const BASE = import.meta.env.VITE_API_URL ?? DEFAULT_API_BASE;

export interface AuthUser {
  id: string;
  name: string;
  company: string | null;
  email: string;
}

export interface AuthResult {
  user: AuthUser;
}

async function request(path: string, body: object): Promise<AuthResult> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error ?? "Request failed.");
  return data as AuthResult;
}

export function register(params: {
  name: string;
  company?: string;
  email: string;
  password: string;
}) {
  return request("/api/auth/register", params);
}

export function login(params: { email: string; password: string }) {
  return request("/api/auth/login", params);
}

export async function getSession(): Promise<AuthUser | null> {
  try {
    const res = await fetch(`${BASE}/api/auth/me`, { credentials: "include" });
    if (!res.ok) return null;
    const data = (await res.json()) as { user?: AuthUser };
    return data.user ?? null;
  } catch {
    return null;
  }
}

export async function logout(): Promise<void> {
  await fetch(`${BASE}/api/auth/logout`, { method: "POST", credentials: "include" });
}
