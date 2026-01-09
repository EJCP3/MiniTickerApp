<script setup lang="ts">
import type { Solicitud } from "@/types/solicitudes";
import BaseIcon from "@/components/BaseIcon.vue";
import TicketAssignment from "@/components/modal/TicketAssignment.vue";

defineProps<{
  solicitudes: Solicitud[];
}>();

const emit = defineEmits(["row-click"]);

// Reutilizamos la lógica de colores que ya tienes para consistencia visual
const getStatusClass = (estado: string) => {
  const map: Record<string, string> = {
    Nueva: "badge-warning bg-yellow-100 text-yellow-800 border-none",
    "En Proceso": "badge-info bg-blue-100 text-blue-800 border-none",
    Resuelta: "badge-success bg-green-100 text-green-800 border-none",
    Cerrada: "bg-gray-200 text-gray-600 border-none",
    Rechazada: "badge-error bg-red-100 text-red-800 border-none",
  };
  return map[estado] || "badge-ghost";
};

const getPriorityColor = (prioridad: string) => {
  const map: Record<string, string> = {
    Baja: "bg-emerald-500",
    Media: "bg-orange-400",
    Alta: "bg-red-600",
  };
  return map[prioridad] || "bg-gray-300";
};
</script>

<template>
  <div
    class="overflow-x-auto bg-base-100 rounded-2xl border border-base-200 shadow-sm"
  >
    <table class="table table-zebra w-full">
      <thead>
        <tr class="bg-base-200/50 text-base-content/70">
          <th class="rounded-tl-2xl">Numero</th>
          <th>Título</th>
          <th>Área</th>
          <th>Prioridad</th>
          <th>Estado</th>
          <th>Solicitante</th>
          <th>Gestor</th>
          <th class="rounded-tr-2xl text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="s in solicitudes"
          :key="s.id"
          class="hover:bg-base-200/50 transition-colors cursor-pointer group"
          @click="emit('row-click', s.uuid)"
        >
          <td class="font-mono text-xs opacity-50">#{{ s.id }}</td>
          <td class="max-w-md">
            <div
              class="font-bold text-base-content group-hover:text-primary truncate"
            >
              {{ s.titulo }}
            </div>
          </td>
          <td>
            <span
              class="badge badge-sm bg-base-200 border-none text-base-content/70 font-bold uppercase text-[10px]"
            >
              {{ s.tipo }}
            </span>
          </td>
          <td>
            <div class="flex items-center gap-2 text-xs font-semibold">
              <span
                class="size-2 rounded-full"
                :class="getPriorityColor(s.prioridad)"
              ></span>
              {{ s.prioridad }}
            </div>
          </td>
          <td>
            <span
              class="badge badge-sm font-bold border-none"
              :class="getStatusClass(s.estado)"
            >
              {{ s.estado }}
            </span>
          </td>
          <td class="text-xs text-base-content/60 font-medium">
            {{ s.solicitante }}
          </td>
          <td class="text-xs text-base-content/60 font-medium" @click.stop>
            <template v-if="s.responsable">{{ s.responsable }}</template>
            <template v-else>
              <TicketAssignment :ticket="s" />
            </template>
          </td>
          <td class="text-center">
            <button class="btn btn-ghost btn-xs text-primary font-bold">
              Detalles
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
