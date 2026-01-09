<script setup lang="ts">
import BaseIcon from '@/components/BaseIcon.vue'
import type { IconName } from '@/utils/icons'
import { useActivityUI } from '@/composables/useActivityUI';


const { getActivityConfig } = useActivityUI();
// Interfaces
interface Activity {
  id: string | number
  tipo: string
  fecha: string
  titulo: string
  mensaje: string
  ticketId?: string
}

const props = defineProps<{
  activities: Activity[]
}>()

const emit = defineEmits(['row-click'])

// Reutilizamos la lógica de configuración de eventos para la tabla

</script>

<template>
  <div class="overflow-x-auto bg-base-100 rounded-2xl border border-base-200 shadow-sm">
    <table class="table table-zebra w-full">
      <thead>
        <tr class="bg-base-200/50 text-base-content/70">
          <th class="rounded-tl-2xl">Evento</th>
          <th>Detalle</th>
          <th>Referencia</th>
          <th>Fecha</th>
          <th class="rounded-tr-2xl text-right">Acción</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          v-for="act in activities" 
          :key="act.id" 
          class="hover:bg-base-200/40 transition-colors group cursor-pointer"
          @click="emit('row-click', act)"
        >
          <td>
            <div class="flex items-center gap-3">
              <div 
                class="size-8 rounded-lg flex items-center justify-center shrink-0 border border-base-300 shadow-sm"
                :class="getActivityConfig(act.tipo).circleClass"
              >
                <BaseIcon :name="getActivityConfig(act.tipo).iconName" class="size-4" />
              </div>
              <span class="text-xs font-black uppercase tracking-tighter opacity-60">
                {{ act.tipo }}
              </span>
            </div>
          </td>

          <td class="max-w-md">
            <div class="font-bold text-sm truncate" :title="act.titulo">
              {{ act.titulo }}
            </div>
            <div class="text-[11px] text-base-content/60 truncate" :title="act.mensaje">
              {{ act.mensaje }}
            </div>
          </td>

          <td>
            <span class="badge badge-sm font-mono font-bold tracking-widest bg-base-200 border-none text-[10px]">
              {{ act.ticketId ? 'TICKET' : 'SISTEMA' }}
            </span>
          </td>

          <td class="text-xs font-medium whitespace-nowrap">
            {{ act.fecha }}
          </td>

          <td class="text-right">
            <button class="btn btn-ghost btn-xs text-primary font-black uppercase">
              Ver
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>