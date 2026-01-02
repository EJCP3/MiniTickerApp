<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import "ninja-keys";
import { icons } from "@/utils/icons";

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
    handler: () => {
      router.push("/crear-solicitud");
    },
  },
  {
    id: "solicitudes",
    title: "Ver Solicitudes",
    hotkey: "ctrl+d",
    icon: icons.documentText,
    handler: () => {
      router.push("/solicitudes");
    },
  },
 
  {
    id: "departamentos",
    title: "Ver Departamentos",
    hotkey: "ctrl+f",
    icon: icons.building,
    handler: () => {
      router.push("/departamentos");
    },
  },

  {
    id: "actividad",
    title: "Ver Actividad",
    hotkey: "ctrl+g",
    icon: icons.history,
    handler: () => {
      router.push("/actividad");
    },
  },
 {
    id: "usuarios",
    title: "Gestionar Usuarios",
    hotkey: "ctrl+h",
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
