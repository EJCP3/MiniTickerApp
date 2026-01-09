export interface AreaStats {
  total: number;
  activas: number;
  completadas: number;
  pendientesMsg?: string;
}

export interface Area {
  id: string;
  nombre: string;
  prefijo: string;
  activo: boolean; // En BD suele ser 'activo', tu mock usaba 'estado'
  responsableId: string;
  // Estos campos son opcionales porque quizás el backend no los devuelve y los calculamos en el front
  color?: string; 
  stats?: AreaStats;
}

export interface TipoSolicitud {
  id: string;
  areaId: string;
  nombre: string;
  activo: boolean;
  tieneTickets?: boolean; 
}

// Para los dropdowns
export interface SelectOption {
  value: string;
  label: string;
}