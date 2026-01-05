export interface User {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  fotoPerfilUrl: string; 
  activo: boolean;
  fechaCreacion: string;
}

export type RolUsuario = 'Solicitante' | 'Admin' | 'Gestor' | 'SuperAdmin';

export const areasOptions = [
  { label: 'Tecnología de la Información', value: 'area1' },
  { label: 'Mantenimiento', value: 'area2' },
  { label: 'Logística', value: 'area3' },
  { label: 'Finanzas', value: 'area4' },
  { label: 'Recursos Humanos', value: 'area5' },
];


// export interface User {
//   Id: string
//   Nombre: string
//   Email: string
//   Rol: RolUsuario
//   AreaId?: string 
//   Activo: boolean
//   FotoPerfilUrl?: string
//   FechaCreacion: string
// }

