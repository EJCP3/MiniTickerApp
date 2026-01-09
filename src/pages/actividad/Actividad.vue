<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { storeToRefs } from "pinia";
import { useQuery } from "@pinia/colada";
import { useActivityStore } from "@/stores/activityStore";
import { useDepartmentStore } from "@/stores/departmentStore";
import { useAuthStore } from "@/stores/authStore";
import userService from "@/services/usuarios";

// Componentes
import ActividadKPIs from "./ActividadKPIs.vue";
import BaseIcon from "@/components/BaseIcon.vue";
import TicketModal from "@/components/modal/TicketModal.vue";
import ActividadTable from "./ActividadTable.vue";
import ActividadCard from "./ActividadCard.vue";

// 👇 1. IMPORTAR EL NUEVO MODAL DE SISTEMA
import ActivityDetailModal from "@/components/ActivityDetailModal.vue";

import type { IconName } from "@/utils/icons";
import { useUIStore } from "@/stores/uiStore";

const store = useActivityStore();
const { activities, filterArea, filterUser, isLoading } = storeToRefs(store);
const { clearFilters } = store;

const uiStore = useUIStore();
const departmentStore = useDepartmentStore();
const authStore = useAuthStore();

// --- QUERY DE USUARIOS ---
const { data: allUsers } = useQuery({
  key: ["users-filter"],
  query: () => userService.getUsers(),
  staleTime: 1000 * 60 * 5,
});

const usersFiltered = computed(() => {
  const lista = allUsers.value || [];
  const miRol = authStore.user?.rol;
  const miId = authStore.user?.id;

  return lista.filter((usuario: any) => {
    if (usuario.id === miId) return true;
    if (miRol === "Admin") {
      return usuario.rol === "Gestor" || usuario.rol === "Solicitante";
    }
    if (miRol === "SuperAdmin") {
      return ["Gestor", "Admin", "Solicitante"].includes(usuario.rol);
    }
    return usuario.rol === "Gestor" || usuario.rol === "Solicitante";
  });
});

// --- FILTROS ---
const filterType = ref("Todos");

const filteredActivities = computed(() => {
  let data = activities.value || [];

  // 1. FILTRO POR TIPO (Lógica Avanzada)
  if (filterType.value !== "Todos") {
    const f = filterType.value;

    if (f === 'Sesion') {
      // Muestra Login y Logout
      data = data.filter((a: any) => ['Login', 'Logout'].includes(a.tipo));
    }
    else if (f === 'Usuarios') {
      // Muestra todo lo que empiece por "Usuario" (Creado, Editado, Estado)
      data = data.filter((a: any) => a.tipo.startsWith('Usuario')); 
    }
    else if (f === 'Areas') {
      // Muestra todo lo que empiece por "Area"
      data = data.filter((a: any) => a.tipo.startsWith('Area')); 
    }
    else if (f === 'Tipos') {
      // Muestra todo lo que empiece por "TipoSolicitud"
      data = data.filter((a: any) => a.tipo.startsWith('TipoSolicitud'));
    }
    else {
      // Para los Tickets, la coincidencia es exacta (ej: "ComentarioADD")
      data = data.filter((a: any) => a.tipo === f);
    }
  }

  // 2. FILTRO POR ÁREA (Este se mantiene igual)
  /* ... tu lógica existente de filtro por área ... */
  // Si no tienes lógica compleja aquí, usa esta simple:
  /*
  if (filterArea.value !== "Todas") {
     data = data.filter((act: any) => {
        // Si es ticket, filtramos por área si la tiene
        if (act.ticketId) return true; // Asumimos que el backend ya filtra tickets por área
        return true; // Eventos de sistema globales se muestran siempre o según tu preferencia
     });
  }
  */

  return data;
});

const isSystemFilter = computed(() => {
  const systemGroups = ['Sesion', 'Usuarios', 'Areas', 'Tipos'];
  return systemGroups.includes(filterType.value);
});

// 2. Observar cambios: Si elige sistema, forzamos Área a "Todas"
watch(filterType, (newValue) => {
  if (['Sesion', 'Usuarios', 'Areas', 'Tipos'].includes(newValue)) {
    filterArea.value = 'Todas'; 
  }
});

const hasActiveFilters = computed(() => {
  return (
    filterArea.value !== "Todas" ||
    filterUser.value !== "Todos" ||
    filterType.value !== "Todos"
  );
});

// --- LÓGICA DE MODALES (AQUÍ ESTÁ EL CAMBIO) ---

// Estado para Ticket Modal
const showModal = ref(false);
const selectedTicket = ref<any>(null);

// Estado para System Modal (Nuevo)
const showSystemModal = ref(false);
const selectedSystemActivity = ref<any>(null);

// 👇 FUNCIÓN INTELIGENTE DE APERTURA
const openDetail = (actividad: any) => {
  // CASO A: Es un Ticket (Tiene ID)
  if (actividad.ticketId) {
    selectedTicket.value = {
      id: actividad.ticketId,
      // Intentamos extraer el código del título "Ticket MAN-001", si falla ponemos fallback
      codigo: actividad.titulo.includes("Ticket")
        ? actividad.titulo.split("Ticket ")[1]
        : actividad.titulo,
      titulo: actividad.titulo,
      descripcion: actividad.mensaje,
    };
    showModal.value = true;
  }
  // CASO B: Es Evento de Sistema (No tiene Ticket ID)
  else {
    selectedSystemActivity.value = actividad;
    showSystemModal.value = true;
  }
};

</script>

<template>
  <main
    class="min-h-screen bg-base-200 p-6 md:p-10 font-sans text-base-content"
  >
    <div class="max-w-6xl mx-auto">
      <header class="mb-8 flex justify-between items-center">
        <h1 class="text-3xl font-bold">Actividad del Sistema</h1>
        <div
          v-if="isLoading"
          class="loading loading-spinner text-primary"
        ></div>
      </header>

      <ActividadKPIs :activities="activities" />

      <section
        class="bg-base-100 p-3 rounded-xl shadow-sm mb-10 border border-base-200 flex flex-wrap items-center gap-3"
      >
        <div
          class="flex items-center gap-2 px-2 text-base-content/60 font-semibold text-sm"
        >
          <BaseIcon name="filter" class="h-6 w-6" />
          Filtros
        </div>

        <select
          v-model="filterType"
          class="select select-bordered select-sm focus:outline-none"
        >
          <option value="Todos">Todos</option>

          <optgroup label="Tickets">
            <option value="Creado">Nuevo Ticket</option>
            <option value="CambioEstado">Movimientos</option>
            <option value="ComentarioADD">Comentarios</option>
            <option value="Asignado">Asignaciones</option>
          </optgroup>

          <optgroup label="Sistema">
            <option value="Sesion">Sesiones (Login/Logout)</option>
            <option value="Usuarios">Gestión de Usuarios</option>
            <option value="Areas">Gestión de Áreas</option>
            <option value="Tipos">Configuración (Tipos)</option>
          </optgroup>
        </select>

        <select
          v-model="filterArea"
          class="select select-bordered select-sm focus:outline-none"
          :disabled="isSystemFilter"
        >
          <option value="Todas">Todas las áreas</option>
          <option
            v-for="area in departmentStore.areas"
            :key="area.id"
            :value="area.id"
          >
            {{ area.nombre }}
          </option>
        </select>

        <select
          v-model="filterUser"
          class="select select-bordered select-sm focus:outline-none max-w-xs"
        >
          <option value="Todos">Todos los usuarios</option>
          <option v-for="user in usersFiltered" :key="user.id" :value="user.id">
            {{ user.nombre }}
          </option>
        </select>

        <button
          @click="clearFilters"
          class="btn btn-sm btn-ghost btn-circle text-error tooltip"
          data-tip="Limpiar filtros"
          :disabled="!hasActiveFilters"
        >
          <BaseIcon name="trash" class="h-5 w-5" />
        </button>
      </section>

      <section class="relative">
        <div
          class="absolute left-[2.2rem] top-4 bottom-4 w-px bg-base-300"
          aria-hidden="true"
        ></div>

        <div class="flex flex-col gap-8">
          <section class="relative">
            <transition name="fade" mode="out-in">
              <div v-if="uiStore.viewMode === 'grid'">
                <div
                  class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-y-6"
                >
                  <ActividadCard
                    v-for="actividad in filteredActivities"
                    :key="actividad.id"
                    :actividad="actividad"
                    @click="openDetail(actividad)"
                  />
                </div>
              </div>

              <ActividadTable
                v-else
                :activities="filteredActivities"
                @row-click="openDetail"
              />
            </transition>

            <div
              v-if="filteredActivities.length === 0 && !isLoading"
              class="py-12 text-center text-base-content/40"
            >
              <p>No hay actividad con estos filtros.</p>
            </div>
          </section>

          <div
            v-if="isLoading && filteredActivities.length === 0"
            class="pl-24 space-y-4"
          >
            <div class="skeleton h-32 w-full"></div>
            <div class="skeleton h-32 w-full"></div>
          </div>
        </div>
      </section>
    </div>

    <TicketModal
      :is-open="showModal"
      :ticket="selectedTicket"
      @close="showModal = false"
    />

    <ActivityDetailModal
      :is-open="showSystemModal"
      :activity="selectedSystemActivity"
      @close="showSystemModal = false"
    />
  </main>
</template>
