<script setup lang="ts">
import { ref } from 'vue';
import TicketModal, { type Ticket } from '@/components/TicketModal.vue'; // Importa el componente y el tipo

const showModal = ref(false);
const ticketSeleccionado = ref<Ticket | null>(null);

// Ejemplo de datos en tu lista
const misTickets = ref<Ticket[]>([
  {
    id: 1,
    codigo: 'TI-2024-001',
    categoria: 'TI',
    prioridad: 'Media',
    estado: 'Pendiente',
    titulo: 'Instalación de software AutoCAD',
    descripcion: 'Necesito instalación de AutoCAD 2024 en mi equipo de trabajo para los planos del proyecto X.',
    solicitante: 'Juan Pérez',
    fechaCreacion: '15 dic 2024, 09:30 a.m.',
    ultimaActualizacion: '15 dic 2024, 09:30 a.m.',
    historial: [
        { titulo: 'Solicitud creada', usuario: 'Juan Pérez', fecha: '15 dic, 09:30 am', descripcion: 'Creación inicial del ticket' }
    ]
  },
  {
    id: 2,
    codigo: 'MNT-2024-055',
    categoria: 'Mantenimiento',
    prioridad: 'Alta',
    estado: 'En Proceso',
    titulo: 'Aire Acondicionado Sala B',
    descripcion: 'El aire hace un ruido extraño y no enfría.',
    solicitante: 'Maria Garcia',
    fechaCreacion: '20 dic 2024, 10:00 a.m.',
    ultimaActualizacion: '21 dic 2024, 11:00 a.m.',
    historial: []
  }
]);

// FUNCIÓN PARA ABRIR EL MODAL
const verDetalle = (ticket: Ticket) => {
  ticketSeleccionado.value = ticket; // 1. Guardamos el ticket clicado
  showModal.value = true;            // 2. Abrimos el modal
};

const cerrarDetalle = () => {
  showModal.value = false;
  // Opcional: ticketSeleccionado.value = null; tras una animación
};
</script>

<template>
  <div class="p-10">
    <h1 class="text-2xl font-bold mb-4">Mis Tickets</h1>
    
    <div class="grid gap-4">
      <div 
        v-for="t in misTickets" 
        :key="t.id" 
        class="bg-base-100 p-4 rounded-xl shadow border border-base-200 flex justify-between items-center"
      >
        <div @click="verDetalle(t)">
          <div class="font-bold">{{ t.codigo }} - {{ t.titulo }}</div>
          <div class="text-sm opacity-70">{{ t.estado }}</div>
        </div>
        
     
      </div>
    </div>

    <TicketModal 
      :is-open="showModal" 
      :ticket="ticketSeleccionado" 
      @close="cerrarDetalle" 
    />
  </div>
</template>