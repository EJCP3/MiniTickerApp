<script setup lang="ts">
import { ref, watch } from "vue";
import type { Area, TipoSolicitud } from "@/types/department";
import BaseIcon from "@/components/BaseIcon.vue";
import { toast } from "vue-sonner";

const props = defineProps<{
  isOpen: boolean;
  areaData: Area | null;
  types: TipoSolicitud[];
}>();

const emit = defineEmits(["close", "add", "delete", "toggle-status"]);

const newTypeInput = ref("");
const typeToDelete = ref<TipoSolicitud | null>(null);
const processingIds = ref<Set<string>>(new Set());

watch(
  () => props.types,
  () => {
    processingIds.value.clear();
  }
);

const handleAdd = () => {
  if (!newTypeInput.value.trim()) return;
  emit("add", newTypeInput.value);
  newTypeInput.value = "";
};

const prepararBorrado = (tipo: TipoSolicitud) => {
  if (tipo.tieneTickets) {
    toast.error("Acción Bloqueada", {
      description: "Este tipo de solicitud tiene historial y no puede eliminarse físicamente.",
      duration: 5000
    });
    return;
  }
  typeToDelete.value = tipo;
};

const executeDelete = () => {
  if (typeToDelete.value) {
    emit("delete", typeToDelete.value.id);
    typeToDelete.value = null;
  }
};

const handleToggle = (tipo: TipoSolicitud) => {
  if (processingIds.value.has(tipo.id)) return;
  processingIds.value.add(tipo.id);
  emit("toggle-status", {
    id: tipo.id,
    activo: !tipo.activo,
  });

  setTimeout(() => {
    if (processingIds.value.has(tipo.id)) {
      processingIds.value.delete(tipo.id);
    }
  }, 2000);
};
</script>

<template>
  <dialog class="modal" :class="{ 'modal-open': isOpen }">
    <div class="modal-box w-11/12 max-w-2xl bg-base-100">
      <form method="dialog">
        <button
          @click="$emit('close')"
          type="button"
          class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          ✕
        </button>
      </form>

      <header class="flex items-center gap-3 mb-6">
        <div class="w-10 h-10 rounded-lg bg-info/10 text-info flex items-center justify-center">
          <BaseIcon name="list" class="size-6" />
        </div>
        <div>
          <h3 class="font-bold text-lg text-base-content">Tipos de Solicitud</h3>
          <p class="text-xs text-base-content/60">
            Configurando:
            <span class="font-bold text-primary">{{ areaData?.nombre }}</span>
          </p>
        </div>
      </header>

      <section class="bg-base-200 p-4 rounded-lg mb-6 flex gap-2 items-end shadow-inner">
        <div class="flex-1">
          <label class="label text-xs font-bold text-base-content/50 uppercase">Agregar Nuevo Tipo</label>
          <input
            v-model="newTypeInput"
            @keyup.enter="handleAdd"
            type="text"
            placeholder="Ej. Reparación de Hardware..."
            class="input input-bordered w-full focus:input-primary bg-base-100 h-10"
          />
        </div>
        <button
          @click="handleAdd"
          type="button"
          class="btn btn-primary btn-sm h-10 px-4 font-bold text-white"
        >
          <BaseIcon name="plus" class="size-4 mr-1" />
          Agregar
        </button>
      </section>

      <section class="overflow-x-auto border border-base-200 rounded-lg shadow-sm min-h-[150px]">
        <table class="table w-full">
          <thead class="bg-base-200 text-base-content/70">
            <tr>
              <th scope="col">Nombre</th>
              <th scope="col" class="text-center">Estado</th>
              <th scope="col" class="text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="types.length === 0">
              <td colspan="3" class="text-center py-8 text-base-content/40 italic">
                Sin tipos configurados para este departamento.
              </td>
            </tr>
            <tr
              v-for="tipo in types"
              :key="tipo.id"
              class="hover:bg-base-200/50 transition-colors"
            >
              <td class="font-medium text-base-content">{{ tipo.nombre }}</td>
              <td class="text-center relative">
                <input
                  type="checkbox"
                  class="toggle toggle-success toggle-sm"
                  :class="{ 'opacity-50 cursor-wait': processingIds.has(tipo.id) }"
                  :checked="tipo.activo"
                  :disabled="processingIds.has(tipo.id)"
                  @click.prevent="handleToggle(tipo)"
                />
                <span
                  v-if="processingIds.has(tipo.id)"
                  class="loading loading-spinner loading-xs text-success absolute -right-4 top-1/2 -translate-y-1/2"
                ></span>
              </td>
              <td class="text-right">
                <button
                  @click="prepararBorrado(tipo)"
                  class="btn btn-square btn-ghost btn-xs"
                  :class="tipo.tieneTickets ? 'text-base-content/20' : 'text-error hover:bg-error/10'"
                  :title="tipo.tieneTickets ? 'No se puede eliminar: tiene historial' : 'Eliminar tipo'"
                >
                  <BaseIcon name="trash" class="size-4" />
                </button>
                <button
                  @click="handleToggle(tipo)"
                  class="btn btn-square btn-ghost btn-xs"
                >
                  <BaseIcon :name="tipo.activo ? 'eye' : 'eyeOff'" class="size-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <div class="modal-action">
        <button @click="$emit('close')" type="button" class="btn btn-ghost">Cerrar</button>
      </div>
    </div>
  </dialog>

  <dialog class="modal" :class="{ 'modal-open': typeToDelete !== null }">
    <div class="modal-box w-full max-w-sm bg-base-100 text-center shadow-xl border border-base-200">
      <div class="flex size-14 justify-center mb-4 text-error bg-error/10 rounded-full p-1 mx-auto">
        <BaseIcon name="alertCircle" class="size-12" />
      </div>
      <h3 class="font-bold text-lg text-base-content">¿Eliminar este tipo?</h3>
      <p class="py-4 text-sm text-base-content/70">
        Estás a punto de eliminar <span class="font-bold text-base-content">{{ typeToDelete?.nombre }}</span>. 
        Esta acción es permanente y no se puede deshacer.
      </p>
      <div class="modal-action justify-center gap-2 mt-2">
        <button @click="typeToDelete = null" type="button" class="btn btn-sm btn-ghost">Cancelar</button>
        <button @click="executeDelete" type="button" class="btn btn-sm btn-error text-white font-bold">
          Sí, eliminar
        </button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button @click="typeToDelete = null">close</button>
    </form>
  </dialog>
</template>