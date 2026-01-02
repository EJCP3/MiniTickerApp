import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

// --- DATOS DE CATÁLOGOS (Mock) ---
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

// --- COMPOSABLE ---
export function useTicketForm() {
  const router = useRouter()
  const isSubmitting = ref(false)
  
  // Estado inicial del formulario
  const formData = ref({
    AreaId: '',
    TipoSolicitudId: '',
    Prioridad: 'Media',
    Asunto: '',
    Descripcion: '',
    ArchivoAdjunto: null as any
  })

  // Computed para filtrar tipos según área
  const tiposFiltrados = computed(() => {
    if (!formData.value.AreaId) return []
    return todosLosTipos.filter(t => t.areaId === formData.value.AreaId)
  })

  // Función para resetear/iniciar
  const resetForm = (areaIdPreseleccionada: string | null = null) => {
    formData.value = {
      AreaId: areaIdPreseleccionada || '',
      TipoSolicitudId: '',
      Prioridad: 'Media',
      Asunto: '',
      Descripcion: '',
      ArchivoAdjunto: null
    }
  }

  // Función de envío
  const submitTicket = async () => {
    isSubmitting.value = true
    
    try {
      // Simulación de payload
      const payload = {
        ...formData.value,
        SolicitanteId: 'user-actual-id', // Esto vendría de tu store de auth
        Estado: 'Nueva',
        FechaCreacion: new Date().toISOString(),
        ArchivoAdjuntoUrl: formData.value.ArchivoAdjunto?.[0]?.name || null
      }

      console.log("Enviando Ticket al Backend:", payload)
      
      // Simular delay de API
      await new Promise(r => setTimeout(r, 1000))
      
      alert('Ticket Creado Correctamente')
      router.push('/solicitudes') // Redirigir a la lista
      
    } catch (error) {
      console.error("Error creando ticket", error)
      alert('Error al crear el ticket')
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    formData,
    areas,
    prioridades,
    tiposFiltrados,
    isSubmitting,
    resetForm,
    submitTicket
  }
}