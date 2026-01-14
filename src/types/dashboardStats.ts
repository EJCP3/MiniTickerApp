export interface DashboardStats {
  kpis: {
    total: number;
    completadas: number;
    pendientes: number;
    enProceso: number;
    tasaResolucion: number;
    tiempoPromedio: number;
    satisfaccion: number;
  };
  tendencia: {
    mes: string;
    total: number;
    completadas: number;
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
  desempenoAreas: {
    area: string;
    total: number;
    completadas: number;
  }[];
  tiemposPorArea: {
    area: string;
    dias: number;
  }[];
}
