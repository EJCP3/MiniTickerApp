import { ref } from 'vue';
import * as XLSX from 'xlsx';
import { useDashboardStore } from '@/stores/reportStore';

export function useExcelExport() {
  const isExporting = ref(false);
  const dashboardStore = useDashboardStore();

  const exportToExcel = () => {
    if (dashboardStore.isLoading) return;
    isExporting.value = true;

    try {
      const wb = XLSX.utils.book_new();

      // -----------------------------------------------------------------------
      // HOJA 1: RESUMEN GENERAL (KPIs)
      // -----------------------------------------------------------------------
      const resumenData = [
        { Métrica: "Total Solicitudes", Valor: dashboardStore.kpis.total },
        { Métrica: "Completadas", Valor: dashboardStore.kpis.completadas },
        { Métrica: "Pendientes", Valor: dashboardStore.kpis.pendientes },
        { Métrica: "En Proceso", Valor: dashboardStore.kpis.enProceso },
        { Métrica: "Vencidas", Valor: dashboardStore.kpis.vencidas },
        { Métrica: "Rechazadas", Valor: dashboardStore.kpis.rechazadas },
        { Métrica: "Tasa de Resolución", Valor: `${dashboardStore.kpis.tasaResolucion}%` },
        { Métrica: "Tiempo Promedio", Valor: `${dashboardStore.kpis.tiempoPromedio} días` },
        { Métrica: "Satisfacción", Valor: dashboardStore.kpis.satisfaccion || "N/A" }
      ];
      const wsResumen = XLSX.utils.json_to_sheet(resumenData);
      wsResumen['!cols'] = [{ wch: 25 }, { wch: 15 }]; // Ancho de columnas
      XLSX.utils.book_append_sheet(wb, wsResumen, "Resumen General");

      // -----------------------------------------------------------------------
      // HOJA 2: TENDENCIA TEMPORAL (Datos del Gráfico de Línea)
      // -----------------------------------------------------------------------
      const tendenciaData = dashboardStore.stats.tendencia.map(t => ({
        Periodo: t.mes,
        Total: t.total,
        Completadas: t.completadas,
        Vencidas: t.vencidas,
        Rechazadas: t.rechazadas
      }));
      const wsTendencia = XLSX.utils.json_to_sheet(tendenciaData);
      wsTendencia['!cols'] = [{ wch: 15 }, { wch: 10 }, { wch: 15 }, { wch: 10 }, { wch: 15 }];
      XLSX.utils.book_append_sheet(wb, wsTendencia, "Tendencia Temporal");

      // -----------------------------------------------------------------------
      // HOJA 3: TOP SOLICITANTES
      // -----------------------------------------------------------------------
      const solicitantesData = dashboardStore.topSolicitantes.map((s, index) => ({
        Ranking: index + 1,
        Nombre: s.nombre,
        Cantidad: s.cantidad
      }));
      const wsSolicitantes = XLSX.utils.json_to_sheet(solicitantesData);
      wsSolicitantes['!cols'] = [{ wch: 10 }, { wch: 30 }, { wch: 10 }];
      XLSX.utils.book_append_sheet(wb, wsSolicitantes, "Top Solicitantes");

      // -----------------------------------------------------------------------
      // HOJA 4: TOP GESTORES (Detallado)
      // -----------------------------------------------------------------------
      const gestoresData = dashboardStore.topGestores.map((g, index) => ({
        Ranking: index + 1,
        Nombre: g.nombre,
        Area: g.area || 'N/A',
        Total_Asignados: g.cantidad,
        En_Proceso: g.enProceso,
        Resueltas: g.resueltas,
        Rechazadas: g.rechazadas,
        Vencidas: g.vencidas
      }));
      const wsGestores = XLSX.utils.json_to_sheet(gestoresData);
      wsGestores['!cols'] = [{ wch: 10 }, { wch: 25 }, { wch: 20 }, { wch: 15 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }];
      XLSX.utils.book_append_sheet(wb, wsGestores, "Top Gestores");

      // -----------------------------------------------------------------------
      // HOJA 5: POR PRIORIDAD
      // -----------------------------------------------------------------------
      const prioridadData = dashboardStore.prioridades.map(p => ({
        Prioridad: p.label,
        Cantidad: p.count,
        Porcentaje: `${p.percent}%`
      }));
      const wsPrioridad = XLSX.utils.json_to_sheet(prioridadData);
      XLSX.utils.book_append_sheet(wb, wsPrioridad, "Por Prioridad");

      // -----------------------------------------------------------------------
      // HOJA 6: ESTATUS (Datos del Gráfico de Dona)
      // -----------------------------------------------------------------------
      const estatusData = dashboardStore.stats.estatus.map(e => ({
        Estado: e.estado,
        Cantidad: e.cantidad
      }));
      const wsEstatus = XLSX.utils.json_to_sheet(estatusData);
      XLSX.utils.book_append_sheet(wb, wsEstatus, "Estatus Global");

      // -----------------------------------------------------------------------
      // HOJA 7: DESEMPEÑO POR ÁREA
      // -----------------------------------------------------------------------
      const areasData = dashboardStore.stats.desempenoAreas.map(a => ({
        Area: a.area,
        Total: a.total,
        Completadas: a.completadas,
        Vencidas: a.vencidas,
        Rechazadas: a.rechazadas
      }));
      const wsAreas = XLSX.utils.json_to_sheet(areasData);
      wsAreas['!cols'] = [{ wch: 25 }, { wch: 10 }, { wch: 15 }, { wch: 10 }, { wch: 15 }];
      XLSX.utils.book_append_sheet(wb, wsAreas, "Desempeño Áreas");

      // -----------------------------------------------------------------------
      // HOJA 8: TIEMPOS PROMEDIO
      // -----------------------------------------------------------------------
     

      // -----------------------------------------------------------------------
      // GUARDAR ARCHIVO
      // -----------------------------------------------------------------------
      const dateStr = new Date().toLocaleDateString().replace(/\//g, "-");
      const fileName = `Reporte_MiniTicker_${dashboardStore.selectedPeriod}_${dateStr}.xlsx`;
      
      XLSX.writeFile(wb, fileName);

    } catch (error) {
      console.error("Error exportando a Excel:", error);
      alert("Hubo un error al generar el reporte.");
    } finally {
      isExporting.value = false;
    }
  };

  return {
    isExporting,
    exportToExcel
  };
}