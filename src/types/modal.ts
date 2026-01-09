
export interface UsuarioDto {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  fotoPerfilUrl?: string;
}

export interface AreaDto {
  id: string;
  nombre: string;
  responsableId?: string;
}

export interface HistorialDto {
  fecha: string; // "04/01/2026 05:38 p. m."
  titulo: string;
  subtitulo: string;
  descripcion: string;
  // Agregamos los demás campos que vi en tu JSON por si acaso
  tipoEvento?: number;
}

export interface Ticket {
  id: string;
  numero: string; // "COM-2026-0011"
  asunto: string;
  descripcion: string;
  estado: string; // "EnProceso"
  prioridad: string;
  fechaCreacion: string;
  fechaActualizacion?: string;
  
  // Objetos anidados (NO STRINGS)
  area?: AreaDto;
  tipoSolicitud?: AreaDto;
  solicitante: UsuarioDto;
  gestor?: UsuarioDto;
  
  historial: HistorialDto[];
}