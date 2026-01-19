<script setup lang="ts">
import { onMounted, ref } from "vue";
import Chart from "primevue/chart";
import { useDashboardStore } from "@/stores/reportStore";
import { commonOptions, pieOptions, hBarOptions } from "@/utils/chartConfig";

// Componentes Hijos
import ReportHeader from "./ReportHeader.vue";
import ReportKpis from "./ReportKpis.vue";
import TopListWidget from "./TopListWidget.vue"; // O tus widgets específicos
import PriorityWidget from "./PriorityWidget.vue";
import TopListGestorWidget from "./TopListGestorWidget.vue";
import TopListUserWidget from "./TopListUserWidget.vue";
import PerfilModal from "@/components/PerfilModal.vue"; 
import usuarios from "@/services/usuarios";

const dashboardStore = useDashboardStore();

// --- Lógica del Modal ---
const perfilModalDashboardRef = ref<InstanceType<typeof PerfilModal> | null>(null);const selectedUser = ref(null); // Usuario seleccionado

// Esta función se ejecuta cuando clickeas un usuario en las listas
const handleViewProfile = async (user: any) => {
  console.log("Usuario clickeado:", user); // Para depurar

  if (!user || !user.id) {
    console.error("El usuario no tiene ID, no se puede cargar perfil completo.");
    return;
  }

  try {
    // 1. Intentamos cargar los datos completos desde la API
    const fullUser = await usuarios.getUserById(user.id);
    selectedUser.value = fullUser;
  } catch (error) {
    console.warn("No se pudo cargar detalle completo, usando datos básicos.", error);
    
    // 2. FALLBACK: Si falla la API, usamos lo que ya tenemos en el widget
    // Mapeamos los datos del reporte a la estructura del perfil
    selectedUser.value = {
      ...user,
      email: user.email || 'Correo no disponible en reporte',
      rol: user.rol || 'Gestor', // O adivinar según el widget
      fechaCreacion: new Date().toISOString()
    };
  }
  
  // 3. Abrimos el modal
 perfilModalDashboardRef.value?.openModal();
};
onMounted(() => {
  dashboardStore.refreshDashboard();
});
</script>

<template>
  <div class="min-h-screen p-6 font-sans text-base-content bg-base-200/30">
    
    <ReportHeader />

    <div v-if="dashboardStore.isLoading" class="flex justify-center py-20">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>

    <div v-else class="space-y-6">
      
      <ReportKpis />

      <div class="card bg-base-100 shadow-xl">
        <div class="card-body p-6">
          <h3 class="card-title text-sm opacity-70">
            <i class="pi pi-chart-line text-primary"></i> Tendencia Temporal
          </h3>
          <div class="h-[300px]">
            <Chart type="line" :data="dashboardStore.lineChartData" :options="commonOptions" class="h-full" />
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <TopListUserWidget 
          title="Top Solicitantes" 
          :items="dashboardStore.topSolicitantes" 
          icon="pi-users"
          @view-profile="handleViewProfile"        />
        
        <TopListGestorWidget 
          title="Top Gestores" 
          :items="dashboardStore.topGestores" 
          icon="pi-briefcase"
          @view-profile="handleViewProfile"
        />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="h-full">
          <PriorityWidget class="h-full" />
        </div>
        <div class="card bg-base-100 shadow-xl h-full">
          <div class="card-body p-6">
            <h3 class="card-title text-sm opacity-70">
              <i class="pi pi-chart-pie text-secondary"></i> Distribución por Estatus
            </h3>
            <div class="h-[250px] flex justify-center items-center">
              <Chart type="doughnut" :data="dashboardStore.pieChartData" :options="pieOptions" class="h-full w-full" />
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body p-6">
            <h3 class="card-title text-sm opacity-70">
              <i class="pi pi-chart-bar text-primary"></i> Desempeño por Área
            </h3>
            <div class="h-[250px]">
              <Chart type="bar" :data="dashboardStore.barChartData" :options="commonOptions" class="h-full" />
            </div>
          </div>
        </div>
      </div>

    </div>

    <PerfilModal 
      ref="perfilModalDashboardRef" 
      :user="selectedUser" 
    />

  </div>
</template>