<!-- <script setup lang="ts">
import { createTicketSchema } from '@/schema/createTicketSchema'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import BaseIcon from '@/components/BaseIcon.vue' // Ajusta la ruta a tu componente de iconos

const router = useRouter()

// --- ESTADO ---
type Step = 'selection' | 'form'
const currentStep = ref<Step>('selection')
const isSubmitting = ref(false)

// Estado del formulario
const formData = ref({
  AreaId: '',
  TipoSolicitudId: '',
  Prioridad: 'Media',
  Asunto: '',
  Descripcion: '',
  ArchivoAdjunto: null
})

// Generamos el schema reactivo basado en formData
const schema = computed(() => createTicketSchema(formData.value))

// --- FUNCIONES ---
const iniciarSolicitud = (areaId: string | null) => {
  formData.value = {
    AreaId: areaId || '',
    TipoSolicitudId: '',
    Prioridad: 'Media',
    Asunto: '',
    Descripcion: '',
    ArchivoAdjunto: null
  }
  currentStep.value = 'form'
}

const cancelar = () => {
  currentStep.value = 'selection'
}

const handleSubmit = async (data: any) => {
  isSubmitting.value = true
  
  const payload = {
    ...data,
    SolicitanteId: 'user-actual-id', 
    Estado: 'Nueva',
    FechaCreacion: new Date().toISOString(),
    ArchivoAdjuntoUrl: data.ArchivoAdjunto?.[0]?.name || null
  }

  console.log("Enviando Ticket (Schema):", payload)
  await new Promise(r => setTimeout(r, 1000))
  
  alert('Ticket Creado Correctamente')
  router.push('/solicitudes')
  isSubmitting.value = false
}

// Datos estáticos para el paso 1
const areas = [
  { label: 'Tecnología (TI)', value: 'area-ti' },
  { label: 'Mantenimiento', value: 'area-mant' },
  { label: 'Transporte', value: 'area-trans' },
  { label: 'Compras', value: 'area-comp' },
]
</script>

<template>
  <main class="min-h-screen bg-base-200 flex items-center justify-center p-4">

    <section 
      v-if="currentStep === 'selection'" 
      aria-label="Selección de tipo de solicitud"
      class="card w-full max-w-4xl h-[500px] bg-primary text-primary-content shadow-2xl relative overflow-hidden flex flex-col items-center justify-center animate-fade-in"
    >
      <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full" aria-hidden="true"></div>
      <div class="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-tr-full" aria-hidden="true"></div>

      <div class="z-10 flex flex-col items-center text-center">
        <button 
          @click="iniciarSolicitud(null)"
          class="group flex flex-col items-center mb-8 transition-transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary-content/50 rounded-3xl p-4"
          aria-label="Crear nueva solicitud general"
        >
          <div class="w-24 h-24 bg-primary-content/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-4 group-hover:bg-primary-content/30 transition-colors shadow-lg border border-primary-content/20">
            <BaseIcon name="plus" class="h-10 w-10 text-primary-content" />
          </div>
          <h2 class="text-3xl font-bold">Nueva Solicitud</h2>
          <p class="text-primary-content/80 text-sm mt-2">Crea una nueva solicitud de servicio</p>
        </button>

        <div class="flex flex-wrap justify-center gap-3 px-8">
          <button
            v-for="area in areas"
            :key="area.value"
            @click="iniciarSolicitud(area.value)"
            class="btn btn-outline border-primary-content text-primary-content hover:bg-primary-content hover:text-primary rounded-full btn-sm normal-case font-semibold transition-all"
          >
            {{ area.label }}
          </button>
        </div>
      </div>
    </section>

    <section 
      v-else 
      aria-label="Formulario de nueva solicitud"
      class="card bg-base-100 shadow-xl w-full max-w-2xl animate-slide-up"
    >
      <header class="p-6 border-b border-base-200 flex justify-between items-center">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <BaseIcon name="documentText" class="size-10" />
          </div>
          <h2 class="text-xl font-bold text-base-content">Detalles de Solicitud</h2>
        </div>
        <button @click="cancelar" class="btn btn-sm btn-ghost text-base-content/60 hover:text-base-content">
          Cancelar
        </button>
      </header>

      <div class="p-8">
        
        <FormKit 
          type="form" 
          v-model="formData"
          :actions="false" 
          @submit="handleSubmit"
          form-class="space-y-4"
        >
          
          <FormKitSchema :schema="schema" :data="formData" />

          <div class="pt-4">
            <button 
              type="submit" 
              :disabled="isSubmitting"
              class="btn btn-primary w-full shadow-lg shadow-primary/20 text-white font-bold"
            >
              <span v-if="isSubmitting" class="loading loading-spinner"></span>
              <span v-else>Enviar Solicitud</span>
            </button>
          </div>

        </FormKit>

      </div>
    </section>

  </main>
</template>

<style scoped>
.animate-fade-in { animation: fadeIn 0.3s ease-in-out; }
.animate-slide-up { animation: slideUp 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

/* Ajustes globales para FormKit + DaisyUI */
:deep(.formkit-outer) { margin-bottom: 0.5rem; }
:deep(.formkit-message) { color: oklch(var(--er)); font-size: 0.875rem; margin-top: 0.25rem; }
</style> --><script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import BaseIcon from '@/components/BaseIcon.vue' 
import catalogoService from '@/services/catalogoService' // Asegúrate de tener este servicio creado
import ticketService from '@/services/ticketService'     // Asegúrate de tener este servicio creado

const router = useRouter()

// --- ESTADO ---
type Step = 'selection' | 'form'
const currentStep = ref<Step>('selection')
const isSubmitting = ref(false)
const isLoadingTypes = ref(false)

// Listas para los selects
const areasList = ref<{ label: string; value: string }[]>([])
const tiposList = ref<{ label: string; value: string }[]>([])

// Estado del formulario
const formData = ref({
  AreaId: '',
  TipoSolicitudId: '',
  Prioridad: 1, // 0: Baja, 1: Media, 2: Alta (Según tu backend)
  Asunto: '',
  Descripcion: '',
  ArchivoAdjunto: null as any
})

// --- CARGA INICIAL ---
onMounted(async () => {
  try {
    const areas = await catalogoService.getAreas();
    // Mapeamos para FormKit { label, value }
    areasList.value = areas.map(a => ({ label: a.nombre, value: a.id }));
  } catch (error) {
    console.error("Error cargando áreas", error);
  }
})

// --- WATCHER: Carga en Cascada (Área -> Tipos) ---
watch(() => formData.value.AreaId, async (newAreaId) => {
  // Limpiar tipos anteriores
  tiposList.value = [];
  formData.value.TipoSolicitudId = ''; 
  
  if (!newAreaId) return;

  isLoadingTypes.value = true;
  try {
    const tipos = await catalogoService.getTipoSolicitudes(newAreaId);
    tiposList.value = tipos.map(t => ({ label: t.nombre, value: t.id }));
  } catch (error) {
    console.error("Error cargando tipos", error);
  } finally {
    isLoadingTypes.value = false;
  }
});

// --- SCHEMA DE FORMKIT (COMPUTED) ---
// Es computed para que se actualice cuando areasList o tiposList cambien
const schema = computed(() => [
  {
    $el: 'div',
    attrs: { class: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
    children: [
      {
        $formkit: 'select',
        name: 'AreaId',
        label: 'Área',
        placeholder: 'Selecciona el área',
        options: areasList.value,
        validation: 'required',
        outerClass: 'formkit-outer',
        inputClass: 'select select-bordered w-full focus:select-primary',
        labelClass: 'label-text font-bold text-xs uppercase text-gray-400 mb-1 block'
      },
      {
        $formkit: 'select',
        name: 'Prioridad',
        label: 'Prioridad',
        value: 1,
        options: [
          { label: 'Baja', value: 0 },
          { label: 'Media', value: 1 },
          { label: 'Alta', value: 2 }
        ],
        outerClass: 'formkit-outer',
        inputClass: 'select select-bordered w-full focus:select-primary',
        labelClass: 'label-text font-bold text-xs uppercase text-gray-400 mb-1 block'
      }
    ]
  },
  {
    $formkit: 'select',
    name: 'TipoSolicitudId',
    label: 'Tipo de Solicitud',
    placeholder: 'Selecciona el tipo de problema',
    options: tiposList.value,
    validation: 'required',
    // Deshabilitar si no hay área seleccionada o si está cargando
    disabled: !formData.value.AreaId || isLoadingTypes.value,
    help: !formData.value.AreaId ? 'Selecciona primero un área arriba' : '',
    outerClass: 'formkit-outer',
    inputClass: 'select select-bordered w-full focus:select-primary',
    labelClass: 'label-text font-bold text-xs uppercase text-gray-400 mb-1 block'
  },
  {
    $formkit: 'text',
    name: 'Asunto',
    label: 'Asunto',
    placeholder: 'Breve título del problema',
    validation: 'required|length:5,100',
    outerClass: 'formkit-outer',
    inputClass: 'input input-bordered w-full focus:input-primary font-bold text-gray-700',
    labelClass: 'label-text font-bold text-xs uppercase text-gray-400 mb-1 block'
  },
  {
    $formkit: 'textarea',
    name: 'Descripcion',
    label: 'Descripción Detallada',
    placeholder: 'Explica qué sucede...',
    validation: 'required|length:10',
    outerClass: 'formkit-outer',
    inputClass: 'textarea textarea-bordered w-full h-32 text-base leading-relaxed focus:textarea-primary',
    labelClass: 'label-text font-bold text-xs uppercase text-gray-400 mb-1 block'
  },
  {
    $formkit: 'file',
    name: 'ArchivoAdjunto',
    label: 'Evidencia (Opcional)',
    accept: '.pdf,.jpg,.png,.doc,.docx',
    outerClass: 'formkit-outer',
    inputClass: 'file-input file-input-bordered file-input-primary w-full text-sm',
    labelClass: 'label-text font-bold text-xs uppercase text-gray-400 mb-1 block'
  }
])

// --- FUNCIONES ---
const iniciarSolicitud = (areaId: string | null) => {
  // Resetear form
  formData.value = {
    AreaId: areaId || '',
    TipoSolicitudId: '',
    Prioridad: 1,
    Asunto: '',
    Descripcion: '',
    ArchivoAdjunto: null
  }
  currentStep.value = 'form'
}

const cancelar = () => {
  currentStep.value = 'selection'
}

const handleSubmit = async (data: any) => {
  isSubmitting.value = true
  
  try {
    // 1. Crear FormData para envío de archivos
    const formPayload = new FormData();
    
    formPayload.append('AreaId', data.AreaId);
    formPayload.append('TipoSolicitudId', data.TipoSolicitudId);
    formPayload.append('Prioridad', data.Prioridad.toString());
    formPayload.append('Asunto', data.Asunto);
    formPayload.append('Descripcion', data.Descripcion);

    // FormKit devuelve un array [{ file: FileObject, name: "..." }]
    if (data.ArchivoAdjunto && data.ArchivoAdjunto.length > 0) {
      formPayload.append('ArchivoAdjunto', data.ArchivoAdjunto[0].file);
    }

    // 2. Enviar al backend
    await ticketService.create(formPayload);
    
    // 3. Redirección y Feedback
    // Puedes usar un toast aquí
    alert('Ticket creado correctamente');
    router.push('/tickets'); // O donde quieras redirigir
    
  } catch (error) {
    console.error("Error al crear ticket", error);
    alert('Hubo un error al crear la solicitud');
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <main class="min-h-screen bg-base-200 flex items-center justify-center p-4">

    <section 
      v-if="currentStep === 'selection'" 
      aria-label="Selección de tipo de solicitud"
      class="card w-full max-w-4xl h-[500px] bg-primary text-primary-content shadow-2xl relative overflow-hidden flex flex-col items-center justify-center animate-fade-in"
    >
      <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full" aria-hidden="true"></div>
      <div class="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-tr-full" aria-hidden="true"></div>

      <div class="z-10 flex flex-col items-center text-center">
        <button 
          @click="iniciarSolicitud(null)"
          class="group flex flex-col items-center mb-8 transition-transform hover:scale-105 focus:outline-none rounded-3xl p-4"
        >
          <div class="w-24 h-24 bg-primary-content/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-4 group-hover:bg-primary-content/30 transition-colors shadow-lg border border-primary-content/20">
            <BaseIcon name="plus" class="h-10 w-10 text-primary-content" />
          </div>
          <h2 class="text-3xl font-bold">Nueva Solicitud</h2>
          <p class="text-primary-content/80 text-sm mt-2">Crea una nueva solicitud de servicio</p>
        </button>

        <div v-if="areasList.length > 0" class="flex flex-wrap justify-center gap-3 px-8">
          <button
            v-for="area in areasList"
            :key="area.value"
            @click="iniciarSolicitud(area.value)"
            class="btn btn-outline border-primary-content text-primary-content hover:bg-primary-content hover:text-primary rounded-full btn-sm normal-case font-semibold transition-all"
          >
            {{ area.label }}
          </button>
        </div>
        <div v-else class="loading loading-dots text-primary-content"></div>
      </div>
    </section>

    <section 
      v-else 
      aria-label="Formulario de nueva solicitud"
      class="card bg-base-100 shadow-xl w-full max-w-2xl animate-slide-up"
    >
      <header class="p-6 border-b border-base-200 flex justify-between items-center">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <BaseIcon name="documentText" class="h-6 w-6" />
          </div>
          <h2 class="text-xl font-bold text-base-content">Detalles de Solicitud</h2>
        </div>
        <button @click="cancelar" class="btn btn-sm btn-ghost text-base-content/60 hover:text-base-content">
          Cancelar
        </button>
      </header>

      <div class="p-8 bg-white">
        <FormKit 
          type="form" 
          v-model="formData"
          :actions="false" 
          @submit="handleSubmit"
        >
          <FormKitSchema :schema="schema" :data="formData" />

          <div class="pt-6 border-t border-base-200 mt-4">
            <button 
              type="submit" 
              :disabled="isSubmitting"
              class="btn btn-primary w-full shadow-lg shadow-primary/20 text-white font-bold"
            >
              <span v-if="isSubmitting" class="loading loading-spinner"></span>
              <span v-else>Enviar Solicitud</span>
            </button>
          </div>

        </FormKit>
      </div>
    </section>

  </main>
</template>

<style scoped>
.animate-fade-in { animation: fadeIn 0.3s ease-in-out; }
.animate-slide-up { animation: slideUp 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

/* Estilos para los mensajes de error de FormKit */
:deep(.formkit-message) { 
  color: oklch(var(--er)); 
  font-size: 0.75rem; 
  margin-top: 0.25rem;
  font-weight: 600;
}
</style>