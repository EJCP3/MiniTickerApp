<script setup>
import BaseIcon from './BaseIcon.vue'; // Asumiendo que el componente se llama así

// No cambiamos los props, siguen igual
defineProps({
  id: String,
  type: String,
  priority: String,
  title: String,
  description: String,
  user: String,
  date: String,
  status: String,
  responsible: String,
});

// Definimos el evento que la card puede emitir
defineEmits(['click']);
</script>

<template>
  <article 
    @click="$emit('click')"
    class="bg-white p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] max-w-sm w-full relative overflow-hidden font-sans cursor-pointer hover:bg-gray-50 transition-colors"
  >

    <div class="absolute top-0 left-0 w-2 h-full bg-red-600" aria-hidden="true"></div>

    <header class="flex items-center justify-between mb-4 pl-4">
      <div class="flex items-center gap-3">
        <span class="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full uppercase tracking-wider">
          {{ type }}
        </span>
        <span class="text-gray-400 text-sm font-medium">{{ id }}</span>
      </div>
      <span class="px-3 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full uppercase tracking-wider">
        {{ priority }}
      </span>
    </header>

    <h3 class="text-xl font-bold text-gray-800 mb-2 pl-4">
      {{ title }}
    </h3>

    <p class="text-gray-500 text-sm leading-relaxed mb-6 pl-4 line-clamp-3">
      {{ description }}
    </p>

    <footer class="flex items-center justify-between mb-6 pl-4">
      <div class="flex flex-col gap-1">
        
        <div class="flex items-center gap-2 text-gray-600 text-sm font-medium">
          <BaseIcon name="user" class="h-6 w-6 text-gray-400" />
          <span>{{ user }}</span>
        </div>
        
        <div class="flex items-center gap-2 text-gray-400 text-xs">
          <BaseIcon name="date" class="h-6 w-6" />
          <time>{{ date }}</time>
        </div>

      </div>
      
      <span class="px-4 py-1.5 bg-blue-100 text-blue-600 text-sm font-bold rounded-full">
        {{ status }}
      </span>
    </footer>

    <div class="bg-gray-50 p-4 rounded-xl flex items-center gap-2 text-sm pl-6">
      <span class="font-bold text-gray-400 uppercase text-xs tracking-wider">Responsable:</span>
      <span class="font-bold text-gray-700">{{ responsible }}</span>
    </div>

  </article>
</template>