import type { User } from "./user";

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  roleId?: number;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}
