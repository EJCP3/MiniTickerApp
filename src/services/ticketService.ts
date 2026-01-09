// src/api/ticketService.ts
import apiClient from "./client"; // Tu instancia de axios configurada
import type { PagedResult, Ticket, TicketFilter } from "@/types/solicitudes";

export default {
  async getTickets(): Promise<Ticket[]> {
    const response = await apiClient.get<Ticket[]>("/api/tickets");
    return response.data;
  },
  async getTicketById(id: string): Promise<Ticket> {
    const response = await apiClient.get<Ticket>(`/api/tickets/${id}`);
    // Asumimos que el backend devuelve el objeto ticket directamente
    return response.data;
  },
  async getTicketHistory(id: string) {
    const response = await apiClient.get(`/api/tickets/${id}/historial`);
    return response.data; // Devuelve el array con eventos y comentarios mezclados
  },

  async addComment(ticketId: string, texto: string) {
    // El backend espera CreateComentarioDto { Texto: string }
    console.log(ticketId, texto);
    const response = await apiClient.post(
      `/api/tickets/${ticketId}/comentarios`,
      {
        texto: texto,
      }
    );
    return response.data;
  },

  async assignManager(ticketId: string, gestorId: string) {
    const response = await apiClient.patch(`/api/tickets/${ticketId}/assign`, {
      gestorId: gestorId,
    });
    return response.data;
  },

  async changeStatus(ticketId: string, estado: number, motivo: string) {
    const response = await apiClient.patch(`/api/tickets/${ticketId}/status`, {
      estado: estado,
      motivo: motivo,
    });
    return response.data;
  },

  async update(id: string, formData: FormData) {
    const { data } = await apiClient.put(`/api/tickets/${id}`, formData);
    return data;
  },

  async create(formData: FormData) {
    const { data } = await apiClient.post(`/api/tickets`, formData);
    return data;
  },

  async getAll(filter: TicketFilter): Promise<PagedResult<Ticket>> {
    // Axios serializa automáticamente el objeto params a query string
    // Ej: /api/tickets?Page=1&PageSize=10&Estado=1
    const response = await apiClient.get<PagedResult<Ticket>>("/api/tickets", {
      params: filter,
    });
    return response.data;
  },
  getSummary: async (params: any) => {
    // Ahora enviamos el objeto completo de filtros a la URL /api/tickets/summary
    return await apiClient.get("/api/tickets/summary", { params });
  },
};
