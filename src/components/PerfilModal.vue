<script setup lang="ts">
import { computed, ref } from "vue";

import BaseIcon from "./BaseIcon.vue"; // Importamos el componente de iconos

// PROPS: Recibimos el objeto usuario desde el padre o el store

const props = defineProps({
  user: {
    type: Object,
    default: () => null,
  },
});

// Función para abrir el modal desde el padre

const modalId = `modal-${Math.random().toString(36).substr(2, 9)}`;

// 2. Función para abrir el modal buscando su ID único
const openModal = () => {
  // Buscamos el elemento directamente en el documento
  const modalElement = document.getElementById(modalId) as HTMLDialogElement;

  if (modalElement) {
    modalElement.showModal();
  } else {
    console.error(`No se encontró el modal con ID: ${modalId}`);
    // Intento de rescate: buscar por clase si falla el ID (muy raro)
    const fallback = document.querySelector(
      "dialog[open]"
    ) as HTMLDialogElement;
    if (fallback) fallback.close(); // cerrar otros por si acaso
  }
};
// Exponemos la función para que el padre pueda llamarla

defineExpose({ openModal });

// Formatear la fecha

const formattedDate = computed(() => {
  if (!props.user?.fechaCreacion) return "  Fecha desconocida";

  return new Date(props.user.fechaCreacion).toLocaleDateString("es-ES", {
    year: "numeric",

    month: "long",

    day: "numeric",
  });
});

// Avatar por defecto

const avatarUrl = computed(() => {
  if (props.user?.fotoPerfilUrl) return props.user.fotoPerfilUrl;

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    props.user?.nombre
  )}&background=random`;
});
</script>

<template>
  <dialog :id="modalId" class="modal modal-bottom sm:modal-middle">
    <article class="modal-box relative bg-base-100">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
          ✕
        </button>
      </form>

      <div v-if="user">
        <header class="flex flex-col items-center text-center mt-4">
          <div class="avatar mb-4">
            <div
              class="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2"
            >
              <img :src="avatarUrl" :alt="`Foto de perfil de ${user.nombre}`" />
            </div>
          </div>

          <h3 class="font-bold text-2xl text-base-content">
            {{ user.nombre }}
          </h3>

          <div class="mt-2">
            <span
              class="badge badge-primary badge-lg uppercase font-semibold shadow-sm"
            >
              {{ user.rol }}
            </span>
          </div>

          <div v-if="user?.areaNombre" class="mt-2">
            <span
              class="badge badge-warning badge-lg uppercase font-semibold shadow-sm"
            >
              {{ user.areaNombre }}
            </span>
          </div>
        </header>

        <div class="divider text-base-content/50 text-sm">
          Información de Contacto
        </div>

        <section class="space-y-4 px-4 pb-4">
          <a
            :href="`mailto:${user.email}`"
            class="flex items-center gap-3 bg-base-200 p-3 rounded-lg hover:bg-base-300 transition-colors group cursor-pointer"
          >
            <div
              class="p-2 bg-base-100 rounded-full text-primary group-hover:text-primary-focus"
            >
              <BaseIcon name="mail" class="h-10 w-10" />
            </div>
            <div class="flex flex-col text-left overflow-hidden">
              <span
                class="text-xs text-base-content/60 font-semibold uppercase tracking-wide"
                >Correo Electrónico</span
              >
              <span class="font-medium truncate text-base-content">{{
                user.email
              }}</span>
            </div>
          </a>

          <div class="flex items-center gap-3 bg-base-200 p-3 rounded-lg">
            <div class="p-2 bg-base-100 rounded-full text-secondary">
              <BaseIcon name="clock" class="h-10 w-10" />
            </div>
            <div class="flex flex-col text-left">
              <span
                class="text-xs text-base-content/60 font-semibold uppercase tracking-wide"
                >Miembro desde</span
              >
              <time
                :datetime="user.fechaCreacion"
                class="font-medium text-base-content"
              >
                {{ formattedDate }}
              </time>
            </div>
          </div>
        </section>
      </div>

      <div v-else class="py-10 text-center text-base-content/50">
        <span class="loading loading-spinner loading-md"></span>
        <p class="text-sm mt-2">Cargando perfil...</p>
      </div>
    </article>

    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>
