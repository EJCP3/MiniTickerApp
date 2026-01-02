export type RolUsuario = 'SuperAdmin' | 'Admin' | 'Gestor' | 'Solicitante'

export interface User {
  Id: string
  Nombre: string
  Email: string
  Rol: RolUsuario
  AreaId?: string 
  Activo: boolean
  FotoPerfilUrl?: string
  FechaCreacion: string
}

export const areasOptions = [
  { label: 'Tecnología (TI)', value: 'area-1' },
  { label: 'Recursos Humanos', value: 'area-2' },
  { label: 'Ventas', value: 'area-3' },
  { label: 'Marketing', value: 'area-4' },
]

export const DEFAULT_PHOTO = "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"