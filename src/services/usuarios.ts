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

  /**
   * (Opcional) Obtener solo gestores si tu backend soporta filtrado
   * Ejemplo: /api/users?rol=Gestor
//    */
  //   async getManagers(): Promise<User[]> {
  //     const response = await apiClient.get('/api/users', {
  //         params: { rol: 'Gestor' } // Ajusta según cómo filtre tu backend
  //     });
  //     return Array.isArray(response.data) ? response.data : (response.data.items || []);
  //   }
};
