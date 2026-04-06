import type { AuthUser, LoginDto, RegisterDto } from "./auth.types";

export type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginDto) => Promise<void>;
  register: (payload: RegisterDto) => Promise<void>;
  logout: () => void;
};

export type AuthProviderProps = {
  children: React.ReactNode;
};
