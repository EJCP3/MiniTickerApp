<script setup lang="ts">
import type { Area } from '@/types/department'
import { gestoresOptions } from '@/types/department'
import BaseIcon from '@/components/BaseIcon.vue' // Importamos el componente

defineProps<{ area: Area }>()
const emit = defineEmits(['edit', 'manage-types'])

// Helpers visuales
const getResponsableName = (id: string) => gestoresOptions.find(g => g.value === id)?.label.split(' (')[0] || 'Sin Asignar'

const getDynamicBorder = (color: string) => {
    const borders: any = { primary: 'border-l-primary', secondary: 'border-l-secondary', info: 'border-l-info', success: 'border-l-success', warning: 'border-l-warning', error: 'border-l-error' }
    return borders[color] || 'border-l-neutral'
}
const getDynamicBg = (color: string) => {
    const bgs: any = { primary: 'bg-primary text-primary-content', secondary: 'bg-secondary text-secondary-content', info: 'bg-info text-info-content', success: 'bg-success text-success-content', warning: 'bg-warning text-warning-content', error: 'bg-error text-error-content' }
    return bgs[color] || 'bg-neutral text-neutral-content'
}
</script>

<template>
  <article 
    class="card bg-base-100 shadow-xl border-l-[6px] transition-all hover:-translate-y-1 hover:shadow-2xl" 
    :class="getDynamicBorder(area.color)"
  >
    <div class="card-body p-6">
      
      <header class="flex justify-between items-start mb-4">
        <div class="flex gap-4">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm" :class="getDynamicBg(area.color)">
             <BaseIcon name="inbox" class="size-12" />
          </div>
          
          <div>
            <h3 class="font-bold text-lg leading-tight text-base-content">{{ area.nombre }}</h3>
            <div class="flex gap-2 mt-1">
              <span class="badge badge-sm font-mono font-bold opacity-70">{{ area.prefijo }}</span>
              <span class="badge badge-sm" :class="area.estado ? 'badge-success text-white' : 'badge-error text-white'">
                {{ area.estado ? 'Activo' : 'Inactivo' }}
              </span>
            </div>
          </div>
        </div>
        
        <div class="flex gap-1">
          <button 
            @click="emit('manage-types', area)" 
            class="btn btn-ghost btn-sm btn-circle text-base-content/40 hover:text-info tooltip tooltip-left" 
            data-tip="Tipos de Solicitud"
            aria-label="Gestionar tipos de solicitud"
          >
            <BaseIcon name="list" class="size-10" />
          </button>
          
          <button 
            @click="emit('edit', area)" 
            class="btn btn-ghost btn-sm btn-circle text-base-content/40 hover:text-primary tooltip tooltip-left" 
            data-tip="Editar"
            aria-label="Editar departamento"
          >
            <BaseIcon name="edit" class="size-10" />
          </button>
        </div>
      </header>

      <section class="bg-base-200/50 rounded-lg p-3 mb-4 border border-base-200 flex items-center justify-between">
        <div>
          <span class="text-[10px] text-base-content/50 uppercase font-bold tracking-wider mb-0.5 block">Responsable</span>
          <div class="font-semibold text-sm text-base-content">{{ getResponsableName(area.responsableId) }}</div>
        </div>
        <div class="avatar placeholder">
          <div class="bg-base-300 text-base-content rounded-full w-8">
            <span class="text-xs font-bold">{{ getResponsableName(area.responsableId).charAt(0) }}</span>
          </div>
        </div> 
      </section>

      <dl class="grid grid-cols-3 gap-2 mb-4">
        
        <div class="text-center p-2 rounded-lg bg-base-200/30 flex flex-col-reverse">
          <dt class="text-[10px] text-base-content/60 uppercase font-bold">Total</dt>
          <dd class="text-lg font-bold text-base-content m-0">{{ area.stats.total }}</dd>
        </div>
        
        <div class="text-center p-2 rounded-lg bg-base-200/30 flex flex-col-reverse">
          <dt class="text-[10px] text-base-content/60 uppercase font-bold">Activas</dt>
          <dd class="text-lg font-bold text-warning m-0">{{ area.stats.activas }}</dd>
        </div>
        
        <div class="text-center p-2 rounded-lg bg-base-200/30 flex flex-col-reverse">
          <dt class="text-[10px] text-base-content/60 uppercase font-bold">Hechas</dt>
          <dd class="text-lg font-bold text-success m-0">{{ area.stats.completadas }}</dd>
        </div>

      </dl>

      <div 
        v-if="area.stats.pendientesMsg" 
        role="alert"
        class="alert alert-warning bg-warning/40 text-warning-content border-none py-2 px-3 text-xs flex justify-start rounded-lg"
      >
        <BaseIcon name="warning" class="size-10 shrink-0 text-warning" />
        <span class="font-medium text-warning-700">{{ area.stats.pendientesMsg }}</span>
      </div>
      
      <div v-else class="h-[40px]" aria-hidden="true"></div>

    </div>
  </article>
</template>