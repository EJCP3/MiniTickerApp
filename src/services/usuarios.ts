// src/services/userService.ts
import apiClient from "./client";
import type { User } from "@/types";

export default {
  /**
   * Obtiene la lista de todos los usuarios.
   * Útil para llenar dropdowns de asignación.
   */
  async getUsers(): Promise<User[]> {
    // GET /api/users
    const response = await apiClient.get("/api/users");

    console.log("Response users:", response.data);

    if (response.data && Array.isArray(response.data.items)) {
      return response.data.items;
    }

    // B. Si tu API devuelve el array directo (ej: [...])
    if (Array.isArray(response.data)) {
      return response.data;
    }

    return [];
  },

  async getUserById(userId: string): Promise<User | null> {
    // GET /api/users/{userId}
    const response = await apiClient.get(`/api/users/${userId}`);
    return response.data || null;
},

 async createUser(userData: FormData): Promise<User> {
  // Al enviar un FormData, Axios configura automáticamente el Content-Type a multipart/form-data
  const response = await apiClient.post("/api/users", userData);
  return response.data;
},

 async updateUser(userId: string, userData: FormData): Promise<User> {
  // La URL debe quedar como /api/users/{userId}
  const response = await apiClient.put(`/api/users/${userId}`, userData);
  return response.data;
},

  async toggleUserStatus(userId: string, isActive: boolean): Promise<any> {
   
    const url = isActive 
      ? `/api/users/${userId}/activate` 
      : `/api/users/${userId}/deactivate`;
    
    const response = await apiClient.put(url);
    return response.data;
  },

async getActiveManagers(): Promise<User[]> {
  // Llamamos al endpoint que ya devuelve la lista filtrada desde el backend
  const response = await apiClient.get("/api/catalog/managers-selection");
  return response.data;
}

}