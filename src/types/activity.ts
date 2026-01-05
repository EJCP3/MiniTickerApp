// src/types/activity.ts

export type ActivityType = 'Creado' | 'Asignado' | 'EstadoCambiado' | 'PrioridadCambiada' | 'Comentario' | 'Cierre';

// src/types/activity.ts


export interface ActivityItem {
  id: string;
  ticketId: string;
  titulo: string;   // Ej: "Ticket COM-2026-0005"
  mensaje: string;  // Ej: "Has creado este ticket."
  fecha: string;    // Ej: "Hace 4 min" (Ya viene formateada)
  tipo: ActivityType; 
}