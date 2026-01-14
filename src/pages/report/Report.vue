<script setup lang="ts">
import { onMounted, ref } from "vue";
import Chart from "primevue/chart";
import { useDashboardStore } from "@/stores/reportStore"; 
import * as XLSX from "xlsx"; // <--- 1. Importar la librería

const dashboardStore = useDashboardStore();
const isExporting = ref(false); // Estado para el loading del botón

// --- CONFIGURACIÓN DE GRÁFICOS (Tu código original) ---
const commonOptions = {
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: "#a6adbb" } },
    tooltip: { mode: "index", intersect: false },
  },
  elements: { line: { tension: 0.4 } },
  scales: {
    x: { ticks: { color: "#a6adbb" }, grid: { color: "#374151", drawBorder: false } },
    y: {
      beginAtZero: true,
      ticks: { color: "#a6adbb", stepSize: 1, precision: 0 },
      grid: { color: "#374151", drawBorder: false },
    },
  },
};

const pieOptions = {
  plugins: { legend: { position: "right", labels: { usePointStyle: true, color: "#a6adbb" } } },
};

const hBarOptions = {
  indexAxis: "y",
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: commonOptions.scales,
};

// --- FUNCIÓN PARA EXPORTAR A EXCEL ---
const exportToExcel = () => {
  if (dashboardStore.isLoading) return;
  isExporting.value = true;

  try {
    // 1. Crear libro de trabajo
    const wb = XLSX.utils.book_new();

    // ---------------------------------------------------------
    // HOJA 1: RESUMEN GENERAL (KPIs)
    // ---------------------------------------------------------
    const resumenData = [
      { Métrica: "Total Solicitudes", Valor: dashboardStore.kpis.total },
      { Métrica: "Completadas", Valor: dashboardStore.kpis.completadas },
      { Métrica: "Pendientes", Valor: dashboardStore.kpis.pendientes },
      { Métrica: "En Proceso", Valor: dashboardStore.kpis.enProceso },
      { Métrica: "Tasa de Resolución", Valor: `${dashboardStore.kpis.tasaResolucion}%` },
      { Métrica: "Tiempo Promedio", Valor: `${dashboardStore.kpis.tiempoPromedio} días` },
      { Métrica: "Satisfacción", Valor: dashboardStore.kpis.satisfaccion || "N/A" }
    ];
    const wsResumen = XLSX.utils.json_to_sheet(resumenData);
    // Ajustar ancho de columnas (opcional)
    wsResumen['!cols'] = [{ wch: 20 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, wsResumen, "KPIs Generales");

    // ---------------------------------------------------------
    // HOJA 2: TENDENCIA (Extraído del gráfico de línea)
    // ---------------------------------------------------------
    // Reconstruimos la tabla basándonos en los datos del gráfico para que coincida visualmente
    const lineLabels = dashboardStore.lineChartData.labels || [];
    const totalData = dashboardStore.lineChartData.datasets[0]?.data || []; // Asumiendo que el dataset 0 es Total
    const completadasData = dashboardStore.lineChartData.datasets[1]?.data || []; // Asumiendo que el dataset 1 es Completadas

    const tendenciaExcel = lineLabels.map((label: string, index: number) => ({
      Periodo: label,
      Total_Solicitudes: totalData[index] || 0,
      Solicitudes_Completadas: completadasData[index] || 0
    }));
    
    const wsTendencia = XLSX.utils.json_to_sheet(tendenciaExcel);
    wsTendencia['!cols'] = [{ wch: 15 }, { wch: 20 }, { wch: 25 }];
    XLSX.utils.book_append_sheet(wb, wsTendencia, "Tendencia Temporal");

    // ---------------------------------------------------------
    // HOJA 3: PRIORIDADES (Lista)
    // ---------------------------------------------------------
    const prioridadesExcel = dashboardStore.prioridades.map((p: any) => ({
      Prioridad: p.label || p.prioridad, // Ajusta según tu DTO
      Cantidad: p.count || p.cantidad,
      Porcentaje: `${p.percent}%`
    }));
    const wsPrioridad = XLSX.utils.json_to_sheet(prioridadesExcel);
    wsPrioridad['!cols'] = [{ wch: 15 }, { wch: 10 }, { wch: 10 }];
    XLSX.utils.book_append_sheet(wb, wsPrioridad, "Por Prioridad");

    // ---------------------------------------------------------
    // HOJA 4: TOP SOLICITANTES (Lista)
    // ---------------------------------------------------------
    const solicitantesExcel = dashboardStore.topSolicitantes.map((u: any) => ({
      Nombre: u.nombre,
      Cantidad: u.cantidad,
      // Si tienes el ID disponible: Id: u.id 
    }));
    const wsSolicitantes = XLSX.utils.json_to_sheet(solicitantesExcel);
    wsSolicitantes['!cols'] = [{ wch: 30 }, { wch: 10 }];
    XLSX.utils.book_append_sheet(wb, wsSolicitantes, "Top Solicitantes");

    // ---------------------------------------------------------
    // HOJA 5: ESTATUS (Extraído del gráfico de Dona)
    // ---------------------------------------------------------
    const pieLabels = dashboardStore.pieChartData.labels || [];
    const pieValues = dashboardStore.pieChartData.datasets[0]?.data || [];
    
    const estatusExcel = pieLabels.map((label: string, index: number) => ({
      Estado: label,
      Cantidad: pieValues[index] || 0
    }));
    const wsEstatus = XLSX.utils.json_to_sheet(estatusExcel);
    XLSX.utils.book_append_sheet(wb, wsEstatus, "Distribución Estatus");

    // ---------------------------------------------------------
    // HOJA 6: DESEMPEÑO POR ÁREA (Extraído del gráfico de Barras)
    // ---------------------------------------------------------
    const barLabels = dashboardStore.barChartData.labels || [];
    const barTotal = dashboardStore.barChartData.datasets[0]?.data || []; // Dataset 0 suele ser Total
    // Si tu gráfico tiene una segunda barra para "Completadas", agrégala aquí:
    const barCompletadas = dashboardStore.barChartData.datasets[1]?.data || [];

    const areasExcel = barLabels.map((label: string, index: number) => ({
      Area: label,
      Total_Tickets: barTotal[index] || 0,
      Tickets_Completados: barCompletadas[index] || 0
    }));
    const wsAreas = XLSX.utils.json_to_sheet(areasExcel);
    wsAreas['!cols'] = [{ wch: 25 }, { wch: 15 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, wsAreas, "Desempeño Áreas");

    // ---------------------------------------------------------
    // HOJA 7: TIEMPOS PROMEDIO (Extraído del gráfico horizontal)
    // ---------------------------------------------------------
    const timeLabels = dashboardStore.hBarChartData.labels || [];
    const timeValues = dashboardStore.hBarChartData.datasets[0]?.data || [];

    const tiemposExcel = timeLabels.map((label: string, index: number) => ({
      Area: label,
      Dias_Promedio: timeValues[index] || 0
    }));
    const wsTiempos = XLSX.utils.json_to_sheet(tiemposExcel);
    wsTiempos['!cols'] = [{ wch: 25 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, wsTiempos, "Tiempos Promedio");

    // ---------------------------------------------------------
    // FINAL: GENERAR ARCHIVO
    // ---------------------------------------------------------
    const dateStr = new Date().toLocaleDateString().replace(/\//g, "-");
    const fileName = `Reporte_Completo_${dashboardStore.selectedPeriod}_${dateStr}.xlsx`;
    
    XLSX.writeFile(wb, fileName);

  } catch (error) {
    console.error("Error exportando a Excel:", error);
    // Aquí puedes usar tu sistema de notificaciones (Toast)
    alert("Hubo un error al generar el reporte.");
  } finally {
    isExporting.value = false;
  }
};

onMounted(() => {
  dashboardStore.refreshDashboard();
});
</script>

<template>
  <div class="min-h-screen p-6 font-sans text-base-content">
    <header class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 class="text-3xl font-bold text-primary">Reportes del Sistema</h1>
        <p class="opacity-70 text-sm">Análisis en tiempo real</p>
      </div>

      <div class="flex items-center gap-3">
        <button 
          @click="exportToExcel" 
          class="btn btn-sm btn-success text-white gap-2"
          :disabled="dashboardStore.isLoading || isExporting"
        >
          <span v-if="isExporting" class="loading loading-spinner loading-xs"></span>
          <i v-else class="pi pi-file-excel"></i>
          {{ isExporting ? 'Generando...' : 'Exportar Excel' }}
        </button>

        <select
          class="select select-sm select-bordered w-full sm:w-auto"
          v-model="dashboardStore.selectedArea"
          @change="dashboardStore.refreshDashboard()"
        >
          <option :value="null">Todas las Áreas</option>
          <option 
            v-for="area in dashboardStore.areas" 
            :key="area.id" 
            :value="area.id"
          >
            {{ area.nombre }}
          </option>
        </select>

        
        <select
          class="select select-sm select-bordered"
          v-model="dashboardStore.selectedPeriod"
          @change="dashboardStore.refreshDashboard()"
        >
          <option value="esta-semana">Esta semana</option>
          <option value="este-mes">Este mes</option>
          <option value="mes-pasado">Mes pasado</option>
          <option value="anio-actual">Año actual</option>
        </select>
      </div>
    </header>

    <div v-if="dashboardStore.isLoading" class="flex justify-center py-20">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>

    <div v-else>
       <div
        class="stats stats-vertical lg:stats-horizontal shadow-lg w-full bg-base-100 mb-8"
      >
        <div class="stat">
          <div class="stat-figure text-primary">
            <i class="pi pi-file text-3xl"></i>
          </div>
          <div class="stat-title">Total Solicitudes</div>
          <div class="stat-value text-primary">
            {{ dashboardStore.kpis.total }}
          </div>
        </div>

        <div class="stat">
          <div class="stat-figure text-secondary">
            <i class="pi pi-check-circle text-3xl"></i>
          </div>
          <div class="stat-title">Completadas</div>
          <div class="stat-value text-secondary">
            {{ dashboardStore.kpis.completadas }}
          </div>
          <div class="stat-desc text-success">
            Rate: {{ dashboardStore.kpis.tasaResolucion }}%
          </div>
        </div>

        <div class="stat">
          <div class="stat-figure text-warning">
            <i class="pi pi-clock text-3xl"></i>
          </div>
          <div class="stat-title">Pendientes</div>
          <div class="stat-value text-warning">
            {{ dashboardStore.kpis.pendientes }}
          </div>
          <div class="stat-desc text-warning">Requieren atención</div>
        </div>

        <div class="stat">
          <div class="stat-figure text-info">
            <i class="pi pi-spinner text-3xl"></i>
          </div>
          <div class="stat-title">En Proceso</div>
          <div class="stat-value text-info">
            {{ dashboardStore.kpis.enProceso }}
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-8">
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body p-6">
            <h3 class="card-title text-sm opacity-70">
              <i class="pi pi-chart-line text-primary"></i> Tendencia
            </h3>
            <div class="h-[300px]">
              <Chart
                type="line"
                :data="dashboardStore.lineChartData"
                :options="commonOptions"
                class="h-full"
              />
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <h3 class="card-title text-lg mb-4">Por Prioridad</h3>
              <div class="space-y-5">
                <div
                  v-for="(item, index) in dashboardStore.prioridades"
                  :key="index"
                >
                  <div class="flex justify-between text-xs mb-1">
                    <span class="font-bold">{{ item.label }}</span>
                    <span class="opacity-70"
                      >{{ item.count }} ({{ item.percent }}%)</span
                    >
                  </div>
                  <progress
                    class="progress w-full"
                    :class="item.color"
                    :value="item.percent"
                    max="100"
                  ></progress>
                </div>
              </div>
            </div>
          </div>

          <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <h3 class="card-title text-lg mb-4">Top Solicitantes</h3>

              <div class="flex flex-col gap-4">
                <div
                  v-for="(user, index) in dashboardStore.topSolicitantes"
                  :key="user.id"
                  class="flex items-center gap-4 p-2 rounded-lg hover:bg-base-200 transition-colors"
                >
                  <div class="avatar placeholder">
                    <div
                      :class="`w-10 h-10 rounded-full shadow-sm ${user.color}`"
                    >
                      <span class="text-lg font-bold text-center">{{
                        user.cantidad
                      }}</span>
                    </div>
                  </div>

                  <div class="flex flex-col">
                    <span class="font-bold text-base">{{ user.nombre }}</span>
                    <span
                      class="text-xs opacity-60 uppercase tracking-wider font-semibold"
                    >
                      Top #{{ index + 1 }}
                    </span>
                  </div>
                </div>

                <div
                  v-if="dashboardStore.topSolicitantes.length === 0"
                  class="text-center py-4 opacity-50"
                >
                  <i class="pi pi-users text-2xl mb-2"></i>
                  <p class="text-sm">Sin datos aún</p>
                </div>
              </div>
            </div>
          </div>
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body p-6">
              <h3 class="card-title text-sm opacity-70">
                <i class="pi pi-chart-pie text-secondary"></i> Distribución por
                Estado
              </h3>
              <div class="h-[300px] flex justify-center">
                <Chart
                  type="doughnut"
                  :data="dashboardStore.pieChartData"
                  :options="pieOptions"
                  class="h-full w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body p-6">
            <h3 class="card-title text-sm opacity-70">
              <i class="pi pi-chart-bar text-primary"></i> Desempeño por Área
            </h3>
            <div class="h-[250px]">
              <Chart
                type="bar"
                :data="dashboardStore.barChartData"
                :options="commonOptions"
                class="h-full"
              />
            </div>
          </div>
        </div>

        <div class="card bg-base-100 shadow-xl">
          <div class="card-body p-6">
            <h3 class="card-title text-sm opacity-70">
              <i class="pi pi-clock text-secondary"></i> Tiempos Promedio
            </h3>
            <div class="h-[250px]">
              <Chart
                type="bar"
                :data="dashboardStore.hBarChartData"
                :options="hBarOptions"
                class="h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>