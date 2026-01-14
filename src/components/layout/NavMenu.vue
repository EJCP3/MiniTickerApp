<script setup lang="ts">
import BaseIcon from "@/components/BaseIcon.vue";
import { useAuthStore } from "@/stores/authStore";
import { computed } from "vue";
const authStore = useAuthStore();

// Definimos los tipos para TypeScript
type Role = 'Solicitante' | 'Admin' | 'Gestor' | 'SuperAdmin';

interface MenuItem {
  label: string;
  route: string;
  hotkey: string;
  // Array de roles permitidos. Si no se pone nada, es para todos.
  roles?: Role[]; 
}
const allMenuItems: MenuItem[] = [
  { 
    label: "Home", 
    route: "/", 
    hotkey: "a" 
    // Sin 'roles' => Visible para todos
  },
  { 
    label: "Crear solicitud", 
    route: "/crear-solicitud", 
    hotkey: "s",
    roles: ['Solicitante', 'Admin', 'SuperAdmin'] // Todos menos invitados
  },
  { 
    label: "Solicitudes", 
    route: "/solicitudes", 
    hotkey: "d",
  },
  { 
    label: "Área", 
    route: "/area", 
    hotkey: "f",
    roles: ['Admin', 'SuperAdmin'] // Solo Admins
  },
  { 
    label: "Actividad", 
    route: "/actividad", 
    hotkey: "g",
    roles: [ 'Admin', 'SuperAdmin'] // Gestores y Admins
  },
  { 
    label: "Report", 
    route: "/report", 
    hotkey: "r",
    roles: [ 'Admin', 'SuperAdmin'] // Gestores y Admins
  },
  { 
    label: "Usuarios", 
    route: "/usuarios", 
    hotkey: "t",
    roles: ['SuperAdmin'] // Solo Admins
  },
];

// 3. COMPUTED: Esta es la magia que filtra el menú
const visibleMenuItems = computed(() => {
  const userRole = authStore.user?.rol as Role; // Obtenemos rol actual

  return allMenuItems.filter(item => {
    // A. Si el ítem no tiene roles definidos, es público para todos los logueados
    if (!item.roles || item.roles.length === 0) {
      return true;
    }

    // B. Si el usuario es SuperAdmin, suele ver todo (Opcional, si quieres esa lógica)
    if (userRole === 'SuperAdmin') return true;

    // C. Verificamos si el rol del usuario está en la lista permitida del ítem
    return item.roles.includes(userRole);
  });
});
// Definimos los items aquí para limpiar el layout


const closeDropdown = () => {
  const elem = document.activeElement as HTMLElement;
  if (elem) elem.blur();
};
</script>

<template>
  <div class="dropdown">
    <div
      tabindex="0"
      role="button"
      class="btn btn-ghost btn-circle"
      aria-label="Menú principal"
    >
      <BaseIcon name="menu" class="w-8 h-8" />
    </div>
    <ul
      tabindex="-1"
      class="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow-lg"
    >
      <li v-for="item in visibleMenuItems" :key="item.route">
        <router-link :to="item.route" @click="closeDropdown">
          {{ item.label }}
          <span class="ml-auto text-xs opacity-50">
            <kbd class="kbd kbd-sm">Ctrl</kbd> +
            <kbd class="kbd kbd-sm">{{ item.hotkey.toUpperCase() }}</kbd>
          </span>
        </router-link>
      </li>
    </ul>
  </div>
</template>
