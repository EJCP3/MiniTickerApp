<script setup lang="ts">
import { ref } from "vue";
import { gestoresOptions } from "@/types/department";
import BaseIcon from "@/components/BaseIcon.vue";

const props = defineProps<{ isOpen: boolean }>();
const emit = defineEmits(["close", "submit"]);

const isSubmitting = ref(false);
const newArea = ref({ nombre: "", responsableId: "" });

const handleSubmit = async () => {
  isSubmitting.value = true;
  await new Promise((r) => setTimeout(r, 800));
  emit("submit", newArea.value);
  isSubmitting.value = false;
  newArea.value = { nombre: "", responsableId: "" }; // Reset
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
      <h3 class="font-bold text-lg mb-4 flex items-center gap-2">
        <span
          class=" rounded bg-primary text-primary-content flex items-center justify-center"
          >
          <BaseIcon name="plus" class="size-10 " />
          </span
        >
        Nuevo Departamento
      </h3>
      <FormKit
        type="form"
        v-model="newArea"
        :actions="false"
        @submit="handleSubmit"
        form-class="space-y-4"
      >
        <FormKit
          type="text"
          name="nombre"
          label="Nombre"
          placeholder="Ej. Recursos Humanos"
          validation="required|length:3"
          label-class="label-text font-bold block mb-1"
          input-class="input input-bordered w-full focus:input-primary"
        />
        <div class="grid grid-cols-2 gap-4">
          <FormKit
            type="select"
            name="responsableId"
            label="Responsable de Área (opcional)"
            placeholder="Selecciona..."
            :options="gestoresOptions"
            label-class="label-text font-bold block mb-1"
            input-class="select select-bordered w-full focus:select-primary"
          />
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
            >Guardar
          </button>
        </div>
      </FormKit>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button @click="$emit('close')">close</button>
    </form>
  </dialog>
</template>
