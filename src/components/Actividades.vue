<script setup lang="ts">
import { ref } from 'vue';

interface Actividad {
  id: number;
  tipo: string;
  descripcion: string;
  detalle?: string;
  usuario: string;
  tiempo: string;
}


const actividades = ref<Actividad[]>([
  {
    id: 1,
    tipo: 'Solicitud creada',
    descripcion: 'MNT-2024-016 - Cambio de luminarias',
    usuario: 'Carlos Ruiz',
    tiempo: 'Hace 380d'
  },
  {
    id: 2,
    tipo: 'Estado actualizado a En Proceso',
    descripcion: 'MNT-2024-015 - Reparación de aire acondicionado',
    usuario: 'Pedro Martínez',
    tiempo: 'Hace 380d'
  },
  {
    id: 3,
    tipo: 'Solicitud creada',
    descripcion: 'TI-2024-001 - Instalación de software AutoCAD',
    detalle: 'Se creó la solicitud para instalación de software',
    usuario: 'Juan Pérez',
    tiempo: 'Hace 380d'
  },
  {
    id: 4,
    tipo: 'Estado actualizado a En Proceso',
    descripcion: 'TI-2024-002 - Reseteo de contraseña',
    usuario: 'Luis Hernández',
    tiempo: 'Hace 380d'
  },
  {
    id: 5,
    tipo: 'Solicitud creada',
    descripcion: 'TI-2024-002 - Reseteo de contraseña',
    usuario: 'Diana Torres',
    tiempo: 'Hace 380d'
  },
  {
    id: 6,
    tipo: 'Solicitud asignada',
    descripcion: 'MNT-2024-015 - Reparación de aire acondicionado',
    usuario: 'Sistema', 
    tiempo: 'Hace 380d'
  }
]);
</script>

<template>
  <div class="p-6 rounded-3xl shadow-xl bg-base-200 text-base-content w-full h-full">
    
    <div class="flex items-center gap-4 mb-6">
      <div class="p-3 bg-white/20 rounded-2xl backdrop-blur-sm shadow-sm">
        <i class="fa-solid fa-chart-line text-2xl"></i> </div>
      <div>
        <h2 class="text-xl font-bold">Actividad del Sistema</h2>
        <p class="text-sm opacity-80 text-primary-content/80">Últimos eventos</p>
      </div>
    </div>

    <div class="flex flex-col gap-3 max-h-150 overflow-y-auto pr-2 custom-scroll">
      
      <div 
        v-for="actividad in actividades" 
        :key="actividad.id"
        class="
          bg-white/10 
          backdrop-blur-md 
          rounded-xl 
          p-4 
          border border-white/10 
          hover:bg-white/15 
          transition-colors
        "
      >
        <div class="flex items-start gap-3 mb-1">
          <div class="mt-1.5 w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(255,255,255,0.6)]"></div>
          
          <div class="flex-1">
            <h3 class="font-bold text-base leading-tight">{{ actividad.tipo }}</h3>
            <p class="text-sm opacity-90 mt-1">{{ actividad.descripcion }}</p>
            
            <p v-if="actividad.detalle" class="text-xs opacity-70 mt-1 italic">
              {{ actividad.detalle }}
            </p>
          </div>
        </div>

        <div class="flex justify-between items-end mt-3 pl-5">
          <span class="text-xs font-medium opacity-60">{{ actividad.usuario }}</span>
          <div class="flex items-center gap-1 text-xs opacity-60">
            <i class="fa-regular fa-clock"></i>
            <span>{{ actividad.tiempo }}</span>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<style scoped>

.custom-scroll::-webkit-scrollbar {
  width: 6px;
}
.custom-scroll::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}
.custom-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

</style>