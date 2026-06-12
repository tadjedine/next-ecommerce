"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from "react";
import { getAuthToken, setAuthToken, isTokenExpired, authFetch } from "./auth";

export interface ApiCustomer {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  id_gender: number;
  birthday: string | null;
  newsletter: boolean;
  is_guest: boolean;
  created_at: string;
}

interface AuthContextValue {
  user: ApiCustomer | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string, user: ApiCustomer) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// How often (in ms) we check whether the token has expired on the client side.
const EXPIRATION_CHECK_INTERVAL_MS = 30_000; // every 30 seconds

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ApiCustomer | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // useRef to avoid stale closure issues inside event listeners and intervals.
  const logoutRef = useRef<() => void>(() => {});

  // ── Silent logout (no API call, no redirect — just clear state) ──
  // Used when the token expires or a 401 is received. We don't want to
  // call the /logout endpoint because the token is already dead.
  const silentLogout = useCallback(() => {
    setAuthToken(null);
    setTokenState(null);
    setUser(null);
  }, []);

  // Keep the ref always pointing to the latest silentLogout
  useEffect(() => {
    logoutRef.current = silentLogout;
  }, [silentLogout]);

  // ── 1. On mount: validate stored token with the server ──
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = getAuthToken();
      if (storedToken) {
        // Quick client-side check first — no network call needed
        if (isTokenExpired()) {
          setAuthToken(null);
          setLoading(false);
          return;
        }

        try {
          const res = await authFetch<{ data: ApiCustomer }>("/v1/auth/me");
          setUser(res.data || (res as unknown as ApiCustomer));
          setTokenState(storedToken);
        } catch (error) {
          console.error("Failed to fetch user with stored token", error);
          setAuthToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // ── 2. Listen for the custom "auth:expired" event from authFetch ──
  // When any API call anywhere in the app gets a 401, authFetch dispatches
  // this event. We listen here so the React state updates instantly and
  // the navbar swaps from the user icon back to "Sign In".
  useEffect(() => {
    const handleExpired = () => {
      logoutRef.current();
    };

    window.addEventListener("auth:expired", handleExpired);
    return () => window.removeEventListener("auth:expired", handleExpired);
  }, []);

  // ── 3. Periodic proactive expiration check ──
  // Even if the user doesn't make any API call, we check every 30 seconds
  // whether the token's age has exceeded the server-side expiration limit.
  // If it has, we silently log out so the UI updates automatically.
  useEffect(() => {
    const interval = setInterval(() => {
      const currentToken = getAuthToken();
      if (currentToken && isTokenExpired()) {
        console.info("Token expired (proactive check). Logging out.");
        logoutRef.current();
      }
    }, EXPIRATION_CHECK_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  // ── Login ──
  const login = useCallback((newToken: string, newUser: ApiCustomer) => {
    setAuthToken(newToken);
    setTokenState(newToken);
    setUser(newUser);
  }, []);

  // ── Explicit logout (user clicked "Logout") ──
  const logout = useCallback(async () => {
    try {
      if (token) {
        await authFetch("/v1/auth/logout", { method: "POST" });
      }
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setAuthToken(null);
      setTokenState(null);
      setUser(null);
      window.location.href = "/";
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
