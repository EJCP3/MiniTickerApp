<script setup lang="ts">
import type { User } from "@/types/users";
import BaseIcon from "@/components/BaseIcon.vue";
import { computed } from "vue";

const props = defineProps<{
  users: User[];
}>();

const emit = defineEmits(["edit", "toggleStatus"]); //

const getBadgeClass = (rol: string) => {
  switch (rol) {
    case "SuperAdmin":
      return "badge-secondary badge-soft";
    case "Admin":
      return "badge-primary badge-soft";
    case "Gestor":
      return "badge-accent badge-soft";
    default:
      return "badge-soft";
  }
};

const handleToggle = (user: User) => {
  // Emitimos el ID y el valor contrario al actual
  emit("toggleStatus", user.id, !user.activo);
};
</script>

<template>
  <div
    class="overflow-x-auto bg-base-100 rounded-2xl border border-base-200 shadow-sm"
  >
    <table class="table table-zebra w-full">
      <thead>
        <tr class="bg-base-200/50 text-base-content/70">
          <th class="rounded-tl-2xl">Usuario</th>
          <th>Rol</th>
          <th>Area</th>
          <th class="text-center">Estado</th>
          <th class="rounded-tr-2xl text-right">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="user in users"
          :key="user.id"
          class="hover:bg-base-200/30 transition-colors group"
        >
          <td>
            <div class="flex items-center gap-3">
              <div class="avatar">
                <div class="w-10 rounded-full ring-1 ring-base-200">
                  <img
                    :src="
                      user.fotoPerfilUrl ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user.nombre
                      )}&background=random`
                    "
                  />
                </div>
              </div>
              <div>
                <div class="font-bold text-base-content">{{ user.nombre }}</div>
                <div class="text-xs opacity-50">{{ user.email }}</div>
              </div>
            </div>
          </td>

          <td>
            <span
              class="badge badge-sm font-bold border-none"
              :class="getBadgeClass(user.rol)"
            >
              {{ user.rol }}
            </span>
          </td>

          <td>
            <span
              class="badge badge-sm font-bold border-none"
              :class="getBadgeClass(user.rol)"
            >
              {{ user.areaNombre || "General" }}
            </span>
          </td>

          <td class="text-center">
            <div class="flex justify-center">
              <div
                class="badge badge-xs"
                :class="
                  user.activo
                    ? 'badge-success shadow-[0_0_8px] shadow-success'
                    : 'badge-error shadow-[0_0_8px] shadow-error'
                "
              ></div>
            </div>
          </td>

          <td>
            <div class="flex justify-end gap-2">
              <button
                @click="$emit('edit', user)"
                class="btn btn-ghost btn-xs text-info tooltip hover:bg-transparent hover:border-transparent"
                data-tip="Editar"
              >
                <BaseIcon name="edit" class="size-8" />
              </button>
              <button
                @click="handleToggle(user)"
                class="btn btn-ghost btn-xs tooltip"
                :class="user.activo ? 'text-error' : 'text-success'"
                :data-tip="user.activo ? 'Desactivar' : 'Activar'"
              >
                <BaseIcon
                  :name="user.activo ? 'userPlus' : 'userOff'"
                  class="size-8"
                />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
