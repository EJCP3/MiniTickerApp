import apiClient from "./client";
import type { LoginRequest, LoginResponse, User } from "@/types";

export default {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    // Aquí es donde se hace el POST a tu endpoint
    const response = await apiClient.post<LoginResponse>(
      "/api/auth/login",
      credentials
    );
    return response.data;
  },

  // src/services/authService.ts
  async obtenerUsuarioPorId(id: string): Promise<User> {
    console.log(id);
    const response = await apiClient.get<User>(`/api/users/${id}`);
    return response.data;
  },

  async logout() {
    return apiClient.post("/api/auth/logout");
  },
};
