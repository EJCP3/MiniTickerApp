<script setup lang="ts">
import type { Solicitud } from '@/types/solicitudes'
import BaseIcon from '@/components/BaseIcon.vue' // Importamos BaseIcon

defineProps<{
  solicitud: Solicitud
}>()

// --- HELPERS VISUALES (Específicos de la tarjeta) ---
const getPriorityBorder = (prioridad: string) => {
  const map: Record<string, string> = {
    'Baja': 'border-l-emerald-500',
    'Media': 'border-l-orange-400',
    'Alta': 'border-l-red-600',
  }
  return map[prioridad] || 'border-l-gray-300'
}

const getTypeConfig = (tipo: string) => {
  const map: Record<string, { badgeBg: string, badgeText: string }> = {
    'TI': { badgeBg: 'bg-purple-100', badgeText: 'text-purple-700' },
    'Mantenimiento': { badgeBg: 'bg-orange-100', badgeText: 'text-orange-700' },
    'Transporte': { badgeBg: 'bg-emerald-100', badgeText: 'text-emerald-700' },
    'Compras': { badgeBg: 'bg-teal-100', badgeText: 'text-teal-700' }
  }
  return map[tipo] || { badgeBg: 'bg-gray-100', badgeText: 'text-gray-700' }
}

const getPriorityBadgeClass = (prioridad: string) => {
  const map: Record<string, string> = {
    'Baja': 'bg-emerald-50 text-emerald-700 border-emerald-100',
    'Media': 'bg-orange-50 text-orange-700 border-orange-100',
    'Alta': 'bg-red-50 text-red-700 border-red-100',
  }
  return map[prioridad] || 'bg-gray-50'
}

const getStatusClass = (estado: string) => {
  const map: Record<string, string> = {
    'Nueva': 'badge-warning bg-yellow-100 text-yellow-800 border-none',
    'En Proceso': 'badge-info bg-blue-100 text-blue-800 border-none',
    'Resuelta': 'badge-success bg-green-100 text-green-800 border-none',
    'Cerrada': 'bg-gray-200 text-gray-600 border-none',
    'Rechazada': 'badge-error bg-red-100 text-red-800 border-none'
  }
  return map[estado] || 'badge-ghost'
}
</script>

<template>
  <article 
    class="card bg-base-100 shadow-sm hover:shadow-lg transition-all duration-300 border border-base-200 h-full border-l-[6px] cursor-pointer hover:scale-[1.02]"
    :class="getPriorityBorder(solicitud.prioridad)"
    @click="$emit('click')"
  >
    <div class="card-body p-6">
      
      <header class="flex justify-between items-start mb-2">
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide"
            :class="[getTypeConfig(solicitud.tipo).badgeBg, getTypeConfig(solicitud.tipo).badgeText]"
          >
            {{ solicitud.tipo }}
          </span>
          <span class="text-xs text-base-content/50 font-mono font-medium">{{ solicitud.id }}</span>
        </div>
        
        <span class="px-2 py-0.5 rounded-full text-xs font-semibold border"
          :class="getPriorityBadgeClass(solicitud.prioridad)"
        >
          {{ solicitud.prioridad }}
        </span>
      </header>

      <div class="mb-4">
        <h3 class="font-bold text-lg text-base-content leading-tight mb-2 hover:text-primary transition-colors cursor-pointer">
          {{ solicitud.titulo }}
        </h3>
        <p class="text-sm text-base-content/70 line-clamp-3 leading-relaxed">
          {{ solicitud.descripcion }}
        </p>
      </div>

      <footer class="mt-auto space-y-3">
        <div class="flex justify-between items-end">
          <div class="space-y-1.5">
            
            <div class="flex items-center gap-2 text-xs text-base-content/60 font-medium">
              <BaseIcon name="user" class="h-4 w-4" />
              {{ solicitud.solicitante }}
            </div>
            
            <div class="flex items-center gap-2 text-xs text-base-content/60">
              <BaseIcon name="calendar" class="h-4 w-4" />
              <time>{{ solicitud.fecha }}</time>
            </div>

          </div>
          
          <span class="badge badge-sm font-semibold" :class="getStatusClass(solicitud.estado)">
            {{ solicitud.estado }}
          </span>
        </div>

        <div v-if="solicitud.responsable" class="bg-base-200/60 rounded-lg p-2.5 flex items-center gap-2 mt-3">
            <span class="text-[10px] uppercase font-bold text-base-content/40 tracking-wider">Responsable:</span>
            <span class="text-xs font-semibold text-base-content/80">{{ solicitud.responsable }}</span>
        </div>
        <div v-else class="h-[38px]" aria-hidden="true"></div>
      </footer>

    </div>
  </article>
</template>