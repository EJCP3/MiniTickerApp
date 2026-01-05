export interface AreaStats {
  total: number
  activas: number
  completadas: number
  pendientesMsg?: string
}

export interface Area {
  id: string
  nombre: string
  prefijo: string
  activo: boolean
}

export interface TipoSolicitud {
  id: string
  areaId: string
  nombre: string
  activo: boolean
}

