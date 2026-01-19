import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useQuery, useQueryCache } from "@pinia/colada";
import dashboardService from "@/services/dashboardService";
import type { DashboardStats } from "@/types";
import catalogoService from "@/services/catalogoService";

interface AreaSimple {
  id: number;
  nombre: string;
}

export const useDashboardStore = defineStore("dashboard", () => {
  const queryCache = useQueryCache();
  
  // --- STATE ---
  const selectedPeriod = ref("este-mes");
  const selectedArea = ref<number | null>(null);

  // --- QUERY 1: LISTA DE ÁREAS ---
  const { data: areasData } = useQuery({
    key: ["areas-list"],
    query: async () => await catalogoService.getAreas(false),
    staleTime: 1000 * 60 * 60, 
  });

  const areas = computed<AreaSimple[]>(() => areasData.value || []);

  // --- QUERY 2: DASHBOARD STATS ---
  const { data: stats, isLoading, error, refetch } = useQuery({
    key: () => ["dashboard-stats", selectedPeriod.value, selectedArea.value], 
    query: () => dashboardService.getStats(selectedPeriod.value, selectedArea.value),
    staleTime: 1000 * 60 * 5,
  });

  // Helper para devolver estructura vacía
  const safeStats = computed<DashboardStats>(() => stats.value || {
    kpis: { total: 0, completadas: 0, rechazadas: 0, pendientes: 0, enProceso: 0, vencidas: 0, tasaResolucion: 0, tiempoPromedio: 0, satisfaccion: 0 },
    tendencia: [],
    estatus: [],
    prioridades: [],
    topSolicitantes: [],
    topGestores: [], // ✅ Asegúrate que esto exista en tu tipo DashboardStats
    desempenoAreas: [],
    tiemposPorArea: []
  });

  // --- CHART 1: LINEA (Tendencia) ---
  const lineChartData = computed(() => {
    const data = safeStats.value.tendencia;
    return {
      labels: data.map(d => d.mes),
      datasets: [
        {
          label: 'Total',
          data: data.map(d => d.total),
          fill: true,
          borderColor: '#7480ff', 
          backgroundColor: 'rgba(116, 128, 255, 0.1)',
          tension: 0.4
        },
        {
          label: 'Completadas',
          data: data.map(d => d.completadas),
          fill: true,
          borderColor: '#2dd4bf', 
          backgroundColor: 'rgba(45, 212, 191, 0.1)',
          tension: 0.4
        },
        {
          label: 'Vencidas',
          data: data.map(d => d.vencidas),
          fill: true,
          borderColor: '#f471b5', 
          backgroundColor: 'rgba(244, 113, 181, 0.1)',
          tension: 0.4
        },
          {
          label: 'Rechazadas',
          data: data.map(d => d.rechazadas),
          fill: true,
          borderColor: '#f87272', 
          backgroundColor: 'rgba(248, 114, 114, 0.1)',
          tension: 0.4
        },
      ]
    };
  });

  // --- CHART 2: DONA (Estatus) ---
  const pieChartData = computed(() => {
    const data = safeStats.value.estatus;
    const colorMap: Record<string, string> = {
      'Nueva': '#fbbd23',      
      'En Proceso': '#3abff8', 
      'Resuelta': '#36d399',   
      'Cerrada': '#2a323c',    
      'Rechazada': '#f87272', 
      'Vencida': '#f471b5'
    };
    return {
      labels: data.map(d => d.estado),
      datasets: [{
          data: data.map(d => d.cantidad),
          backgroundColor: data.map(d => colorMap[d.estado] || '#cccccc'),
          borderWidth: 0
      }]
    };
  });

  // --- CHART 3: BARRAS (Desempeño Áreas) ---
  const barChartData = computed(() => {
    const data = safeStats.value.desempenoAreas;
    return {
      labels: data.map(d => d.area),
      datasets: [
        { label: 'Total', backgroundColor: '#7480ff', data: data.map(d => d.total), borderRadius: 4 },
        { label: 'Completadas', backgroundColor: '#36d399', data: data.map(d => d.completadas), borderRadius: 4 },
        { label: 'Vencidas', backgroundColor: '#f471b5', data: data.map(d => d.vencidas), borderRadius: 4 },
        { label: 'Rechazadas', backgroundColor: '#f87272', data: data.map(d => d.rechazadas), borderRadius: 4 }
      ]
    };
  });

  const hBarChartData = computed(() => {
    const data = safeStats.value.tiemposPorArea;
    return {
      labels: data.map(d => d.area),
      datasets: [{
          label: 'Días Promedio',
          backgroundColor: '#f471b5', 
          data: data.map(d => d.dias),
          borderRadius: 4
      }]
    };
  });

  const kpis = computed(() => safeStats.value.kpis);

  const prioridades = computed(() => {
    const total = safeStats.value.prioridades.reduce((acc, curr) => acc + curr.cantidad, 0);
    const colorMap: Record<string, string> = {
      'Urgente': 'progress-error',
      'Alta': 'progress-warning',
      'Media': 'progress-info',
      'Baja': 'progress-secondary'
    };
    return safeStats.value.prioridades.map(p => ({
      label: p.prioridad,
      count: p.cantidad,
      percent: total > 0 ? Math.round((p.cantidad / total) * 100) : 0,
      color: colorMap[p.prioridad] || 'progress-primary'
    }));
  });

  const topSolicitantes = computed(() => {
    const colors = ['bg-primary text-primary-content', 'bg-secondary text-secondary-content', 'bg-accent text-accent-content', 'bg-info text-info-content', 'bg-neutral text-neutral-content'];
    return safeStats.value.topSolicitantes.map((user, index) => ({
      ...user,
      color: colors[index % colors.length] 
    }));
  });

  // ✅ CORRECCIÓN AQUÍ: Se lee 'topGestores' en lugar de 't'
  const topGestores = computed(() => {
    // Usamos una paleta diferente para diferenciar visualmente o la misma
    const colors = ['bg-indigo-500 text-white', 'bg-purple-500 text-white', 'bg-pink-500 text-white', 'bg-rose-500 text-white', 'bg-orange-500 text-white'];
    
    return safeStats.value.topGestores.map((user, index) => ({
      ...user,
      color: colors[index % colors.length] 
    }));
  });

  // --- ACTIONS ---
  function refreshDashboard() {
    refetch();
  }
  function changePeriod(newPeriod: string) {
    selectedPeriod.value = newPeriod;
  }

  return {
    selectedPeriod,
    selectedArea, 
    isLoading,
    error,
    stats: safeStats,
    areas, 
    lineChartData,
    pieChartData,
    barChartData,
    hBarChartData,
    kpis,
    topSolicitantes,
    topGestores, // 👈 No olvides exportarlo aquí
    prioridades,
    changePeriod,
    refreshDashboard
  };
});