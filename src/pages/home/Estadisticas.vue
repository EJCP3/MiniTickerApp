<script setup lang="ts">
import { ref } from 'vue';

// Definimos la interfaz para los datos de las tarjetas de estado
interface EstadoSolicitud {
  titulo: string;
  cantidad: number;
  icono: string; 
  colorIcono: string; 
}

const estados = ref<EstadoSolicitud[]>([
  { titulo: 'Nueva', cantidad: 2, icono: 'fa-regular fa-clock', colorIcono: 'text-warning' },
  { titulo: 'En Proceso', cantidad: 2, icono: 'fa-solid fa-spinner fa-spin', colorIcono: 'text-info' },
  { titulo: 'Resuelta', cantidad: 1, icono: 'fa-solid fa-pause', colorIcono: 'text-warning' },
  { titulo: 'Cerrada', cantidad: 1, icono: 'fa-regular fa-circle-check', colorIcono: 'text-success' },
  { titulo: 'Rechazada', cantidad: 0, icono: 'fa-regular fa-circle-xmark', colorIcono: 'text-error' }, // Corregí el icono/color para rechazada visualmente
]);

// Datos simulados para las métricas (fila inferior)
const tasaCompletado = ref(17);
const satisfaccion = ref(94);
const totalSolicitudes = ref(6);
</script>

<template>
  <div class="w-full max-w-7xl mx-auto p-4 sm:p-6 rounded-3xl shadow-lg bg-base-100 text-base-content transition-all duration-300">
    
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div class="flex items-center gap-4">
        <div class="p-3 bg-white/20 rounded-2xl backdrop-blur-sm shadow-sm">
          <i class="fa-solid fa-chart-line text-2xl"></i>
        </div>
        <div>
          <h2 class="text-xl font-bold">Estadísticas del Sistema</h2>
          <p class="text-sm text-base-content/60">Vista general de todas las solicitudes</p>
        </div>
      </div>
      
      <div class="text-left sm:text-right w-full sm:w-auto">
        <span class="text-4xl sm:text-5xl font-bold block leading-none">{{ totalSolicitudes }}</span>
        <span class="text-sm opacity-80">Total de Solicitudes</span>
      </div>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-2 gap-3 sm:gap-4 mb-2">
      
      <div 
        v-for="(estado, index) in estados" 
        :key="index"
        class="
          bg-white/10 
          backdrop-blur-md 
          rounded-2xl 
          p-3 sm:p-4 
          flex flex-col justify-between 
          h-28 sm:h-32 
          transition-transform hover:scale-105 
          border border-white/10 
          shadow-lg
        "
      >
        <div class="flex items-center gap-2 mb-2">
          <i :class="[estado.icono, estado.colorIcono]"></i>
          <span class="text-[10px] sm:text-xs font-bold opacity-80 uppercase tracking-wide truncate">{{ estado.titulo }}</span>
        </div>
        <span class="text-3xl sm:text-4xl font-bold">{{ estado.cantidad }}</span>
      </div>

      <div class="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-5 flex flex-col justify-between h-28 sm:h-32 border border-white/10 shadow-lg hover:scale-105 transition-transform">
        <div class="flex justify-between items-center mb-2">
          <span class="text-[10px] sm:text-sm font-medium opacity-90 truncate mr-1">Completado</span>
          <span class="text-lg sm:text-xl font-bold">{{ tasaCompletado }}%</span>
        </div>
        <progress class="progress progress-success w-full bg-black/20 h-2 sm:h-3" :value="tasaCompletado" max="100"></progress>
      </div>

    </div>
   
  </div>
</template>

<style scoped>
</style>