<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from "@/stores/authStore";
import BaseIcon from "@/components/BaseIcon.vue";
import type { User } from '@/types'; // Asegúrate de tener tus tipos

import { useUIStore } from '@/stores/uiStore'


const uiStore = useUIStore();


const props = defineProps<{
  user: User | null
}>();

const emit = defineEmits(['open-profile', 'open-commands']);

const router = useRouter();
const authStore = useAuthStore();

// Lógica de Temas
type Theme = "light" | "dark" | "winter" | "night";
const setTheme = (theme: Theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
};



// Lógica de Logout
const handleLogout = () => {
  authStore.logout();
  const elem = document.activeElement as HTMLElement;
  if (elem) elem.blur();
  router.push("/login");
};

// Computed para seguridad visual
const displayName = computed(() => props.user?.nombre || 'Usuario');
const displayEmail = computed(() => props.user?.email || '');
const displayRole = computed(() => props.user?.rol || 'Invitado');
const displayAvatar = computed(() => props.user?.fotoPerfilUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName.value)}&background=random`);
</script>

<template>
  <div class="dropdown dropdown-end">
    <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar online">
      <div class="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
        <img :alt="displayName" :src="displayAvatar" />
      </div>
    </div>

    <ul tabindex="-1" class="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-64 p-2 shadow-lg border border-base-200">
      <li class="menu-title px-4 py-2">
        <span class="text-base-content font-bold">{{ displayName }}</span>
        <span class="text-base-content font-medium">{{ displayEmail }}</span>
      </li>

      <div class="divider my-0"></div>

      <li>
        <button @click="$emit('open-profile')" class="justify-between py-3">
          Ver Perfil
          <span class="badge badge-primary badge-outline badge-sm">{{ displayRole }}</span>
        </button>
      </li>

      <li>
        <button @click="$emit('open-commands')" class="justify-between py-3">
          Comandos
          <span class="flex gap-1">
            <kbd class="kbd kbd-xs">Ctrl</kbd> <kbd class="kbd kbd-xs">K</kbd>
          </span>
        </button>
      </li>


    
        
    <li class="md:col-span-2 flex flex-row justify-between items-center gap-2 px-4 py-2">

      <span>Formato datos</span>
      <div class="join join-vertical  border border-base-300 w-full md:w-auto">
        <button 
          @click="uiStore.setViewMode('grid')" 
          class="join-item btn btn-sm flex-1 md:flex-none"
          :class="uiStore.viewMode === 'grid' ? 'btn-primary' : 'btn-ghost'"
        >
          <BaseIcon name="gridDots" class="size-5" />
        </button>
        <button 
          @click="uiStore.setViewMode('table')" 
          class="join-item btn btn-sm flex-1 md:flex-none"
          :class="uiStore.viewMode === 'table' ? 'btn-primary' : 'btn-ghost'"
        >
          <BaseIcon name="list" class="size-5" />
        </button>
      </div>
  
      </li>

      <li>
        <details>
          <summary>Tema</summary>
          <ul class="grid grid-cols-2 gap-2 p-2 bg-base-100 rounded-t-none">
            <li><button @click="setTheme('light')" class="flex gap-2"><BaseIcon name="sun" class="w-4 h-4 text-orange-500"/> Light</button></li>
            <li><button @click="setTheme('dark')" class="flex gap-2"><BaseIcon name="moon" class="w-4 h-4 text-purple-400"/> Dark</button></li>
            <li><button @click="setTheme('winter')" class="flex gap-2"><BaseIcon name="snowflake" class="w-4 h-4 text-cyan-400"/> Winter</button></li>
            <li><button @click="setTheme('night')" class="flex gap-2"><BaseIcon name="building" class="w-4 h-4 text-blue-600"/> Night</button></li>
          </ul>
        </details>
      </li>

      <div class="divider my-0"></div>

      <li>
        <button @click.prevent="handleLogout" class="text-error font-medium hover:bg-error/10">
          Cerrar Sesión
        </button>
      </li>
    </ul>
  </div>
</template>