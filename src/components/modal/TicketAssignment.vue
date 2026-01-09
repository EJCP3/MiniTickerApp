<script setup lang="ts">
import { ref, computed } from "vue";
import { useTicketStore } from "@/stores/ticketModalStore";
import { useAuthStore } from "@/stores/authStore";
import { useDepartmentStore } from "@/stores/departmentStore";
import BaseIcon from "../BaseIcon.vue";
import { storeToRefs } from "pinia";

const props = defineProps<{
  ticket?: any;    // Usado en la tabla (objeto completo)
  ticketId?: string; // Usado en TicketDetails (solo el ID)
}>();

const store = useTicketStore();
const authStore = useAuthStore();
const deptStore = useDepartmentStore();

const { gestoresOptions, areas } = storeToRefs(deptStore);
const modoEdicion = ref(false);

// ✅ Referencia inteligente del ticket
const activeTicket = computed(() => props.ticket || store.currentTicket);

// ✅ Obtención segura del UUID
const getActiveUuid = computed(() => {
  return props.ticket?.uuid || props.ticketId || store.currentTicket?.id;
});

// ⭐ NUEVA: Filtra globalmente solo los gestores que están activos
const gestoresSoloActivos = computed(() => {
  return gestoresOptions.value.filter(g => g.activo === true || g.activo === undefined); 
  // Nota: Se incluye undefined por si la propiedad no viene del backend inicialmente
});

// ✅ LÓGICA DE FILTRADO ACTUALIZADA
const gestorDelArea = computed(() => {
  const areaIdDelTicket = activeTicket.value?.area?.id;
  
  // Si no hay área, devolvemos todos los gestores activos
  if (!areaIdDelTicket) return gestoresSoloActivos.value;

  const areaEnCatalogo = areas.value.find((a) => a.id === areaIdDelTicket);
  const responsableIdReal = areaEnCatalogo?.responsableId;

  // Si el usuario logueado es Gestor, solo puede auto-asignarse si está activo
  if (isGestor.value) {
    return gestoresSoloActivos.value.filter(
      (g) => g.value === authStore.user?.id && g.value === responsableIdReal
    );
  }

  // Para Admins: Filtrar gestores activos que pertenecen al área sugerida
  const filtrado = gestoresSoloActivos.value.filter(
    (g) => g.value === responsableIdReal
  );

  // Si no hay responsable activo sugerido, mostrar todos los gestores activos disponibles
  return filtrado.length > 0 ? filtrado : gestoresSoloActivos.value;
});

const hasGestor = computed(() => {
  const g = activeTicket.value?.gestor;
  return !!g && !!g.id && g.id !== "00000000-0000-0000-0000-000000000000";
});

const nombreGestor = computed(() => activeTicket.value?.gestor?.nombre || "Sin asignar");
const isAdminOrSuper = computed(() => ["Admin", "SuperAdmin"].includes(authStore.user?.rol || ""));
const isGestor = computed(() => authStore.user?.rol === "Gestor");

const isTicketEnProceso = computed(() => 
  activeTicket.value?.estado === "EnProceso" || activeTicket.value?.estado === 1
);

const asignar = async (gestorId: string) => {
  const targetUuid = getActiveUuid.value;
  if (!gestorId || !targetUuid) return;

  try {
    await store.assignManager(gestorId, targetUuid);
    modoEdicion.value = false;
    (document.activeElement as HTMLElement)?.blur();
  } catch (error) {
    console.error("Error en la asignación:", error);
  }
};

const activarEdicion = () => { modoEdicion.value = true; };
const cancelarEdicion = () => { modoEdicion.value = false; };
</script>
<template>
  <div class="flex flex-col animate-fade-in">
    <div class="flex justify-between items-end mb-1">
      <h3 class="text-xs font-bold text-gray-400 flex items-center gap-2 uppercase tracking-wider">
        <BaseIcon name="userShield" class="h-4 w-4" /> Responsable
      </h3>

      <button
        v-if="hasGestor && isAdminOrSuper && !modoEdicion && !isTicketEnProceso"
        @click.stop="activarEdicion"
        class="text-[10px] text-primary hover:underline cursor-pointer font-semibold"
      >
        Cambiar
      </button>

      <button
        v-if="modoEdicion"
        @click.stop="cancelarEdicion"
        class="text-[10px] text-gray-400 hover:text-error cursor-pointer font-semibold"
      >
        Cancelar
      </button>
    </div>

    <div v-if="hasGestor && !modoEdicion" class="flex items-center gap-2 mt-1 p-2 bg-gray-50 rounded-lg border border-gray-100">
      <div class="avatar placeholder">
        <div class="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md">
          <span class="text-xs font-bold">{{ nombreGestor[0] }}</span>
        </div>
      </div>
      <div class="flex flex-col">
        <span class="text-gray-700 font-bold text-sm leading-none">{{ nombreGestor }}</span>
        <span class="text-[10px] text-green-600 font-medium flex items-center gap-1 mt-1 bg-green-50 px-1.5 py-0.5 rounded-full w-fit">
          <BaseIcon name="check" class="h-3 w-3" /> Asignado
        </span>
      </div>
    </div>

    <button
      v-if="isGestor && !hasGestor && !modoEdicion"
      @click.stop="asignar(authStore.user?.id)"
      class="btn btn-sm btn-primary w-full gap-2 mt-1"
    >
      <BaseIcon name="userCheck" class="h-4 w-4" />
      Atender este ticket
    </button>

    <div v-else-if="(isAdminOrSuper && !hasGestor) || modoEdicion" class="dropdown dropdown-end w-full" @click.stop>
      <div tabindex="0" role="button" class="btn btn-sm btn-outline border-base-300 bg-base-100 w-full justify-between font-normal normal-case h-auto py-2">
        <span class="flex items-center gap-2">
          <BaseIcon name="userPlus" class="h-4 w-4 text-orange-500" />
          {{ modoEdicion ? "Seleccionar responsable..." : "Asignar Gestor" }}
        </span>
        <BaseIcon name="chevronDown" class="h-3 w-3 opacity-50" />
      </div>

      <ul tabindex="0" class="dropdown-content z-[50] menu p-2 shadow-xl bg-base-100 rounded-box w-64 border border-base-200 max-h-60 overflow-y-auto mt-1">
        <li v-if="activeTicket?.area?.responsableId" class="px-3 py-1 text-[9px] uppercase font-bold text-primary/60">
          Responsable Sugerido ({{ activeTicket.area.nombre }})
        </li>

        <li v-for="g in gestorDelArea" :key="g.value">
          <a @click.stop="asignar(g.value)" class="flex justify-between items-center py-2 hover:bg-base-200">
            <div class="flex items-center gap-3">
              <div class="avatar">
                <div class="w-8 h-8 rounded-full border border-base-300">
                  <img :src="g.foto" :alt="g.label" />
                </div>
              </div>
              <div class="flex flex-col">
                <span class="font-bold text-sm leading-none">{{ g.label }}</span>
              </div>
            </div>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>