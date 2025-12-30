<script setup lang="ts">
import { ref } from "vue";
import Estadísticas from "../components/Estadisticas.vue";
import Actividades from "../components/Actividades.vue";
</script>

<template>
  <main class="w-11/12 mx-auto py-6 h-full">
    <div>
      <h1 class="text-3xl font-bold mb-4">Dashboard</h1>
      <p class="text-lg text-base-content/70">
        Vista general del sistema de solicitudes
      </p>
    </div>

    <div class="mt-6  h-full flex flex-col lg:flex-row gap-6">
    
       
         <Estadísticas />
           <Actividades/>
    </div>
   
  </main>
</template>

<style scoped></style>
