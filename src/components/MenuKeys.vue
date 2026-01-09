<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import "ninja-keys";
import { icons } from "@/utils/icons";
import { useAuthStore } from "@/stores/authStore"; // Importa tu store de auth
interface NinjaAction {
  id: string;
  title: string;
  hotkey?: string;
  icon?: string;
  handler?: () => void;
  children?: NinjaAction[];
  keywords?: string;
  roles?: string[];
}
const authStore = useAuthStore();
const userRole = computed(() => authStore.user?.rol);
const router = useRouter();
const placeholder = ref("Buscar o ejecutar comando...");

const allActions = ref<NinjaAction[]>([
  {
    id: "home",
    title: "Home",
    hotkey: "ctrl+a",
    icon: icons.home,
    handler: () => {
      router.push("/");
    },
  },
  {
    id: "crear-solicitud",
    title: "Crear Solicitud",
    hotkey: "ctrl+s",
    icon: icons.receipt,
    roles: ["Solicitante", "Admin", "SuperAdmin"],
    handler: () => {
      router.push("/crear-solicitud");
    },
  },
  {
    id: "solicitudes",
    title: "Ver Solicitudes",
    hotkey: "ctrl+d",
    roles: ["Solicitante", "Admin", "SuperAdmin"],
    icon: icons.documentText,
    handler: () => {
      router.push("/solicitudes");
    },
  },
 
  {
    id: "area",
    title: "Ver Área",
    hotkey: "ctrl+f",
    roles: ["Admin", "SuperAdmin"],
    icon: icons.building,
    handler: () => {
      router.push("/area");
    },
  },

  {
    id: "actividad",
    title: "Ver Actividad",
    hotkey: "ctrl+g",
    roles: ["Admin", "SuperAdmin"],
    icon: icons.history,
    handler: () => {
      router.push("/actividad");
    },
  },
 {
    id: "usuarios",
    title: "Gestionar Usuarios",
    hotkey: "ctrl+h",
    roles: ["SuperAdmin"],
    icon: icons.user,
    handler: () => {
      router.push("/usuarios");
    },
  },
  {
    id: "theme",
    title: "Cambiar tema...",

    icon: icons.palette,
    children: [
      {
        id: "theme-winter",
        title: "Tema Winter",
        hotkey: "ctrl+1",
        icon: icons.snowflake,
        handler: () => {
          document.documentElement.setAttribute("data-theme", "winter");
          localStorage.setItem("theme", "winter");
        },
      },
      {
        id: "theme-light",
        title: "Tema Light",
        hotkey: "ctrl+2",

        icon: icons.sun,
        handler: () => {
          document.documentElement.setAttribute("data-theme", "light");
          localStorage.setItem("theme", "light");
        },
      },
      {
        id: "theme-dark",
        title: "Tema Dark",
        hotkey: "ctrl+3",

        icon: icons.moon,
        handler: () => {
          document.documentElement.setAttribute("data-theme", "dark");
          localStorage.setItem("theme", "dark");
        },
      },
      {
        id: "theme-night",
        title: "Tema Night",
        hotkey: "ctrl+4",

        icon: icons.moon,
        handler: () => {
          document.documentElement.setAttribute("data-theme", "night");
          localStorage.setItem("theme", "night");
        },
      },
    ],
  },
]);

const hotkeys = computed(() => {
  return allActions.value.filter(action => {
    // Si la acción no tiene restricciones de rol, se muestra a todos
    if (!action.roles) return true;
    
    // Si tiene roles, verificamos si el rol del usuario actual está incluido
    return action.roles.includes(userRole.value || "");
  });
});


const openNinjaKeys = () => {
  const ninja = document.querySelector("ninja-keys") as any;
  if (ninja) {
    ninja.open();
  }
};

defineExpose({
  openNinjaKeys,
});


</script>

<template>
  <ninja-keys :placeholder="placeholder" :data="hotkeys" />
</template>

<style>
ninja-keys {
  --ninja-icon-size: 24px; /* Variable que usa ninja-keys internamente */
  --ninja-icon-color: #888; /* Color por defecto */
  --ninja-selected-icon-color: #fff; /* Color al seleccionar */

  /* Otras variables que ya tenías */
  --ninja-z-index: 9999;
  --ninja-width: 640px;
  --ninja-top: 20%;
}
</style>
