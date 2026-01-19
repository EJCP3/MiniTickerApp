<script setup lang="ts">
import { useDashboardStore } from "@/stores/reportStore";
import { useExcelExport } from "@/composables/useExcelExport";

const dashboardStore = useDashboardStore();
const { isExporting, exportToExcel } = useExcelExport();
</script>

<template>
  <header class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
    <div>
      <h1 class="text-3xl font-bold text-primary">Reportes del Sistema</h1>
      <p class="opacity-70 text-sm">Análisis en tiempo real</p>
    </div>

    <div class="flex items-center gap-3">
      <button @click="exportToExcel" class="btn btn-sm btn-success text-white gap-2"
        :disabled="dashboardStore.isLoading || isExporting">
        <span v-if="isExporting" class="loading loading-spinner loading-xs"></span>
        <i v-else class="pi pi-file-excel"></i>
        {{ isExporting ? 'Generando...' : 'Exportar Excel' }}
      </button>

      <select class="select select-sm select-bordered w-full sm:w-auto" v-model="dashboardStore.selectedArea"
        @change="dashboardStore.refreshDashboard()">
        <option :value="null">Todas las Áreas</option>
        <option v-for="area in dashboardStore.areas" :key="area.id" :value="area.id">
          {{ area.nombre }}
        </option>
      </select>

      <select class="select select-sm select-bordered" v-model="dashboardStore.selectedPeriod"
        @change="dashboardStore.refreshDashboard()">
        <option value="esta-semana">Esta semana</option>
        <option value="este-mes">Este mes</option>
        <option value="mes-pasado">Mes pasado</option>
        <option value="anio-actual">Año actual</option>
      </select>
    </div>
  </header>
</template>