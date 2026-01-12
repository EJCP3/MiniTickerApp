export interface User {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  fotoPerfilUrl: string;
  activo: boolean;
  fechaCreacion: string;
  areaId?: string;
  areaNombre?: string;
  debeCambiarPassword?: boolean;
}

export type RolUsuario = "Solicitante" | "Admin" | "Gestor" | "SuperAdmin";

export const areasOptions = [
  { label: "Tecnología de la Información", value: "area1" },
  { label: "Mantenimiento", value: "area2" },
  { label: "Logística", value: "area3" },
  { label: "Finanzas", value: "area4" },
  { label: "Recursos Humanos", value: "area5" },
];

