<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { useActivityUI } from '@/composables/useActivityUI';
import BaseIcon from '@/components/BaseIcon.vue';
import type { ActivityItem } from '@/types/activity';
import type { IconName } from '@/utils/icons';

const props = defineProps<{
  isOpen: boolean;
  activity: ActivityItem | null;
}>();

const formatDate = (isoString: string) => {
  if (!isoString) return '';
  const fechaSegura = isoString.endsWith('Z') ? isoString : `${isoString}Z`;
  return new Date(fechaSegura).toLocaleString('es-DO', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};


const emit = defineEmits(['close']);

const { getActivityConfig } = useActivityUI();
</script>

<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div 
      v-if="isOpen && activity" 
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      @click.self="$emit('close')"
    >
      
      <div 
        class="bg-white w-full max-w-md rounded-2xl shadow-2xl transform transition-all overflow-hidden"
        role="dialog"
      >
        <div 
          class="px-6 py-6 border-b flex items-center gap-4"
          :class="getActivityConfig(activity.tipo).circleClass.replace('text-', 'bg-opacity-10 bg-')" 
        >
          <div 
            class="w-12 h-12 rounded-full flex items-center justify-center border-2 shrink-0"
            :class="getActivityConfig(activity.tipo).circleClass"
          >
            <BaseIcon 
              :name="getActivityConfig(activity.tipo).iconName as IconName" 
              class="size-6" 
            />
          </div>

          <div>
            <h3 class="text-lg font-bold text-gray-900">
              {{ getActivityConfig(activity.tipo).label || 'Detalle de Actividad' }}
            </h3>
            <p class="text-sm text-gray-500 font-medium">
              {{ formatDate(activity.fechaCreacion) }}
            </p>
          </div>
          
          <button @click="$emit('close')" class="ml-auto text-gray-400 hover:text-gray-600">
            <BaseIcon name="close" class="size-6" />
          </button>
        </div>

        <div class="p-6 space-y-4">
          
          <div>
            <label class="text-xs font-bold text-gray-400 uppercase tracking-wider">Detalle del Evento</label>
            <p class="mt-1 text-gray-800 text-base leading-relaxed">
              {{ activity.mensaje }}
            </p>
          </div>

          <div class="grid grid-cols-2 gap-4 pt-2">
            <div class="bg-gray-50 p-3 rounded-lg">
              <label class="text-xs font-bold text-gray-400 uppercase block">Tipo</label>
              <span class="font-mono text-xs text-gray-600 break-all">{{ activity.tipo }}</span>
            </div>
            
            <div class="bg-gray-50 p-3 rounded-lg">
              <label class="text-xs font-bold text-gray-400 uppercase block">ID Referencia</label>
              <span class="font-mono text-xs text-gray-600 break-all" title="ID de la actividad">
                {{ activity.id.substring(0, 8) }}...
              </span>
            </div>
          </div>

          <div v-if="activity.ticketId" class="pt-2">
            <router-link 
              :to="`/tickets/${activity.ticketId}`"
              class="btn btn-primary btn-sm w-full gap-2"
            >
              Ver Ticket Relacionado
              <BaseIcon name="arrowRight" class="size-4" />
            </router-link>
          </div>

        </div>

        <div class="bg-gray-50 px-6 py-4 flex justify-end">
          <button 
            @click="$emit('close')"
            class="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  </Transition>
</template>