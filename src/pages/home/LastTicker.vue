<script setup>
import { computed, onMounted, onUnmounted } from "vue";
import { storeToRefs } from "pinia";
import CardTicker from "@/components/CardTicker.vue";
import TicketModal from "@/components/modal/TicketModal.vue";
import { useTicketStore } from "@/stores/ticketStore";
import { useAuthStore } from "@/stores/authStore";
import { useActivityActions } from "@/composables/useDateTicket";

const authStore = useAuthStore();
const ticketStore = useTicketStore();


const { tickets, isLoading } = storeToRefs(ticketStore);
const { refresh } = ticketStore; 

const { showModal, ticketSeleccionado, abrirDetalleTicket } = useActivityActions();

let intervalo = null;

// ✅ CORRECCIÓN: Usamos 'refresh()' en lugar de 'tickets()'
const cargarDatos = async () => {
  await refresh(); 
};

onMounted(() => {
  cargarDatos();
  intervalo = setInterval(cargarDatos, 30000);
});

onUnmounted(() => {
  if (intervalo) clearInterval(intervalo);
});

const closeModal = () => {
  showModal.value = false;
};

const formatearFechaVisual = (fechaStr) => {
  if (!fechaStr) return "---";
  if (typeof fechaStr === "string" && fechaStr.includes("/")) {
    return fechaStr.split(" ")[0];
  }
  const fechaObj = new Date(fechaStr);
  if (!isNaN(fechaObj.getTime())) {
    return fechaObj.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }
  return fechaStr;
};

const ultimosTresTickets = computed(() => {
  const listaOriginal = tickets.value || [];
  let listaProcesada = [...listaOriginal];
  const user = authStore.user;


  if (user && (user.rol === "Solicitante" || user.role === "Solicitante")) {
    listaProcesada = listaProcesada.filter((t) => {
      const idTicketSolicitante = t.solicitante?.id || t.solicitanteId;
      return String(idTicketSolicitante) === String(user.id);
    });
  }

  listaProcesada.sort((a, b) => {
    return new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime();
  });

  return listaProcesada.slice(0, 3).map((ticket) => ({
    id: ticket.id || ticket.uuid,
    numero: ticket.numero || ticket.codigo,
    type: ticket.tipoSolicitud?.nombre || ticket.area?.nombre || "General",
    priority: ticket.prioridad,
    title: ticket.asunto,
    description: ticket.descripcion,
    user: ticket.solicitante?.nombre || "Usuario",
    date: formatearFechaVisual(ticket.fechaCreacion),
    status: ticket.estado,
    responsible: ticket.gestor?.nombre || "Sin asignar",
    ticketId: ticket.id,
    titulo: ticket.asunto,
    mensaje: ticket.descripcion,
    usuario: ticket.solicitante?.nombre || "Usuario",
    fecha: ticket.fechaCreacion,
  }));
});

const clickEnTicket = (task) => {
  abrirDetalleTicket({ ...task, id: task.ticketId });
};
</script>

<template>
  <div class="min-h-screen w-full flex flex-col items-center p-6 lg:pt-14 lg:pb-10 relative overflow-hidden">
    <div class="absolute w-6 h-full left-1/2 -translate-x-1/2 top-0 bg-gray-700 rounded-full shadow-lg z-10 lg:relative lg:w-full lg:max-w-7xl lg:h-6 lg:left-auto lg:translate-x-0 lg:z-20 lg:bg-linear-to-r lg:from-gray-700 lg:to-gray-800 lg:rounded-full"></div>

    <div class="flex flex-col lg:flex-row justify-center items-start w-full gap-10 pt-12 lg:gap-24 lg:-mt-2.5 lg:px-8 lg:pt-0 pointer-events-none">
      
      <div v-if="isLoading && ultimosTresTickets.length === 0" class="text-white font-bold p-4">
        Cargando tickets...
      </div>

      <div
        v-else
        v-for="task in ultimosTresTickets"
        :key="task.id"
        class="flex flex-col items-center relative group w-full lg:w-auto pointer-events-auto"
      >
        <div class="w-16 h-5 bg-gray-800 shadow-md relative z-0 rounded-md lg:w-6 lg:h-16 lg:top-1 lg:rounded-none"></div>

        <div class="w-full max-w-sm transform-gpu transition-all duration-300 ease-out relative z-30 -mt-2 lg:mt-0 lg:hover:-translate-y-2 lg:hover:shadow-[0_25px_50px_rgba(0,0,0,0.15)]">
          <CardTicker v-bind="task" @click="clickEnTicket(task)" />
        </div>
      </div>

      <div v-if="!isLoading && ultimosTresTickets.length === 0" class="text-gray-400 p-4 font-medium pointer-events-auto">
        No hay tickets recientes para mostrar.
      </div>
    </div>

    <TicketModal 
      :isOpen="showModal" 
      :ticket-id="ticketSeleccionado?.ticketId || ticketSeleccionado?.id" 
      @close="closeModal" 
    />
  </div>
</template>