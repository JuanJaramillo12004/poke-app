import { api } from "./axios";
import type {
  AuthUser,
  LoginDto,
  LoginResponse,
  RegisterDto,
} from "../types/auth.types";

export async function login(payload: LoginDto): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/auth/login", payload);
  return response.data;
}

export async function register(payload: RegisterDto): Promise<AuthUser> {
  const response = await api.post<AuthUser>("/auth/register", payload);
  return response.data;
}

export async function getProfile(): Promise<AuthUser> {
  const response = await api.get<AuthUser>("/auth/profile");
  return response.data;
}
