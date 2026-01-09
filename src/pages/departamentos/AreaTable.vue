<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useDepartmentStore } from "@/stores/departmentStore";
import type { Area } from "@/types/department";
import BaseIcon from "@/components/BaseIcon.vue";
import { toast } from "vue-sonner";

const props = defineProps<{
  areas: Area[];
}>();

const emit = defineEmits(["edit", "manage-types"]);

const store = useDepartmentStore();
const { gestoresOptions } = storeToRefs(store);

// --- ESTADOS PARA EL MODAL ---
const areaToDelete = ref<Area | null>(null);

const getManager = (responsableId?: string) => {
  if (!responsableId) return { name: "Sin Asignar", photo: null };
  const found = gestoresOptions.value.find((g) => g.value === responsableId);
  return {
    name: found?.label || "Sin Asignar",
    photo: found?.foto || null,
  };
};

// --- LÓGICA DE BORRADO ---
const intentarBorrar = (area: Area) => {
  if (area.stats?.activas > 0) {
    toast.error("Acción Bloqueada", {
      description: `El área "${area.nombre}" tiene ${area.stats.activas} tickets pendientes que deben cerrarse.`,
      duration: 5000
    });
    return;
  }
  areaToDelete.value = area;
};

const ejecutarBorrado = async () => {
  if (areaToDelete.value) {
    const areaId = areaToDelete.value.id;
    areaToDelete.value = null; // Cerramos modal inmediatamente
    
    try {
      await store.deleteArea(areaId);
    } catch (e) {
      // El error ya es manejado por el onError del store con un Toast
    }
  }
};
</script>

<template>
  <div class="overflow-x-auto bg-base-100 rounded-2xl border border-base-200 shadow-sm">
    <table class="table table-zebra w-full">
      <thead>
        <tr class="bg-base-200/50 text-base-content/70">
          <th class="rounded-tl-2xl">Área</th>
          <th>Responsable</th>
          <th class="text-center">Tickets (A / T)</th>
          <th>Estado</th>
          <th class="rounded-tr-2xl text-right">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="area in areas" :key="area.id" class="hover:bg-base-200/30 transition-colors">
          <td>
            <div class="flex items-center gap-3">
              <div 
                class="size-10 rounded-lg flex items-center justify-center shrink-0"
                :class="area.activo ? 'bg-blue-600 text-white' : 'bg-base-300 text-base-content/30'"
              >
                <BaseIcon name="barChart" class="size-5" />
              </div>
              <div>
                <div class="font-bold text-base-content">{{ area.nombre }}</div>
                <div class="text-[10px] font-mono opacity-50 uppercase">{{ area.prefijo }}</div>
              </div>
            </div>
          </td>

          <td>
            <div class="flex items-center gap-2">
              <div class="avatar placeholder">
                <div class="w-8 rounded-full bg-secondary text-white">
                  <img v-if="getManager(area.responsableId).photo" :src="getManager(area.responsableId).photo" />
                  <span v-else class="text-xs">{{ getManager(area.responsableId).name.charAt(0) }}</span>
                </div>
              </div>
              <span class="text-sm font-medium">{{ getManager(area.responsableId).name }}</span>
            </div>
          </td>

          <td class="text-center">
            <div class="flex justify-center gap-3">
              <div class="flex flex-col">
                <span class="text-sm font-bold text-warning">{{ area.stats?.activas || 0 }}</span>
                <span class="text-[9px] uppercase opacity-40 font-bold">Activas</span>
              </div>
              <div class="divider divider-horizontal mx-0 w-1"></div>
              <div class="flex flex-col">
                <span class="text-sm font-bold opacity-70">{{ area.stats?.total || 0 }}</span>
                <span class="text-[9px] uppercase opacity-40 font-bold">Total</span>
              </div>
            </div>
          </td>

          <td>
            <span 
              class="badge badge-sm font-bold text-white border-none"
              :class="area.activo ? 'badge-success' : 'badge-error'"
            >
              {{ area.activo ? "Activo" : "Inactivo" }}
            </span>
          </td>

          <td>
            <div class="flex justify-end gap-1">
              <button @click="$emit('manage-types', area)" class="btn btn-ghost btn-xs tooltip" data-tip="Tipos">
                <BaseIcon name="list" class="size-10" />
              </button>
              <button @click="$emit('edit', area)" class="btn btn-ghost btn-xs text-info tooltip" data-tip="Editar">
                <BaseIcon name="edit" class="size-10" />
              </button>
              <button 
                @click="intentarBorrar(area)" 
                class="btn btn-ghost btn-xs transition-all" 
                :class="area.stats?.activas > 0 ? 'text-base-content/20' : 'text-error hover:bg-error/10'"
                :title="area.stats?.activas > 0 ? 'Cierre los tickets para borrar' : 'Eliminar'"
              >
                <BaseIcon name="trash" class="size-10" />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  

  <dialog class="modal" :class="{ 'modal-open': areaToDelete !== null }">
    <div class="modal-box w-full max-w-sm bg-base-100 text-center shadow-xl border border-base-200">
      <div class="flex size-14 justify-center mb-4 text-error bg-error/10 rounded-full p-1 mx-auto">
        <BaseIcon name="alertCircle" class="size-12" />
      </div>
      
      <h3 class="font-bold text-lg text-base-content">¿Desactivar Área?</h3>
      <p class="py-4 text-sm text-base-content/70">
        Estás a punto de desactivar el área <span class="font-bold text-base-content">{{ areaToDelete?.nombre }}</span>. 
        Esta acción impedirá crear nuevas solicitudes para este departamento.
      </p>
      
      <div class="modal-action justify-center gap-2 mt-2">
        <button @click="areaToDelete = null" class="btn btn-sm btn-ghost">Cancelar</button>
        <button @click="ejecutarBorrado" class="btn btn-sm btn-error text-white font-bold">
          Sí, desactivar
        </button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button @click="areaToDelete = null">close</button>
    </form>
  </dialog>
  </div>
</template>