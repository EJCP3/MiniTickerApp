<script setup lang="ts">
import { computed, ref, watch } from "vue";
import BaseIcon from "../BaseIcon.vue";
import { useTicketStore } from "@/stores/ticketModalStore"; // Ajusta ruta si es ticketModalStore
import { useAuthStore } from "@/stores/authStore";

const store = useTicketStore();
const authStore = useAuthStore();

// Estados Enum (Asegúrate que coincidan con tu Backend: 0=Nueva, 1=EnProceso...)
const EstadoTicketEnum = {
  Nueva: 0, 
  EnProceso: 1,
  Resuelta: 2,
  Cerrada: 3,
  Rechazada: 4,
};

// Estado local
const nuevoEstado = ref<number | string>(""); 
const nuevoComentario = ref("");
const motivoRechazo = ref(""); 

// Computed
const isSubmitting = computed(() => store.isActionLoading);
const esAdmin = computed(() => authStore.user?.rol === 'Admin');

const requiereMotivo = computed(() => {
  return Number(nuevoEstado.value) === EstadoTicketEnum.Rechazada;
});

// Sincronizar select con estado actual del ticket al abrir
watch(() => store.currentTicket, (ticket) => {
    if (ticket) {
        // Mapeo inverso simple: Si el estado viene como string "EnProceso", buscamos su valor numérico
        const estadoStr = ticket.estado; 
        // Esto es un truco rápido. Lo ideal es que el backend mande el ID del estado.
        // Si no, lo dejamos vacío para que el usuario elija.
        if (estadoStr === 'EnProceso') nuevoEstado.value = 1;
        else if (estadoStr === 'Resuelta') nuevoEstado.value = 2;
        // etc...
    }
}, { immediate: true });


const guardarEstado = async () => {
  if (nuevoEstado.value === "") return;
  if (requiereMotivo.value && !motivoRechazo.value.trim()) {
      alert("Debes indicar un motivo para rechazar.");
      return;
  }
  
  await store.changeStatus(Number(nuevoEstado.value), motivoRechazo.value);
  motivoRechazo.value = "";
};

const publicarComentario = async () => {
  if (!nuevoComentario.value.trim()) return;
  await store.addComment(nuevoComentario.value);
  nuevoComentario.value = ""; 
};
</script>

<template>
  <div class="animate-fade-in space-y-6 pt-2">
    
    <div class="bg-base-200/50 p-4 rounded-xl border border-base-200">
      <h3 class="text-sm font-bold text-base-content mb-3 flex items-center gap-2">
         <BaseIcon name="refresh" class="h-4 w-4"/> Gestión de Estado
      </h3>
      
      <div class="flex flex-col gap-3">
        <div class="flex gap-2">
          <select
            v-model="nuevoEstado"
            class="select select-bordered bg-base-100 flex-1 w-full focus:outline-none focus:border-primary"
          >
            <option disabled value="">Seleccionar nuevo estado...</option>
            <option :value="EstadoTicketEnum.EnProceso">En Proceso</option>
            <option :value="EstadoTicketEnum.Resuelta">Resuelta</option>
            <option :value="EstadoTicketEnum.Rechazada" class="text-error font-bold">Rechazada</option>
            <option :value="EstadoTicketEnum.Cerrada" :disabled="!esAdmin">Cerrada (Admin)</option>
          </select>

          <button 
            @click="guardarEstado" 
            :disabled="isSubmitting || nuevoEstado === ''"
            class="btn btn-primary px-6"
          >
            <span v-if="isSubmitting" class="loading loading-spinner loading-xs"></span>
            <span v-else>Guardar</span>
          </button>
        </div>

        <div v-if="requiereMotivo" class="animate-fade-in-up">
            <input 
                v-model="motivoRechazo"
                type="text" 
                class="input input-bordered input-error w-full" 
                placeholder="Especifique el motivo del rechazo (Obligatorio)..." 
            />
        </div>
      </div>
    </div>

    <div>
      <h3 class="text-sm font-bold text-base-content mb-3 flex items-center gap-2">
        <BaseIcon name="chat" class="h-4 w-4"/> Agregar Nota / Comentario
      </h3>
      <div class="form-control">
        <textarea
          v-model="nuevoComentario"
          :disabled="isSubmitting"
          class="textarea textarea-bordered w-full h-32 bg-base-100 focus:outline-none focus:border-primary text-base"
          placeholder="Escribe un comentario..."
        ></textarea>
      </div>

      <button
        @click="publicarComentario"
        :disabled="isSubmitting || !nuevoComentario.trim()"
        class="btn btn-neutral w-full mt-4 flex items-center justify-center gap-2"
      >
        <span v-if="isSubmitting" class="loading loading-spinner loading-sm"></span>
        <template v-else>
          <BaseIcon name="send" class="h-5 w-5" />
          Publicar Comentario
        </template>
      </button>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in-up { animation: fadeInUp 0.3s ease-out; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>
