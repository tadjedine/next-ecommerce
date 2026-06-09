"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { getAuthToken, setAuthToken, authFetch } from "./auth";

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ApiCustomer | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = getAuthToken();
      if (storedToken) {
        try {
          const res = await authFetch<{ data: ApiCustomer }>("/v1/auth/me");
          setUser(res.data || (res as unknown as ApiCustomer)); // Handle direct return or wrapped data
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

  const login = useCallback((newToken: string, newUser: ApiCustomer) => {
    setAuthToken(newToken);
    setTokenState(newToken);
    setUser(newUser);
  }, []);

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
