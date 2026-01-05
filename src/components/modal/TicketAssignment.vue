<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useTicketStore } from '@/stores/ticketModalStore'; 
import { useAuthStore } from '@/stores/authStore';
import userService from '@/services/usuarios';
import BaseIcon from '../BaseIcon.vue';

const store = useTicketStore();
const authStore = useAuthStore();
const gestores = ref<any[]>([]);
const isLoadingUsers = ref(false);
const modoEdicion = ref(false); 

// --- COMPUTADAS ---

const hasGestor = computed(() => {
  const g = store.currentTicket?.gestor;
  return !!g && !!g.id && g.id !== '00000000-0000-0000-0000-000000000000';
});

const nombreGestor = computed(() => store.currentTicket?.gestor?.nombre || 'Sin asignar');
const isAdminOrSuper = computed(() => ['Admin', 'SuperAdmin'].includes(authStore.user?.rol || ''));
const isGestor = computed(() => authStore.user?.rol === 'Gestor');

// NUEVA VALIDACIÓN: Verificar si está "EnProceso"
const isTicketEnProceso = computed(() => {
    // Verificamos si el estado es exactamente el string 'EnProceso'
    // (O el ID 1 si tu backend mandara números, pero vi en tu JSON que manda texto)
    return store.currentTicket?.estado === 'EnProceso';
});

// --- FILTRADO DE JERARQUÍA ---

const loadGestores = async () => {
  if (gestores.value.length > 0) return;

  try {
    isLoadingUsers.value = true;
    const todosLosUsuarios = await userService.getUsers();
    const miRol = authStore.user?.rol;

    gestores.value = todosLosUsuarios.filter((usuario: any) => {
        if (usuario.rol === 'Solicitante') return false;
        if (miRol === 'Admin') return usuario.rol === 'Gestor';
        if (miRol === 'SuperAdmin') return ['Gestor', 'Admin'].includes(usuario.rol);
        return usuario.rol === 'Gestor';
    });

  } catch (e) {
    console.error("Error cargando usuarios", e);
  } finally {
    isLoadingUsers.value = false;
  }
};

// --- ACCIONES ---

const asignar = async (gestorId: string) => {
  if (!gestorId) return;
  await store.assignManager(gestorId);
  modoEdicion.value = false;
  (document.activeElement as HTMLElement)?.blur(); 
};

const activarEdicion = () => {
    modoEdicion.value = true;
    loadGestores();
};

const cancelarEdicion = () => {
    modoEdicion.value = false;
};

onMounted(() => {
  if (isAdminOrSuper.value && !hasGestor.value) {
    loadGestores();
  }
});
</script>

<template>
  <div class="flex flex-col animate-fade-in">
    <div class="flex justify-between items-end mb-1">
        <h3 class="text-xs font-bold text-gray-400 flex items-center gap-2 uppercase tracking-wider">
           <BaseIcon name="userShield" class="h-4 w-4" /> Responsable
        </h3>
        
        <button 
            v-if="hasGestor && isAdminOrSuper && !modoEdicion && !isTicketEnProceso" 
            @click="activarEdicion"
            class="text-[10px] text-primary hover:underline cursor-pointer font-semibold"
        >
            Cambiar
        </button>
        
        <span 
            v-else-if="hasGestor && isTicketEnProceso && isAdminOrSuper" 
            class="text-[10px] text-gray-400 flex items-center gap-1 cursor-help"
            title="No se puede cambiar el gestor mientras el ticket está en proceso"
        >
            <BaseIcon name="lockClosed" class="h-3 w-3"/> 
        </span>
        
        <button 
            v-if="modoEdicion" 
            @click="cancelarEdicion"
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
            <span class="text-gray-700 font-bold text-sm leading-none">
                {{ nombreGestor }}
            </span>
            <span class="text-[10px] text-green-600 font-medium flex items-center gap-1 mt-1 bg-green-50 px-1.5 py-0.5 rounded-full w-fit">
                <BaseIcon name="check" class="h-3 w-3" /> Asignado
            </span>
        </div>
    </div>

    <div v-else-if="isAdminOrSuper || modoEdicion" class="dropdown dropdown-end w-full">
      <div 
        tabindex="0" 
        role="button" 
        @click="loadGestores" 
        class="btn btn-sm btn-outline border-base-300 bg-base-100 w-full justify-between font-normal normal-case h-auto py-2 hover:bg-base-200 hover:border-base-400"
      >
        <span class="flex items-center gap-2">
            <BaseIcon name="userPlus" class="h-4 w-4 text-orange-500"/>
            {{ modoEdicion ? 'Seleccionar nuevo...' : 'Asignar Gestor' }}
        </span>
        <BaseIcon name="chevronDown" class="h-3 w-3 opacity-50"/>
      </div>

      <ul tabindex="0" class="dropdown-content z-[50] menu p-2 shadow-xl bg-base-100 rounded-box w-64 border border-base-200 max-h-60 overflow-y-auto mt-1">
        <li v-if="isLoadingUsers" class="text-xs text-gray-400 p-2 text-center">
           <span class="loading loading-spinner loading-xs"></span> Cargando...
        </li>
        <li v-else-if="gestores.length === 0" class="text-xs text-gray-400 p-2 text-center">
           No se encontraron usuarios asignables.
        </li>
        <li v-else v-for="g in gestores" :key="g.id">
          <a @click="asignar(g.id)" class="flex justify-between items-center py-2">
             <div class="flex items-center gap-2">
                 <div class="avatar placeholder">
                    <div class="bg-neutral-focus text-neutral-content rounded-full w-6 h-6 text-[10px]">
                        <span>{{ g.nombre[0] }}</span>
                    </div>
                 </div>
                 <span class="font-medium text-sm">{{ g.nombre }}</span>
             </div>
             <span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-base-200 text-gray-500 border border-base-300">
                {{ g.rol }}
             </span>
          </a>
        </li>
      </ul>
    </div>

    <div v-else-if="isGestor && !hasGestor" class="mt-1">
        <button 
            @click="asignar(authStore.user.id)" 
            :disabled="store.isActionLoading" 
            class="btn btn-sm btn-primary w-full shadow-sm text-white"
        >
            <BaseIcon name="hand" class="h-4 w-4"/>
            Tomar este Ticket
        </button>
    </div>

    <div v-else class="text-sm text-gray-400 italic mt-1 bg-base-200/50 p-2 rounded text-center">
      Sin asignar
    </div>

  </div>
</template>

<style scoped>
.animate-fade-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
</style>

<style scoped>
.animate-fade-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
</style>

