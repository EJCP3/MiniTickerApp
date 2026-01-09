<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import BaseIcon from '@/components/BaseIcon.vue';
import { useSolicitudesStore } from '@/stores/useSolicitudesStore';
import { useAuthStore } from '@/stores/authStore';
// 1. Inicializar Store
const store = useSolicitudesStore();
const { counts, isLoading } = storeToRefs(store);


const authStore = useAuthStore();

// 2. Computed para el Total
const totalTickets = computed(() => counts.value.todas);

// 3. Tasa de Completado
const tasaCompletado = computed(() => {
    const total = totalTickets.value;
    if (total === 0) return 0;
    
    // Usamos los contadores del store (Resuelta + Cerrada)
    // Esto es más exacto que filtrar la lista visual porque incluye todo el historial
    const completados = counts.value.resuelta + counts.value.cerrada;
    
    return Math.round((completados / total) * 100);
});

// 4. Array de Estadísticas para el v-for
const estadisticas = computed(() => [
    {
    titulo: "Nueva",
    cantidad: counts.value.nueva,
    iconName: "clock",
    colorIcono: "text-warning",
    },
    {
    titulo: "En Proceso",
    cantidad: counts.value.proceso,
    iconName: "loader",
    colorIcono: "text-info",
    },
    {
    titulo: "Resuelta",
    cantidad: counts.value.resuelta,
    iconName: "check",
    colorIcono: "text-warning", // O text-success si prefieres verde
    },
    {
    titulo: "Cerrada",
    cantidad: counts.value.cerrada,
    iconName: "checkCircle",
    colorIcono: "text-success",
    },
    {
    titulo: "Rechazada",
    cantidad: counts.value.rechazada,
    iconName: "xCircle",
    colorIcono: "text-error",
    },
]);
</script>

<template>
  <section 
    aria-label="Resumen de estadísticas del sistema"
    class="w-full max-w-8xl mx-auto p-4 sm:p-6 rounded-3xl shadow-lg bg-base-100 text-base-content transition-all duration-300"
  >
    
    <header class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div class="flex items-center gap-4">
        <div class="w-15 p-3 bg-base-200/50 rounded-2xl backdrop-blur-sm shadow-sm text-primary">
          <BaseIcon name="history" class="size-10" /> 
        </div>
        <div>
         <h2 class="text-xl font-bold">
            {{ authStore.user?.rol === 'Solicitante' ? 'Mi Resumen' : 'Estadísticas del Sistema' }}
          </h2>
          <p class="text-sm text-base-content/60">
            {{ authStore.user?.rol === 'Solicitante' ? 'Estado de tus solicitudes' : 'Vista general de la plataforma' }}
          </p>
        </div>
      </div>
      
      <div class="text-left sm:text-right w-full sm:w-auto">
        <span v-if="isLoading" class="loading loading-spinner loading-lg"></span>
        <span v-else class="text-4xl sm:text-5xl font-bold block leading-none">{{ counts.todas }}</span>
        
        <span class="text-sm opacity-80">Total de Solicitudes</span>
      </div>
    </header>

    <div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4 mb-2">
      
      <article 
        v-for="(estado, index) in estadisticas" 
        :key="index"
        class="
          bg-base-200/30 
          backdrop-blur-md 
          rounded-2xl 
          p-3 sm:p-4 
          flex flex-col justify-between 
          h-28 sm:h-32 
          transition-transform hover:scale-105 
          border border-base-content/5 
          shadow-sm hover:shadow-md
        "
      >
        <div class="flex items-center gap-2 mb-2 w-10/12 ">
          <BaseIcon 
            :name="estado.iconName" 
            :class="`size-8 sm:size-10 ${estado.colorIcono}`" 
          />
          <h3 class="text-[10px] sm:text-xs font-bold opacity-80 uppercase tracking-wide truncate">
            {{ estado.titulo }}
          </h3>
        </div>
        
        <dl>
          <dt class="sr-only">Cantidad de solicitudes {{ estado.titulo }}</dt>
          <dd class="text-3xl sm:text-4xl font-bold m-0">
             <span v-if="isLoading" class="loading loading-dots loading-sm"></span>
             <span v-else>{{ estado.cantidad }}</span>
          </dd>
        </dl>
      </article>

      <article class="bg-base-200/30 backdrop-blur-md rounded-2xl p-3 sm:p-5 flex flex-col justify-between h-28 sm:h-32 border border-base-content/5 shadow-sm hover:shadow-md hover:scale-105 transition-transform">
        <div class="flex justify-between items-center mb-2">
          <h3 class="text-[10px] sm:text-sm font-medium opacity-90 truncate mr-1">Completado</h3>
          <span class="text-lg sm:text-xl font-bold">
             <span v-if="isLoading">...</span>
             <span v-else>{{ tasaCompletado }}%</span>
          </span>
        </div>
        
        <div class="w-full">
           <label for="progress-bar" class="sr-only">Porcentaje de completado</label>
           <progress 
             id="progress-bar" 
             class="progress progress-success w-full bg-base-300 h-2 sm:h-3" 
             :value="tasaCompletado" 
             max="100"
           >
             {{ tasaCompletado }}%
           </progress>
        </div>
      </article>

    </div>
   
  </section>
</template>