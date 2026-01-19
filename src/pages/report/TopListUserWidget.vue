<script setup lang="ts">



defineProps<{
  title: string;
  items: Array<{ id?: string; nombre: string; cantidad: number; color?: string }>;
  icon?: string;
}>();

const emit = defineEmits(['view-profile']);
</script>

<template>
  <div class="card bg-base-100 shadow-xl">
    <div class="card-body">
      <h3 class="card-title text-lg mb-4">{{ title }}</h3>
      <div class="flex flex-col gap-4">
        <div v-for="(user, index) in items" :key="index"
          class="flex items-center gap-4 p-2 rounded-lg hover:bg-base-200 transition-colors"
          @click="emit('view-profile', user)"
        >
          <div class="avatar placeholder">
            <div :class="`w-10 h-10 rounded-full shadow-sm ${user.color || 'bg-neutral text-neutral-content'}`">
              <span class="text-lg font-bold text-center">{{ user.cantidad }}</span>
            </div>
          </div>
          <div class="flex flex-col">
            <span class="font-bold text-base">{{ user.nombre }}</span>
            <span class="text-xs opacity-60 uppercase tracking-wider font-semibold">
              Top #{{ index + 1 }}
            </span>
          </div>
        </div>

        <div v-if="items.length === 0" class="text-center py-4 opacity-50">
          <i class="pi pi-users text-2xl mb-2"></i>
          <p class="text-sm">Sin datos aún</p>
        </div>
      </div>
    </div>
  </div>
</template>