<script setup lang="ts">
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { useDepartmentStore } from "@/stores/departmentStore";
import type { Area } from "@/types/department";
import { toast } from "vue-sonner"; //

import BaseIcon from "@/components/BaseIcon.vue";

const props = defineProps<{
  area: Area;
}>();

const showDeleteConfirm = ref(false); //

const intentarBorrar = async () => {
  // 1. VALIDACIÓN LOCAL (Basada en tus stats de image_6d9298.png)
  if (props.area.stats?.activas > 0) {
    toast.error("Acción denegada", {
      description: `No puedes eliminar el área "${props.area.nombre}" porque tiene ${props.area.stats.activas} tickets activos.`,
    });
    return;
  }
  showDeleteConfirm.value = true; //
  // 2. CONFIRMACIÓN NATIVA (Solo para el sí/no)

  
};

const ejecutarBorrado = async () => {
 
  try {
    await store.deleteArea(props.area.id); //
  } catch (e) {
    
  }
   showDeleteConfirm.value = false; 
};

const emit = defineEmits(["edit", "manage-types"]);

// 1. Conectamos al store para tener acceso a la lista de usuarios
const store = useDepartmentStore();
const { gestoresOptions } = storeToRefs(store);

// 2. Computed para encontrar el NOMBRE basándonos en el ID
const manager = computed(() => {
  if (!props.area.responsableId) return null;

  // Buscamos en gestoresOptions que ahora incluye la propiedad 'foto'
  return gestoresOptions.value.find(
    (g) => g.value === props.area.responsableId
  );
});
const mensajeError = ref("");
// 2. Extraemos el nombre y la foto de forma segura
const managerName = computed(() => manager.value?.label || "Sin Asignar");
const managerPhoto = computed(() => manager.value?.foto || null);

// 3. Iniciales (Tu lógica actual funciona perfecto)
const managerInitials = computed(() => {
  const name = managerName.value;
  if (name === "Sin Asignar") return "S";
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
});

// Clases dinámicas para el estado
const statusColor = computed(() =>
  props.area.activo
    ? "bg-primary/10 text-primary"
    : "bg-base-300 text-base-content/50"
);

// const intentarBorrar = async () => {
//   // 1. Limpiamos errores previos
//   mensajeError.value = "";

//   // 2. Verificación local inmediata basada en el DTO
//   if (props.area.stats?.activas > 0) {
//     mensajeError.value = `No se puede eliminar: tiene ${props.area.stats.activas} tickets pendientes.`;
//     return;
//   }

//   // 3. Confirmación nativa del navegador
//   const confirma = confirm(
//     `¿Estás seguro de desactivar el área "${props.area.nombre}"?`
//   );

//   if (confirma) {
//     try {
//       await store.deleteArea(props.area.id);
//     } catch (e: any) {
//       // Si el backend falla por la validación que pusimos en C#
//       mensajeError.value = e.response?.data?.message || "Error al eliminar";
//     }
//   }
// };
</script>

<template>
  <article
    class="card bg-base-100 shadow-sm hover:shadow-md transition-shadow border border-base-200"
  >
  <dialog class="modal" :class="{ 'modal-open': showDeleteConfirm }">
      <div class="modal-box w-full max-w-sm bg-base-100 text-center shadow-xl border border-base-200">
        <div class="flex size-14 justify-center mb-4 text-error bg-error/10 rounded-full p-1 mx-auto">
          <BaseIcon name="alertCircle" class="size-12" />
        </div>
        
        <h3 class="font-bold text-lg text-base-content">Borrar Área?</h3>
        <p class="py-4 text-sm text-base-content/70">
          Estás a punto de Borrar el área <span class="font-bold text-base-content">{{ area.nombre }}</span>. 
          Los tickets históricos se mantendrán, pero no se podrán crear nuevos.
        </p>
        
        <div class="modal-action justify-center gap-2 mt-2">
          <button @click="showDeleteConfirm = false" class="btn btn-sm btn-ghost">Cancelar</button>
          <button @click="ejecutarBorrado" class="btn btn-sm btn-error text-white font-bold">
            Sí, borrar
          </button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button @click="showDeleteConfirm = false">close</button>
      </form>
    </dialog>
    <div
      v-if="mensajeError"
      class="text-[10px] text-error font-bold mb-2 animate-bounce"
    >
      {{ mensajeError }}
    </div>
    <div class="card-body p-6">
      <div class="flex justify-between items-start mb-4">
        <div class="flex gap-4 items-center">
          <div
            class="w-12 h-12 rounded-xl flex items-center justify-center transition-colors"
            :class="
              props.area.activo
                ? 'bg-blue-600 text-white'
                : 'bg-base-200 text-base-content/30'
            "
          >
            <BaseIcon name="barChart" class="size-6" />
          </div>
          <div>
            <h2 class="card-title text-xl font-bold text-base-content">
              {{ area.nombre }}
            </h2>
            <div class="flex gap-2 mt-1">
              <span class="badge badge-ghost badge-sm font-mono text-xs">
                {{ area.prefijo }}
              </span>
              <span
                class="badge badge-sm"
                :class="
                  area.activo
                    ? 'badge-success text-white'
                    : 'badge-error text-white'
                "
              >
                {{ area.activo ? "Activo" : "Inactivo" }}
              </span>
            </div>
          </div>
        </div>

        <div class="flex gap-1">
          <button
            @click="$emit('manage-types', area)"
            class="btn btn-square btn-ghost btn-sm tooltip tooltip-bottom"
            data-tip="Configurar Tipos"
          >
            <BaseIcon name="list" class="size-5" />
          </button>
          <button
            @click="$emit('edit', area)"
            class="btn btn-square btn-ghost btn-sm tooltip tooltip-bottom"
            data-tip="Editar Área"
          >
            <BaseIcon name="edit" class="size-5" />
          </button>
          <div class="flex gap-1">
            <button
              @click="intentarBorrar"
              class="btn btn-sm btn-square transition-all"
              :class="[
                area.stats?.activas > 0
                  ? 'btn-ghost text-base-content/20 cursor-not-allowed'
                  : 'btn-ghost text-error hover:bg-error/10',
              ]"
              :title="
                area.stats?.activas > 0
                  ? 'Bloqueado: Existen tickets activos'
                  : 'Eliminar área'
              "
            >
              <BaseIcon name="trash" class="size-5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-base-200/50 rounded-lg p-3 mb-4 flex items-center gap-3">
      <div class="avatar placeholder">
        <div
          class="w-10 rounded-full text-white"
          :class="area.responsableId ? 'bg-secondary' : 'bg-neutral-focus'"
        >
          <img
            v-if="area.responsableId"
            :src="managerPhoto"
            :alt="managerName"
          />
        </div>
      </div>
      <div class="flex flex-col">
        <span
          class="text-[10px] uppercase font-bold text-base-content/40 tracking-wider"
        >
          Responsable
        </span>
        <span
          class="font-medium text-sm text-base-content truncate max-w-[150px]"
        >
          {{ managerName }}
        </span>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-2 mt-auto border-t border-base-200 pt-4">
      <div class="text-center">
        <div class="text-2xl font-bold text-base-content">
          {{ area.stats?.total || 0 }}
        </div>
        <div class="text-[10px] uppercase font-bold text-base-content/40">
          Total
        </div>
      </div>
      <div class="text-center border-l border-base-200">
        <div class="text-2xl font-bold text-warning">
          {{ area.stats?.activas || 0 }}
        </div>
        <div class="text-[10px] uppercase font-bold text-base-content/40">
          Activas
        </div>
      </div>
      <div class="text-center border-l border-base-200">
        <div class="text-2xl font-bold text-success">
          {{ area.stats?.completadas || 0 }}
        </div>
        <div class="text-[10px] uppercase font-bold text-base-content/40">
          Hechas
        </div>
      </div>
    </div>
  </article>
</template>
