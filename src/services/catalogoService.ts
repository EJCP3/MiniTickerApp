import apiClient from "./client"; // Tu instancia de axios configurada
import {Area, TipoSolicitud} from "@/types";

export default {
  async getAreas(): Promise<Area[]> {
    const response = await apiClient.get<Area[]>("/api/catalog/areas");
    return response.data;
  },
 
    async getTipoSolicitudes(areaId: string): Promise<TipoSolicitud[]> {
    const response = await apiClient.get<TipoSolicitud[]>("/api/catalog/tipos-solicitud", { params: { areaId } });
    return response.data;
  }

};