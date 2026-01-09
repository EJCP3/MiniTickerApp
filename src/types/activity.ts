// src/types/activity.ts

export type ActivityType = 
  // --- Eventos de Ticket (TicketEventType) ---
  | 'Creado' 
  | 'CambioEstado' 
  | 'ComentarioADD' 
  | 'Asignado'
  
  // --- Eventos de Sistema (SystemEventType) ---
  | 'Login' 
  | 'Logout'
  | 'UsuarioCreado' | 'UsuarioActualizado' | 'UsuarioEstadoCambio'
  | 'AreaCreada' | 'AreaActualizada' | 'AreaEliminada' | 'AreaEstadoCambio'
  | 'TipoSolicitudCreado' | 'TipoSolicitudEliminado' | 'TipoSolicitudEstadoCambio'
  
  // --- Fallback para evitar errores si agregas más en el futuro ---
  | string;

// src/types/activity.ts


export interface ActivityItem {
  id: string;
  ticketId: string | null; // Null si es actividad de sistema
  titulo: string;   // Ej: "Ticket COM-2026-0005"
  mensaje: string;  // Ej: "Has creado este ticket."
  fecha: string;    // Ej: "Hace 4 min" (Ya viene formateada)
 
  fechaCreacion: string; // Fecha en formato ISO para ordenamiento
   tipo: ActivityType; 
}