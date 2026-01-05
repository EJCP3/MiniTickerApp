<template>
  <div class="space-y-6" aria-hidden="true">
    <div v-for="i in 4" :key="i" class="flex gap-4 animate-pulse">
      <div class="w-10 h-10 rounded-full bg-base-300"></div>
      <div class="flex-1 space-y-2 py-1">
        <div class="h-4 bg-base-300 rounded w-3/4"></div>
        <div class="h-3 bg-base-300 rounded w-1/2"></div>
      </div>
    </div>
  </div>
</template>