<script setup lang="ts">
import { ref, computed } from "vue";
import type { User } from "@/types/users";
import { areasOptions } from "@/types/users";
import BaseIcon from "@/components/BaseIcon.vue";

const props = defineProps<{ user: User }>();
const emit = defineEmits(["edit", "toggleStatus"]);

// Estado para el modal de confirmación
const showDeleteConfirm = ref(false);

const badgeClass = computed(() => {
  switch (props.user.rol) {
    case "SuperAdmin":
      return "badge-secondary badge-soft";
    case "Admin":
      return "badge-primary badge-soft";
    case "Gestor":
      return "badge-accent badge-soft";
    default:
      return "badge-soft";
  }
});

const handleToggleStatus = () => {
  emit("toggleStatus", props.user.id, !props.user.activo);
  
};
</script>

<template>
  <article
    class="card bg-base-100 shadow-sm border border-base-200 hover:shadow-md transition-all group relative"
  >
    <div class="card-body p-6">
      <header class="flex justify-between items-start">
        <div class="flex gap-4">
          <figure class="avatar">
            <div
              class="w-12 h-12 rounded-full ring ring-base-200 ring-offset-base-100 ring-offset-2"
            >
              <img
                :src="
                  user.fotoPerfilUrl ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.nombre
                  )}&background=random`
                "
                :alt="`Avatar de ${user.nombre}`"
              />
            </div>
          </figure>

          <div class="overflow-hidden">
            <h3
              class="font-bold text-lg leading-tight truncate"
              :title="user.nombre"
            >
              {{ user.nombre }}
            </h3>
            <p
              class="text-sm text-base-content/60 mb-2 truncate"
              :title="user.email"
            >
              {{ user.email }}
            </p>

            <div class="flex flex-wrap gap-2">
              <span
                class="badge badge-sm gap-1.5 py-3 pl-2 pr-3"
                :class="badgeClass"
              >
                {{ user.rol }}
              </span>
              <span
                v-if="user.areaNombre"
                class="badge badge-ghost badge-sm opacity-80"
              >
                {{ user.areaNombre }}
              </span>
            </div>
          </div>
        </div>

        <div
          class="tooltip tooltip-left"
          :data-tip="user.activo ? 'Activo' : 'Inactivo'"
        >
          <div
            class="w-3 h-3 rounded-full mt-2"
            :class="
              user.activo
                ? 'bg-success shadow-[0_0_8px] shadow-success'
                : 'bg-error shadow-[0_0_8px] shadow-error'
            "
            aria-hidden="true"
          ></div>
        </div>
      </header>

      <footer class="mt-4 pt-4 border-t border-base-200 flex gap-2">
        <button
          @click="$emit('edit', user)"
          class="btn btn-sm btn-outline flex-1 gap-2 hover:btn-primary"
        >
          <BaseIcon name="edit" class="size-6" />
          Editar
        </button>

        <button
          @click="handleToggleStatus"
          class="btn btn-sm flex-1 gap-2"
          :class="
            user.activo
              ? 'btn-ghost text-error hover:bg-error/10'
              : 'btn-success text-white'
          "
        >
          <BaseIcon
            :name="user.activo ? 'userMinus' : 'userCheck'"
            class="size-5"
          />
          {{ user.activo ? "Desactivar" : "Activar" }}
        </button>
      </footer>
    </div>

   
  </article>
</template>
