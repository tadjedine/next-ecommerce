// ─── Token Expiration Config ─────────────────────────────────
// This MUST match the 'expiration' value in config/sanctum.php.
// It is used for the proactive client-side expiration check.
const TOKEN_EXPIRATION_MINUTES = 120;

// ─── Token Storage ───────────────────────────────────────────

export function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
}

export function setAuthToken(token: string | null) {
  if (typeof window !== "undefined") {
    if (token) {
      localStorage.setItem("token", token);
      // Store the timestamp of when this token was saved (i.e., when the user logged in).
      // This is used by the proactive expiration check in AuthContext.
      localStorage.setItem("token_created_at", Date.now().toString());
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("token_created_at");
    }
  }
}

/**
 * Check if the stored token has exceeded its expected lifetime
 * based on the creation timestamp saved in localStorage.
 * Returns true if the token is expired (or if there's no timestamp).
 */
export function isTokenExpired(): boolean {
  if (typeof window === "undefined") return false;

  const createdAt = localStorage.getItem("token_created_at");
  if (!createdAt) return false; // No timestamp means we can't check; let the server decide.

  const elapsedMs = Date.now() - parseInt(createdAt, 10);
  const expirationMs = TOKEN_EXPIRATION_MINUTES * 60 * 1000;
  return elapsedMs >= expirationMs;
}

// ─── Auth Event ──────────────────────────────────────────────
// A custom browser event that authFetch dispatches when the server
// returns 401. AuthContext listens for this event to immediately
// update the React state (clear user, show "Sign In" button).

export function dispatchAuthExpired() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("auth:expired"));
  }
}

// ─── Authenticated Fetch ─────────────────────────────────────

export async function authFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(options?.headers);
  headers.set("Accept", "application/json");
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const url = `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api"}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers,
  });

  if (!res.ok) {
    if (res.status === 401) {
      // Token is expired or invalid on the server.
      // 1. Clear it from storage.
      setAuthToken(null);
      // 2. Fire a custom event so AuthContext can update React state immediately.
      dispatchAuthExpired();
    }
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
