<script setup lang="ts">
import { computed } from 'vue';
import BaseIcon from '@/components/BaseIcon.vue';
import type { ActivityItem } from '@/types/activity';
import type { IconName } from '@/utils/icons';
import { useActivityUI } from '@/composables/useActivityUI';

const props = defineProps<{
  actividad: ActivityItem;
}>();

const { getActivityConfig } = useActivityUI();

// Emitimos un evento cuando hacen click
defineEmits(['click']);

// Lógica visual (Colores e Iconos)

</script>

<template>
  <li class="group relative pl-12 pb-8 last:pb-0">
    <div 
      class="absolute left-0 top-0 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-transform group-hover:scale-110 z-10 bg-base-100"
      :class="[getActivityConfig(actividad.tipo).circleClass]"
    >
      <BaseIcon :name="getActivityConfig(actividad.tipo).iconName as IconName" class="size-5" />
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