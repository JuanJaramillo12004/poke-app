import { useCallback, useEffect, useMemo, useState } from "react";
import { clearStoredToken, getStoredToken, setStoredToken } from "../api/axios";
import {
  getProfile,
  login as loginRequest,
  register as registerRequest,
} from "../api/auth.api";
import type { LoginDto, RegisterDto } from "../types/auth.types";
import { AuthContext } from "./auth-context";
import type {
  AuthContextValue,
  AuthProviderProps,
} from "../types/auth-context.types";

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthContextValue["user"]>(null);
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function bootstrapAuth() {
      const existingToken = getStoredToken();

      if (!existingToken) {
        setIsLoading(false);
        return;
      }

      try {
        const profile = await getProfile();
        setUser(profile);
        setToken(existingToken);
      } catch {
        clearStoredToken();
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    void bootstrapAuth();
  }, []);

  const login = useCallback(async (payload: LoginDto) => {
    const response = await loginRequest(payload);
    setStoredToken(response.access_token);
    setToken(response.access_token);

    const profile = await getProfile();
    setUser(profile);
  }, []);

  const register = useCallback(
    async (payload: RegisterDto) => {
      await registerRequest(payload);
      await login(payload);
    },
    [login],
  );

  const logout = useCallback(() => {
    clearStoredToken();
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      logout,
    }),
    [user, token, isLoading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
