<script setup lang="ts">
import { useDashboardStore } from "@/stores/reportStore";
const store = useDashboardStore();
</script>

<template>
  <div class="stats stats-vertical lg:stats-horizontal shadow-lg w-full bg-base-100 mb-8">
    
    <div class="stat">
      <div class="stat-figure text-primary"><i class="pi pi-file text-3xl"></i></div>
      <div class="stat-title">Total Solicitudes</div>
      <div class="stat-value text-primary">{{ store.kpis.total }}</div>
    </div>

    <div class="stat">
      <div class="stat-figure text-secondary"><i class="pi pi-check-circle text-3xl"></i></div>
      <div class="stat-title">Completadas</div>
      <div class="stat-value text-secondary">{{ store.kpis.completadas }}</div>
      <div class="stat-desc text-success">Rate: {{ store.kpis.tasaResolucion }}%</div>
    </div>

    <div class="stat">
      <div class="stat-figure text-secondary"><i class="pi pi-check-circle text-3xl"></i></div>
      <div class="stat-title">Rechazadas</div>
      <div class="stat-value text-accent">{{ store.kpis.rechazadas }}</div>
    </div>

    <div class="stat">
      <div class="stat-figure text-warning"><i class="pi pi-clock text-3xl"></i></div>
      <div class="stat-title">Pendientes</div>
      <div class="stat-value text-warning">{{ store.kpis.pendientes }}</div>
      <div class="stat-desc text-error">Requieren atención</div>
    </div>

    <div class="stat">
      <div class="stat-figure text-info"><i class="pi pi-spinner text-3xl"></i></div>
      <div class="stat-title">En Proceso</div>
      <div class="stat-value text-info">{{ store.kpis.enProceso }}</div>
    </div>

    <div class="stat">
      <div class="stat-figure text-error"><i class="pi pi-exclamation-circle text-3xl"></i></div>
      <div class="stat-title">Vencidas</div>
      <div class="stat-value text-error">{{ store.kpis.vencidas }}</div>
    </div>

  </div>
</template>