<script setup lang="ts">
import { ref, watch, onUnmounted, computed } from "vue";
import { useTicketStore } from "@/stores/ticketModalStore";
import BaseIcon from "../BaseIcon.vue";
import TicketHeader from "./TicketHeader.vue";
import TicketDetails from "./TicketDetails.vue";
import TicketHistory from "./TicketHistory.vue";
import TicketActions from "./TicketActions.vue";
import TicketEdit from "./TicketEdit.vue";

// --- 1. PROPS ---
const props = defineProps<{
  isOpen: boolean;
  ticketId?: string;
  ticket?: any;
}>();

const emit = defineEmits(["close"]);
const activeTab = ref("details");
const store = useTicketStore();
const isEditing = ref(false);

// Resetear edición al cerrar modal
watch(
  () => props.isOpen,
  (val) => {
    if (!val) isEditing.value = false;
  }
);

// --- 2. COMPUTADA ID ---
const targetId = computed(() => {
  if (props.ticketId) return props.ticketId.toString();
  if (props.ticket && props.ticket.id) return props.ticket.id.toString();
  return null;
});

// --- 3. WATCH CARGA ---
watch(
  () => [props.isOpen, targetId.value],
  ([isOpen, newId]) => {
    if (isOpen && newId) {
      store.fetchTicket(newId.toString());
      activeTab.value = "details";
      isEditing.value = false;
    }
  },
  { immediate: true }
);

// --- 4. FUNCIONES CLAVE ---

const activarEdicion = () => {
  isEditing.value = true;
};

// ESTA ES LA FUNCIÓN QUE CIERRA LA PESTAÑA DE EDIT
const terminarEdicion = () => {
  isEditing.value = false; // 1. Apaga el modo edición
  activeTab.value = "details"; // 2. Vuelve a la pestaña de detalles
};

// Limpiar al desmontar
onUnmounted(() => {
  store.currentTicket = null;
});
</script>

<template>
  <dialog class="modal" :class="{ 'modal-open': isOpen }">
    <article
      class="modal-box w-11/12 max-w-2xl bg-base-100 p-0 overflow-hidden rounded-2xl shadow-2xl custom-scrollbar"
    >
      <button
        @click="emit('close')"
        class="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 z-50"
      >
        <BaseIcon name="close" class="h-6 w-6" />
      </button>

      <div v-if="store.isLoading" class="h-64 flex items-center justify-center">
        <span class="loading loading-spinner loading-lg text-primary"></span>
        <p class="ml-2 text-gray-400">Cargando ticket...</p>
      </div>

      <div v-else-if="store.error" class="p-10 text-center text-error">
        <p>{{ store.error }}</p>
      </div>

      <div v-else-if="store.currentTicket">
        <TicketHeader
          v-if="!isEditing"
          :ticket="store.currentTicket"
          :active-tab="activeTab"
          @change-tab="(tab) => (activeTab = tab)"
          @edit-click="activarEdicion"
        />

        <div class="px-6 pb-8 max-h-[65vh] overflow-y-auto custom-scrollbar">
          <TicketEdit
            v-if="isEditing"
            @cancel="terminarEdicion"
            @saved="terminarEdicion"
          />

          <template v-else>
            <TicketDetails
              v-if="activeTab === 'details'"
              :ticket="store.currentTicket"
            />

            <TicketHistory v-else-if="activeTab === 'history'" />

            <TicketActions v-else-if="activeTab === 'gestionar'" />
          </template>
        </div>
      </div>
    </article>

    <form method="dialog" class="modal-backdrop">
      <button @click="emit('close')">close</button>
    </form>
  </dialog>
</template>
