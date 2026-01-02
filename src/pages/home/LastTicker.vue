<script setup>
import { ref } from 'vue';
import CardTicker from '@/components/CardTicker.vue';
import TicketModal from '@/components/TicketModal.vue';
const isModalOpen = ref(false);
const selectedTicket = ref(null);

// Datos simulados (Ampliados para llenar el modal correctamente)
const tasks = ref([
  {
    id: 'MNT-2024-015',
    type: 'Mantenimiento',
    priority: 'Alta',
    title: 'Reparación de aire acondicionado',
    description: 'El aire acondicionado de la sala de reuniones principal hace un ruido fuerte y no enfría. Se requiere revisión urgente antes de la junta directiva.',
    user: 'María García',
    date: '14 dic 2024',
    status: 'En Proceso',
    responsible: 'Pedro Martínez',
    // Datos extra para el modal:
    fullDate: '2024-12-14T09:30:00',
    updatedDate: '2024-12-15T14:00:00',
    history: [
      { titulo: 'Ticket Creado', usuario: 'María García', fecha: '2024-12-14T09:30:00', descripcion: 'Incidencia reportada desde panel.' },
      { titulo: 'Asignación', usuario: 'Admin Sistema', fecha: '2024-12-14T10:00:00', descripcion: 'Asignado a Pedro Martínez.' },
      { titulo: 'Inicio de revisión', usuario: 'Pedro Martínez', fecha: '2024-12-15T09:00:00', descripcion: 'Revisando unidad compresora.' }
    ]
  },
  {
    id: 'INC-2024-089',
    type: 'Incidencia',
    priority: 'Media',
    title: 'Fallo en servidor de correo',
    description: 'Los usuarios reportan lentitud al enviar emails externos con adjuntos pesados.',
    user: 'Carlos López',
    date: '15 dic 2024',
    status: 'Pendiente',
    responsible: 'Ana Torres',
    fullDate: '2024-12-15T11:20:00',
    updatedDate: '2024-12-15T11:20:00',
    history: [
       { titulo: 'Ticket Creado', usuario: 'Carlos López', fecha: '2024-12-15T11:20:00', descripcion: 'Problema de latencia detectado.' }
    ]
  },
  {
    id: 'SOL-2024-112',
    type: 'Solicitud',
    priority: 'Baja',
    title: 'Nueva licencia de software',
    description: 'El departamento de diseño solicita una licencia adicional de Adobe CC para el nuevo pasante.',
    user: 'Laura Ruiz',
    date: '16 dic 2024',
    status: 'Aprobado',
    responsible: 'Javier Gómez',
    fullDate: '2024-12-16T15:45:00',
    updatedDate: '2024-12-17T09:00:00',
    history: [
       { titulo: 'Solicitud enviada', usuario: 'Laura Ruiz', fecha: '2024-12-16T15:45:00', descripcion: 'Petición de compra.' },
       { titulo: 'Aprobación Gerencia', usuario: 'Marta Boss', fecha: '2024-12-17T09:00:00', descripcion: 'Presupuesto aprobado.' }
    ]
  }
]);

// Función para abrir el modal
const openTicketModal = (task) => {
  // Mapeamos los datos de la Card al formato que espera el Modal (Ticket Interface)
  selectedTicket.value = {
    id: task.id,
    codigo: task.id,
    categoria: task.type,
    prioridad: task.priority,
    estado: task.status,
    titulo: task.title,
    descripcion: task.description,
    solicitante: task.user,
    responsable: task.responsible,
    fechaCreacion: task.fullDate,
    ultimaActualizacion: task.updatedDate,
    historial: task.history || []
  };
  
  isModalOpen.value = true;
};
</script>

<template>
  <div class="min-h-screen w-full flex flex-col items-center p-6 lg:pt-14 lg:pb-10 relative overflow-hidden ">

    <div class="absolute w-6 h-full left-1/2 -translate-x-1/2 top-0 bg-gray-700 rounded-full shadow-lg z-10
                lg:relative lg:w-full lg:max-w-4xl lg:h-6 lg:left-auto lg:translate-x-0 lg:z-20 lg:bg-linear-to-r lg:from-gray-700 lg:to-gray-800 lg:rounded-full"></div>

    <div class="flex flex-col lg:flex-row justify-center items-start w-full gap-10 pt-12 
                lg:gap-12 lg:-mt-2.5 lg:px-8 lg:pt-0 pointer-events-none"> 
                <div v-for="(task, index) in tasks" :key="task.id" class="flex flex-col items-center relative group w-full lg:w-auto pointer-events-auto">

        <div class="w-16 h-5 bg-gray-800 shadow-md relative z-0 rounded-md
                    lg:w-6 lg:h-16 lg:top-1 lg:rounded-none"></div>

        <div class="w-full max-w-sm transform-gpu transition-all duration-300 ease-out relative z-30 -mt-2
                    lg:mt-0 lg:hover:-translate-y-2 lg:hover:shadow-[0_25px_50px_rgba(0,0,0,0.15)]">
          <CardTicker v-bind="task" @click="openTicketModal(task)" />
        </div>

      </div>
    </div>

    <TicketModal 
      :isOpen="isModalOpen" 
      :ticket="selectedTicket"
      @close="isModalOpen = false"
    />

  </div>
</template>