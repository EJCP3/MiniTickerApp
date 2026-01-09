<script setup lang="ts">
import { ref } from "vue";
import BaseIcon from "@/components/BaseIcon.vue";
import { storeToRefs } from "pinia";
import { useDepartmentStore } from "@/stores/departmentStore";
import { toast } from "vue-sonner";


// 1. AÑADIDO: isSubmitting ahora entra como Prop porque lo controla el Store/Padre
const props = defineProps<{ 
  isOpen: boolean;
  onSubmit: (data: any) => Promise<void>; // Opcional, por defecto false si no se pasa
}>();
const isSubmitting = ref(false);
const store = useDepartmentStore();
const { gestoresOptions } = storeToRefs(store);

const emit = defineEmits(["close", "submit"]);

const newArea = ref({ nombre: "", responsableId: null });



const handleSubmit = async () => {
  isSubmitting.value = true;
  
  try {
    // 1. Ejecutamos la creación
    await props.onSubmit(newArea.value);
    
    // 2. Disparamos el toast INMEDIATAMENTE
    if (newArea.value.responsableId) {
      // Caso con Gestor
      toast.success(`Área creada: ${newArea.value.nombre}`, {
        description: "El área y su responsable han sido vinculados correctamente.",
      });
    } else {
      // Caso sin Gestor
      toast.success(`Área creada: ${newArea.value.nombre}`, {
        description: "El área se creó correctamente (sin gestor asignado).",
      });
    }
    // 3. Limpiamos y cerramos después de un breve delay opcional 
    // para asegurar que el usuario vea el cambio en el form antes de irse
    newArea.value = { nombre: "", responsableId: null };
    emit("close"); 
    
  } catch (error: any) {
    const msg = error.response?.data?.message || "Error al crear el área";
    toast.error(msg);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <dialog class="modal" :class="{ 'modal-open': isOpen }">
    <div class="modal-box max-w-lg">
      <form method="dialog">
        <button
          @click="$emit('close')"
          class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          type="button"
        >
          ✕
        </button>
      </form>
      
      <h3 class="font-bold text-lg mb-4 flex items-center gap-2">
        <span class="rounded bg-primary text-primary-content flex items-center justify-center">
          <BaseIcon name="plus" class="size-10" />
        </span>
        Nueva Área
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
          validation="required|length:2"
          label-class="label-text font-bold block mb-1"
          input-class="input input-bordered w-full focus:input-primary"
        />

        <div class="grid grid-cols-1 gap-4"> <FormKit
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
            :disabled="props.isSubmitting"
            class="btn btn-primary"
          >
            <span v-if="props.isSubmitting" class="loading loading-spinner"></span>
            Guardar
          </button>
        </div>
      </FormKit>
    </div>
    
    <form method="dialog" class="modal-backdrop">
      <button @click="$emit('close')" type="button">close</button>
    </form>
  </dialog>
</template>