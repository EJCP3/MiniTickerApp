export interface DashboardStats {
  kpis: {
    total: number;
    completadas: number;
    pendientes: number;
    enProceso: number;
    rechazadas: number;
    vencidas: number;
    tasaResolucion: number;
    tiempoPromedio: number;
    satisfaccion: number;
  };
  tendencia: {
    mes: string;
    total: number;
    completadas: number;
    vencidas: number;
    rechazadas: number;
  }[];
  estatus: {
    estado: string; // 'Nueva', 'En Proceso', etc.
    cantidad: number;
  }[];
  prioridades: {
    prioridad: string; // 'Alta', 'Media', etc.
    cantidad: number;
  }[];
  topSolicitantes: {
    nombre: string;
    cantidad: number;
    id: string;
  }[];
  topGestores: {
    area: string;
    nombre: string;
    cantidad: number;
    resueltas: number;
    rechazadas: number;
    vencidas: number;
    enProceso: number
    id: string;
  }[];
  desempenoAreas: {
    area: string;
    total: number;
    completadas: number;
    vencidas: number;
    rechazadas: number;
  }[];
  
}
