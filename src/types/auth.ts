import { User } from "./users";

export interface LoginRequest {
  email: string; // o email, depende de tu backend
  password: string;
}

// Lo que responde el backend
export interface LoginResponse {
  token: string;
  user: User;
  debeCambiarPassword: boolean;
}
