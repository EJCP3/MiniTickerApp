<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// --- INTERFACES ---
interface Solicitud {
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

type TabType = 'todas' | 'nueva' | 'proceso' | 'resuelta' | 'cerrada' | 'rechazada'

// --- ESTADO ---
const searchTerm = ref('')
const typeFilter = ref('todos')
const priorityFilter = ref('todas')
const activeTab = ref<TabType>('todas')

// Datos simulados
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

// --- COMPUTADOS ---
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

// --- HELPERS VISUALES ---

// 1. NUEVA FUNCIÓN: Color del Borde según PRIORIDAD (3 colores)
const getPriorityBorder = (prioridad: string) => {
  const map: Record<string, string> = {
    'Baja': 'border-l-emerald-500',   // Verde (Tranquilo)
    'Media': 'border-l-orange-400',   // Naranja (Atención)
    'Alta': 'border-l-red-600',       // Rojo (Peligro)
  }
  return map[prioridad] || 'border-l-gray-300'
}

// 2. Configuración de Badges por TIPO (Mantenemos los colores de los badges)
const getTypeConfig = (tipo: string) => {
  const map: Record<string, { badgeBg: string, badgeText: string }> = {
    'TI': { badgeBg: 'bg-purple-100', badgeText: 'text-purple-700' },
    'Mantenimiento': { badgeBg: 'bg-orange-100', badgeText: 'text-orange-700' },
    'Transporte': { badgeBg: 'bg-emerald-100', badgeText: 'text-emerald-700' },
    'Compras': { badgeBg: 'bg-teal-100', badgeText: 'text-teal-700' }
  }
  return map[tipo] || { badgeBg: 'bg-gray-100', badgeText: 'text-gray-700' }
}

// 3. Estilos de badge prioridad (Texto e interior)
const getPriorityBadgeClass = (prioridad: string) => {
  const map: Record<string, string> = {
    'Baja': 'bg-emerald-50 text-emerald-700 border-emerald-100',
    'Media': 'bg-orange-50 text-orange-700 border-orange-100',
    'Alta': 'bg-red-50 text-red-700 border-red-100',
  }
  return map[prioridad] || 'bg-gray-50'
}

// 4. Estilos de badge estado
const getStatusClass = (estado: string) => {
  const map: Record<string, string> = {
    'Nueva': 'badge-warning bg-yellow-100 text-yellow-800 border-none',
    'En Proceso': 'badge-info bg-blue-100 text-blue-800 border-none',
    'Resuelta': 'badge-success bg-green-100 text-green-800 border-none',
    'Cerrada': 'bg-gray-200 text-gray-600 border-none',
    'Rechazada': 'badge-error bg-red-100 text-red-800 border-none'
  }
  return map[estado] || 'badge-ghost'
}

const irACrear = () => router.push('/crear-solicitud')
</script>

<template>
  <div class="min-h-screen bg-base-200 p-6 md:p-10 font-sans text-base-content">
    
    <div class="max-w-7xl mx-auto">
      
      <header class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-bold mb-1">Solicitudes</h1>
          <p class="text-base-content/70 text-sm">Gestión completa de solicitudes del sistema</p>
        </div>
        
        <button 
          @click="irACrear"
          class="btn btn-primary gap-2 shadow-lg shadow-primary/20 text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Nueva Solicitud
        </button>
      </header>

      <div class="bg-base-100 p-4 rounded-box shadow-sm mb-6 border border-base-200">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div class="md:col-span-6">
            <label class="input input-bordered flex items-center gap-2 bg-base-200/50">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 opacity-70"><path fill-rule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clip-rule="evenodd" /></svg>
              <input v-model="searchTerm" type="text" class="grow" placeholder="Buscar..." />
            </label>
          </div>
          <div class="md:col-span-3">
            <select v-model="typeFilter" class="select select-bordered w-full bg-base-200/50">
              <option value="todos">Todos los tipos</option>
              <option value="TI">TI</option>
              <option value="Mantenimiento">Mantenimiento</option>
              <option value="Transporte">Transporte</option>
              <option value="Compras">Compras</option>
            </select>
          </div>
          <div class="md:col-span-3">
            <select v-model="priorityFilter" class="select select-bordered w-full bg-base-200/50">
              <option value="todas">Prioridad</option>
              <option value="Baja">Baja</option>
              <option value="Media">Media</option>
              <option value="Alta">Alta</option>
            </select>
          </div>
        </div>
      </div>

      <div class="flex w-full flex-wrap gap-2 mb-8">
        <button 
          v-for="tab in (['todas', 'nueva', 'proceso', 'resuelta', 'cerrada', 'rechazada'] as TabType[])" 
          :key="tab"
          @click="activeTab = tab"
          class="flex-1 btn btn-sm rounded-full font-medium transition-all duration-200 gap-2 border"
          :class="activeTab === tab 
            ? 'btn-primary text-white shadow-md shadow-primary/30 border-primary' 
            : 'btn-ghost bg-white border-base-200 text-base-content/70 hover:bg-base-200'"
        >
          {{ tab.charAt(0).toUpperCase() + tab.slice(1) }}
          <span class="badge badge-sm font-bold" :class="activeTab === tab ? 'badge-white text-primary' : 'badge-ghost'">
            {{ counts[tab] }}
          </span>
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <div 
          v-for="solicitud in filteredSolicitudes" 
          :key="solicitud.id"
          class="card bg-base-100 shadow-sm hover:shadow-lg transition-all duration-300 border border-base-200 h-full border-l-[6px]"
          :class="getPriorityBorder(solicitud.prioridad)"
        >
          <div class="card-body p-6">
            
            <div class="flex justify-between items-start mb-2">
              <div class="flex items-center gap-2">
                <span class="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide"
                  :class="[getTypeConfig(solicitud.tipo).badgeBg, getTypeConfig(solicitud.tipo).badgeText]"
                >
                  {{ solicitud.tipo }}
                </span>
                <span class="text-xs text-base-content/50 font-mono font-medium">{{ solicitud.id }}</span>
              </div>
              
              <span class="px-2 py-0.5 rounded-full text-xs font-semibold border"
                :class="getPriorityBadgeClass(solicitud.prioridad)"
              >
                {{ solicitud.prioridad }}
              </span>
            </div>

            <div class="mb-4">
              <h3 class="font-bold text-lg text-base-content leading-tight mb-2 hover:text-primary transition-colors cursor-pointer">
                {{ solicitud.titulo }}
              </h3>
              <p class="text-sm text-base-content/70 line-clamp-3 leading-relaxed">
                {{ solicitud.descripcion }}
              </p>
            </div>

            <div class="mt-auto space-y-3">
              <div class="flex justify-between items-end">
                <div class="space-y-1.5">
                  <div class="flex items-center gap-2 text-xs text-base-content/60 font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {{ solicitud.solicitante }}
                  </div>
                  <div class="flex items-center gap-2 text-xs text-base-content/60">
                     <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {{ solicitud.fecha }}
                  </div>
                </div>
                <span class="badge badge-sm font-semibold" :class="getStatusClass(solicitud.estado)">
                  {{ solicitud.estado }}
                </span>
              </div>

              <div v-if="solicitud.responsable" class="bg-base-200/60 rounded-lg p-2.5 flex items-center gap-2 mt-3">
                 <span class="text-[10px] uppercase font-bold text-base-content/40 tracking-wider">Responsable:</span>
                 <span class="text-xs font-semibold text-base-content/80">{{ solicitud.responsable }}</span>
              </div>
              <div v-else class="h-[38px]"></div>
            </div>

          </div>
        </div>

        <div v-if="filteredSolicitudes.length === 0" class="col-span-full text-center py-20 opacity-50">
          <p class="text-xl font-bold">No se encontraron resultados</p>
        </div>

      </div>

    </div>
  </div>
</template>