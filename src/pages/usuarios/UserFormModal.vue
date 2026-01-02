<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { areasOptions, DEFAULT_PHOTO, type User } from "@/types/users";
import BaseIcon from "@/components/BaseIcon.vue";

// Props: 'userData' puede ser null (modo crear) o un objeto User (modo editar)
const props = defineProps<{
  isOpen: boolean;
  userData?: User | null;
}>();

const emit = defineEmits(["close", "submit"]);

const isSubmitting = ref(false);
const previewUrl = ref<string | null>(null);

// Estado del formulario
const formData = ref<any>({
  Nombre: "",
  Email: "",
  Password: "",
  Rol: "Solicitante",
  AreaId: "",
  Activo: true,
  Foto: null,
});

// --- COMPUTADOS ---
const isEditMode = computed(() => !!props.userData);
const modalTitle = computed(() =>
  isEditMode.value ? "Editar Usuario" : "Nuevo Usuario"
);
const modalIcon = computed(() => (isEditMode.value ? "edit" : "plus"));

// Validación de contraseña: Requerida en crear, opcional en editar
const passwordRules = computed(() =>
  isEditMode.value ? "length:6" : "required|length:6"
);
const passwordHelp = computed(() =>
  isEditMode.value ? "Deja en blanco para mantener la actual" : ""
);

// --- WATCHER: Inicializar datos al abrir/cerrar ---
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      if (props.userData) {
        // MODO EDITAR: Copiar datos existentes
        formData.value = { ...props.userData, Password: "", Foto: null }; // Password vacío por seguridad
        previewUrl.value = null; // Reset preview, usará la foto del usuario
      } else {
        formData.value = {
          Nombre: "",
          Email: "",
          Password: "",
          Rol: "Solicitante",
          AreaId: "",
          Activo: true,
          Foto: null,
        };
        previewUrl.value = null;
      }
    }
  }
);

// --- HANDLERS ---
const handleFileChange = (e: any) => {
  const fileArray = e;
  if (fileArray && fileArray.length > 0 && fileArray[0].file) {
    previewUrl.value = URL.createObjectURL(fileArray[0].file);
  } else {
    previewUrl.value = null;
  }
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  await new Promise((r) => setTimeout(r, 800));

  // Preparamos el payload. Si hay preview, la mandamos como Foto.
  // Si no hay preview en modo edit, el padre sabrá mantener la foto anterior.
  const payload = {
    ...formData.value,
    Foto: previewUrl.value ? previewUrl.value : null,
  };

  emit("submit", payload);
  isSubmitting.value = false;
};

const handleClose = () => {
  emit("close");
  previewUrl.value = null;
};
</script>

<template>
  <dialog class="modal" :class="{ 'modal-open': isOpen }">
    <div class="modal-box w-11/12 max-w-lg">
      <form method="dialog">
        <button
          @click="handleClose"
          class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 "
        >
        <BaseIcon name="close" class="size-10" /> 
        </button>
      </form>

      <h3 class="font-bold text-lg mb-4 flex items-center gap-2">
        <span
          class="w-8 h-8 rounded text-primary-content flex items-center justify-center text-center"
          :class="isEditMode ? 'bg-secondary' : 'bg-primary'"
        >
          <BaseIcon :name="modalIcon" class="size-6" />
        </span>
        {{ modalTitle }}
      </h3>

      <FormKit
        type="form"
        v-model="formData"
        :actions="false"
        @submit="handleSubmit"
        form-class="space-y-4"
      >
        <div class="flex justify-center mb-4">
          <div class="flex flex-col items-center gap-2 w-full max-w-xs">
            <div class="avatar">
              <div
                class="w-24 rounded-full ring ring-offset-base-100 ring-offset-2"
                :class="isEditMode ? 'ring-secondary' : 'ring-primary'"
              >
                <img
                  :src="
                    previewUrl
                      ? previewUrl
                      : props.userData?.FotoPerfilUrl || DEFAULT_PHOTO
                  "
                  class="object-cover"
                />
              </div>
            </div>
   <FormKit 
  type="file" 
  name="Foto" 
  label="Cambiar Foto" 
  accept=".png,.jpg,.jpeg,.webp" 
  @input="handleFileChange" 
  :classes="{
    outer: 'w-full max-w-xs',
    label: 'label-text font-bold text-center mb-2 block',
    input: `
      file-input file-input-sm file-input-bordered w-full max-w-xs
      file:mr-4 file:py-2 file:px-4
      file:rounded-l-lg file:border-0
      file:text-xs file:font-semibold
      file:bg-primary file:text-primary-content
      hover:file:bg-primary-focus
      text-sm text-base-content/70
    `,
    help: 'text-xs text-center mt-1 text-base-content/50',
    
    /* --- ESTO OCULTA LA LISTA DE TEXTO --- */
    fileList: 'hidden', 
    fileItem: 'hidden',
    noFiles: 'hidden'
  }"
/>
         
          </div>
        </div>

        <FormKit
          type="text"
          name="Nombre"
          label="Nombre"
          validation="required|length:3"
          label-class="label-text font-bold block mb-1"
          input-class="input input-bordered w-full focus:input-primary"
        />
        <FormKit
          type="email"
          name="Email"
          label="Email"
          validation="required|email"
          label-class="label-text font-bold block mb-1"
          input-class="input input-bordered w-full focus:input-primary"
        />

        <FormKit
          type="password"
          name="Password"
          label="Contraseña"
          :validation="passwordRules"
          :help="passwordHelp"
          label-class="label-text font-bold block mb-1"
          input-class="input input-bordered w-full focus:input-primary"
        />

        <div class="grid grid-cols-1 gap-4">
          <FormKit
            type="select"
            name="Rol"
            label="Rol"
            :options="['Solicitante', 'Gestor', 'Admin', 'SuperAdmin']"
            validation="required"
            label-class="label-text font-bold block mb-1"
            input-class="select select-bordered w-full focus:select-primary"
          />
          <FormKit
            type="select"
            name="AreaId"
            label="Área"
            placeholder="General"
            :options="areasOptions"
            label-class="label-text font-bold block mb-1"
            input-class="select select-bordered w-full focus:select-primary"
          />
        </div>

        <div class="form-control mt-2 border border-base-200 rounded-lg p-3">
          <FormKit
            type="checkbox"
            name="Activo"
            label="Usuario Activo"
            outer-class="form-control"
            wrapper-class="flex items-center gap-3 cursor-pointer"
            label-class="label-text font-bold cursor-pointer flex-1"
            input-class="checkbox checkbox-primary"
          >
            <template #label="context">
              <span class="flex-1 font-bold">Estado</span>
              <span
                class="badge"
                :class="
                  context.value ? 'badge-success text-white' : 'badge-ghost'
                "
                >{{ context.value ? "Habilitado" : "Deshabilitado" }}</span
              >
            </template>
          </FormKit>
        </div>

        <div class="modal-action mt-6">
          <button type="button" @click="handleClose" class="btn btn-ghost">
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="btn btn-primary"
          >
            <span v-if="isSubmitting" class="loading loading-spinner"></span>
            {{ isEditMode ? "Actualizar" : "Guardar" }}
          </button>
        </div>
      </FormKit>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button @click="handleClose">close</button>
    </form>
  </dialog>
</template>
