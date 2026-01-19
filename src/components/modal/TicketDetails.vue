



<script setup lang="ts">
import { useTicketStore } from '@/stores/ticketModalStore';
import BaseIcon from '../BaseIcon.vue';
import TicketAssignment from './TicketAssignment.vue';

const props = defineProps<{
  ticketId?: string;
  ticket?: any;
}>();


console.log(props.ticket)


const store = useTicketStore();
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL // Ajusta tu puerto default si falla el env

// Función para descargar/abrir archivo
const descargarArchivo = (ruta: string) => {
  if (!ruta) return;

  let urlFinal = ruta;

  // Si la ruta es relativa (ej: "uploads/tickets/..."), le pegamos el dominio del backend
  if (!ruta.startsWith("http")) {
    const pathLimpio = ruta.startsWith("/") ? ruta.substring(1) : ruta;
    urlFinal = `${API_BASE_URL}/${pathLimpio}`;
  }

  console.log("Abriendo archivo:", urlFinal);
  window.open(urlFinal, "_blank");
};

// Helper para obtener nombre del archivo (opcional, por si el backend no manda nombre)
const getNombreArchivo = (url: string) => {
    if (!url) return "Archivo Adjunto";
    // Intenta sacar el nombre del final de la URL
    return url.split('/').pop() || "Documento Adjunto";
};
</script>

<template>
  <div v-if="store.currentTicket" class="space-y-6 pt-2 animate-fade-in">
    
    <div class="space-y-2">
      <h3 class="text-xs font-bold text-base-content/50 uppercase tracking-wider">
        Descripción del Problema
      </h3>
      <div class="bg-base-200/50 p-4 rounded-xl border border-base-200 text-sm text-base-content/80 leading-relaxed">
        {{ store.currentTicket.descripcion }}
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      <div class="space-y-1">
         <h3 class="text-xs font-bold text-base-content/50 uppercase tracking-wider flex items-center gap-2">
           <BaseIcon name="user" class="h-4 w-4" /> Solicitante
         </h3>
         <div class="font-medium text-base-content">
            {{ store.currentTicket.solicitante?.nombre || 'Desconocido' }}
         </div>
         <div class="text-xs text-base-content/60">
            {{ store.currentTicket.solicitante?.email || '' }}
         </div>
      </div>

     <div class="space-y-1">
        <template v-if="store.currentTicket.estado === 'Vencida'">
           <h3 class="text-xs font-bold text-base-content/50 uppercase tracking-wider flex items-center gap-2 mb-1">
              <BaseIcon name="user" class="h-4 w-4" /> Responsable
           </h3>
           <div class="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <BaseIcon name="ban" class="h-5 w-5" />
              <div class="flex flex-col">
                 <span class="text-sm font-bold">Asignación Bloqueada</span>
                 <span class="text-xs opacity-80">El ticket ha vencido.</span>
              </div>
           </div>
        </template>

        <template v-else>
           <TicketAssignment :ticketId="props.ticketId"/>
        </template>
      </div>

      <div class="space-y-1">
         <h3 class="text-xs font-bold text-base-content/50 uppercase tracking-wider flex items-center gap-2">
            <BaseIcon name="clock" class="h-4 w-4" /> Creado el
         </h3>
         <div class="text-sm font-semibold text-base-content">
            {{ store.formatBackendDate(store.currentTicket.fechaCreacion) }}
         </div>
      </div>

      <div class="space-y-1">
         <h3 class="text-xs font-bold text-base-content/50 uppercase tracking-wider flex items-center gap-2">
            <BaseIcon name="refresh" class="h-4 w-4" /> Última Actividad
         </h3>
         <div class="text-sm font-semibold text-base-content">
            {{ store.formatBackendDate(store.currentTicket.fechaActualizacion) }}
         </div>
      </div>
  

      <div class="space-y-1">
         <h3 class="text-xs font-bold text-base-content/50 uppercase tracking-wider flex items-center gap-2">
            <BaseIcon name="calendar" class="h-4 w-4" /> Fecha de Vencimiento
         </h3>
         <div class="text-sm font-semibold text-base-content">
             {{ props.ticket.fechaVencimiento ? store.formatBackendDate(store.currentTicket.fechaVencimiento) : 'No especificada' }}
         </div>
      </div>

    </div>

    <div v-if="store.currentTicket.archivoAdjuntoUrl" class="border-t border-base-200 pt-4">
        <h3 class="text-xs font-bold text-base-content/50 mb-3 uppercase tracking-wider flex items-center gap-2">
            <BaseIcon name="paperClip" class="h-4 w-4" /> Documentos Adjuntos
        </h3>
        
        <div
          @click="descargarArchivo(store.currentTicket.archivoAdjuntoUrl)"
          class="group flex items-center gap-4 p-4 bg-base-100 border border-base-300 rounded-xl hover:border-primary hover:shadow-md cursor-pointer transition-all"
        >
          <div class="p-3 bg-primary/10 text-primary rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
             <BaseIcon name="documentText" class="h-6 w-6" />
          </div>

          <div class="flex-1 overflow-hidden">
            <p class="font-bold text-sm text-base-content truncate group-hover:text-primary transition-colors">
              {{ getNombreArchivo(store.currentTicket.archivoAdjuntoUrl) }}
            </p>
            <p class="text-xs text-base-content/50 font-medium mt-0.5">
               Clic para visualizar o descargar
            </p>
          </div>

          <BaseIcon name="externalLink" class="h-4 w-4 text-base-content opacity-30 group-hover:text-primary group-hover:opacity-100" />
        </div>
    </div>

  </div>
  
  <div v-else class="text-center py-10 text-base-content/50">
    Cargando...
  </div>
</template>
<style scoped>
.animate-fade-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
</style>