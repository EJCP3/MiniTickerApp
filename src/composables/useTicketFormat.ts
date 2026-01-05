// src/components/TicketModal/useTicketFormat.ts
export function useTicketFormat() {
  
  const formatearFecha = (fechaInput: string | Date): string => {
    if (!fechaInput) return 'Fecha no disponible';
    const fecha = typeof fechaInput === 'string' ? new Date(fechaInput) : fechaInput;
    if (isNaN(fecha.getTime())) return 'Fecha inválida';

    return fecha.toLocaleDateString('es-ES', { 
      year: 'numeric', month: 'long', day: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
    });
  };

  const getBadgePrioridad = (prioridad: string) => {
    switch (prioridad?.toLowerCase()) {
      case 'alta': return 'bg-red-100 text-red-600';
      case 'media': return 'bg-blue-100 text-blue-600';
      case 'baja': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getBadgeEstado = (estado: string) => {
    switch (estado?.toLowerCase()) {
      case 'resuelta': case 'resuelto': return 'text-success border-success/20 bg-success/10';
      case 'en proceso': return 'text-info border-info/20 bg-info/10';
      case 'rechazada': return 'text-error border-error/20 bg-error/10';
      default: return 'text-base-content/70 border-base-200';
    }
  };

  return { formatearFecha, getBadgePrioridad, getBadgeEstado };
}