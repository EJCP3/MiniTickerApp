<script setup lang="ts">
// Definimos la interfaz extendida para soportar los campos opcionales de Gestores
interface TopItem {
  id?: string;
  nombre: string;
  cantidad: number;
  color?: string;
  enProceso?: number;
  // Propiedades opcionales para Gestores
  area?: string;
  resueltas?: number;
  rechazadas?: number;
  vencidas?: number;
}

defineProps<{
  title: string;
  items: TopItem[];
  icon?: string;
}>();

const emit = defineEmits(['view-profile']);

</script>

<template>
  <div class="card bg-base-100 shadow-xl h-full">
    <div class="card-body p-5">
      <div class="flex items-center gap-2 mb-4">
        <div v-if="icon" class="p-2 bg-base-200 rounded-lg">
          <i :class="`pi ${icon} text-primary`"></i>
        </div>
        <h3 class="card-title text-lg">{{ title }}</h3>

        <ul class="flex gap-4 ml-auto text-xs ">

              <li >
                <span class="flex items-center gap-1 ml-2">
                    <div class="w-3 h-3 rounded-full bg-primary"></div> En Proceso
                </span>
            </li>

            <li >
                <span class="flex items-center gap-1 ml-2">
                    <div class="w-3 h-3 rounded-full bg-success"></div> Resueltas
                </span>
            </li>
             <li >
                <span class="flex items-center gap-1 ml-2">
                    <div class="w-3 h-3 rounded-full bg-accent"></div> Rechazadas
                </span>
            </li>
            <li >
                <span class="flex items-center gap-1 ml-2">
                    <div class="w-3 h-3 rounded-full bg-error"></div> Vencidas
                </span>
            </li>
           
        </ul>
      </div>

      <div class="flex flex-col gap-3">
        <div 
          v-for="(user, index) in items" 
          @click="emit('view-profile', user)"
          :key="index"
          class="p-3 rounded-xl bg-base-200/50 hover:bg-base-200 transition-all border border-transparent hover:border-base-300"
        >
          <div class="flex items-start gap-4">
            <div class="avatar placeholder pt-1">
              <div :class="`w-12 h-12 rounded-full shadow-sm ${user.color || 'bg-neutral text-neutral-content'}`">
                <span class="text-xl font-bold">{{ user.cantidad }}</span>
              </div>
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex justify-between items-start">
                <div>
                  <h4 class="font-bold text-base truncate">{{ user.nombre }}</h4>
                  <p v-if="user.area" class="text-xs opacity-60 flex items-center gap-1">
                    <i class="pi pi-building text-[10px]"></i> {{ user.area }}
                  </p>
                  <p v-else class="text-xs opacity-50 uppercase font-bold tracking-wider">Top #{{ index + 1 }}</p>
                </div>
              </div>

              <div  class="flex gap-3 mt-2 pt-2 border-t border-base-content/5">

                  <div class="flex items-center gap-1 text-xs" title="enProceso">
                  <div class="w-2 h-2 rounded-full bg-primary"></div>
                  <span class="font-medium">{{ user.enProceso || 0 }}</span>
                </div>
                
                <div class="flex items-center gap-1 text-xs" title="Resueltas">
                  <div class="w-2 h-2 rounded-full bg-success"></div>
                  <span class="font-medium">{{ user.resueltas || 0 }}</span>
                </div>


                 <div  class="flex items-center gap-1 text-xs" title="Rechazadas">
                  <div class="w-2 h-2 rounded-full bg-accent"></div>
                  <span class="font-medium">{{ user.rechazadas || 0 }}</span>
                </div>

                
                <div class="flex items-center gap-1 text-xs" title="Vencidas">
                  <div class="w-2 h-2 rounded-full bg-error"></div>
                  <span class="font-medium">{{ user.vencidas || 0 }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="items.length === 0" class="flex flex-col items-center justify-center py-8 opacity-50">
          <i class="pi pi-inbox text-3xl mb-2"></i>
          <p class="text-sm">No hay datos disponibles</p>
        </div>
      </div>
    </div>
    
  </div>
</template>