import { defineStore } from "pinia";
import { computed } from "vue";
import { useQuery } from "@pinia/colada";
import type { Ticket } from "@/types";
import ticketService from "@/services/ticketService";
import type { IconName } from "@/utils/icons";
import { useIntervalFn } from "@vueuse/core";

export const useTicketStore = defineStore("tickets", () => {
  interface EstadoEstadistica {
    titulo: string;
    cantidad: number;
    iconName: IconName;
    colorIcono: string;
  }

  const {
    data: tickets,
    status,
    error,
    refresh,
  } = useQuery({
    key: ["tickets"],
    query: async () => {
      const response: any = await ticketService.getTickets();

      return response.items || [];
    },

    staleTime: 1000 * 60,
  });
  
// setInterval(() => {
//     refresh();
//   }, 30 * 1000); 

  const isLoading = computed(() => status.value === "pending");

  const estadisticas = computed<EstadoEstadistica[]>(() => {
    // Seguridad: Si aún no hay data, devolvemos array vacío
    const listaTickets = tickets.value || [];

    const counts: Record<string, number> = {
      Nueva: 0,
      EnProceso: 0,
      Resuelta: 0,
      Cerrada: 0,
      Rechazada: 0,
    };

    listaTickets.forEach((t: Ticket) => {
      if (counts[t.estado] !== undefined) counts[t.estado]++;
    });

    return [
      {
        titulo: "Nueva",
        cantidad: counts.Nueva,
        iconName: "clock",
        colorIcono: "text-warning",
      },
      {
        titulo: "En Proceso",
        cantidad: counts.EnProceso,
        iconName: "loader",
        colorIcono: "text-info",
      },
      {
        titulo: "Resuelta",
        cantidad: counts.Resuelta,
        iconName: "check",
        colorIcono: "text-warning",
      },
      {
        titulo: "Cerrada",
        cantidad: counts.Cerrada,
        iconName: "checkCircle",
        colorIcono: "text-success",
      },
      {
        titulo: "Rechazada",
        cantidad: counts.Rechazada,
        iconName: "xCircle",
        colorIcono: "text-error",
      },
    ];
  });

  const totalTickets = computed(() => tickets.value?.length || 0);

  const tasaCompletado = computed(() => {
    const total = totalTickets.value;
    if (total === 0) return 0;
    const listaTickets = tickets.value || [];
    const completados = listaTickets.filter(
      (t: Ticket) => t.estado === "Cerrada" || t.estado === "Resuelta"
    ).length;
    return Math.round((completados / total) * 100);
  });

  // Retornamos todo lo necesario
  return {
    tickets, // La data (array limpio)
    isLoading, // Estado de carga
    error, // Errores si los hay
    refresh, // Función para recargar manualmente (fetchTickets)
    estadisticas, // Tus cálculos
    totalTickets,
    tasaCompletado,
  };
});
