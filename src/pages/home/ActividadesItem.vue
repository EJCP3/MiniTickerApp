<script setup lang="ts">
import { computed } from 'vue';
import BaseIcon from '@/components/BaseIcon.vue';
import type { ActivityItem } from '@/types/activity';
import type { IconName } from '@/utils/icons';

const props = defineProps<{
  actividad: ActivityItem;
}>();

// Emitimos un evento cuando hacen click
defineEmits(['click']);

// Lógica visual (Colores e Iconos)
const config = computed(() => {
  const tipo = props.actividad.tipo; // Asegúrate que tu tipo ActivityItem tenga 'tipo'
  switch (tipo) {
    case 'Creado': 
      return { icon: 'plus', color: 'bg-emerald-500/20 text-emerald-500', border: 'border-emerald-500/30' };
    case 'EstadoCambiado': 
      return { icon: 'refresh', color: 'bg-blue-500/20 text-blue-500', border: 'border-blue-500/30' };
    case 'Asignado': 
      return { icon: 'userCheck', color: 'bg-purple-500/20 text-purple-500', border: 'border-purple-500/30' };
    case 'Comentario': 
      return { icon: 'chat', color: 'bg-amber-500/20 text-amber-500', border: 'border-amber-500/30' };
    case 'Cierre':
      return { icon: 'checkCircle', color: 'bg-green-500/20 text-green-500', border: 'border-green-500/30' };
    default: 
      return { icon: 'bell', color: 'bg-gray-500/20 text-gray-400', border: 'border-gray-500/30' };
  }
});
</script>

<template>
  <li class="group relative pl-12 pb-8 last:pb-0">
    <div 
      class="absolute left-0 top-0 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-transform group-hover:scale-110 z-10 bg-base-100"
      :class="[config.color, config.border]"
    >
      <BaseIcon :name="config.icon as IconName" class="size-5" />
    </div>

    <article 
      @click="$emit('click')"
      class="bg-base-200/40 hover:bg-base-200 rounded-xl p-4 transition-all border border-transparent hover:border-base-300 group-hover:shadow-sm cursor-pointer"
    >
      <header class="flex justify-between items-center mb-2">
        <span class="font-bold text-sm text-primary">{{ actividad.titulo }}</span> <span class="text-xs text-base-content/50 font-medium">{{ actividad.fecha }}</span>
      </header>

      <h3 class="font-medium text-base text-base-content">{{ actividad.mensaje }}</h3>
      
      <p class="mt-2 text-xs font-medium uppercase tracking-wider opacity-50">
        {{ actividad.tipo }}
      </p>
    </article>
  </li>
</template>