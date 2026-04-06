import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { clearStoredToken, getStoredToken, setStoredToken } from "../api/axios";
import { getApiErrorMessage } from "../api/axios";
import type { ApiHandledError } from "../api/axios";
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

// Provider component: manages authentication state, token persistence, and auth actions.
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthContextValue["user"]>(null);
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Bootstraps user session from the stored token on app startup.
    async function bootstrapAuth() {
      const existingToken = getStoredToken();

      if (!existingToken) {
        setIsLoading(false);
        return;
      }

      // Surface request failures to the user with clear feedback.
      try {
        const profile = await getProfile();
        setUser(profile);
        setToken(existingToken);
      } catch (error) {
        clearStoredToken();
        setToken(null);
        setUser(null);
        toast.error(getApiErrorMessage(error as ApiHandledError));
      } finally {
        setIsLoading(false);
      }
    }

    void bootstrapAuth();
  }, []);

  const login = useCallback(async (payload: LoginDto) => {
    // Surface request failures to the user with clear feedback.
    try {
      const response = await loginRequest(payload);
      setStoredToken(response.access_token);
      setToken(response.access_token);

      const profile = await getProfile();
      setUser(profile);
      toast.success("Sesion iniciada correctamente");
    } catch (error) {
      toast.error(getApiErrorMessage(error as ApiHandledError));
      throw error;
    }
  }, []);

  // Registers a new user and logs them in, with error handling and feedback.
  const register = useCallback(
    async (payload: RegisterDto) => {
      // Surface request failures to the user with clear feedback.
      try {
        await registerRequest(payload);
        toast.success("Cuenta creada correctamente");
      } catch (error) {
        toast.error(getApiErrorMessage(error as ApiHandledError));
        throw error;
      }

      await login(payload);
    },
    [login],
  );

  // Clears authentication state and stored token, effectively logging the user out.
  const logout = useCallback(() => {
    clearStoredToken();
    setToken(null);
    setUser(null);
    toast.success("Sesion cerrada");
  }, []);

  // Memoizes the context value to optimize performance and prevent unnecessary re-renders.
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
