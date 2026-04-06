import { createContext } from "react";
import type { AuthContextValue } from "../types/auth-context.types";

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);
