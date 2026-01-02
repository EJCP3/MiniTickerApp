<script setup lang="ts">
import { ref } from 'vue';
import BaseIcon from '@/components/BaseIcon.vue'; // Importar componente
import type { IconName } from '@/utils/icons';

// Definimos la interfaz adaptada para usar IconName
interface EstadoSolicitud {
  titulo: string;
  cantidad: number;
  iconName: IconName; // Cambiado de 'icono' string a 'IconName'
  colorIcono: string;

}

const estados = ref<EstadoSolicitud[]>([
  { titulo: 'Nueva', cantidad: 2, iconName: 'clock', colorIcono: 'text-warning' },
  { titulo: 'En Proceso', cantidad: 2, iconName: 'loader', colorIcono: 'text-info',  },
  { titulo: 'Resuelta', cantidad: 1, iconName: 'pause', colorIcono: 'text-warning' }, // O usa 'check' si prefieres
  { titulo: 'Cerrada', cantidad: 1, iconName: 'checkCircle', colorIcono: 'text-success' },
  { titulo: 'Rechazada', cantidad: 0, iconName: 'xCircle', colorIcono: 'text-error' },
]);

// Datos simulados
const tasaCompletado = ref(17);
const totalSolicitudes = ref(6);
</script>

<template>
  <section 
    aria-label="Resumen de estadísticas del sistema"
    class="w-full max-w-7xl mx-auto p-4 sm:p-6 rounded-3xl shadow-lg bg-base-100 text-base-content transition-all duration-300"
  >
    
    <header class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div class="flex items-center gap-4">
        <div class="p-3 bg-base-200/50 rounded-2xl backdrop-blur-sm shadow-sm text-primary">
          <BaseIcon name="chartLine" class="h-6 w-6" />
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
    </header>

    <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-2 gap-3 sm:gap-4 mb-2">
      
      <article 
        v-for="(estado, index) in estados" 
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
            :class="`size-10 ${estado.colorIcono}`" 
          />
          <h3 class="text-[10px] sm:text-xs font-bold opacity-80 uppercase tracking-wide truncate">
            {{ estado.titulo }}
          </h3>
        </div>
        
        <dl>
          <dt class="sr-only">Cantidad de solicitudes {{ estado.titulo }}</dt>
          <dd class="text-3xl sm:text-4xl font-bold m-0">{{ estado.cantidad }}</dd>
        </dl>
      </article>

      <article class="bg-base-200/30 backdrop-blur-md rounded-2xl p-3 sm:p-5 flex flex-col justify-between h-28 sm:h-32 border border-base-content/5 shadow-sm hover:shadow-md hover:scale-105 transition-transform">
        <div class="flex justify-between items-center mb-2">
          <h3 class="text-[10px] sm:text-sm font-medium opacity-90 truncate mr-1">Completado</h3>
          <span class="text-lg sm:text-xl font-bold">{{ tasaCompletado }}%</span>
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