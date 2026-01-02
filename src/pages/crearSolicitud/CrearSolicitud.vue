<script setup lang="ts">
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
</style>