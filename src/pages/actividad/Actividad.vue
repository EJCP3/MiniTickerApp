<script setup lang="ts">
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
  { id: 'u1', name: 'Carlos Ruiz' },
  { id: 'u2', name: 'Pedro Martínez' },
  { id: 'u3', name: 'Juan Pérez' },
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
    fecha: new Date(Date.now() - 1000 * 60 * 30) // Hace 30 min
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
    fecha: new Date(Date.now() - 1000 * 60 * 60 * 2) // Hace 2 h
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
    fecha: new Date(Date.now() - 1000 * 60 * 60 * 5) // Hace 5 h
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
    fecha: new Date(Date.now() - 1000 * 60 * 60 * 24) // Hace 1 d
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

// --- COMPUTADOS ---
const filteredActivities = computed(() => {
  return activities.value.filter(act => {
    const matchArea = filterArea.value === 'Todas' || act.area === filterArea.value
    const matchUser = filterUser.value === 'Todos' || act.usuarioId === filterUser.value
    const matchType = filterType.value === 'Todos' || act.tipoEvento === filterType.value
    return matchArea && matchUser && matchType
  })
})

const hasActiveFilters = computed(() => {
  return filterArea.value !== 'Todas' || filterUser.value !== 'Todos' || filterType.value !== 'Todos'
})

// KPIs
const totalCount = computed(() => activities.value.length)
const todayCount = computed(() => {
  const now = new Date()
  return activities.value.filter(a => a.fecha.toDateString() === now.toDateString()).length
})
const weekCount = computed(() => {
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  return activities.value.filter(a => a.fecha >= oneWeekAgo).length
})

// --- HELPERS VISUALES ---
const getRelativeTime = (date: Date) => {
  const diffMinutes = Math.floor((new Date().getTime() - date.getTime()) / 60000)
  if (diffMinutes < 60) return `Hace ${diffMinutes} min`
  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `Hace ${diffHours} h`
  const diffDays = Math.floor(diffHours / 24)
  return `Hace ${diffDays} d`
}

// CONFIGURACIÓN DE ICONOS Y COLORES (Basado en la imagen)
const getEventConfig = (tipo: string) => {
  switch (tipo) {
    case 'Creación':
      return {
        // Verde (Círculo verde claro, icono verde oscuro)
        circleClass: 'bg-emerald-100 text-emerald-600 border-emerald-200', 
        icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>'
      }
    case 'Cambio de Estado':
      return {
        // Azul (Círculo azul claro, icono azul)
        circleClass: 'bg-blue-100 text-blue-600 border-blue-200',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>'
      }
    case 'Comentario':
      return {
        // Naranja/Amarillo
        circleClass: 'bg-orange-100 text-orange-500 border-orange-200',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>'
      }
    case 'Asignación':
      return {
        // Morado
        circleClass: 'bg-purple-100 text-purple-600 border-purple-200',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /><path stroke-linecap="round" stroke-linejoin="round" d="M9 14l2 2 4-4" /></svg>'
      }
    default:
      return { circleClass: 'bg-gray-100 text-gray-500', icon: '' }
  }
}
</script>

<template>
  <div class="min-h-screen bg-base-200 p-6 md:p-10 font-sans text-base-content">
    <div class="max-w-6xl mx-auto">
      
     <div class="mb-8">
        <h1 class="text-3xl font-bold">Actividad del Sistema</h1>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div class="card bg-base-100 shadow-sm border border-base-200">
          <div class="card-body p-5 flex-row items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg></div>
            <div><div class="text-xs opacity-50 font-bold uppercase">Total Actividades</div><div class="text-2xl font-black">{{ totalCount }}</div></div>
          </div>
        </div>
        <div class="card bg-base-100 shadow-sm border border-base-200">
          <div class="card-body p-5 flex-row items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
            <div><div class="text-xs opacity-50 font-bold uppercase">Hoy</div><div class="text-2xl font-black">{{ todayCount }}</div></div>
          </div>
        </div>
        <div class="card bg-base-100 shadow-sm border border-base-200">
          <div class="card-body p-5 flex-row items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg></div>
            <div><div class="text-xs opacity-50 font-bold uppercase">Esta Semana</div><div class="text-2xl font-black">{{ weekCount }}</div></div>
          </div>
        </div>
      </div>

      <div class="bg-base-100 p-3 rounded-xl shadow-sm mb-10 border border-base-200 flex flex-wrap items-center gap-3">
        <div class="flex items-center gap-2 px-2 text-base-content/60 font-semibold text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clip-rule="evenodd" /></svg>
          Filtros
        </div>
        <select v-model="filterType" class="select select-bordered select-sm">
          <option>Todos</option><option>Creación</option><option>Cambio de Estado</option><option>Comentario</option><option>Asignación</option>
        </select>
        <select v-model="filterArea" class="select select-bordered select-sm">
          <option>Todas</option><option v-for="area in areas" :key="area">{{ area }}</option>
        </select>
        <select v-model="filterUser" class="select select-bordered select-sm">
          <option value="Todos">Todos los usuarios</option><option v-for="user in users" :key="user.id" :value="user.id">{{ user.name }}</option>
        </select>
        <button @click="clearFilters" class="btn btn-sm btn-ghost btn-circle text-error tooltip" data-tip="Limpiar">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
      </div>

      <div class="relative">
        
        <div class="absolute left-[2.2rem] top-4 bottom-4 w-px bg-base-300"></div>

        <div class="flex flex-col gap-8"> <div v-for="actividad in filteredActivities" :key="actividad.id" class="relative pl-24 group">
            
            <div 
              class="absolute left-4 top-0 w-12 h-12 rounded-full border flex items-center justify-center z-10 transition-transform group-hover:scale-110 bg-base-100"
              :class="getEventConfig(actividad.tipoEvento).circleClass"
              v-html="getEventConfig(actividad.tipoEvento).icon"
            >
              </div>

            <div class="card bg-base-100 shadow-sm border border-base-200/60 hover:shadow-md transition-shadow">
              <div class="card-body p-5">
                
                <div class="flex justify-between items-start mb-1">
                  <span class="bg-base-200 text-base-content/60 px-2 py-1 rounded text-xs font-bold font-mono tracking-wide">
                    {{ actividad.ticketId }}
                  </span>
                  <span class="text-xs text-base-content/40 font-medium">
                    {{ getRelativeTime(actividad.fecha) }}
                  </span>
                </div>

                <h3 class="font-bold text-base text-base-content mb-1">
                  {{ actividad.titulo }}
                </h3>

                <p class="text-sm text-base-content/70 leading-relaxed">
                  <span class="font-semibold text-blue-600 cursor-pointer hover:underline">
                    {{ actividad.usuario }}
                  </span>
                  <span class="text-base-content/50 mx-1">:</span>
                  {{ actividad.descripcion }}
                </p>

              </div>
            </div>

          </div>

          <div v-if="filteredActivities.length === 0" class="py-12 text-center text-base-content/40 pl-24">
            No hay actividad reciente.
          </div>

        </div>
      </div>

    </div>
  </div>
</template>