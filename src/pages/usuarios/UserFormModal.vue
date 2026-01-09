<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { type User } from "@/types/users";
import BaseIcon from "@/components/BaseIcon.vue";
import { useDepartmentStore } from "@/stores/departmentStore";
import { generateUserEmail } from "@/utils/generateEmail";

const props = defineProps<{
  isOpen: boolean;
  userData?: User | null;
}>();

const emit = defineEmits(["close", "submit"]);
const departmentStore = useDepartmentStore();

const isSubmitting = ref(false);
const previewUrl = ref<string | null>(null);

const formData = ref<any>({
  Nombre: "",
  Email: "",
  Password: "",
  Rol: "Solicitante",
  AreaId: "",
  Activo: true,
  FotoPerfil: null,
});

// --- OPCIONES DE ÁREA CON VALIDACIÓN VISUAL ---
const apiAreasOptions = computed(() => {
  // Obtenemos las áreas directamente del store para tener datos actualizados
  const options = departmentStore.areas.map((area) => ({
    // Si el área tiene responsable y no es el usuario actual, lo indicamos en la etiqueta
    label: area.responsableId && area.responsableId !== props.userData?.id
      ? `${area.nombre} (Ocupada)` 
      : area.nombre,
    value: area.id,
    attrs: {
      // Deshabilitamos la opción si ya tiene otro responsable asignado
      disabled: area.responsableId && area.responsableId !== props.userData?.id
    }
  }));

  return [{ label: "Ninguna", value: "" }, ...options];
});

const isEditMode = computed(() => !!props.userData);
const modalTitle = computed(() =>
  isEditMode.value ? "Editar Usuario" : "Nuevo Usuario"
);
const modalIcon = computed(() => (isEditMode.value ? "edit" : "plus"));

const passwordRules = computed(() =>
  isEditMode.value ? "length:6" : "required|length:6"
);
const passwordHelp = computed(() =>
  isEditMode.value ? "Deja en blanco para mantener la actual" : ""
);

// --- WATCHERS ---

// 1. Limpiar AreaId si el rol cambia a Solicitante
watch(
  () => formData.value.Rol,
  (newRol) => {
    if (["Solicitante", "Admin", "SuperAdmin"].includes(newRol)) {
      formData.value.AreaId = "";
    }
  }
);

// 2. Generación automática de Email
watch(
  () => formData.value.Nombre,
  (nuevoNombre) => {
    if (!isEditMode.value && nuevoNombre) {
      formData.value.Email = generateUserEmail(nuevoNombre);
    } else if (!isEditMode.value && !nuevoNombre) {
      formData.value.Email = "";
    }
  }
);

// 3. Inicialización de datos al abrir
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      if (props.userData) {
        formData.value = {
          Nombre: props.userData.nombre,
          Email: props.userData.email,
          Rol: props.userData.rol,
          AreaId: props.userData.areaId || "",
          Activo: props.userData.activo ?? true,
          Password: "",
          FotoPerfil: null,
        };
        previewUrl.value = null;
      } else {
        formData.value = {
          Nombre: "", Email: "", Password: "",
          Rol: "Solicitante", AreaId: "", Activo: true, FotoPerfil: null,
        };
        previewUrl.value = null;
      }
    }
  }
);

// 4. Lógica de desvinculación bidireccional
watch(
  () => formData.value.AreaId,
  async (newAreaId, oldAreaId) => {
    if (
      props.isOpen &&
      isEditMode.value &&
      props.userData?.areaId &&
      newAreaId === ""
    ) {
      const confirmar = confirm("¿Deseas desvincular a este usuario del área actual? Esto limpiará la relación en ambas tablas.");

      if (confirmar) {
        try {
          isSubmitting.value = true;
          // Llamada al endpoint sincronizado (AreaId + UsuarioId)
          await departmentStore.removerResponsable(
            props.userData.areaId,
            props.userData.id
          );
          
          formData.value.AreaId = "";
        } catch (error: any) {
          // Revertimos en caso de error del backend
          formData.value.AreaId = oldAreaId;
        } finally {
          isSubmitting.value = false;
        }
      } else {
        formData.value.AreaId = oldAreaId;
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

const handleClose = () => {
  emit("close");
  previewUrl.value = null;
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  const formPayload = new FormData();

  if (props.userData?.id) {
    formPayload.append("Id", props.userData.id);
  }

  formPayload.append("Nombre", formData.value.Nombre);
  formPayload.append("Email", formData.value.Email);
  formPayload.append("Activo", formData.value.Activo.toString());

  if (formData.value.AreaId && formData.value.AreaId.trim() !== "") {
    formPayload.append("AreaId", formData.value.AreaId);
  }

  if (formData.value.Password && formData.value.Password.trim() !== "") {
    formPayload.append("Password", formData.value.Password);
  }

  const rolesMap: Record<string, number> = {
    Solicitante: 0, Gestor: 1, Admin: 2, SuperAdmin: 3,
  };
  formPayload.append("Rol", (rolesMap[formData.value.Rol] ?? 0).toString());

  if (formData.value.FotoPerfil && formData.value.FotoPerfil.length > 0) {
    const fileToUpload = formData.value.FotoPerfil[0].file;
    formPayload.append("FotoPerfil", fileToUpload);
  }

  emit("submit", formPayload);
  isSubmitting.value = false;
};
</script>

<template>
  <dialog class="modal" :class="{ 'modal-open': isOpen }">
    <div class="modal-box w-11/12 max-w-lg bg-base-100 p-0 overflow-hidden">
      <div class="p-6 pb-0 flex justify-between items-start">
        <h3 class="font-bold text-xl flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-lg"
            :class="isEditMode ? 'bg-secondary' : 'bg-primary'"
          >
            <BaseIcon :name="modalIcon" class="size-6" />
          </div>
          {{ modalTitle }}
        </h3>
        <button @click="handleClose" class="btn btn-sm btn-circle btn-ghost">
          <BaseIcon name="close" class="size-5" />
        </button>
      </div>

      <FormKit
        type="form"
        v-model="formData"
        :actions="false"
        @submit="handleSubmit"
        form-class="p-6 space-y-5"
      >
        <div class="flex flex-col items-center gap-4 py-2">
          <div class="avatar">
            <div
              class="w-28 h-28 rounded-full ring ring-offset-base-100 ring-offset-4 shadow-xl"
              :class="isEditMode ? 'ring-secondary' : 'ring-primary'"
            >
              <img
                :src="
                  previewUrl ||
                  userData?.fotoPerfilUrl ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    formData.Nombre || 'U'
                  )}&background=random`
                "
                class="object-cover"
              />
            </div>
          </div>

          <FormKit
            type="file"
            name="FotoPerfil"
            label="Cambiar Foto de Perfil"
            accept=".png,.jpg,.jpeg,.webp"
            @input="handleFileChange"
            :classes="{
              outer: 'w-full max-w-xs',
              label: 'label-text font-bold text-center mb-2 block text-xs uppercase text-base-content/50',
              input: 'file-input file-input-sm file-input-bordered w-full file:bg-primary file:text-white file:border-none',
              fileList: 'hidden',
              fileItem: 'hidden',
              noFiles: 'hidden',
            }"
          />
        </div>

        <div class="space-y-4">
          <FormKit
            type="text"
            name="Nombre"
            label="Nombre Completo"
            placeholder="Ej. Juan Pérez"
            validation="required|length:3"
            label-class="label-text font-bold block mb-1"
            input-class="input input-bordered w-full focus:input-primary bg-base-200/50"
          />

          <FormKit
            type="email"
            name="Email"
            label="Correo Electrónico"
            placeholder="nombre@miniticker.com"
            validation="required|email"
            disabled="isEditMode"
            label-class="label-text font-bold block mb-1"
            input-class="input input-bordered w-full focus:input-primary bg-base-200/50"
            help="El correo se genera automáticamente a partir del nombre"
            help-class="text-[10px] mt-1 opacity-70"
          />

          <FormKit
            type="password"
            name="Password"
            label="Contraseña"
            :validation="passwordRules"
            :help="passwordHelp"
            label-class="label-text font-bold block mb-1"
            input-class="input input-bordered w-full focus:input-primary bg-base-200/50"
            help-class="text-xs mt-1 text-base-content/50"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormKit
            type="select"
            name="Rol"
            label="Rol de Usuario"
            :options="['Solicitante', 'Gestor', 'Admin', 'SuperAdmin']"
            validation="required"
            label-class="label-text font-bold block mb-1"
            input-class="select select-bordered w-full focus:select-primary bg-base-200/50"
          />

          <FormKit
            v-if="!['Solicitante', 'Admin', 'SuperAdmin'].includes(formData.Rol)"
            type="select"
            name="AreaId"
            label="Área Asignada"
            placeholder="Seleccionar área"
            :options="apiAreasOptions"
            label-class="label-text font-bold block mb-1"
            input-class="select select-bordered w-full focus:select-primary bg-base-200/50"
          />
        </div>

        <div class="bg-base-200/50 rounded-xl p-4 border border-base-300">
          <FormKit
            type="checkbox"
            name="Activo"
            label="¿Usuario habilitado?"
            label-class="label-text font-bold cursor-pointer"
            input-class="checkbox checkbox-primary"
            wrapper-class="flex items-center justify-between"
          />
        </div>

        <div class="modal-action bg-base-200 p-4 -mx-6 -mb-6 mt-4 flex gap-2">
          <button
            type="button"
            @click="handleClose"
            class="btn btn-ghost flex-1"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="btn btn-primary flex-1 text-white shadow-lg shadow-primary/30"
          >
            <span v-if="isSubmitting" class="loading loading-spinner"></span>
            <BaseIcon
              v-else
              :name="isEditMode ? 'refresh' : 'check'"
              class="size-5 mr-2"
            />
            {{ isEditMode ? "Actualizar" : "Crear Usuario" }}
          </button>
        </div>
      </FormKit>
    </div>
    <div class="modal-backdrop" @click="handleClose"></div>
  </dialog>
</template>