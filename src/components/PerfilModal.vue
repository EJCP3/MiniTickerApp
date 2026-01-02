<script setup>
import { computed } from 'vue';

// PROPS: Recibimos el objeto usuario desde el padre o el store
const props = defineProps({
  user: {
    type: Object,
    required: true,
    // Ejemplo de estructura por defecto para evitar errores si es null
    default: () => ({
      nombre: 'Usuario Desconocido',
      email: 'sin-email@miniticker.com',
      rol: 'Solicitante',
      fotoPerfilUrl: null, // Si es null, mostramos un placeholder
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

// Formatear la fecha (Ej: 29 de Diciembre del 2025)
const formattedDate = computed(() => {
  if (!props.user?.fechaCreacion) return 'Fecha desconocida';
  return new Date(props.user.fechaCreacion).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Avatar por defecto si no hay URL (usando UI Avatars)
const avatarUrl = computed(() => {
  if (props.user?.fotoPerfilUrl) return props.user.fotoPerfilUrl;
  // Genera una imagen con las iniciales si no tiene foto
  return `https://ui-avatars.com/api/?name=${props.user.nombre}&background=random`;
});
</script>

<template>
  <dialog id="user_profile_modal" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box relative">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
      
      <div class="flex flex-col items-center text-center mt-4">
        
        <div class="avatar mb-4">
          <div class="w-24 rounded-full ">
            <img :src="avatarUrl" alt="Foto de perfil" />
          </div>
        </div>

        <h3 class="font-bold text-2xl text-base-content">{{ user.nombre }}</h3>
        
        <div class="mt-2">
          <span class="badge badge-primary badge-lg uppercase font-semibold">
            {{ user.rol }}
          </span>
        </div>
      </div>

      <div class="divider">Información</div>

      <div class="space-y-4 px-4">
        <div class="flex items-center gap-3 bg-base-200 p-3 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 opacity-70" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
          <div class="flex flex-col text-left">
            <span class="text-xs opacity-50">Correo Electrónico</span>
            <span class="font-medium truncate">{{ user.email }}</span>
          </div>
        </div>

        <div class="flex items-center gap-3 bg-base-200 p-3 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 opacity-70" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
          </svg>
          <div class="flex flex-col text-left">
            <span class="text-xs opacity-50">Miembro desde</span>
            <span class="font-medium">{{ formattedDate }}</span>
          </div>
        </div>
      </div>

      <div class="modal-action">
        <form method="dialog">
          <button class="btn">Cerrar</button>
        </form>
      </div>
    </div>
    
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>