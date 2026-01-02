<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import TicketModal, { type Ticket } from '@/components/TicketModal.vue';

// --- 1. Definición de Tipos (Basado en tu Backend) ---
// Esta interfaz debe coincidir con lo que devuelve tu API de .NET
interface TicketEventDto {
  id: string;
  ticketId: string;
  ticketNumero: string; // Ej: "TEC-2025-001"
  ticketAsunto: string; // Ej: "Pantalla azul"
  tipoEvento: 'Creado' | 'Asignado' | 'EstadoCambiado' | 'PrioridadCambiada' | 'Comentario' | 'Cierre';
  texto: string; // Descripción automática del evento
  usuarioNombre: string;
  usuarioAvatar?: string; // Opcional
  fecha: string; // ISO Date String
  estadoNuevo?: string; // Para colorear etiquetas
}

// --- 2. Estado ---
const showModal = ref(false);
const ticketSeleccionado = ref<Ticket | null>(null);
const loading = ref(true);
const actividades = ref<TicketEventDto[]>([]);

// --- 3. Simulación de Fetch de Datos (Reemplazar con tu servicio API) ---
const fetchActividades = async () => {
  loading.value = true;
  try {
    // Simulación de delay de red
    await new Promise(resolve => setTimeout(resolve, 800));

    // DATOS DE EJEMPLO QUE VENDRÍAN DE TU API
    actividades.value = [
      {
        id: 'e1',
        ticketId: 't1',
        ticketNumero: 'TEC-2025-042',
        ticketAsunto: 'Fallo en servidor de correos',
        tipoEvento: 'EstadoCambiado',
        texto: 'Cambió el estado de "En Proceso" a "Resuelto"',
        usuarioNombre: 'Juan Gestor',
        fecha: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // Hace 30 min
        estadoNuevo: 'Resuelto'
      },
      {
        id: 'e2',
        ticketId: 't2',
        ticketNumero: 'MNT-2025-010',
        ticketAsunto: 'Aire acondicionado R-2',
        tipoEvento: 'Comentario',
        texto: 'Se requiere comprar repuesto del compresor.',
        usuarioNombre: 'Carlos Técnico',
        fecha: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // Hace 2 horas
      },
      {
        id: 'e3',
        ticketId: 't3',
        ticketNumero: 'COM-2025-005',
        ticketAsunto: 'Solicitud de Laptops',
        tipoEvento: 'Asignado',
        texto: 'Ticket asignado a María Compras',
        usuarioNombre: 'Sistema',
        fecha: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // Hace 5 horas
      },
      {
        id: 'e4',
        ticketId: 't4',
        ticketNumero: 'TEC-2025-043',
        ticketAsunto: 'Instalación VPN',
        tipoEvento: 'Creado',
        texto: 'Ticket creado por el usuario',
        usuarioNombre: 'Ana Usuario',
        fecha: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // Hace 1 día
      }
    ];
  } catch (error) {
    console.error("Error cargando actividades", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchActividades();
});

// --- 4. Helpers Visuales ---

// Calcular tiempo relativo (Hace X min, Hace X días)
const tiempoRelativo = (fechaIso: string) => {
  const fecha = new Date(fechaIso);
  const ahora = new Date();
  const diffSegundos = Math.floor((ahora.getTime() - fecha.getTime()) / 1000);

  if (diffSegundos < 60) return 'Hace un momento';
  const minutos = Math.floor(diffSegundos / 60);
  if (minutos < 60) return `Hace ${minutos} min`;
  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `Hace ${horas} h`;
  const dias = Math.floor(horas / 24);
  return `Hace ${dias} d`;
};

// Obtener configuración de icono y color según el tipo de evento
const getEventConfig = (tipo: string) => {
  switch (tipo) {
    case 'Creado': return { icon: 'fa-plus', color: 'bg-emerald-500/20 text-emerald-500', border: 'border-emerald-500/30' };
    case 'EstadoCambiado': return { icon: 'fa-rotate', color: 'bg-blue-500/20 text-blue-500', border: 'border-blue-500/30' };
    case 'Asignado': return { icon: 'fa-user-check', color: 'bg-purple-500/20 text-purple-500', border: 'border-purple-500/30' };
    case 'Comentario': return { icon: 'fa-comment-dots', color: 'bg-amber-500/20 text-amber-500', border: 'border-amber-500/30' };
    case 'Resuelto': return { icon: 'fa-check-circle', color: 'bg-green-500/20 text-green-500', border: 'border-green-500/30' };
    default: return { icon: 'fa-bell', color: 'bg-gray-500/20 text-gray-400', border: 'border-gray-500/30' };
  }
};

// --- 5. Lógica del Modal ---
const abrirDetalle = (evento: TicketEventDto) => {
  // Construimos un objeto Ticket temporal basado en la información del evento
  // En una app real, aquí harías fetch del ticket completo por ID: api.getTicket(evento.ticketId)
  
  const codigo = evento.ticketNumero;
  const categoria = codigo.startsWith('TEC') ? 'Tecnología' : (codigo.startsWith('MNT') ? 'Mantenimiento' : 'General');

  ticketSeleccionado.value = {
    id: parseInt(evento.id) || 0, // Ajuste temporal si tus IDs son strings
    codigo: codigo,
    categoria: categoria,
    prioridad: 'Alta', // Dato simulado, vendría del backend
    estado: evento.estadoNuevo || 'En Proceso',
    titulo: evento.ticketAsunto,
    descripcion: evento.texto,
    solicitante: evento.usuarioNombre,
    fechaCreacion: evento.fecha,
    ultimaActualizacion: evento.fecha,
    historial: [
      {
        titulo: evento.tipoEvento,
        usuario: evento.usuarioNombre,
        fecha: tiempoRelativo(evento.fecha),
        descripcion: evento.texto
      }
    ]
  };
  showModal.value = true;
};
</script>

<template>
  <div class="w-full max-w-7xl h-full flex flex-col bg-base-100 rounded-3xl shadow-lg overflow-hidden border border-base-300">
    
    <div class="p-6 border-b border-base-200 bg-base-100/50 backdrop-blur-md sticky top-0 ">
      <div class="flex items-center gap-4">
        <div class="p-3 bg-primary/10 rounded-2xl text-primary">
          <i class="fa-solid fa-clock-rotate-left text-xl"></i>
        </div>
        <div>
          <h2 class="text-xl font-bold text-base-content">Actividad Reciente</h2>
          <p class="text-sm text-base-content/60">Historial de movimientos</p>
        </div>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto p-6 custom-scroll relative">
      
      <div v-if="loading" class="space-y-6">
        <div v-for="i in 4" :key="i" class="flex gap-4 animate-pulse">
          <div class="w-10 h-10 rounded-full bg-base-300"></div>
          <div class="flex-1 space-y-2 py-1">
            <div class="h-4 bg-base-300 rounded w-3/4"></div>
            <div class="h-3 bg-base-300 rounded w-1/2"></div>
          </div>
        </div>
      </div>

      <div v-else class="relative space-y-0">
        <div class="absolute left-5 top-2 bottom-6 w-0.5 bg-base-300/50"></div>

        <div 
          v-for="(actividad, index) in actividades" 
          :key="actividad.id"
          class="group relative pl-12 pb-8 last:pb-0 cursor-pointer"
          @click="abrirDetalle(actividad)"
        >
          <div 
            class="absolute left-0 top-0 w-10 h-10 rounded-full flex items-center justify-center text-sm border-2 transition-transform group-hover:scale-110 z-10 bg-base-100"
            :class="[getEventConfig(actividad.tipoEvento).color, getEventConfig(actividad.tipoEvento).border]"
          >
            <i class="fa-solid" :class="getEventConfig(actividad.tipoEvento).icon"></i>
          </div>

          <div class="bg-base-200/40 hover:bg-base-200 rounded-xl p-4 transition-all border border-transparent hover:border-base-300 group-hover:shadow-sm">
            
            <div class="flex justify-between items-start mb-1">
              <span class="text-xs font-bold px-2 py-0.5 rounded-md bg-base-300 text-base-content/70">
                {{ actividad.ticketNumero }}
              </span>
              <span class="text-xs text-base-content/50 font-medium">
                {{ tiempoRelativo(actividad.fecha) }}
              </span>
            </div>

            <h3 class="font-semibold text-sm text-base-content mb-1">
              {{ actividad.ticketAsunto }}
            </h3>
            
            <p class="text-sm text-base-content/70 leading-relaxed">
              <span v-if="actividad.usuarioNombre !== 'Sistema'" class="font-medium text-primary">
                {{ actividad.usuarioNombre }}
              </span>
              <span v-else class="font-medium text-secondary">Sistema</span>:
              {{ actividad.texto }}
            </p>

          </div>
        </div>
      </div>

      <div v-if="!loading && actividades.length === 0" class="flex flex-col items-center justify-center h-40 text-base-content/50">
        <i class="fa-regular fa-folder-open text-4xl mb-2 opacity-50"></i>
        <p>No hay actividad reciente</p>
      </div>

    </div>

    <TicketModal 
      :is-open="showModal" 
      :ticket="ticketSeleccionado" 
      @close="showModal = false" 
    />

  </div>
</template>

<style scoped>
.custom-scroll::-webkit-scrollbar {
  width: 5px;
}
.custom-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.3);
  border-radius: 10px;
}
.custom-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.5);
}
</style>