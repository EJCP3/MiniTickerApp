// src/types/solicitudes.ts
export interface Solicitud {
  id: string
  tipo: string
  titulo: string
  descripcion: string
  solicitante: string
  fecha: string
  estado: 'Nueva' | 'En Proceso' | 'Resuelta' | 'Cerrada' | 'Rechazada'
  prioridad: 'Baja' | 'Media' | 'Alta' 
  responsable: string | null
}

export type TabType = 'todas' | 'nueva' | 'proceso' | 'resuelta' | 'cerrada' | 'rechazada'