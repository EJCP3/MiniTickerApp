<script setup lang="ts">

import TicketModal, { type Ticket } from '@/components/TicketModal.vue' 
import ActividadKPIs from './ActividadKPIs.vue'
import { type IconName } from '@/utils/icons' // Importamos el tipo si lo usas, opcional
import BaseIcon from '@/components/BaseIcon.vue'
import { ref, computed } from 'vue'

// --- INTERFACES ---
interface Activity {
  id: string
  ticketId: string
  area: string
  tipoEvento: 'Creación' | 'Cambio de Estado' | 'Comentario' | 'Asignación'
  titulo: string
  descripcion: string
  usuario: string
  usuarioId: string
  fecha: Date
}

// --- DATOS MOCK ---
const users = [
  { id: 'u1', name: 'Juan Gestor' },
  { id: 'u2', name: 'Carlos Técnico' },
  { id: 'u3', name: 'Ana Usuario' },
  { id: 'u4', name: 'Sistema' }
]

const areas = ['TI', 'Mantenimiento', 'Transporte', 'Compras']

const activities = ref<Activity[]>([
  {
    id: '1',
    ticketId: 'TEC-2025-042',
    area: 'TI',
    tipoEvento: 'Cambio de Estado',
    titulo: 'Fallo en servidor de correos',
    descripcion: 'Cambió el estado de "En Proceso" a "Resuelto"',
    usuario: 'Juan Gestor',
    usuarioId: 'u1',
    fecha: new Date(Date.now() - 1000 * 60 * 30)
  },
  {
    id: '2',
    ticketId: 'MNT-2025-010',
    area: 'Mantenimiento',
    tipoEvento: 'Comentario',
    titulo: 'Aire acondicionado R-2',
    descripcion: 'Se requiere comprar repuesto del compresor.',
    usuario: 'Carlos Técnico',
    usuarioId: 'u2',
    fecha: new Date(Date.now() - 1000 * 60 * 60 * 2)
  },
  {
    id: '3',
    ticketId: 'COM-2025-005',
    area: 'Compras',
    tipoEvento: 'Asignación',
    titulo: 'Solicitud de Laptops',
    descripcion: 'Ticket asignado a María Compras',
    usuario: 'Sistema',
    usuarioId: 'u4',
    fecha: new Date(Date.now() - 1000 * 60 * 60 * 5)
  },
  {
    id: '4',
    ticketId: 'TEC-2025-043',
    area: 'TI',
    tipoEvento: 'Creación',
    titulo: 'Instalación VPN',
    descripcion: 'Ticket creado por el usuario',
    usuario: 'Ana Usuario',
    usuarioId: 'u3',
    fecha: new Date(Date.now() - 1000 * 60 * 60 * 24)
  }
])

// --- FILTROS ---
const filterArea = ref('Todas')
const filterUser = ref('Todos')
const filterType = ref('Todos')

const clearFilters = () => {
  filterArea.value = 'Todas'
  filterUser.value = 'Todos'
  filterType.value = 'Todos'
}

const hasActiveFilters = computed(() => {
  return filterArea.value !== 'Todas' || filterUser.value !== 'Todos' || filterType.value !== 'Todos'
})

// --- LISTA FILTRADA ---
const filteredActivities = computed(() => {
  return activities.value.filter(act => {
    const matchArea = filterArea.value === 'Todas' || act.area === filterArea.value
    const matchUser = filterUser.value === 'Todos' || act.usuarioId === filterUser.value
    const matchType = filterType.value === 'Todos' || act.tipoEvento === filterType.value
    return matchArea && matchUser && matchType
  })
})

// --- LÓGICA DEL MODAL ---
const showModal = ref(false)
const selectedTicket = ref<Ticket | null>(null)

const openDetail = (actividad: Activity) => {
  selectedTicket.value = {
    id: actividad.id,
    codigo: actividad.ticketId,
    categoria: actividad.area,
    prioridad: 'Media',
    estado: 'En Proceso',
    titulo: actividad.titulo,
    descripcion: actividad.descripcion,
    solicitante: actividad.usuario,
    fechaCreacion: actividad.fecha.toISOString(),
    ultimaActualizacion: new Date().toISOString(),
    historial: [
      {
        titulo: actividad.tipoEvento,
        usuario: actividad.usuario,
        fecha: actividad.fecha.toISOString(),
        descripcion: actividad.descripcion
      },
      {
        titulo: 'Sistema',
        usuario: 'System',
        fecha: new Date(Date.now() - 10000000).toISOString(),
        descripcion: 'Registro anterior simulado para ver historial.'
      }
    ]
  }
  showModal.value = true
}

// --- HELPERS VISUALES ---
const getRelativeTime = (date: Date) => {
  const diffMinutes = Math.floor((new Date().getTime() - date.getTime()) / 60000)
  if (diffMinutes < 60) return `Hace ${diffMinutes} min`
  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `Hace ${diffHours} h`
  const diffDays = Math.floor(diffHours / 24)
  return `Hace ${diffDays} d`
}

// Configuración de iconos y colores
const getEventConfig = (tipo: string): { circleClass: string, iconName: IconName } => {
  switch (tipo) {
    case 'Creación':
      return {
        circleClass: 'bg-emerald-100 text-emerald-600 border-emerald-200', 
        iconName: 'plus'
      }
    case 'Cambio de Estado':
      return {
        circleClass: 'bg-blue-100 text-blue-600 border-blue-200',
        iconName: 'refresh'
      }
    case 'Comentario':
      return {
        circleClass: 'bg-orange-100 text-orange-500 border-orange-200',
        iconName: 'chat'
      }
    case 'Asignación':
      return {
        circleClass: 'bg-purple-100 text-purple-600 border-purple-200',
        iconName: 'userCheck'
      }
    default:
      return { circleClass: 'bg-gray-100 text-gray-500', iconName: 'infoCircle' as IconName }
  }
}
</script>

<template>
  <main class="min-h-screen bg-base-200 p-6 md:p-10 font-sans text-base-content">
    <div class="max-w-6xl mx-auto">
      
      <header class="mb-8">
        <h1 class="text-3xl font-bold">Actividad del Sistema</h1>
      </header>

      <ActividadKPIs :activities="activities" />

      <section 
        aria-label="Filtros de actividad"
        class=" bg-base-100 p-3 rounded-xl shadow-sm mb-10 border border-base-200 flex flex-wrap items-center gap-3"
      >
        <div class="flex items-center gap-2 px-2 text-base-content/60 font-semibold text-sm">
          <BaseIcon name="filter" class="h-6 w-6" />
          Filtros
        </div>
        
        <select v-model="filterType" class="select select-bordered select-sm focus:outline-none">
          <option>Todos</option><option>Creación</option><option>Cambio de Estado</option><option>Comentario</option><option>Asignación</option>
        </select>
        
        <select v-model="filterArea" class="select select-bordered select-sm focus:outline-none">
          <option>Todas</option><option v-for="area in areas" :key="area">{{ area }}</option>
        </select>
        
        <select v-model="filterUser" class="select select-bordered select-sm focus:outline-none">
          <option value="Todos">Todos los usuarios</option><option v-for="user in users" :key="user.id" :value="user.id">{{ user.name }}</option>
        </select>
        
        <button 
          @click="clearFilters" 
          class="btn btn-sm btn-ghost btn-circle text-error tooltip" 
          data-tip="Limpiar filtros" 
          :disabled="!hasActiveFilters"
          aria-label="Limpiar filtros"
        >
          <BaseIcon name="trash" class="h-10 w-10" />
        </button>
      </section>

      <section class="relative">
        <div class="absolute left-[2.2rem] top-4 bottom-4 w-px bg-base-300" aria-hidden="true"></div>

        <div class="flex flex-col gap-8">
          
          <article 
            v-for="actividad in filteredActivities" 
            :key="actividad.id" 
            class="relative pl-24 group"
          >
            
            <div 
              class="absolute left-4 top-0 w-12 h-12 rounded-full border flex items-center justify-center z-10 transition-transform group-hover:scale-110 bg-base-100 text-center "
              :class="getEventConfig(actividad.tipoEvento).circleClass"
            >
              <BaseIcon :name="getEventConfig(actividad.tipoEvento).iconName" class="h-10 w-10" />
            </div>

            <div 
              @click="openDetail(actividad)"
              role="button"
              tabindex="0"
              class="card bg-base-100 shadow-sm border border-base-200/60 hover:shadow-md hover:border-primary/20 transition-all cursor-pointer active:scale-[0.99]"
            >
              <div class="card-body p-5">
                <header class="flex justify-between items-start mb-1">
                  <span class="bg-base-200 text-base-content/60 px-2 py-1 rounded text-xs font-bold font-mono tracking-wide">
                    {{ actividad.ticketId }}
                  </span>
                  <time :datetime="actividad.fecha.toISOString()" class="text-xs text-base-content/40 font-medium">
                    {{ getRelativeTime(actividad.fecha) }}
                  </time>
                </header>

                <h3 class="font-bold text-base text-base-content mb-1 group-hover:text-primary transition-colors">
                  {{ actividad.titulo }}
                </h3>

                <p class="text-sm text-base-content/70 leading-relaxed">
                  <span class="font-semibold text-blue-600 hover:underline relative z-20" @click.stop>{{ actividad.usuario }}</span>
                  <span class="text-base-content/50 mx-1">:</span>
                  {{ actividad.descripcion }}
                </p>
              </div>
            </div>

          </article>

          <div v-if="filteredActivities.length === 0" class="py-12 text-center text-base-content/40 pl-24">
            <p>No hay actividad reciente.</p>
          </div>

        </div>
      </section>

    </div>

    <TicketModal 
      :is-open="showModal" 
      :ticket="selectedTicket" 
      @close="showModal = false" 
    />

  </main>
</template>