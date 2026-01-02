<script setup lang="ts">
import { computed } from 'vue';
import { icons, type IconName } from '@/utils/icons';

const props = defineProps<{
  name: IconName; 
  class?: string;
}>();

const iconSvg = computed(() => {
  return icons[props.name] || '';
});
</script>

<template>
  <span 
    v-html="iconSvg" 
    class="inline-flex items-center justify-center shrink-0"
    :class="props.class"
  ></span>
</template>