
<script setup lang="ts">
import { computed, ref, watch } from "vue";
import BaseIcon from "../BaseIcon.vue";
import { useTicketStore } from "@/stores/ticketModalStore"; 
import { useAuthStore } from "@/stores/authStore";

const store = useTicketStore();
const authStore = useAuthStore();

// ✅ Mapeo de pesos para control de flujo unidireccional
const EstadoTicketEnum = {
  Nueva: 0, 
  EnProceso: 1,
  Resuelta: 2,
  Cerrada: 3,
  Rechazada: 4,
};

const nuevoEstado = ref<number | string>(""); 
const nuevoComentario = ref("");
const motivoRechazo = ref(""); 

const isSubmitting = computed(() => store.isActionLoading);
const esAdmin = computed(() => authStore.user?.rol === 'Admin' || authStore.user?.rol === 'SuperAdmin');

// ✅ Obtener el peso numérico del estado actual del ticket
const pesoEstadoActual = computed(() => {
  const estado = store.currentTicket?.estado;
  if (typeof estado === 'number') return estado;
  
  // Mapeo por si el backend envía strings
  const mapa: Record<string, number> = {
    'Nueva': 0, 'EnProceso': 1, 'Resuelta': 2, 'Cerrada': 3, 'Rechazada': 4
  };
  return mapa[estado] ?? 0;
});

// ✅ Filtrar opciones para evitar retrocesos
const opcionesDisponibles = computed(() => {
  const actual = pesoEstadoActual.value;
  
  // Si el ticket ya está Cerrado (3) o Rechazado (4), no hay más cambios posibles
  if (actual >= 3) return [];

  const todas = [
    { label: 'En Proceso', value: EstadoTicketEnum.EnProceso, adminOnly: false },
    { label: 'Resuelta', value: EstadoTicketEnum.Resuelta, adminOnly: false },
    { label: 'Rechazada', value: EstadoTicketEnum.Rechazada, adminOnly: false },
    { label: 'Cerrada ', value: EstadoTicketEnum.Cerrada, adminOnly: true },
  ];

  // Solo retornar estados con peso mayor al actual
  return todas.filter(opt => {
    const cumpleFlujo = opt.value > actual;
    const cumpleRol = opt.adminOnly ? esAdmin.value : true;
    return cumpleFlujo && cumpleRol;
  });
});

const requiereMotivo = computed(() => {
  return Number(nuevoEstado.value) === EstadoTicketEnum.Rechazada;
});

watch(() => store.currentTicket, (ticket) => {
    nuevoEstado.value = ""; // Resetear al cambiar de ticket
    motivoRechazo.value = "";
}, { immediate: true });

const guardarEstado = async () => {
  if (nuevoEstado.value === "") return;
  if (requiereMotivo.value && !motivoRechazo.value.trim()) {
      alert("Debes indicar un motivo para rechazar.");
      return;
  }
  
  await store.changeStatus(Number(nuevoEstado.value), motivoRechazo.value);
  nuevoEstado.value = ""; 
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
    
    <div v-if="authStore.user?.rol !== 'Solicitante' && opcionesDisponibles.length > 0" 
         class="bg-base-200/50 p-4 rounded-xl border border-base-200">
      <h3 class="text-sm font-bold text-base-content mb-3 flex items-center gap-2">
         <BaseIcon name="refresh" class="h-4 w-4"/> Gestión de Estado
      </h3>
      
      <div class="flex flex-col gap-3">
        <div class="flex gap-2">
          <select
            v-model="nuevoEstado"
            class="select select-bordered bg-base-100 flex-1 w-full focus:outline-none focus:border-primary"
          >
            <option disabled value="">Seleccionar siguiente paso...</option>
            <option v-for="opt in opcionesDisponibles" 
                    :key="opt.value" 
                    :value="opt.value"
                    :class="{'text-error font-bold': opt.value === EstadoTicketEnum.Rechazada}"
            >
              {{ opt.label }}
            </option>
          </select>

          <button 
            @click="guardarEstado" 
            :disabled="isSubmitting || nuevoEstado === ''"
            class="btn btn-primary px-6"
          >
            <span v-if="isSubmitting" class="loading loading-spinner loading-xs"></span>
            <span v-else>Actualizar</span>
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

    <div v-else-if="pesoEstadoActual >= 3" class="alert alert-info shadow-sm py-2">
      <BaseIcon name="info" class="h-4 w-4" />
      <span class="text-xs">Este ticket se encuentra en un estado finalizado y no permite más cambios de estado.</span>
    </div>

    <div>
      <h3 class="text-sm font-bold text-base-content mb-3 flex items-center gap-2">
        <BaseIcon name="chat" class="h-4 w-4"/>{{ authStore.user?.rol === 'Solicitante' ? 'Aclaratoria o Mensaje' : 'Agregar Nota / Comentario' }}
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