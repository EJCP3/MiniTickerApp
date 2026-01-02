<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import BaseIcon from './BaseIcon.vue'; // Importamos el componente de iconos

export interface HistorialItem {
  titulo: string;
  usuario: string;
  fecha: string; 
  descripcion: string;
}

export interface Ticket {
  id: number | string;
  codigo: string;
  categoria: string;
  prioridad: string;
  estado: string;
  titulo: string;
  descripcion: string;
  solicitante: string;
  responsable?: string;
  fechaCreacion: string;
  ultimaActualizacion: string;
  historial: HistorialItem[];
  archivoUrl?: string; 
  archivoNombre?: string;
}

const props = defineProps<{
  isOpen: boolean;
  ticket: Ticket | null;
}>();

const emit = defineEmits(['close', 'update']);

const activeTab = ref<'details' | 'history' | 'gestionar'>('details');
const nuevoEstado = ref('');
const nuevoComentario = ref('');

const formatearFecha = (fechaStr: string): string => {
  const opciones: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  const fecha = new Date(fechaStr);
  return fecha.toLocaleDateString('es-ES', opciones);
};

watch(() => props.ticket, (newVal) => {
  if (newVal) {
    nuevoEstado.value = newVal.estado;
    activeTab.value = 'details'; 
  }
});

const badgePrioridadClass = computed(() => {
  switch (props.ticket?.prioridad.toLowerCase()) {
    case 'alta': return 'bg-red-100 text-red-600';
    case 'media': return 'bg-blue-100 text-blue-600';
    case 'baja': return 'bg-green-100 text-green-600';
    default: return 'bg-gray-100 text-gray-600';
  }
});

const cerrarModal = () => emit('close');
</script>

<template>
  <dialog class="modal" :class="{ 'modal-open': isOpen }">
    <article v-if="ticket" class="modal-box w-11/12 max-w-2xl bg-base-100 p-0 overflow-hidden rounded-2xl custom-scrollbar shadow-2xl">
      
      <button @click="cerrarModal" class="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 z-50" aria-label="Cerrar">
        <BaseIcon name="close" class="h-10 w-10" />
      </button>

      <header class="p-6 pb-2">
        <div class="flex flex-wrap items-center gap-3 mb-2">
          <span class="badge badge-ghost border-none font-medium bg-green-100 text-green-600">
            {{ ticket.categoria }}
          </span>
          <span class="text-gray-500 font-mono text-sm">{{ ticket.codigo }}</span>
          
          <span :class="['badge badge-ghost border-none font-medium', badgePrioridadClass]">
            {{ ticket.prioridad }}
          </span>
          
          <div class="ml-auto mr-8 flex gap-2">
             <div class="flex items-center gap-2 px-3 py-1 rounded-full border border-base-200 text-sm font-medium text-base-content/70">
                <BaseIcon name="infoCircle" class="h-6 w-6 text-gray-400" />
                <span>{{ ticket.estado }}</span>
             </div>
          </div>
        </div>

        <h2 class="text-2xl font-bold text-base-content mb-6 leading-tight">
          {{ ticket.titulo }}
        </h2>

        <nav class="bg-base-200 p-1 rounded-xl flex gap-1 mb-2">
          <button @click="activeTab = 'details'" 
            class="flex-1 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2" 
            :class="activeTab === 'details' ? 'bg-base-100 shadow-sm text-base-content' : 'text-gray-500 hover:text-base-content'">
            <BaseIcon name="documentText" class="h-6 w-6" /> 
            Detalles
          </button>
          
          <button @click="activeTab = 'history'" 
            class="flex-1 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2" 
            :class="activeTab === 'history' ? 'bg-base-100 shadow-sm text-base-content' : 'text-gray-500 hover:text-base-content'">
            <BaseIcon name="history" class="h-6 w-6" /> 
            Historial
            <span class="badge badge-sm badge-ghost">{{ ticket.historial?.length || 0 }}</span>
          </button>
          
           <button @click="activeTab = 'gestionar'" 
            class="flex-1 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2" 
            :class="activeTab === 'gestionar' ? 'bg-base-100 shadow-sm text-base-content' : 'text-gray-500 hover:text-base-content'">
            <BaseIcon name="edit" class="h-6 w-6" /> 
            Gestionar
          </button>
        </nav>
      </header>

      <div class="px-6 pb-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
        
        <section v-if="activeTab === 'details'" class="animate-fade-in space-y-6">
          <div class="border-b-2 border-base-200 pb-6">
            <h3 class="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">Descripción</h3>
            <div class="bg-primary/5 p-4 rounded-xl text-base-content/80 text-sm leading-relaxed mb-4 border border-primary/10">
              {{ ticket.descripcion }}
            </div>

            <div v-if="ticket.archivoUrl">
               <h3 class="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">Adjunto</h3>
               <a :href="ticket.archivoUrl" target="_blank" rel="noopener noreferrer" 
                  class="flex items-center gap-3 p-3 bg-base-200 rounded-xl hover:bg-base-300 transition-colors group cursor-pointer border border-transparent hover:border-base-content/10">
                  <div class="w-10 h-10 rounded-lg bg-base-100 flex items-center justify-center text-primary shadow-sm group-hover:scale-105 transition-transform">
                    <BaseIcon name="documentText" class="h-6 w-6" />
                  </div>
                  <div class="flex-1 overflow-hidden">
                    <p class="font-medium text-sm text-base-content truncate">{{ ticket.archivoNombre || 'Ver documento' }}</p>
                    <p class="text-xs text-gray-500">Clic para descargar / ver</p>
                  </div>
                  <BaseIcon name="search" class="h-4 w-4 text-gray-400 mr-2" />
               </a>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
            <div>
               <h3 class="text-xs font-bold text-gray-400 mb-1 flex items-center gap-2 uppercase tracking-wider">
                 <BaseIcon name="user" class="h-6 w-6" /> Solicitante
               </h3>
               <p class="font-medium text-base-content">{{ ticket.solicitante }}</p>
            </div>
            <div>
               <h3 class="text-xs font-bold text-gray-400 mb-1 flex items-center gap-2 uppercase tracking-wider">
                 <BaseIcon name="userShield" class="h-6 w-6" /> Responsable
               </h3>
               <p class="font-medium text-base-content">{{ ticket.responsable || 'Sin asignar' }}</p>
            </div>
            <div>
               <h3 class="text-xs font-bold text-gray-400 mb-1 flex items-center gap-2 uppercase tracking-wider">
                 <BaseIcon name="clock" class="h-6 w-6" /> Fecha de Creación
               </h3>
               <time :datetime="ticket.fechaCreacion" class="font-medium capitalize text-base-content">
                  {{ formatearFecha(ticket.fechaCreacion) }}
               </time>
            </div>
            <div>
               <h3 class="text-xs font-bold text-gray-400 mb-1 flex items-center gap-2 uppercase tracking-wider">
                 <BaseIcon name="refresh" class="h-6 w-6" /> Última Actualización
               </h3>
               <time :datetime="ticket.ultimaActualizacion" class="font-medium capitalize text-base-content">
                  {{ formatearFecha(ticket.ultimaActualizacion) }}
               </time>
            </div>
          </div>
        </section>

        <section v-else-if="activeTab === 'gestionar'" class="animate-fade-in space-y-6">
          <div class="border-b-2 border-base-200 pb-6">
            <h3 class="text-sm font-bold text-base-content mb-2">Cambiar Estado</h3>
            <div class="flex gap-2">
              <select v-model="nuevoEstado" class="select select-bordered bg-base-200 flex-1 w-full focus:outline-none focus:border-primary">
                <option value="Pendiente">Pendiente</option>
                <option value="En Proceso">En Proceso</option>
                <option value="Resuelta">Resuelta</option>
                <option value="Rechazada">Rechazada</option>
              </select>
              <button class="btn btn-neutral px-6">Actualizar</button>
            </div>
          </div>

          <div>
            <h3 class="text-sm font-bold text-base-content mb-2">Agregar Comentario</h3>
            <div class="form-control">
              <textarea 
                v-model="nuevoComentario"
                class="textarea textarea-bordered w-full h-24 bg-base-100 focus:outline-none focus:border-primary" 
                placeholder="Escribe un comentario o actualización..."
              ></textarea>
            </div>
            <button class="btn btn-outline btn-block mt-4 border-base-300 text-gray-600 hover:bg-base-200 hover:text-base-content hover:border-base-content/20">
              <BaseIcon name="edit" class="h-10 w-10 mr-2" /> Agregar Comentario
            </button>
          </div>
        </section>

        <section v-else-if="activeTab === 'history'" class="animate-fade-in">
          <ul class="space-y-4">
            <li v-for="(item, index) in ticket.historial" :key="index" 
                class="bg-base-100 border border-base-200 rounded-lg p-4 shadow-sm border-l-4 border-l-primary relative">
               
               <div class="flex justify-between items-start mb-2">
                 <h4 class="font-bold text-base-content">{{ item.titulo }}</h4>
                 <time class="text-xs text-gray-400 font-mono">{{ formatearFecha(item.fecha) }}</time>
               </div>
               
               <div class="text-xs uppercase tracking-wide text-gray-400 mb-3 flex items-center gap-1">
                 <BaseIcon name="user" class="h-6 w-6" />
                 <span>{{ item.usuario }}</span>
               </div>
               
               <div class="bg-base-200/50 p-3 rounded-md text-sm text-gray-600">
                 {{ item.descripcion }}
               </div>
            </li>
          </ul>

          <div v-if="!ticket.historial || ticket.historial.length === 0" class="text-center py-10 opacity-50 flex flex-col items-center">
             <BaseIcon name="history" class="h-10 w-10 mb-2 text-gray-300" />
             <p class="text-gray-500">No hay historial disponible</p>
          </div>
        </section>

      </div>
    </article>
    
    <form method="dialog" class="modal-backdrop">
      <button @click="cerrarModal">close</button>
    </form>
  </dialog>
</template>

<style scoped>
.animate-fade-in { animation: fadeIn 0.2s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
.capitalize { text-transform: capitalize; }

/* Scrollbar personalizada sutil */
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(156, 163, 175, 0.3); border-radius: 20px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: rgba(156, 163, 175, 0.5); }
</style>