// src/composables/useSolicitudes.ts
import { ref, computed } from 'vue'
import type { Solicitud, TabType } from '@/types/solicitudes'

export function useSolicitudes() {
  // Estado
  const searchTerm = ref('')
  const typeFilter = ref('todos')
  const priorityFilter = ref('todas')
  const activeTab = ref<TabType>('todas')

  // Datos Mock
  const solicitudes = ref<Solicitud[]>([
    {
      id: 'TI-2024-001',
      tipo: 'TI',
      titulo: 'Instalación de software AutoCAD',
      descripcion: 'Necesito instalación de AutoCAD 2024 en mi equipo de trabajo.',
      solicitante: 'Juan Pérez',
      fecha: '15 dic 2024',
      estado: 'Nueva',
      prioridad: 'Media',
      responsable: null
    },
    {
      id: 'MNT-2024-015',
      tipo: 'Mantenimiento',
      titulo: 'Reparación de aire acondicionado',
      descripcion: 'El aire acondicionado de la sala de reuniones no funciona.',
      solicitante: 'María García',
      fecha: '14 dic 2024',
      estado: 'En Proceso',
      prioridad: 'Alta',
      responsable: 'Pedro Martínez'
    },
    {
      id: 'TRS-2024-042',
      tipo: 'Transporte',
      titulo: 'Vehículo para visita a cliente',
      descripcion: 'Requiero vehículo para visita a cliente en Guadalajara.',
      solicitante: 'Laura Mendoza',
      fecha: '10 dic 2024',
      estado: 'Resuelta',
      prioridad: 'Media',
      responsable: 'Jorge Flores'
    },
    {
      id: 'CMP-2024-089',
      tipo: 'Compras',
      titulo: 'Material de oficina',
      descripcion: 'Se requiere compra de papelería básica.',
      solicitante: 'Roberto Silva',
      fecha: '08 dic 2024',
      estado: 'Cerrada',
      prioridad: 'Baja',
      responsable: 'Claudia López'
    },
    {
      id: 'TI-2024-002',
      tipo: 'TI',
      titulo: 'Fallo crítico servidor',
      descripcion: 'El servidor principal se reinició solo.',
      solicitante: 'Admin',
      fecha: '16 dic 2024',
      estado: 'Nueva',
      prioridad: 'Alta',
      responsable: null
    }
  ])

  // Lógica de Filtrado
  const filteredSolicitudes = computed(() => {
    return solicitudes.value.filter(solicitud => {
      const term = searchTerm.value.toLowerCase()
      const matchesSearch = 
        solicitud.id.toLowerCase().includes(term) ||
        solicitud.titulo.toLowerCase().includes(term) ||
        solicitud.solicitante.toLowerCase().includes(term)
      
      const matchesType = typeFilter.value === 'todos' || solicitud.tipo === typeFilter.value
      const matchesPriority = priorityFilter.value === 'todas' || solicitud.prioridad === priorityFilter.value
      
      const matchesTab = 
        activeTab.value === 'todas' ||
        (activeTab.value === 'nueva' && solicitud.estado === 'Nueva') ||
        (activeTab.value === 'proceso' && solicitud.estado === 'En Proceso') ||
        (activeTab.value === 'resuelta' && solicitud.estado === 'Resuelta') ||
        (activeTab.value === 'cerrada' && solicitud.estado === 'Cerrada') ||
        (activeTab.value === 'rechazada' && solicitud.estado === 'Rechazada')
      
      return matchesSearch && matchesType && matchesPriority && matchesTab
    })
  })

  // Contadores
  const counts = computed(() => {
    return {
      todas: solicitudes.value.length,
      nueva: solicitudes.value.filter(s => s.estado === 'Nueva').length,
      proceso: solicitudes.value.filter(s => s.estado === 'En Proceso').length,
      resuelta: solicitudes.value.filter(s => s.estado === 'Resuelta').length,
      cerrada: solicitudes.value.filter(s => s.estado === 'Cerrada').length,
      rechazada: solicitudes.value.filter(s => s.estado === 'Rechazada').length
    }
  })

  return {
    searchTerm,
    typeFilter,
    priorityFilter,
    activeTab,
    filteredSolicitudes,
    counts
  }
}