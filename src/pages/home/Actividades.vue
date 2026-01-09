
<script setup lang="ts">
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useActivityStore } from '@/stores/activityStore';
// 👇 1. IMPORTAR AUTH STORE
import { useAuthStore } from '@/stores/authStore'; 
import { useActivityActions } from '@/composables/useDateTicket';
import type { ActivityItem } from '@/types/activity';

import BaseIcon from '@/components/BaseIcon.vue';
import TicketModal from '@/components/modal/TicketModal.vue';
import ActivityItemComponent from './ActividadesItem.vue';
import ActivitySkeleton from './ActividadSkeleton.vue';
import ActivityDetailModal from '@/components/ActivityDetailModal.vue';

const activityStore = useActivityStore();
const { myActivitiesList, isLoadingMine } = storeToRefs(activityStore);
const { refreshMine } = activityStore;

// 👇 2. INSTANCIAR AUTH STORE
const authStore = useAuthStore();

const { 
  showModal, 
  ticketSeleccionado, 
  abrirDetalleTicket 
} = useActivityActions();

const showSystemModal = ref(false);
const systemActivitySelected = ref<ActivityItem | null>(null);

const manejarClickActividad = (item: ActivityItem) => {
  if (item.ticketId) {
    abrirDetalleTicket(item);
  } else {
    systemActivitySelected.value = item;
    showSystemModal.value = true;
  }
};

// --- PROPIEDADES COMPUTADAS MODIFICADA ---
const actividadesRecientes = computed(() => {
  let lista = [...(myActivitiesList.value || [])];
  
  // 👇 3. LÓGICA DE FILTRADO POR ROL
  const userRole = authStore.user?.rol;
  const esAdmin = userRole === 'Admin' || userRole === 'SuperAdmin';

  // Si NO es admin, filtramos para dejar SOLO lo que tenga ticketId (ocultamos sistema)
  if (!esAdmin) {
    lista = lista.filter(item => item.ticketId !== null && item.ticketId !== undefined);
  }

  // 4. Ordenamos y cortamos (igual que antes)
  return lista
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .slice(0, 6);
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
        <button 
          @click="refreshMine" 
          class="ml-auto btn btn-ghost btn-circle btn-sm" 
          title="Recargar"
        >
           <BaseIcon name="refresh" :class="{'animate-spin': isLoadingMine}" class="size-5"/>
        </button>
      </div>
    </header>

    <div class="flex-1 overflow-y-auto p-6 custom-scroll relative">
      
      <ActivitySkeleton v-if="isLoadingMine && (!myActivitiesList || myActivitiesList.length === 0)" />

      <div v-else class="relative space-y-0">
        <div class="absolute left-5 top-2 bottom-6 w-0.5 bg-base-300/50" aria-hidden="true"></div>

        <ol class="list-none m-0 p-0">
          <ActivityItemComponent 
            v-for="item in actividadesRecientes" 
            :key="item.id" 
            :actividad="item"
            @click="manejarClickActividad(item)" 
          />
        </ol>
      </div>
      
      <div v-if="!isLoadingMine && myActivitiesList?.length === 0" class="flex flex-col items-center justify-center h-40 text-base-content/50">
        <BaseIcon name="folderOpen" class="h-10 w-10 mb-2 opacity-50" />
        <p>No hay actividad reciente</p>
      </div>
    </div>

    <TicketModal 
      :is-open="showModal" 
      :ticket="ticketSeleccionado" 
      @close="showModal = false" 
    />

    <ActivityDetailModal
      :is-open="showSystemModal"
      :activity="systemActivitySelected"
      @close="showSystemModal = false"
    />

  </section>
</template>

<style scoped>
.custom-scroll::-webkit-scrollbar { width: 5px; }
.custom-scroll::-webkit-scrollbar-thumb { background: rgba(156, 163, 175, 0.3); border-radius: 10px; }
</style>