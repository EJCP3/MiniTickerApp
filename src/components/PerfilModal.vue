<script setup>
import { computed } from 'vue';
import BaseIcon from './BaseIcon.vue'; // Importamos el componente de iconos

// PROPS: Recibimos el objeto usuario desde el padre o el store
const props = defineProps({
  user: {
    type: Object,
    required: true,
    default: () => ({
      nombre: 'Usuario Desconocido',
      email: 'sin-email@miniticker.com',
      rol: 'Solicitante',
      fotoPerfilUrl: null,
      fechaCreacion: new Date().toISOString()
    })
  }
});

// Función para abrir el modal desde el padre
const openModal = () => {
  const modal = document.getElementById('user_profile_modal');
  if (modal) modal.showModal();
};

// Exponemos la función para que el padre pueda llamarla
defineExpose({ openModal });

// Formatear la fecha
const formattedDate = computed(() => {
  if (!props.user?.fechaCreacion) return 'Fecha desconocida';
  return new Date(props.user.fechaCreacion).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Avatar por defecto
const avatarUrl = computed(() => {
  if (props.user?.fotoPerfilUrl) return props.user.fotoPerfilUrl;
  return `https://ui-avatars.com/api/?name=${props.user.nombre}&background=random`;
});
</script>

<template>
  <dialog id="user_profile_modal" class="modal modal-bottom sm:modal-middle">
    <article class="modal-box relative bg-base-100">
      
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
      
      <header class="flex flex-col items-center text-center mt-4">
        <div class="avatar mb-4">
          <div class="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
            <img :src="avatarUrl" :alt="`Foto de perfil de ${user.nombre}`" />
          </div>
        </div>

        <h3 class="font-bold text-2xl text-base-content">{{ user.nombre }}</h3>
        
        <div class="mt-2">
          <span class="badge badge-primary badge-lg uppercase font-semibold shadow-sm">
            {{ user.rol }}
          </span>
        </div>
      </header>

      <div class="divider text-base-content/50 text-sm">Información de Contacto</div>

      <section class="space-y-4 px-4 pb-4">
        
        <a 
          :href="`mailto:${user.email}`"
          class="flex items-center gap-3 bg-base-200 p-3 rounded-lg hover:bg-base-300 transition-colors group cursor-pointer"
        >
          <div class="p-2 bg-base-100 rounded-full text-primary group-hover:text-primary-focus">
            <BaseIcon name="mail" class="h-10 w-10" />
          </div>
          
          <div class="flex flex-col text-left overflow-hidden">
            <span class="text-xs text-base-content/60 font-semibold uppercase tracking-wide">Correo Electrónico</span>
            <span class="font-medium truncate text-base-content">{{ user.email }}</span>
          </div>
        </a>

        <div class="flex items-center gap-3 bg-base-200 p-3 rounded-lg">
          <div class="p-2 bg-base-100 rounded-full text-secondary">
            <BaseIcon name="clock" class="h-10 w-10" />
          </div>
          
          <div class="flex flex-col text-left">
            <span class="text-xs text-base-content/60 font-semibold uppercase tracking-wide">Miembro desde</span>
            <time :datetime="user.fechaCreacion" class="font-medium text-base-content">
              {{ formattedDate }}
            </time>
          </div>
        </div>

      </section>

    </article>
    
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>