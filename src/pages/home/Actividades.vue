<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useActivityStore } from '@/stores/activityStore';
import { useActivityActions } from '@/composables/useDateTicket';

// Componentes Hijos
import BaseIcon from '@/components/BaseIcon.vue';
import TicketModal from '@/components/modal/TicketModal.vue';
import ActivityItem from './ActividadesItem.vue';
import ActivitySkeleton from './ActividadSkeleton.vue';
import { computed } from 'vue';
// 1. Datos del Store (Pinia Colada)
const activityStore = useActivityStore();
const { activities, isLoading } = storeToRefs(activityStore);

// 2. Lógica del Modal (Traída del composable)
const { 
  showModal, 
  ticketSeleccionado, 
  abrirDetalleTicket 
} = useActivityActions();




// --- NUEVO: Filtramos solo las 6 más recientes ---
const actividadesRecientes = computed(() => {
  // 1. Obtenemos la lista segura (o array vacío)
  const lista = activities.value || [];
  
  // 2. (Opcional) Aseguramos que estén ordenadas por fecha (la más nueva primero)
  // Si tu backend ya las manda ordenadas, puedes borrar esta línea del sort
  const listaOrdenada = [...lista].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  // 3. Cortamos las primeras 6
  return listaOrdenada.slice(0, 6);
});


</script>

<template>
  <section class="w-full max-w-7xl h-full flex flex-col bg-base-100 rounded-3xl shadow-lg overflow-hidden border border-base-300 relative">
    
    <header class="p-6 border-b border-base-200 bg-base-100/50 backdrop-blur-md sticky top-0 z-20">
      <div class="flex items-center gap-4">
        <div class="p-3 bg-primary/10 rounded-2xl text-primary">
          <BaseIcon name="history" class="size-10" />
        </div>
        <div>
          <h2 class="text-xl font-bold text-base-content">Actividad Reciente</h2>
          <p class="text-sm text-base-content/60">Historial de movimientos</p>
        </div>
        <button @click="activityStore.refresh()" class="ml-auto btn btn-ghost btn-circle btn-sm" title="Recargar">
           <BaseIcon name="refresh" :class="{'animate-spin': isLoading}" class="size-5"/>
        </button>
      </div>
    </header>

    <div class="flex-1 overflow-y-auto p-6 custom-scroll relative">
      
      <ActivitySkeleton v-if="isLoading && (!activities || activities.length === 0)" />

      <div v-else class="relative space-y-0">
        <div class="absolute left-5 top-2 bottom-6 w-0.5 bg-base-300/50" aria-hidden="true"></div>

        <ol class="list-none m-0 p-0">
          <ActivityItem 
            v-for="item in actividadesRecientes" 
            :key="item.id" 
            :actividad="item"
            @click="abrirDetalleTicket(item)"
          />
        </ol>
      </div>
      
      <div v-if="!isLoading && activities?.length === 0" class="flex flex-col items-center justify-center h-40 text-base-content/50">
        <BaseIcon name="folderOpen" class="h-10 w-10 mb-2 opacity-50" />
        <p>No hay actividad reciente</p>
      </div>

    </div>

    <TicketModal 
      :is-open="showModal" 
      :ticket="ticketSeleccionado" 
      @close="showModal = false" 
    />

  </section>
</template>

<style scoped>
.custom-scroll::-webkit-scrollbar { width: 5px; }
.custom-scroll::-webkit-scrollbar-thumb { background: rgba(156, 163, 175, 0.3); border-radius: 10px; }
</style>