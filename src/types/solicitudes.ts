// --- ENUMS (Mapean los valores int del Backend) ---

export enum Prioridad {
  Baja = 0,
  Media = 1,
  Alta = 2
}

export enum EstadoTicket {
  Nueva = 0,
  EnProceso = 1,
  Resuelta = 2,
  Cerrada = 3,
  Rechazada = 4
}

// --- ENTIDADES PRINCIPALES ---

export interface Area {
  id: string; // UUID
  nombre: string;
  prefijo?: string;
  activo: boolean;
}

export interface TipoSolicitud {
  id: string; // UUID
  nombre: string;
  areaId: string;
  activo: boolean;
}

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: string; // "Solicitante", "Gestor", "Admin", etc.
  fotoPerfilUrl?: string;
}

// --- TICKET / SOLICITUD (El objeto completo) ---

export interface Ticket {
  id: string;
  numero: string;       // Ej: "TI-2026-001"
  asunto: string;
  descripcion: string;
  prioridad: Prioridad | string; // A veces el backend manda "Alta", a veces 2. Lo manejamos flexible.
  estado: EstadoTicket | string; // Igual aquí
  fechaCreacion: string; // ISO String
  fechaActualizacion?: string;
  
  // Relaciones
  area?: Area;           // Puede venir el objeto completo o null
  areaId: string;
  
  tipoSolicitud?: TipoSolicitud;
  tipoSolicitudId: string;
  
  solicitante?: Usuario;
  solicitanteId: string;
  
  gestor?: Usuario;      // Puede ser null si nadie lo ha tomado
  gestorAsignadoId?: string | null;
  
  archivoAdjuntoUrl?: string | null;
  
  // Listas anidadas (si usas includes)
  historial?: HistorialItem[];
  comentarios?: Comentario[];
}

// --- VISTA SIMPLIFICADA (Para las Tarjetas del Listado) ---
// Esta es la que usa tu componente SolicitudCard.vue
export interface Solicitud {
  uuid: string;
  id: string;          // El número visible (TI-2024...)
  titulo: string;
  descripcion: string;
  prioridad: string;   // Ya traducido a texto: "Alta", "Media"
  tipo: string;        // Nombre del área: "TI", "Mantenimiento"
  estado: string;      // Ya traducido: "Nueva", "En Proceso"
  fecha: string;       // Formato local: "05/01/2026"
  solicitante: string; // Nombre
  responsable: string | null; // Nombre
}

// --- HISTORIAL Y COMENTARIOS ---

export interface HistorialItem {
  fecha: string;
  tipoEvento: number; // Enum TicketEventType del backend
  titulo: string;
  subtitulo: string;
  descripcion: string;
  estadoAnterior?: string;
  estadoNuevo?: string;
}

export interface Comentario {
  id: string;
  texto: string;
  fecha: string;
  usuario: Usuario; // Quién comentó
}

// --- FILTROS Y PAGINACIÓN ---

export type TabType = 'todas' | 'nueva' | 'proceso' | 'resuelta' | 'cerrada' | 'rechazada';

export interface TicketFilter {
  Page: number;
  PageSize: number;
  TextoBusqueda?: string;
  AreaId?: string;       // UUID
  Estado?: number;       // int (Enum)
  Prioridad?: number;    // int (Enum)
  FechaDesde?: string;
  FechaHasta?: string;
}

export interface PagedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalCount: number;
}