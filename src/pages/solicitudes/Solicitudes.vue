<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia' // <--- Necesario para desestructurar state
import { useRouter } from 'vue-router'
import SolicitudCard from './SolicitudCard.vue'
import BaseIcon from '@/components/BaseIcon.vue'
import TicketModal from '@/components/modal/TicketModal.vue'
import { useSolicitudesStore } from '@/stores/useSolicitudesStore'
import { ref } from 'vue'

const router = useRouter()
const store = useSolicitudesStore()

// Desestructuramos el estado (Refs) usando storeToRefs
const { 
  searchTerm, 
  typeFilter, 
  priorityFilter, 
  activeTab, 
  filteredSolicitudes, 
  counts,
  areasList,
  isLoading,
} = storeToRefs(store)

// Las acciones se usan directo del store
onMounted(() => {
  store.fetchAreas()
})

const irACrear = () => router.push('/crear-solicitud')

const isModalOpen = ref(false)
const selectedTicketId = ref<string | undefined>(undefined)

const abrirTicket = (uuid: string) => {
    console.log("Abriendo ticket:", uuid);
    selectedTicketId.value = uuid;
    isModalOpen.value = true;
}

const cerrarModal = () => {
    isModalOpen.value = false;
    selectedTicketId.value = undefined;
    // Opcional: Recargar la lista al cerrar por si hubo cambios
    // store.refetch(); 
}
</script>
<template>
  <main class="min-h-screen bg-base-200 p-6 md:p-10 font-sans text-base-content">
    <div class="max-w-7xl mx-auto">
      

        <header class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-bold mb-1">Solicitudes</h1>
          <p class="text-base-content/70 text-sm">Gestión completa de solicitudes del sistema</p>
        </div>
        
        <button 
          @click="irACrear" 
          class="btn btn-primary gap-2 shadow-lg shadow-primary/20 text-white"
          aria-label="Crear nueva solicitud"
        >
          <BaseIcon name="plus" class="size-10" />
          Nueva Solicitud
        </button>
      </header>

      
      <section class="bg-base-100 p-4 rounded-box shadow-sm mb-6 border border-base-200">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          <div class="md:col-span-6">
            <label class="input input-bordered flex items-center gap-2 bg-base-200/50">
              <BaseIcon name="search" class="size-6 opacity-70" />
              <input v-model="searchTerm" type="text" class="grow" placeholder="Buscar..." />
            </label>
          </div>
          
          <div class="md:col-span-3">
            <select v-model="typeFilter" class="select select-bordered w-full bg-base-300 focus:bg-base-100">
              <option value="todos">Todas las áreas</option>
              <option v-for="area in areasList" :key="area.value" :value="area.value">
                {{ area.label }}
              </option>
            </select>
          </div>
          
          <div class="md:col-span-3">
            <select v-model="priorityFilter" class="select select-bordered w-full bg-base-300 focus:bg-base-100">
              <option value="todas">Todas las Prioridades</option> <option value="Baja">Baja</option>
              <option value="Media">Media</option>
              <option value="Alta">Alta</option>
            </select>
          </div>

        </div>
      </section>
        <nav aria-label="Filtrar por estado de solicitud" class="flex w-full flex-wrap gap-2 mb-8">
        <button 
          v-for="tab in (['todas', 'nueva', 'proceso', 'resuelta', 'cerrada', 'rechazada'] as const)" 
          :key="tab"
          @click="activeTab = tab"
          class="flex-1 btn btn-sm rounded-full font-medium transition-all duration-200 gap-2 border capitalize"
          :class="activeTab === tab 
            ? 'btn-primary shadow-md shadow-primary/30 border-primary text-white' 
            : 'btn-ghost border-base-300 text-base-content hover:bg-base-200 hover:border-base-400'"
          :aria-current="activeTab === tab ? 'page' : undefined"
        >
          {{ tab }}
          
          <span 
            class="badge badge-sm font-bold border-none" 
            :class="activeTab === tab ? 'bg-white/20 text-white' : 'bg-base-content/10 text-base-content/70'"
          >
            {{ counts[tab] || 0 }}
          </span>
        </button>
      </nav>
      <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative min-h-[200px]">
        
        <div v-if="isLoading" class="absolute inset-0 bg-base-200/50 z-10 flex items-center justify-center backdrop-blur-sm">
            <span class="loading loading-spinner loading-lg text-primary"></span>
        </div>

        <SolicitudCard 
          v-for="solicitud in filteredSolicitudes" 
          :key="solicitud.id" 
          :solicitud="solicitud"
          @click="abrirTicket(solicitud.uuid)"
        />

        <div v-if="!isLoading && filteredSolicitudes.length === 0" class="col-span-full text-center py-20 opacity-50 flex flex-col items-center">
          <BaseIcon name="search" class="h-12 w-12 mb-4 opacity-20" />
          <p class="text-xl font-bold">No se encontraron resultados</p>
          <p class="text-sm">Intenta ajustar los filtros de búsqueda</p>
        </div>

      </section>
      <TicketModal
        :is-open="isModalOpen"
        :ticket-id="selectedTicketId"
        @close="cerrarModal"
    />
    </div>
  </main>
</template>
<!-- <template>
  <main class="min-h-screen bg-base-200 p-6 md:p-10 font-sans text-base-content">
    
    <div class="max-w-7xl mx-auto">
      
      <header class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-bold mb-1">Solicitudes</h1>
          <p class="text-base-content/70 text-sm">Gestión completa de solicitudes del sistema</p>
        </div>
        
        <button 
          @click="irACrear" 
          class="btn btn-primary gap-2 shadow-lg shadow-primary/20 text-white"
          aria-label="Crear nueva solicitud"
        >
          <BaseIcon name="plus" class="size-10" />
          Nueva Solicitud
        </button>
      </header>

      <section 
        aria-label="Filtros y búsqueda"
        class="bg-base-100 p-4 rounded-box shadow-sm mb-6 border border-base-200"
      >
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          <div class="md:col-span-6">
            <label class="input input-bordered flex items-center gap-2 bg-base-200/50 focus-within:bg-base-100 transition-colors">
              <BaseIcon name="search" class="size-6 opacity-70" />
              <input 
                v-model="searchTerm" 
                type="text" 
                class="grow" 
                placeholder="Buscar por título, ID o descripción..." 
                aria-label="Buscar solicitudes"
              />
            </label>
          </div>
          
          <div class="md:col-span-3">
            <select v-model="typeFilter" class="select select-bordered w-full bg-base-300 focus:bg-base-100" aria-label="Filtrar por departamento">
              <option value="todos">Todos los ares</option>
              <option value="TI">TI</option>
              <option value="Mantenimiento">Mantenimiento</option>
              <option value="Transporte">Transporte</option>
              <option value="Compras">Compras</option>
            </select>
          </div>
          
          <div class="md:col-span-3">
            <select v-model="priorityFilter" class="select select-bordered w-full bg-base-300 focus:bg-base-100" aria-label="Filtrar por prioridad">
              <option value="todas">Prioridad</option>
              <option value="Baja">Baja</option>
              <option value="Media">Media</option>
              <option value="Alta">Alta</option>
            </select>
          </div>

        </div>
      </section>

      <nav aria-label="Filtrar por estado de solicitud" class="flex w-full flex-wrap gap-2 mb-8">
        <button 
          v-for="tab in (['todas', 'nueva', 'proceso', 'resuelta', 'cerrada', 'rechazada'] as TabType[])" 
          :key="tab"
          @click="activeTab = tab"
          class="flex-1 btn btn-sm rounded-full font-medium transition-all duration-200 gap-2 border"
          :class="activeTab === tab 
            ? 'btn-primary  shadow-md shadow-primary/30 border-primary' 
            : 'btn-ghost border-primary text-base-content hover:bg-accent hover:border-primary'"
          :aria-current="activeTab === tab ? 'page' : undefined"
        >
          {{ tab.charAt(0).toUpperCase() + tab.slice(1) }}
          <span class="badge badge-sm font-bold" :class="activeTab === tab ? 'badge-white text-primary' : 'badge-ghost'">
            {{ counts[tab] }}
          </span>
        </button>
      </nav>

      <section 
        aria-label="Lista de solicitudes"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        
        <SolicitudCard 
          v-for="solicitud in filteredSolicitudes" 
          :key="solicitud.id" 
          :solicitud="solicitud"
        />

        <div v-if="filteredSolicitudes.length === 0" class="col-span-full text-center py-20 opacity-50 flex flex-col items-center">
          <BaseIcon name="search" class="h-12 w-12 mb-4 opacity-20" />
          <p class="text-xl font-bold">No se encontraron resultados</p>
          <p class="text-sm">Intenta ajustar los filtros de búsqueda</p>
        </div>

      </section>

    </div>
  </main>
</template> -->