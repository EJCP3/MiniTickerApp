import { ref, computed } from 'vue'
import type { Area, TipoSolicitud } from '@/types/department'

// Estado Global (para mantener la persistencia al navegar)
const areas = ref<Area[]>([
  {
    id: '1', nombre: 'Tecnología de Información', prefijo: 'TI', estado: true, responsableId: 'u1', color: 'primary',
    stats: { total: 2, activas: 2, completadas: 0, pendientesMsg: '2 solicitudes pendientes' }
  },
  {
    id: '2', nombre: 'Mantenimiento', prefijo: 'MNT', estado: true, responsableId: 'u2', color: 'warning',
    stats: { total: 4, activas: 2, completadas: 2, pendientesMsg: '1 solicitud requiere repuestos' }
  },
  {
    id: '3', nombre: 'Transporte', prefijo: 'TRS', estado: true, responsableId: 'u3', color: 'info',
    stats: { total: 12, activas: 5, completadas: 7 }
  },
  {
    id: '4', nombre: 'Compras', prefijo: 'CMP', estado: false, responsableId: 'u4', color: 'success',
    stats: { total: 8, activas: 0, completadas: 8 }
  }
])

const tiposSolicitud = ref<TipoSolicitud[]>([
  { id: 't1', areaId: '1', nombre: 'Soporte de Hardware', activo: true },
  { id: 't2', areaId: '1', nombre: 'Instalación de Software', activo: true },
  { id: 't3', areaId: '2', nombre: 'Reparación de Aire', activo: true },
])

export function useDepartments() {
  
  // KPIs
  const totalAreas = computed(() => areas.value.length)
  const activas = computed(() => areas.value.filter(a => a.estado).length)
  const inactivas = computed(() => areas.value.filter(a => !a.estado).length)
  const totalSolicitudes = computed(() => areas.value.reduce((acc, curr) => acc + curr.stats.total, 0))

  // Acciones Áreas
  const addArea = (newArea: Partial<Area>) => {
    areas.value.push({
      id: Date.now().toString(),
      nombre: newArea.nombre!,
      prefijo: newArea.prefijo!.toUpperCase(),
      estado: true,
      responsableId: newArea.responsableId!,
      color: 'secondary',
      stats: { total: 0, activas: 0, completadas: 0 }
    } as Area)
  }

  const updateArea = (updatedArea: Partial<Area>) => {
    const index = areas.value.findIndex(a => a.id === updatedArea.id)
    if (index !== -1) {
      areas.value[index] = { ...areas.value[index], ...updatedArea }
    }
  }

  // Acciones Tipos
  const getTypesByArea = (areaId: string) => {
    return computed(() => tiposSolicitud.value.filter(t => t.areaId === areaId))
  }

  const addType = (areaId: string, nombre: string) => {
    tiposSolicitud.value.push({
      id: Date.now().toString(),
      areaId,
      nombre,
      activo: true
    })
  }

  const deleteType = (id: string) => {
    tiposSolicitud.value = tiposSolicitud.value.filter(t => t.id !== id)
  }

  return {
    areas,
    totalAreas,
    activas,
    inactivas,
    totalSolicitudes,
    addArea,
    updateArea,
    getTypesByArea,
    addType,
    deleteType
  }
}