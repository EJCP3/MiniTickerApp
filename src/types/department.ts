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
  estado: boolean
  responsableId: string
  color: string
  stats: AreaStats
}

export interface TipoSolicitud {
  id: string
  areaId: string
  nombre: string
  activo: boolean
}

export const gestoresOptions = [
  { label: 'Luis Hernández (TI)', value: 'u1' },
  { label: 'Pedro Martínez (Mantenimiento)', value: 'u2' },
  { label: 'Jorge Flores (Logística)', value: 'u3' },
  { label: 'Ana López (Finanzas)', value: 'u4' },
  { label: 'María Rivera (RRHH)', value: 'u5' },
]