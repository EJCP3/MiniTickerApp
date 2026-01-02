<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// --- 1. DATOS DE CATÁLOGOS ---
const areas = [
  { label: 'Tecnología (TI)', value: 'area-ti' },
  { label: 'Mantenimiento', value: 'area-mant' },
  { label: 'Transporte', value: 'area-trans' },
  { label: 'Compras', value: 'area-comp' },
]

const todosLosTipos = [
  { label: 'Soporte PC / Laptop', value: 'tipo-1', areaId: 'area-ti' },
  { label: 'Acceso a Sistemas / VPN', value: 'tipo-2', areaId: 'area-ti' },
  { label: 'Instalación de Software', value: 'tipo-3', areaId: 'area-ti' },
  { label: 'Reparación Aire Acondicionado', value: 'tipo-4', areaId: 'area-mant' },
  { label: 'Electricidad / Iluminación', value: 'tipo-5', areaId: 'area-mant' },
  { label: 'Solicitud de Vehículo', value: 'tipo-6', areaId: 'area-trans' },
  { label: 'Mantenimiento Vehicular', value: 'tipo-7', areaId: 'area-trans' },
  { label: 'Insumos de Oficina', value: 'tipo-8', areaId: 'area-comp' },
  { label: 'Mobiliario', value: 'tipo-9', areaId: 'area-comp' },
]

const prioridades = [
  { label: 'Baja', value: 'Baja' },
  { label: 'Media', value: 'Media' },
  { label: 'Alta', value: 'Alta' },
  { label: 'Urgente', value: 'Urgente' },
]

// --- 2. CONTROL DE PASOS Y ESTADO ---
type Step = 'selection' | 'form'
const currentStep = ref<Step>('selection')
const isSubmitting = ref(false)

const formData = ref({
  AreaId: '',
  TipoSolicitudId: '',
  Prioridad: 'Media',
  Asunto: '',
  Descripcion: '',
  ArchivoAdjunto: null as any
})

// --- 3. LÓGICA DE FILTRADO ---
const tiposFiltrados = computed(() => {
  if (!formData.value.AreaId) return []
  return todosLosTipos.filter(t => t.areaId === formData.value.AreaId)
})

// --- 4. FUNCIONES ---
const iniciarSolicitud = (areaIdPreseleccionada: string | null = null) => {
  formData.value = {
    AreaId: areaIdPreseleccionada || '',
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

const handleSubmit = async () => {
  isSubmitting.value = true
  const payload = {
    ...formData.value,
    SolicitanteId: 'user-actual-id', 
    Estado: 'Nueva',
    FechaCreacion: new Date().toISOString(),
    ArchivoAdjuntoUrl: formData.value.ArchivoAdjunto?.[0]?.name || null
  }
  console.log("Enviando Ticket:", payload)
  await new Promise(r => setTimeout(r, 1000))
  alert('Ticket Creado Correctamente')
  router.push('/mis-actividades')
  isSubmitting.value = false
}
</script>

<template>
  <div class=" min-h-screen bg-base-200 flex items-center justify-center  ">

    <div 
      v-if="currentStep === 'selection'" 
      class="card w-full max-w-4xl h-125 bg-primary text-primary-content shadow-2xl relative overflow-hidden flex flex-col items-center justify-center animate-fade-in mt-5"
    >
      <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full"></div>
      <div class="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-tr-full"></div>

      <div class="z-10 flex flex-col items-center">
        <button 
          @click="iniciarSolicitud(null)"
          class="group flex flex-col items-center mb-8 transition-transform hover:scale-105"
        >
          <div class="w-24 h-24 bg-primary-content/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-4 group-hover:bg-primary-content/30 transition-colors shadow-lg border border-primary-content/20">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-primary-content" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h2 class="text-3xl font-bold">Nueva Solicitud</h2>
          <p class="text-primary-content/80 text-sm mt-2">Crea una nueva solicitud de servicio</p>
        </button>

        <div class="flex flex-wrap justify-center gap-3 px-8">
          <button
            v-for="area in areas"
            :key="area.value"
            @click="iniciarSolicitud(area.value)"
            class="btn btn-outline border-primary-content text-primary-content hover:bg-primary-content hover:text-primary rounded-full btn-sm normal-case font-semibold"
          >
            {{ area.label }}
          </button>
        </div>
      </div>
    </div>


    <div 
      v-else 
      class="card bg-base-100 shadow-xl w-full max-w-2xl animate-slide-up "
    >
      <div class="p-6 border-b border-base-200 flex justify-between items-center">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 class="text-xl font-bold text-base-content">Detalles de Solicitud</h2>
        </div>
        <button @click="cancelar" class="btn btn-sm btn-ghost text-base-content/60">
          Cancelar
        </button>
      </div>

      <div class="p-8">
        <FormKit 
          type="form" 
          v-model="formData"
          :actions="false" 
          @submit="handleSubmit"
          form-class="space-y-4"
        >
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormKit
              type="select"
              name="AreaId"
              label="Área"
              placeholder="Selecciona el área"
              :options="areas"
              validation="required"
              
              label-class="label-text font-bold mb-1 block"
              input-class="select select-bordered w-full focus:select-primary"
            />

            <FormKit
              type="select"
              name="Prioridad"
              label="Prioridad"
              :options="prioridades"
              validation="required"
              
              label-class="label-text font-bold mb-1 block"
              input-class="select select-bordered w-full focus:select-primary"
            />
          </div>

          <FormKit
            :key="formData.AreaId" 
            type="select"
            name="TipoSolicitudId"
            label="Tipo de Solicitud"
            placeholder="Selecciona el tipo de problema"
            :options="tiposFiltrados"
            :disabled="!formData.AreaId || tiposFiltrados.length === 0"
            validation="required"
            
            label-class="label-text font-bold mb-1 block"
            input-class="select select-bordered w-full focus:select-primary disabled:bg-base-200 disabled:text-base-content/30"
            help-class="label-text-alt text-error mt-1"
            :help="!formData.AreaId ? 'Selecciona primero un área arriba' : ''"
          />

          <FormKit
            type="text"
            name="Asunto"
            label="Asunto"
            placeholder="Breve título del problema"
            validation="required|length:5,100"
            
            label-class="label-text font-bold mb-1 block"
            input-class="input input-bordered w-full focus:input-primary placeholder:text-base-content/30"
          />

          <FormKit
            type="textarea"
            name="Descripcion"
            label="Descripción Detallada"
            placeholder="Explica qué sucede..."
            validation="required|length:10,1000"
            rows="4"
            
            label-class="label-text font-bold mb-1 block"
            input-class="textarea textarea-bordered w-full focus:textarea-primary text-base placeholder:text-base-content/30 h-32"
          />

           <FormKit
            type="file"
            name="ArchivoAdjunto"
            label="Evidencia (Opcional)"
            accept=".pdf,.jpg,.png"
            
            label-class="label-text font-bold mb-1 block"
            input-class="file-input file-input-bordered w-full focus:file-input-primary text-sm"
          />

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
    </div>

  </div>
</template>

<style scoped>
/* Animaciones simples */
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}
.animate-slide-up {
  animation: slideUp 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Opcional: Ajuste para que FormKit se vea perfecto con DaisyUI */
:deep(.formkit-outer) {
  margin-bottom: 0.5rem;
}
:deep(.formkit-message) {
  color: oklch(var(--er)); /* Color de error de DaisyUI */
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
</style>