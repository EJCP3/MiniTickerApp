<script setup lang="ts">
import { useDashboardStore } from "@/stores/reportStore";
const store = useDashboardStore();
</script>

<template>
  <div class="card bg-base-100 shadow-xl">
    <div class="card-body">
      <h3 class="card-title text-lg mb-4">Por Prioridad</h3>
      <div class="space-y-5">
        <div v-for="(item, index) in store.prioridades" :key="index">
          <div class="flex justify-between text-xs mb-1">
            <span class="font-bold">{{ item.label }}</span>
            <span class="opacity-70">{{ item.count }} ({{ item.percent }}%)</span>
          </div>
          <progress class="progress w-full" :class="item.color" :value="item.percent" max="100"></progress>
        </div>
      </div>
    </div>
  </div>
</template>