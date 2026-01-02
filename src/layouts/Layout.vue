<script setup lang="ts">
import MenuKeys from "@/components/MenuKeys.vue";
import {ref } from "vue";
import { icons } from "@/utils/icons";
import PerfilModal from "@/components/PerfilModal.vue";

const perfilModalRef = ref();
const currentUser = ref({
  nombre: 'Ana',
  email: 'Ana@miniticker.com',
  rol: 'Solicitante',
  fotoPerfilUrl: null, // Para probar el placeholder
  fechaCreacion: '2024-12-25T10:00:00Z'
});

// Referencia al componente modal
const profileModalRef = ref(null);

const abrirPerfil = () => {
  perfilModalRef.value?.openModal();
};

const ninjaKeysRef = ref();

type Theme = "light" | "dark" | "winter" |  "night";

const setTheme = (theme: Theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);

};




interface MenuItem {  
  label: string;
  route: string;
  hotkey: string;
}

const menuItems = ref<MenuItem[]>([
  { label: "Home", route: "/", hotkey: "a" },
  { label: "Crear solicitud", route: "/crear-solicitud", hotkey: "s" },
   { label: "Solicitudes", route: "/solicitudes", hotkey: "d" },
  { label: "Departamentos", route: "/departamentos", hotkey: "f" },
  { label: "Actividad", route: "/actividad", hotkey: "g" },
    { label: "Usuarios", route: "/usuarios", hotkey: "h" },
]);
</script>

<template>
  <div>
    
    <header class="navbar bg-base-100 shadow-sm">
      <nav class="navbar-start">
        <div class="dropdown">
      
          <div
            tabindex="0"
            role="button"
            class="btn btn-ghost btn-circle"
            aria-label="Menú de navegación"
          >
          
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
       
          </div>
               
          <ul
            tabindex="-1"
            class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li v-for="item in menuItems" :key="item.route">
              <router-link :to="item.route">
                {{ item.label }}
                <span class="ml-auto">
                  <kbd class="kbd kbd-sm">Ctrl</kbd>
                  <kbd class="kbd kbd-sm">{{ item.hotkey }}</kbd>
                </span>
              </router-link>
            </li>
          </ul>
        </div>
      </nav>

     <section class="navbar-center">
  <router-link 
    to="/" 
    class="btn btn-ghost text-xl flex items-center justify-center gap-2 px-2"
  >
    <span
      v-html="icons.logo"
      class=" text-primary block"
    ></span>
    
    <span class="font-bold">MiniTicker</span>
  </router-link>
</section>

      <aside class="navbar-end">
        <div class="dropdown dropdown-end">
          <figure
            tabindex="0"
            role="button"
            class="btn btn-ghost btn-circle avatar"
          >
            <div class="w-10 rounded-full">
              <img
                alt="Avatar de Ana"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </figure>
          <ul
            tabindex="-1"
            class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <button @click="abrirPerfil" class="justify-between">
                Ana
                <span class="badge opacity-50">Solicitantes</span>
              </button>
            </li>
            <li>
              <button
                @click="ninjaKeysRef?.openNinjaKeys()"
                class="flex items-center gap-2"
              >
                <span>Menu</span>
                <span class="ml-auto">
                  <kbd class="kbd kbd-sm">Ctrl</kbd>
                  <kbd class="kbd kbd-sm">K</kbd>
                </span>
              </button>
            </li>
            <li>
              <button type="button">Logout
              </button>
            </li>
           <li class="grid grid-cols-2 gap-2 mt-10 w-fit mx-auto">
    <button @click="setTheme('winter')" type="button" class="badge hover:bg-primary hover:text-primary-content">Winter</button>
    <button @click="setTheme('light')" type="button" class="badge hover:bg-primary hover:text-primary-content">Light</button>
    <button @click="setTheme('dark')" type="button" class="badge hover:bg-primary hover:text-primary-content">Dark</button>
    <button @click="setTheme('night')" type="button" class="badge hover:bg-primary hover:text-primary-content">Night</button>
</li>
          </ul>
        </div>
      </aside>
    </header>

    <!-- Main Content -->
    <main>
      <router-view />
    </main>

    <!-- Ninja Keys -->
    <MenuKeys ref="ninjaKeysRef" />
    <PerfilModal ref="perfilModalRef" :user="currentUser" />
  </div>
</template>
