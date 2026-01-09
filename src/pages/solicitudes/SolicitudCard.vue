<script setup lang="ts">
import type { Solicitud } from '@/types/solicitudes'
import BaseIcon from '@/components/BaseIcon.vue'

defineProps<{
  solicitud: Solicitud
}>()

// --- PALETA HÍBRIDA: Colores vivos para dark, colores suaves para light ---
const priorityConfig: Record<string, { border: string, badge: string, dot: string }> = {
  'Baja': { 
    border: 'border-l-emerald-500', 
    badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    dot: 'bg-emerald-500'
  },
  'Media': { 
    border: 'border-l-amber-500', 
    badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    dot: 'bg-amber-500'
  },
  'Alta': { 
    border: 'border-l-rose-500', 
    badge: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    dot: 'bg-rose-500'
  }
}

const getPriorityData = (prioridad: string) => {
  return priorityConfig[prioridad] || { 
    border: 'border-l-base-300', 
    badge: 'bg-base-200 text-base-content/70 border-base-300', 
    dot: 'bg-base-400'
  }
}

const getStatusClass = (estado: string) => {
  const map: Record<string, string> = {
    'Nueva': 'badge-ghost border-base-300 text-base-content/80',
    'En Proceso': 'badge-info text-info-content shadow-sm',
    'Resuelta': 'badge-success text-success-content shadow-sm',
    'Cerrada': 'bg-base-300 text-base-content/40 border-none',
    'Rechazada': 'badge-error text-error-content shadow-sm'
  }
  return map[estado] || 'badge-ghost'
}
</script>

<template>
  <article 
    class="card bg-base-100 shadow-sm hover:shadow-md transition-all duration-200 border border-base-200 h-full border-l-[6px] cursor-pointer group"
    :class="getPriorityData(solicitud.prioridad).border"
    @click="$emit('click')"
  >
    <div class="card-body p-5">
      
      <header class="flex justify-between items-start mb-3">
        <div class="flex items-center gap-2">
          <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border bg-base-200/50 text-base-content/70 border-base-300">
            {{ solicitud.tipo }}
          </span>
          <span class="text-[12px] text-base-content font-mono italic">#{{ solicitud.id }}</span>
        </div>
        
        <div class="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase"
          :class="getPriorityData(solicitud.prioridad).badge"
        >
          <span class="size-1.5 rounded-full" :class="getPriorityData(solicitud.prioridad).dot"></span>
          {{ solicitud.prioridad }}
        </div>
      </header>

      <div class="mb-4">
        <h3 class="font-bold text-base text-base-content leading-tight mb-1 group-hover:text-primary transition-colors">
          {{ solicitud.titulo }}
        </h3>
        <p class="text-xs text-base-content/60 line-clamp-2 leading-relaxed">
          {{ solicitud.descripcion }}
        </p>
      </div>

      <footer class="mt-auto pt-3 border-t border-base-200/50">
        <div class="flex justify-between items-center">
          <div class="flex flex-col gap-0.5">
            <div class="flex items-center gap-1.5 text-[10px] font-bold text-base-content">
              <BaseIcon name="user" class="size-3 opacity-50" />
              {{ solicitud.solicitante }}
            </div>
            <div class="flex items-center gap-1.5 text-[10px] font-bold text-base-content">
              <BaseIcon name="calendar" class="size-3 opacity-50" />
              {{ solicitud.fecha }}
            </div>
          </div>
          
          <div class="badge badge-sm font-bold" :class="getStatusClass(solicitud.estado)">
            {{ solicitud.estado }}
          </div>
        </div>

        <div v-if="solicitud.responsable" 
          class="mt-3 flex items-center gap-2 text-[12px] px-2 py-1 rounded bg-base-200/30 text-base-content italic border border-base-200/50"
        >
          <span class="font-black uppercase ">Atiende:</span>
          <span>{{ solicitud.responsable }}</span>
        </div>
      </footer>
    </div>
  </article>
</template>