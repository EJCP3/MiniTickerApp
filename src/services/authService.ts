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

  async completeSetup(newPassword: string, fotoPerfil: File | null): Promise<{ fotoUrl: string }> {
    
    // A. Creamos el objeto FormData (necesario para subir archivos)
    const formData = new FormData();
    formData.append("newPassword", newPassword);
    
    if (fotoPerfil) {
      formData.append("fotoPerfil", fotoPerfil);
    }

    // B. Hacemos el POST al endpoint correcto
    const response = await apiClient.post<{ fotoUrl: string }>(
      "/api/auth/complete-setup", // Endpoint que creamos en el Backend
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Importante para archivos
        },
      }
    );

    return response.data;
  },

  async requestPasswordReset(email: string, code: string) {
    // El nombre de la propiedad 'primeros4DigitosId' debe coincidir EXACTO con tu DTO de C#
    return  apiClient.post('/api/auth/request-reset', { 
      email: email, 
      primeros4DigitosId: code 
    });
  }

};
