import { http } from "./axios";
import type {
  AuthUser,
  LoginDto,
  LoginResponse,
  RegisterDto,
} from "../types/auth.types";

export async function login(payload: LoginDto): Promise<LoginResponse> {
  const response = await http.post<LoginResponse>("/auth/login", payload);
  return response.data;
}

export async function register(payload: RegisterDto): Promise<AuthUser> {
  const response = await http.post<AuthUser>("/auth/register", payload);
  return response.data;
}

export async function getProfile(): Promise<AuthUser> {
  const response = await http.get<AuthUser>("/auth/profile");
  return response.data;
}
