<script setup lang="ts">
import Estadisticas from "./Estadisticas.vue";
import Actividades from "./Actividades.vue";
import LastTicker from "./LastTicker.vue";



</script>

<template>
  <main class="w-11/12 mx-auto py-6 h-full">  
    <div>
      <h1 class="text-3xl font-bold mb-4">Dashboard</h1>
      <p class="text-lg text-base-content/70">
        Vista general de mis solicitudes
      </p>
    </div>

    <div class="mt-6  h-full flex flex-col lg:flex-row gap-6">
    
       <Estadisticas />
       <Actividades />

      
         
    </div>
    <LastTicker/> 
  </main>
</template>

<style scoped></style>
