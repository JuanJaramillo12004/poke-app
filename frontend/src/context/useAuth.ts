import { useContext } from "react";
import { AuthContext } from "./auth-context";

// Custom hook: reads the authentication context and enforces provider usage.
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }

  return context;
}
