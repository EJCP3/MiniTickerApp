<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import "ninja-keys";
import { icons } from "../utils/icons";

interface NinjaAction {
  id: string;
  title: string;
  hotkey?: string;
  icon?: string;
  handler?: () => void;
  children?: NinjaAction[];
  keywords?: string;
}

const router = useRouter();
const placeholder = ref("Buscar o ejecutar comando...");

const hotkeys = ref<NinjaAction[]>([

 


  {
    id: "home",
    title: "Home",
    hotkey: "ctrl+h",
    icon: icons.home,
    handler: () => {
      router.push("/");
    },
  },
  {
    id: "solicitudes",
    title: "Ver Solicitudes",
    hotkey: "ctrl+s",
    icon: icons.receipt,
    handler: () => {
      router.push("/solicitudes");
    },
  },
  {
    id: "usuarios",
    title: "Gestionar Usuarios",
    hotkey: "ctrl+u",
    icon: icons.users,
    handler: () => {
      router.push("/usuarios");
    },
  },
  {
    id: "departamentos",
    title: "Ver Departamentos",
    hotkey: "ctrl+d",
    icon: icons.building,
    handler: () => {
      router.push("/departamentos");
    },
  },

 
  {
    id: "actividad",
    title: "Ver Actividad",
    hotkey: "ctrl+a",
    icon: icons.timeline,
    handler: () => {
      router.push("/actividad");
    },
  },
  
     {
    id: "logout",
    title: "Cerrar Sesión",
    hotkey: "ctrl+f", 
    icon: icons.logout,
    handler: () => {
      console.log("Cerrando sesión...");
      router.push("/login");
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
        icon: icons.snowflake,
        handler: () => {
          document.documentElement.setAttribute("data-theme", "winter");
          localStorage.setItem("theme", "winter");
        },
      },
      {
        id: "theme-light",
        title: "Tema Light",
        icon: icons.sun,
        handler: () => {
          document.documentElement.setAttribute("data-theme", "light");
          localStorage.setItem("theme", "light");
        },
      },
      {
        id: "theme-dark",
        title: "Tema Dark",
        icon: icons.moon,
        handler: () => {
          document.documentElement.setAttribute("data-theme", "dark");
          localStorage.setItem("theme", "dark");
        },
      },
    ], 
  }, 

 
]);

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
  <ninja-keys
    :placeholder="placeholder"
    :data="hotkeys"
    
  />
</template>

<style>
ninja-keys {
  --ninja-icon-size: 24px; /* Variable que usa ninja-keys internamente */
  --ninja-icon-color: #888; /* Color por defecto */
  --ninja-selected-icon-color: #fff; /* Color al seleccionar */
  
  /* Otras variables que ya tenías */
  --ninja-z-index: 9999;
  --ninja-backdrop-filter: blur(8px);
  --ninja-overflow-background: rgba(0, 0, 0, 0.7);
  --ninja-width: 640px;
  --ninja-top: 20%;
}
</style>