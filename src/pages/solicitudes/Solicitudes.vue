<script setup lang="ts">
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { utils, writeFile } from 'xlsx';
import { useRouter } from "vue-router";
import SolicitudCard from "./SolicitudCard.vue";
import { useUIStore } from "@/stores/uiStore";
import SolicitudTable from "./SolicitudTable.vue";
import BaseIcon from "@/components/BaseIcon.vue";
import TicketModal from "@/components/modal/TicketModal.vue";
import { useSolicitudesStore } from "@/stores/useSolicitudesStore";
import { useAuthStore } from "@/stores/authStore";
const authStore = useAuthStore(); // <--- Instanciamos el store de auth
import { ref } from "vue";

const router = useRouter();
const uiStore = useUIStore();
const store = useSolicitudesStore();

// Desestructuramos el estado (Refs) usando storeToRefs
const {
  searchTerm,
  typeFilter,
  priorityFilter,
  activeTab,
  filteredSolicitudes,
  counts,
  areasList,
  isLoading,
  hasGestorFilter, // Nuevo
  currentPage, // Nuevo
  totalPages,
} = storeToRefs(store);

// Las acciones se usan directo del store
onMounted(() => {
  store.fetchAreas();
});

const irACrear = () => router.push("/crear-solicitud");

const isModalOpen = ref(false);
const selectedTicketId = ref<string | undefined>(undefined);

const abrirTicket = (uuid: string) => {
  console.log("Abriendo ticket:", uuid);
  selectedTicketId.value = uuid;
  isModalOpen.value = true;
};

const cerrarModal = () => {
  isModalOpen.value = false;
  selectedTicketId.value = undefined;
  // Opcional: Recargar la lista al cerrar por si hubo cambios
  // store.refetch();
};

const descargarExcel = () => {
  // 1. Verificamos que haya datos
  if (!filteredSolicitudes.value || filteredSolicitudes.value.length === 0) return;

  // 2. Mapeamos los datos EXACTAMENTE como están en tu interfaz 'Solicitud'
  // Esto soluciona el problema de celdas vacías
  const datosParaExcel = filteredSolicitudes.value.map((item) => ({
    "Código": item.id,            // Interfaz Solicitud: .id
    "Asunto": item.titulo,        // Interfaz Solicitud: .titulo
    "Solicitante": item.solicitante,
    "Área / Tipo": item.tipo,     // Interfaz Solicitud: .tipo
    "Prioridad": item.prioridad,
    "Estado": item.estado,
    "Gestor Asignado": item.responsable || "Sin asignar", // Manejo de nulos
    "Fecha Creación": item.fecha, // Interfaz Solicitud: .fecha
    "Descripción": item.descripcion
  }));

  // 3. Crear hoja de cálculo (Worksheet)
  const worksheet = utils.json_to_sheet(datosParaExcel);

  // Opcional: Ajustar ancho de columnas automáticamente
  const columnWidths = [
    { wch: 15 }, // Código
    { wch: 30 }, // Asunto
    { wch: 20 }, // Solicitante
    { wch: 15 }, // Área
    { wch: 10 }, // Prioridad
    { wch: 12 }, // Estado
    { wch: 20 }, // Gestor
    { wch: 15 }, // Fecha
    { wch: 40 }  // Descripción
  ];
  worksheet['!cols'] = columnWidths;

  // 4. Crear libro (Workbook) y añadir la hoja
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, "Solicitudes");

  // 5. Generar nombre de archivo con fecha
  const date = new Date().toISOString().split('T')[0];
  const fileName = `Reporte_Solicitudes_${date}.xlsx`;

  // 6. Descargar
  writeFile(workbook, fileName);
};
</script>
<template>
  <main
    class="min-h-screen bg-base-200 p-6 md:p-10 font-sans text-base-content"
  >
    <div class="max-w-7xl mx-auto">
      <header
        class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8"
      >
        <div>
          <h1 class="text-3xl font-bold mb-1">Solicitudes</h1>
          <p class="text-base-content/70 text-sm">
            Gestión completa de solicitudes del sistema
          </p>
        </div>

        <div class="flex gap-3">
          <button
            v-if="['Admin', 'SuperAdmin'].includes(authStore.user?.rol)"
            @click="descargarExcel"
            :disabled="filteredSolicitudes.length === 0"
            class="btn btn-outline btn-success gap-2"
            title="Exportar tabla actual a Excel"
          >
            <BaseIcon name="documentText" class="size-5" />
            <span class="hidden sm:inline">Excel</span>
          </button>

          <button
            v-if="authStore.user?.rol === 'Solicitante'"
            @click="irACrear"
            class="btn btn-primary gap-2 shadow-lg shadow-primary/20 text-white"
            aria-label="Crear nueva solicitud"
          >
            <BaseIcon name="plus" class="size-10" />
            <span class="hidden sm:inline">Nueva Solicitud</span>
          </button>
        </div>
      </header>

      <section
        class="bg-base-100 p-4 rounded-box shadow-sm mb-6 border border-base-200"
      >
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div class="md:col-span-5">
            <label
              class="input input-bordered flex items-center gap-2 bg-base-200/50"
            >
              <BaseIcon name="search" class="size-6 opacity-70" />
              <input
                v-model="searchTerm"
                type="text"
                class="grow"
                placeholder="Buscar..."
              />
            </label>
          </div>

          <div class="md:col-span-3">
            <select
              v-if="authStore.user?.rol !== 'Gestor'"
              v-model="typeFilter"
              class="select select-bordered w-full"
            >
              <option value="todos">Todas las áreas</option>
              <option
                v-for="area in areasList"
                :key="area.value"
                :value="area.value"
              >
                {{ area.label }}
              </option>
            </select>

            <div
              v-else
              class="flex items-center h-full px-4 border border-base-300 rounded-lg bg-base-200/50 font-bold text-primary italic text-sm"
            >
              Área: {{ authStore.user?.areaNombre || "Sin asignar todavía" }}
            </div>
          </div>

          <div class="md:col-span-2">
            <select
              v-model="priorityFilter"
              class="select select-bordered w-full bg-base-300 focus:bg-base-100"
            >
              <option value="todas">Prioridades</option>
              <option value="Baja">Baja</option>
              <option value="Media">Media</option>
              <option value="Alta">Alta</option>
            </select>
          </div>

          <div class="md:col-span-2">
            <select
              v-model="hasGestorFilter"
              class="select select-bordered w-full bg-base-200/50"
            >
              <option value="todos">Todos (Asignación)</option>
              <option value="con">Con Gestor</option>
              <option value="sin">Sin Gestor</option>
            </select>
          </div>
        </div>
      </section>
      <nav
        aria-label="Filtrar por estado de solicitud"
        class="flex w-full flex-wrap gap-2 mb-8"
      >
        <button
          v-for="tab in (['todas', 'nueva', 'proceso', 'resuelta', 'cerrada', 'rechazada', 'vencida'] as const)"
          :key="tab"
          @click="activeTab = tab"
          class="flex-1 btn btn-sm rounded-full font-medium transition-all duration-200 gap-2 border capitalize"
          :class="
            activeTab === tab
              ? 'btn-primary shadow-md shadow-primary/30 border-primary text-white'
              : 'btn-ghost border-base-300 text-base-content hover:bg-base-200 hover:border-base-400'
          "
          :aria-current="activeTab === tab ? 'page' : undefined"
        >
          {{ tab }}

          <span
            class="badge badge-sm font-bold border-none"
            :class="
              activeTab === tab
                ? 'bg-white/20 text-white'
                : 'bg-base-content/10 text-base-content/70'
            "
          >
            {{ counts[tab] || 0 }}
          </span>
        </button>
      </nav>
      <section class="relative min-h-[200px]">
        <div
          v-if="isLoading"
          class="absolute inset-0 bg-base-200/50 z-10 flex items-center justify-center backdrop-blur-sm"
        >
          <span class="loading loading-spinner loading-lg text-primary"></span>
        </div>

        <transition name="fade" mode="out-in">
          <div
            v-if="uiStore.viewMode === 'grid'"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <SolicitudCard
              v-for="solicitud in filteredSolicitudes"
              :key="solicitud.id"
              :solicitud="solicitud"
              @click="abrirTicket(solicitud.uuid)"
            />
          </div>

          <SolicitudTable
            v-else
            :solicitudes="filteredSolicitudes"
            @row-click="abrirTicket"
          />
        </transition>

        <div
          v-if="!isLoading && filteredSolicitudes.length === 0"
          class="col-span-full text-center py-20 opacity-50 flex flex-col items-center"
        >
          <BaseIcon name="search" class="h-12 w-12 mb-4 opacity-20" />
          <p class="text-xl font-bold">No se encontraron resultados</p>
          <p class="text-sm">Intenta ajustar los filtros de búsqueda</p>
        </div>
      </section>

      <footer v-if="totalPages > 1" class="flex justify-center mt-10">
        <div class="join shadow-sm border border-base-300">
          <button
            class="join-item btn btn-sm"
            :disabled="currentPage === 1"
            @click="currentPage--"
          >
            «
          </button>

          <button class="join-item btn btn-sm bg-base-100 no-animation">
            Página {{ currentPage }} de {{ totalPages }}
          </button>

          <button
            class="join-item btn btn-sm"
            :disabled="currentPage === totalPages"
            @click="currentPage++"
          >
            »
          </button>
        </div>
      </footer>

      <TicketModal
        :is-open="isModalOpen"
        :ticket-id="selectedTicketId"
        @close="cerrarModal"
      />
    </div>
  </main>
</template>
