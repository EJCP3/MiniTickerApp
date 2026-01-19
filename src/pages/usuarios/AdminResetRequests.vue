<script setup lang="ts">
import { ref, onMounted } from 'vue';
import userService from '@/services/usuarios';
import { toast } from 'vue-sonner'; // 👈 Importar Sonner
import BaseIcon from '@/components/BaseIcon.vue';

interface Solicitud {
  id: string;
  usuarioNombre: string;
  usuarioEmail: string;
  usuarioId: string;
  area: string;
  rol: string;
  fecha: string;
}

const solicitudes = ref<Solicitud[]>([]);
const loading = ref(true);

// Estado para el Modal de Confirmación
const modalOpen = ref(false);
const usuarioSeleccionado = ref<{ id: string; nombre: string } | null>(null);

const cargarSolicitudes = async () => {
  try {
    loading.value = true;
    solicitudes.value = await userService.getPendingResets();
  } catch (error) {
    console.error(error);
    toast.error('Error cargando solicitudes');
  } finally {
    loading.value = false;
  }
};

// 1. Abrir el modal (en lugar de Swal.fire)
const confirmarAccion = (usuarioId: string, nombre: string) => {
  usuarioSeleccionado.value = { id: usuarioId, nombre };
  modalOpen.value = true;
};

// 2. Ejecutar la acción real
const ejecutarReset = async () => {
  if (!usuarioSeleccionado.value) return;

  // Cerramos modal primero
  modalOpen.value = false; 
  
  // Usamos toast.promise para mostrar carga, éxito y error automáticamente
  toast.promise(userService.adminResetPassword(usuarioSeleccionado.value.id), {
    loading: 'Reiniciando contraseña...',
    success: (data: any) => {
      cargarSolicitudes(); // Recargar tabla
      return 'Contraseña reiniciada exitosamente';
    },
    error: 'Error al reiniciar la contraseña'
  });
};

onMounted(() => {
  cargarSolicitudes();
});
</script>

<template>
  <div class="p-6">

    <div class="flex justify-between mb-6">
          <h1 class="text-2xl font-bold mb-6">Solicitudes de Recuperación</h1>
    
    <router-link to="/usuarios" class="btn btn-primary mb-6 gap-2">
      <BaseIcon name="arrowleft" class="size-8" /> Volver a Usuarios
    </router-link>
    </div>
  
    <div v-if="loading" class="flex justify-center">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <div v-else-if="solicitudes.length === 0" class="alert alert-success">
      <BaseIcon name="checkCircle" class="size-8" />
      <span>No hay solicitudes pendientes.</span>
    </div>

    <div v-else class="overflow-x-auto bg-base-100 rounded-lg shadow">
      <table class="table w-full">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Email</th>
            <th>Área</th>
            <th>Rol</th>
            <th>Fecha</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="sol in solicitudes" :key="sol.id">
            <td class="font-bold">{{ sol.usuarioNombre }}</td>
            <td>{{ sol.usuarioEmail }}</td>
            <td>{{ sol.area }}</td>
            <td>{{ sol.rol }}</td>
            <td>{{ new Date(sol.fecha).toLocaleDateString() }}</td>
            <td>
              <button 
                @click="confirmarAccion(sol.usuarioId, sol.usuarioNombre)"
                class="btn btn-warning btn-sm gap-2"
              >
                <BaseIcon name="refresh" class="size-8" /> Reiniciar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="modalOpen" class="modal modal-open">
      <div class="modal-box">
        <h3 class="font-bold text-lg text-warning">¿Confirmar reinicio?</h3>
        <p class="py-4">
          La contraseña de <strong>{{ usuarioSeleccionado?.nombre }}</strong> 
          se cambiará a la predeterminada (MiniTicker2026!).
        </p>
        <div class="modal-action">
          <button class="btn" @click="modalOpen = false">Cancelar</button>
          <button class="btn btn-warning" @click="ejecutarReset">
            Sí, reiniciar
          </button>
        </div>
      </div>
    </div>

  </div>
</template>