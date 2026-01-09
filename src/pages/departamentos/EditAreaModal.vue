<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useDepartmentStore } from "@/stores/departmentStore";
import type { Area } from "@/types/department";
import { toast } from "vue-sonner";
import BaseIcon from "@/components/BaseIcon.vue";

const props = defineProps<{
  isOpen: boolean;
  areaData: Area | null;
  onSubmit: (data: any) => Promise<void>;
}>();
const emit = defineEmits(["close"]);

const store = useDepartmentStore();
const { gestoresOptions } = storeToRefs(store);

const isSubmitting = ref(false);
const editingArea = ref<Partial<Area>>({});

// --- ESTADOS PARA EL MINI MODAL DE DESVINCULACIÓN ---
const showConfirmModal = ref(false);
const pendingOldVal = ref<string | null>(null);

const gestoresConNulo = computed(() => {
  return [{ value: null, label: "Sin Responsable" }, ...gestoresOptions.value];
});

// --- WATCHERS ---

watch(
  () => props.areaData,
  (newVal) => {
    if (newVal) {
      editingArea.value = {
        ...newVal,
        activo: Boolean(newVal.activo),
        responsableId: newVal.responsableId || null,
      };
    }
  },
  { immediate: true }
);

// Lógica de detección de cambio a "Sin Responsable"
watch(
  () => editingArea.value.responsableId,
  (newVal, oldVal) => {
    // Si el usuario cambia manualmente a null, abrimos el mini modal en lugar del confirm
    if (props.isOpen && oldVal && newVal === null && props.areaData?.id) {
      pendingOldVal.value = oldVal;
      showConfirmModal.value = true;
    }
  }
);

// --- ACCIONES DEL MINI MODAL ---

const cancelUnbind = () => {
  // Revertimos el select al valor que tenía antes
  editingArea.value.responsableId = pendingOldVal.value;
  showConfirmModal.value = false;
  pendingOldVal.value = null;
};

const executeUnbind = async () => {
  if (!pendingOldVal.value || !props.areaData?.id) return;

  try {
    showConfirmModal.value = false;
    isSubmitting.value = true;

    await store.removerResponsable(props.areaData.id, pendingOldVal.value);
    toast.success("Gestor desvinculado correctamente");
    pendingOldVal.value = null;
  } catch (error: any) {
    const msg = error.response?.data?.message || "Error al desvincular";
    toast.error(msg);
    // Si falla la API, regresamos el valor en el select
    editingArea.value.responsableId = pendingOldVal.value;
  } finally {
    isSubmitting.value = false;
  }
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  const payload = {
    ...editingArea.value,
   
    responsableId: editingArea.value.responsableId || null,
    activo: editingArea.value.activo,
  };

  console.log(payload)
  try {
    await props.onSubmit(payload);
    toast.success("Área actualizada correctamente");
    emit("close");
  } catch (error: any) {
    const msg = error.response?.data?.message || "Error al actualizar";
    toast.error(msg);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <dialog class="modal" :class="{ 'modal-open': isOpen }">
    <div class="modal-box max-w-lg bg-base-100 p-0 overflow-hidden shadow-2xl">
      <div class="p-6 pb-0 flex justify-between items-center">
        <h3 class="font-bold text-xl flex items-center gap-2">
          <span class="p-2 bg-primary/10 text-primary rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </span>
          Editar Área
        </h3>
        <button
          @click="$emit('close')"
          type="button"
          class="btn btn-sm btn-circle btn-ghost"
        >
          ✕
        </button>
      </div>

      <FormKit
        v-if="editingArea.id"
        type="form"
        v-model="editingArea"
        :actions="false"
        @submit="handleSubmit"
        form-class="p-6 space-y-5"
      >
        <div class="grid grid-cols-1 gap-4">
          <FormKit
            type="text"
            name="nombre"
            label="Nombre del Departamento"
            validation="required|length:2"
            label-class="label-text font-bold block mb-1"
            input-class="input input-bordered w-full focus:input-primary bg-base-200/50"
          />
          <FormKit
            type="text"
            name="prefijo"
            label="Prefijo Identificador"
            help="El prefijo es generado automáticamente por el sistema"
            label-class="label-text font-bold block mb-1"
            input-class="input input-bordered w-full text-base-content/50 bg-base-300/30"
            help-class="text-[10px] mt-1 opacity-60"
          />
          <FormKit
            type="select"
            name="responsableId"
            label="Responsable Asignado"
            :options="gestoresConNulo"
            label-class="label-text font-bold block mb-1"
            input-class="select select-bordered w-full focus:select-primary bg-base-200/50"
          />
        </div>

        <div class="bg-base-200/50 rounded-xl p-4 border border-base-300">
          <FormKit
            type="checkbox"
            name="activo"
            label="Estado de Operación"
            :value="editingArea.activo"
            wrapper-class="flex items-center justify-between"
            label-class="label-text font-bold cursor-pointer"
            input-class="checkbox checkbox-primary"
          />
        </div>

        <div class="modal-action bg-base-200 p-4 -mx-6 -mb-6 mt-4 flex gap-2">
          <button
            type="button"
            @click="$emit('close')"
            class="btn btn-ghost flex-1"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="btn btn-primary flex-1 text-white"
          >
            <span v-if="isSubmitting" class="loading loading-spinner"></span>
            <span v-else>Guardar Cambios</span>
          </button>
        </div>
      </FormKit>
    </div>
    <div class="modal-backdrop" @click="$emit('close')"></div>
  </dialog>

  <dialog class="modal" :class="{ 'modal-open': showConfirmModal }">
    <div
      class="modal-box w-full max-w-sm bg-base-100 text-center shadow-xl border border-base-200"
    >
      <div
        class="flex size-14 justify-center mb-4 text-warning bg-warning/10 rounded-full p-1 mx-auto"
      >
        <BaseIcon name="alertCircle" class="size-12" />
      </div>
      <h3 class="font-bold text-lg text-base-content">
        ¿Quitar gestor actual?
      </h3>
      <p class="py-4 text-sm text-base-content/70">
        Esta acción desvinculará al responsable del área. El usuario ya no
        aparecerá como responsable de este departamento.
      </p>
      <div class="modal-action justify-center gap-2 mt-2">
        <button
          @click="cancelUnbind"
          type="button"
          class="btn btn-sm btn-ghost"
        >
          Cancelar
        </button>
        <button
          @click="executeUnbind"
          type="button"
          class="btn btn-sm btn-warning text-white font-bold"
        >
          Sí, desvincular
        </button>
      </div>
    </div>
    <div class="modal-backdrop" @click="cancelUnbind"></div>
  </dialog>
</template>
