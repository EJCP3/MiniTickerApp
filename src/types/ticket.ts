// src/types/ticket.ts

export interface Ticket {
  id: string;
  numero: string;
  asunto: string;
  estado: 'Nueva' | 'EnProceso' | 'Resuelta' | 'Cerrada' | 'Rechazada'; 
  prioridad: string;
  fechaCreacion: string;

}
