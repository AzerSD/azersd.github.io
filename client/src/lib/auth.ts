import { apiRequest } from "./queryClient";

export interface User {
  id: number;
  email: string;
  username: string;
  firstName: string | null;
  lastName: string | null;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  emailOrUsername: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
}

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await apiRequest("POST", "/api/auth/login", credentials);
  return response.json();
}

export async function register(credentials: RegisterCredentials): Promise<AuthResponse> {
  const response = await apiRequest("POST", "/api/auth/register", credentials);
  return response.json();
}

export async function logout(): Promise<void> {
  await apiRequest("POST", "/api/auth/logout");
}

export async function getCurrentUser(): Promise<{ user: User } | null> {
  try {
    const response = await apiRequest("GET", "/api/auth/me");
    return response.json();
  } catch (error) {
    return null;
  }
}

export function getZitadelAuthUrl(): string {
  return "/api/auth/zitadel";
}
