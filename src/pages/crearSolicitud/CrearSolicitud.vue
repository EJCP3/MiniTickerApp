<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useDepartmentStore } from "@/stores/departmentStore";
import { useTicketActions } from "@/composables/useTickets"; // Asegúrate de tener este composable
import BaseIcon from "@/components/BaseIcon.vue";

const router = useRouter();
const deptStore = useDepartmentStore();
const { createTicket, isSubmitting } = useTicketActions();

// --- ESTADO DE NAVEGACIÓN LOCAL ---
type Step = "selection" | "form";
const currentStep = ref<Step>("selection");

// --- ESTADO DEL FORMULARIO ---
const formData = ref({
  AreaId: "",
  TipoSolicitudId: "",
  Prioridad: 1,
  Asunto: "",
  Descripcion: "",
  ArchivoAdjunto: null as any,
});

// --- LÓGICA DE CASCADA (Reactividad con Pinia Colada) ---
// Al cambiar el AreaId, notificamos al store para que dispare la query de tipos
watch(() => formData.value.AreaId, (newId) => {
  formData.value.TipoSolicitudId = ""; // Limpiar selección previa
  deptStore.selectAreaForTypes(newId);
});

// --- ESQUEMA DINÁMICO DE FORMKIT ---
const schema = computed(() => [
  {
    $el: "div",
    // Aumentamos el gap a 6 para separar las columnas de Area y Prioridad
    attrs: { class: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-6" }, 
    children: [
      {
        $formkit: "select",
        name: "AreaId",
        label: "Área de Atención",
        placeholder: "Selecciona el área",
        options: deptStore.areasOptions,
        validation: "required",
        outerClass: "mb-0", // No necesita margen inferior aquí porque el contenedor div tiene mb-6
        inputClass: "select select-bordered w-full focus:select-primary bg-base-100 h-12", // Añadido h-12
        labelClass: "label-text font-bold text-xs uppercase text-gray-500 mb-2 block",
      },
      {
        $formkit: "select",
        name: "Prioridad",
        label: "Prioridad",
        value: 1,
        options: [
          { label: "Baja", value: 0 },
          { label: "Media", value: 1 },
          { label: "Alta", value: 2 },
        ],
        outerClass: "mb-0",
        inputClass: "select select-bordered w-full focus:select-primary bg-base-100 h-12", // Añadido h-12
        labelClass: "label-text font-bold text-xs uppercase text-gray-500 mb-2 block",
      },
    ],
  },
  {
    $formkit: "select",
    name: "TipoSolicitudId",
    label: "Tipo de Solicitud",
    placeholder: deptStore.isLoadingTypes ? "Cargando tipos..." : "Selecciona el motivo",
    options: deptStore.tiposOptions,
    validation: "required",
    disabled: !formData.value.AreaId || deptStore.isLoadingTypes,
    help: !formData.value.AreaId ? "Selecciona primero un área arriba" : "",
    outerClass: "mb-6", // Espaciado inferior
    inputClass: "select select-bordered w-full focus:select-primary bg-base-100 h-12",
    labelClass: "label-text font-bold text-xs uppercase text-gray-500 mb-2 block",
    helpClass: "text-[10px] mt-1 text-primary font-medium"
  },
  {
    $formkit: "text",
    name: "Asunto",
    label: "Asunto",
    placeholder: "¿Qué sucede? (Resumen corto)",
    validation: "required|length:5,100",
    outerClass: "mb-6", // Espaciado inferior
    inputClass: "input input-bordered w-full focus:input-primary font-semibold h-12",
    labelClass: "label-text font-bold text-xs uppercase text-gray-500 mb-2 block",
  },
  {
    $formkit: "textarea",
    name: "Descripcion",
    label: "Descripción Detallada",
    placeholder: "Por favor, danos más detalles para ayudarte mejor...",
    validation: "required|length:10",
    outerClass: "mb-6", // Espaciado inferior
    inputClass: "textarea textarea-bordered w-full h-36 focus:textarea-primary leading-relaxed p-4", // Aumentado h y p
    labelClass: "label-text font-bold text-xs uppercase text-gray-500 mb-2 block",
  },
  {
    $formkit: "file",
    name: "ArchivoAdjunto",
    label: "Evidencia o Capturas (Opcional)",
    accept: ".pdf,.jpg,.png,.doc,.docx",
    outerClass: "mb-2", // Menor margen aquí porque siguen los botones
    inputClass: "file-input file-input-bordered file-input-primary w-full text-sm h-12",
    labelClass: "label-text font-bold text-xs uppercase text-gray-500 mb-2 block",
    // Para ocultar la lista de archivos que mencionaste antes:
    fileItemClass: "hidden",
    fileListClass: "hidden"
  }
]);

// --- HANDLERS ---
const iniciarSolicitud = (areaId: string | null) => {
  formData.value.AreaId = areaId || "";
  currentStep.value = "form";
};

const cancelar = () => {
  currentStep.value = "selection";
};

const handleSubmit = async (data: any) => {
  const formPayload = new FormData();
  formPayload.append("AreaId", data.AreaId);
  formPayload.append("TipoSolicitudId", data.TipoSolicitudId);
  formPayload.append("Prioridad", data.Prioridad.toString());
  formPayload.append("Asunto", data.Asunto);
  formPayload.append("Descripcion", data.Descripcion);

  if (data.ArchivoAdjunto && data.ArchivoAdjunto.length > 0) {
    formPayload.append("ArchivoAdjunto", data.ArchivoAdjunto[0].file);
  }

  try {
    await createTicket(formPayload);
    // Aquí puedes disparar una notificación de éxito
    router.push("/mis-solicitudes");
  } catch (error) {
    console.error("Error al crear ticket", error);
  }
};
</script>

<template>
  <main class="min-h-screen bg-base-200 flex items-center justify-center p-4">
    <section 
      v-if="currentStep === 'selection'" 
      class="card w-full max-w-4xl h-[550px] bg-primary text-primary-content shadow-2xl relative overflow-hidden flex flex-col items-center justify-center animate-fade-in"
    >
      <div class="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-bl-full pointer-events-none"></div>
      <div class="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-tr-full pointer-events-none"></div>

      <div class="z-10 flex flex-col items-center text-center px-6">
        <button 
          @click="iniciarSolicitud(null)"
          class="group flex flex-col items-center mb-10 transition-all hover:scale-105"
        >
          <div class="w-24 h-24 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mb-4 border border-white/30 shadow-2xl group-hover:bg-white/30">
            <BaseIcon name="plus" class="h-10 w-10 text-white" />
          </div>
          <h2 class="text-4xl font-black tracking-tight">Nueva Solicitud</h2>
          <p class="text-primary-content/70 mt-2 font-medium italic">¿En qué podemos ayudarte hoy?</p>
        </button>

        <div class="space-y-4 w-full max-w-2xl">
          <p class="text-xs uppercase font-bold tracking-widest opacity-50 mb-2">O elige un área directa</p>
          <div v-if="deptStore.areasOptions.length > 0" class="flex flex-wrap justify-center gap-3">
            <button
              v-for="area in deptStore.areasOptions"
              :key="area.value"
              @click="iniciarSolicitud(area.value)"
              class="btn btn-sm btn-outline border-white/40 text-white hover:bg-white hover:text-primary rounded-xl px-6 font-bold"
            >
              {{ area.label }}
            </button>
          </div>
          <div v-else-if="deptStore.isLoadingAreas" class="loading loading-dots loading-md opacity-50"></div>
          <p v-else class="text-sm opacity-60">No hay áreas de servicio activas disponibles.</p>
        </div>
      </div>
    </section>

    <section 
      v-else 
      class="card bg-base-100 shadow-2xl w-full max-w-2xl overflow-hidden animate-slide-up"
    >
      <header class="bg-primary/5 p-6 border-b border-base-200 flex justify-between items-center">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30">
            <BaseIcon name="documentText" class="h-6 w-6" />
          </div>
          <div>
            <h2 class="text-xl font-bold text-base-content">Detalles de la Solicitud</h2>
            <p class="text-xs text-base-content/50 font-medium">Completa la información para procesar tu ticket</p>
          </div>
        </div>
        <button @click="cancelar" class="btn btn-sm btn-circle btn-ghost">
          <BaseIcon name="close" class="size-5" />
        </button>
      </header>

      <div class="p-8">
        <FormKit 
          type="form" 
          v-model="formData"
          :actions="false" 
          :message-class="'text-red-600 font-bold text-center mt-4'"
          @submit="handleSubmit"
        >
          <FormKitSchema :schema="schema" :data="formData" />

          <div class="pt-8 flex flex-col gap-3">
            <button 
              type="submit" 
              :disabled="isSubmitting"
              class="btn btn-primary w-full shadow-xl shadow-primary/20 text-white font-bold text-lg h-14"
            >
              <span v-if="isSubmitting" class="loading loading-spinner"></span>
              <span v-else class="flex items-center gap-2">
                Enviar Solicitud
                <BaseIcon name="send" class="size-5" />
              </span>
            </button>
            <button type="button" @click="cancelar" class="btn btn-ghost btn-sm opacity-50">
              <BaseIcon name="arrowleft" class="size-5" />
              Volver atrás
            </button>
          </div>
        </FormKit>
      </div>
    </section>
  </main>
</template>

<style scoped>
.animate-fade-in { animation: fadeIn 0.4s ease-out; }
.animate-slide-up { animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1); }

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { 
  from { opacity: 0; transform: translateY(30px); } 
  to { opacity: 1; transform: translateY(0); } 
}


:deep(.formkit-outer) { 
  margin-bottom: 1.5rem; /* Esto asegura un padding constante de 24px entre campos */
}

:deep(.formkit-label) {
  padding-left: 2px;
}

:deep(.formkit-message) { 
  font-size: 0.7rem; 
  margin-top: 0.4rem;
  margin-left: 0.2rem;
  font-weight: 800;
  color: #ef4444; /* Rojo de Tailwind para los errores */
  text-transform: uppercase;
}


:deep(.formkit-outer) { margin-bottom: 0; }
:deep(.formkit-message) { 
  font-size: 0.75rem; 
  margin: .5rem;
  font-weight: 700;
}
</style>