<script setup lang="ts">
import BaseIcon from '@/components/BaseIcon.vue'
import type { IconName } from '@/utils/icons'
import { useActivityUI } from '@/composables/useActivityUI';


const { getActivityConfig } = useActivityUI();

// Interfaces
interface Actividad {
  id: string | number
  tipo: string
  fecha: string
  titulo: string
  mensaje: string
  ticketId?: string
}

const props = defineProps<{
  actividad: Actividad
}>()

const emit = defineEmits(['click'])


</script>

<template>
  <article class="relative pl-24 group">
    <div 
      class="absolute left-4 top-0 w-12 h-12 rounded-full border flex items-center justify-center z-10 transition-transform group-hover:scale-110 bg-base-100 text-center shadow-sm"
      :class="getActivityConfig(actividad.tipo).circleClass"
    >
      <BaseIcon :name="getActivityConfig(actividad.tipo).iconName" class="h-6 w-6" />
    </div>

    <div 
      @click="emit('click', actividad)"
      role="button"
      class="card bg-base-100 shadow-sm border border-base-200/60 hover:shadow-md hover:border-primary/20 transition-all cursor-pointer active:scale-[0.99]"
    >
      <div class="card-body p-5">
        <header class="flex justify-between items-start mb-1">
          <div class="flex gap-2">
            <span class="bg-base-200 text-base-content/60 px-2 py-1 rounded text-[10px] font-bold font-mono tracking-widest uppercase">
              {{ actividad.ticketId ? 'TICKET' : 'SISTEMA' }}
            </span>
          </div>
          <time class="text-xs text-base-content/40 font-medium italic">
            {{ actividad.fecha }}
          </time>
        </header>

        <h3 class="font-bold text-base text-base-content mb-1 group-hover:text-primary transition-colors">
          {{ actividad.titulo }}
        </h3>

        <p class="text-sm text-base-content/70 leading-relaxed line-clamp-2">
          {{ actividad.mensaje }}
        </p>
      </div>
    </div>
  </article>
</template>