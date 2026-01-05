// // src/types/modal.ts (ARCHIVO ÚNICO DE VERDAD)

// export interface HistorialItem {
//   fecha: string ;
//   titulo: string;
//   subtitulo?: string;
//   usuario: string;
//   descripcion: string;
//   tipoEvento?: number;
// }

// export interface Ticket {
//   id: number | string; // Permitimos ambos
//   codigo: string;
//   categoria: string;
//   prioridad: string;
//   estado: string;
//   titulo: string;
//   descripcion: string;
//   solicitante: string;
//   fechaCreacion: string | Date;
//   ultimaActualizacion: string | Date;
  
//   // --- CAMPOS NUEVOS OBLIGATORIOS PARA QUE NO DE ERROR ---
//   gestorId?: string;       
//   responsable?: string;    
//   historial?: HistorialItem[]; // Opcional con '?'
//   archivoUrl?: string; 
//   archivoNombre?: string;
// }
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