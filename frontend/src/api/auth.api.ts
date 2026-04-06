import { api } from "./axios";
import type {
  AuthUser,
  LoginDto,
  LoginResponse,
  RegisterDto,
} from "../types/auth.types";

// API function: sends login request to the backend and returns the response data.
export async function login(payload: LoginDto): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/auth/login", payload);
  return response.data;
}

// API function: sends registration request to the backend and returns the created user.
export async function register(payload: RegisterDto): Promise<AuthUser> {
  const response = await api.post<AuthUser>("/auth/register", payload);
  return response.data;
}

// API function: retrieves the profile of the currently authenticated user.
export async function getProfile(): Promise<AuthUser> {
  const response = await api.get<AuthUser>("/auth/profile");
  return response.data;
}
