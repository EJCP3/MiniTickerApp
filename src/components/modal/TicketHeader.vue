<script setup lang="ts">
import { computed } from 'vue';
import { useTicketFormat } from '@/composables/useTicketFormat';
import BaseIcon from '../BaseIcon.vue';
import type { Ticket } from '@/types/modal';
import { useAuthStore } from '@/stores/authStore'; // <--- 1. Importar Auth

const props = defineProps<{
  ticket: Ticket;
  activeTab: string;
}>();

defineEmits(['change-tab', 'edit-click']);

const { getBadgePrioridad, getBadgeEstado } = useTicketFormat();
const authStore = useAuthStore(); // <--- 2. Usar Store

const nombreCategoria = computed(() => {
  return props.ticket.tipoSolicitud?.nombre || props.ticket.area?.nombre || 'General';
});

// --- LÓGICA DE PERMISOS ---
const isEditable = computed(() => {
    // A. El estado debe ser "Nueva" (o 0)
    const esEstadoNuevo = props.ticket.estado === 'Nueva' || props.ticket.estado === 0;
    
    // B. El usuario logueado debe ser el MISMO que creó el ticket (Solicitante)
    // Usamos ?. por seguridad por si solicitante viene null
    const esMiTicket = authStore.user?.id === props.ticket.solicitante?.id;

    return esEstadoNuevo && esMiTicket;
});

// (El resto de tus computed tabsDisponibles sigue igual...)
const puedeCambiarEstado = computed(() => authStore.user?.rol !== 'Solicitante');
const tabsDisponibles = computed(() => {
  const tabs = ['details', 'history'];
  const estadosFinalizados = ['Cerrada', 'Rechazada', 'Resuelta'];
  if (puedeCambiarEstado.value && !estadosFinalizados.includes(props.ticket.estado)) {
    tabs.push('gestionar');
  }
  return tabs;
});
</script>

<template>
  <header class="p-6 pb-2 bg-base-100">
    <div class="flex flex-wrap items-center gap-3 mb-3">
       
       <span class="badge badge-lg border-none font-bold bg-primary/10 text-primary">{{ nombreCategoria }}</span>
       <span class="text-gray-400 font-mono text-sm font-semibold tracking-wide">{{ ticket.numero }}</span>
       <span :class="['badge badge-lg border-none font-bold', getBadgePrioridad(ticket.prioridad)]">{{ ticket.prioridad }}</span>

       <div class="ml-auto flex items-center gap-3">
           
           <button 
              v-if="isEditable" 
              @click="$emit('edit-click')"
              class="btn btn-sm btn-outline btn-primary gap-2 transition-all shadow-sm hover:shadow-md"
              title="Editar mi ticket"
           >
              <BaseIcon name="edit" class="h-4 w-4" />
              <span class="hidden sm:inline font-bold">Editar</span>
           </button>

           <div :class="['flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-bold', getBadgeEstado(ticket.estado)]">
              <BaseIcon name="infoCircle" class="h-4 w-4" />
              <span>{{ ticket.estado }}</span>
           </div>
       </div>
    </div>
    
    <h2 class="text-2xl font-extrabold text-base-content mb-6 leading-tight">
      {{ ticket.asunto }}
    </h2>

    <nav class="bg-base-200/60 p-1 rounded-xl flex gap-1 mb-2">
      <button 
        v-for="tab in tabsDisponibles" :key="tab"
        @click="$emit('change-tab', tab)" 
        class="flex-1 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 capitalize" 
        :class="activeTab === tab ? 'bg-base-100 shadow-sm text-primary' : 'text-gray-500 hover:text-base-content hover:bg-base-200/50'"
      >
        <BaseIcon v-if="tab === 'details'" name="documentText" class="h-5 w-5" />
        <BaseIcon v-if="tab === 'history'" name="history" class="h-5 w-5" />
        <BaseIcon v-if="tab === 'gestionar'" name="edit" class="h-5 w-5" />
        {{ tab === 'gestionar' ? 'Gestionar' : (tab === 'details' ? 'Detalles' : 'Historial') }}
        <span v-if="tab === 'history'" class="badge badge-sm badge-ghost font-normal">{{ ticket.historial?.length || 0 }}</span>
      </button>
    </nav>
  </header>
</template>





