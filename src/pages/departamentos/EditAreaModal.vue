<script setup lang="ts">
import { ref, watch } from "vue";
import { gestoresOptions, type Area } from "@/types/department";

const props = defineProps<{ isOpen: boolean; areaData: Area | null }>();
const emit = defineEmits(["close", "submit"]);

const isSubmitting = ref(false);
const editingArea = ref<Partial<Area>>({});

watch(
  () => props.areaData,
  (newVal) => {
    if (newVal) {
      editingArea.value = { ...newVal };
    }
  }
);

const handleSubmit = async () => {
  isSubmitting.value = true;
  await new Promise((r) => setTimeout(r, 800));
  emit("submit", editingArea.value);
  isSubmitting.value = false;
};
</script>

<template>
  <dialog class="modal" :class="{ 'modal-open': isOpen }">
    <div class="modal-box max-w-lg">
      <form method="dialog">
        <button
          @click="$emit('close')"
          class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          ✕
        </button>
      </form>
      <h3 class="font-bold text-lg mb-4">Editar Departamento</h3>
      <FormKit
        v-if="areaData"
        type="form"
        v-model="editingArea"
        :actions="false"
        @submit="handleSubmit"
        form-class="space-y-4"
      >
        <FormKit
          type="text"
          name="nombre"
          label="Nombre"
          validation="required|length:3"
          label-class="label-text font-bold block mb-1"
          input-class="input input-bordered w-full focus:input-primary"
        />
        <FormKit
          type="text"
          name="prefijo"
          label="Prefijo"
          label-class="label-text font-bold block mb-1"
          input-class="input input-bordered w-full  text-base-content/50"
        />
        <FormKit
          type="select"
          name="responsableId"
          label="Cambiar Responsable"
          :options="gestoresOptions"
          validation="required"
          label-class="label-text font-bold block mb-1"
          input-class="select select-bordered w-full focus:select-primary"
        />
        <div class="form-control">
          <FormKit
            type="checkbox"
            name="estado"
            label="Departamento Activo"
            outer-class="form-control"
            wrapper-class="flex items-center gap-3 p-3 border border-base-300 rounded-lg cursor-pointer"
            label-class="label-text font-bold cursor-pointer flex-1"
            input-class="checkbox checkbox-primary"
          >
            <template #label="context"
              ><span class="flex-1 font-bold">Estado</span
              ><span
                class="badge"
                :class="
                  context.value
                    ? 'badge-success text-white'
                    : 'badge-error text-white'
                "
                >{{ context.value ? "Operativo" : "Deshabilitado" }}</span
              ></template
            >
          </FormKit>
        </div>
        <div class="modal-action">
          <button type="button" @click="$emit('close')" class="btn btn-ghost">
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="btn btn-primary"
          >
            <span v-if="isSubmitting" class="loading loading-spinner"></span
            >Actualizar
          </button>
        </div>
      </FormKit>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button @click="$emit('close')">close</button>
    </form>
  </dialog>
</template>
