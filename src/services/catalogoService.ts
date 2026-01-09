import apiClient from "./client";
import type { Area, TipoSolicitud } from "@/types/department";

export default {
  // CORRECCIÓN: Añadimos 'mostrarInactivos' aquí para quitar el error rojo
  async getAreas(mostrarInactivos: boolean = true): Promise<Area[]> {
    // Enviamos el parámetro al backend
    const { data } = await apiClient.get<Area[]>("/api/catalog/areas", {
      params: { mostrarInactivos },
    });

    // Mapeamos los datos para añadir 'stats' falso y evitar errores,
    // ya que tu backend NO lo envía todavía.
    return data.map((area) => ({
      ...area,
      stats: area.stats || { total: 0, activas: 0, completadas: 0 }, // Mock seguro
      color: area.color || "primary",
    }));
  },

  async createArea(areaData: Partial<Area>): Promise<Area> {
    const { data } = await apiClient.post<Area>("/api/catalog/areas", areaData);
    return data;
  },

  // Recuerda que corregimos esto para recibir un objeto
  async editArea({
    id,
    data,
  }: {
    id: string;
    data: Partial<Area>;
  }): Promise<Area> {
    const response = await apiClient.put<Area>(
      `/api/catalog/areas/${id}`,
      data
    );
    return response.data;
  },

  // También actualizamos este para poder ver tipos inactivos
  async getTipoSolicitudes(
    areaId: string,
    mostrarInactivos: boolean = true
  ): Promise<TipoSolicitud[]> {
    if (!areaId) return [];
    const { data } = await apiClient.get<TipoSolicitud[]>(
      "/api/catalog/tipos-solicitud",
      {
        params: { areaId, mostrarInactivos },
      }
    );
    return data;
  },

  async deleteArea(id: string): Promise<void> {
    await apiClient.delete(`/api/catalog/areas/${id}`);
  },

  // src/services/catalogsService.ts
  async quitarResponsable(areaId: string, usuarioId: string) {
    return await apiClient.patch(
      `/api/catalog/areas/${areaId}/quitar-responsable/${usuarioId}`
    );
  },
  async createTipoSolicitud(
    tipoData: Partial<TipoSolicitud>
  ): Promise<TipoSolicitud> {
    const { data } = await apiClient.post<TipoSolicitud>(
      "/api/catalog/tipos-solicitud",
      tipoData
    );
    return data;
  },

  async deleteTipoSolicitud(id: string): Promise<void> {
    await apiClient.delete(`/api/catalog/tipos-solicitud/${id}`);
  },

  // src/services/catalogsService.ts (o el nombre que uses)

  async toggleTipoSolicitud(id: string, nuevoEstado: boolean): Promise<any> {
    // Si queremos activarlo (true) -> llamamos a /activate
    // Si queremos desactivarlo (false) -> llamamos a /desactivate
    // Ajusta la URL base si es diferente en tu API
    const url = nuevoEstado
      ? `/api/catalog/tipos-solicitud/${id}/activate`
      : `/api/catalog/tipos-solicitud/${id}/desactivate`;

    // Usamos PATCH porque así está en tu Swagger
    const response = await apiClient.patch(url);
    return response.data;
  },
};
