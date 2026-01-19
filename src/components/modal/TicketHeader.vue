<script setup lang="ts">
import { computed } from "vue";
import { useTicketFormat } from "@/composables/useTicketFormat";
import BaseIcon from "../BaseIcon.vue";
import type { Ticket } from "@/types/modal";
import { useAuthStore } from "@/stores/authStore"; 
import { useTicketPdf } from "@/composables/useTicketPdf"; 

const props = defineProps<{
  ticket: Ticket;
  activeTab: string;
}>();

defineEmits(["change-tab", "edit-click"]);

const { getBadgePrioridad, getBadgeEstado } = useTicketFormat();
const authStore = useAuthStore();
const { generatePdf } = useTicketPdf();

const nombreCategoria = computed(() => {
  return (
    props.ticket.tipoSolicitud?.nombre || props.ticket.area?.nombre || "General"
  );
});

// --- PERMISOS ---

// 1. ¿Quién puede editar? (Solo Solicitante si está Nueva)
const isEditable = computed(() => {
  const esEstadoNuevo = props.ticket.estado === "Nueva" || props.ticket.estado === 0;
  const esMiTicket = authStore.user?.id === props.ticket.solicitante?.id;
  return esEstadoNuevo && esMiTicket;
});

// 2. ¿Quién puede ver el PDF? (Solo Admin y SuperAdmin)
const canDownloadPdf = computed(() => {
  const rol = authStore.user?.rol;
  return rol === 'Admin' || rol === 'SuperAdmin';
});

// 3. ¿Quién puede gestionar? (Mientras no esté cerrada)
const puedeGestionar = computed(() => {
  const estadosFinalizados = ["Cerrada", "Rechazada", "Vencida"];
  return !estadosFinalizados.includes(props.ticket.estado);
});

const tabsDisponibles = computed(() => {
  const tabs = ["details", "history"];
  if (puedeGestionar.value) {
    tabs.push("gestionar");
  }
  return tabs;
});
</script>

<template>
  <header class="p-6 pb-2 bg-base-100">
    <div class="flex flex-wrap items-center gap-3 mb-3">
      <span class="badge badge-lg border-none font-bold bg-primary/10 text-primary">
        {{ nombreCategoria }}
      </span>
      <span class="text-gray-400 font-mono text-sm font-semibold tracking-wide">
        {{ ticket.numero }}
      </span>
      <span :class="['badge badge-lg border-none font-bold', getBadgePrioridad(ticket.prioridad)]">
        {{ ticket.prioridad }}
      </span>

      <div class="ml-auto flex items-center gap-3">
        <button
          v-if="isEditable"
          @click="$emit('edit-click')"
          class="btn btn-sm btn-outline btn-primary gap-2 transition-all shadow-sm hover:shadow-md"
          title="Editar mi ticket"
        >
          <BaseIcon name="edit" class="h-4 w-4" />
          <span class="hidden sm:inline font-bold">Editar</span>
        </button>

        <div :class="['flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-bold', getBadgeEstado(ticket.estado)]">
          <BaseIcon name="infoCircle" class="h-4 w-4" />
          <span>{{ ticket.estado }}</span>
        </div>
      </div>
    </div>

    <h2 class="text-2xl font-extrabold text-base-content mb-6 leading-tight">
      {{ ticket.asunto }}
    </h2>

    <nav class="bg-base-200/60 p-1 rounded-xl flex gap-1 mb-2">
      <button
        v-for="tab in tabsDisponibles"
        :key="tab"
        @click="$emit('change-tab', tab)"
        class="flex-1 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 capitalize"
        :class="
          activeTab === tab
            ? 'bg-base-100 shadow-sm text-primary'
            : 'text-gray-500 hover:text-base-content hover:bg-base-200/50'
        "
      >
        <BaseIcon v-if="tab === 'details'" name="documentText" class="h-5 w-5" />
        <BaseIcon v-if="tab === 'history'" name="history" class="h-5 w-5" />
        <BaseIcon v-if="tab === 'gestionar'" name="chat" class="h-5 w-5" />
        {{
          tab === "gestionar"
            ? authStore.user?.rol === "Solicitante"
              ? "Comentar"
              : "Gestionar"
            : tab === "details"
            ? "Detalles"
            : "Historial"
        }}
        <span
          v-if="tab === 'history'"
          class="badge badge-sm badge-ghost font-normal"
        >{{ ticket.historial?.length || 0 }}</span>
      </button>

      <button
        v-if="canDownloadPdf"
        @click="generatePdf(ticket)"
        class="flex-1 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 text-gray-500 hover:text-base-content hover:bg-base-200/50"
        title="Descargar Reporte PDF"
      >
        <BaseIcon name="documentText" class="h-5 w-5" /> 
        <span>PDF</span>
      </button>
    </nav>
  </header>
</template>