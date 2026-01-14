import catalogoService from "./catalogoService";
import apiClient from "./client";
import type { DashboardStats } from "@/types";


// en services/dashboardService.ts

export default {
  // 1. Método para obtener la lista de áreas (si no tienes uno dedicado)

  // 2. Actualizar getStats para aceptar areaId
  async getStats(periodo: string, areaId: number | null) {
    // Construir query params
    let url = `api/activity/stats?periodo=${periodo}`;
    
    if (areaId) {
      url += `&areaId=${areaId}`;
    }

    const response = await apiClient.get(url);
    return response.data;
  }
}