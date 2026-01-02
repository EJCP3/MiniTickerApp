<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
// Asegúrate de que estas rutas existan en tu proyecto
import MenuKeys from "@/components/MenuKeys.vue";
import PerfilModal from "@/components/PerfilModal.vue";
import { icons } from "@/utils/icons"; // Asumo que esto exporta tus SVGs
import BaseIcon from "@/components/BaseIcon.vue";
// --- 1. Referencias y Router ---
const router = useRouter();
// Tipado para acceder a métodos del componente hijo
const perfilModalRef = ref<InstanceType<typeof PerfilModal> | null>(null);
const ninjaKeysRef = ref<InstanceType<typeof MenuKeys> | null>(null);

// --- 2. Estado del Usuario ---
const currentUser = ref({
  nombre: "Ana",
  email: "Ana@miniticker.com",
  rol: "Solicitante",
  fotoPerfilUrl:
    "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
  fechaCreacion: "2024-12-25T10:00:00Z",
});

// --- 3. Configuración de Menú ---
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

// --- 4. Funciones de UI ---

// Cierra el dropdown al hacer clic (truco para DaisyUI CSS dropdowns)
const closeDropdown = () => {
  const elem = document.activeElement as HTMLElement;
  if (elem) elem.blur();
};

const abrirPerfil = () => {
  closeDropdown();
  perfilModalRef.value?.openModal(); // Llama al método expuesto en el hijo
};

const abrirNinjaKeys = () => {
  closeDropdown();
  ninjaKeysRef.value?.openNinjaKeys();
};

const handleLogout = () => {
  // Aquí iría tu lógica de limpieza de sesión (Pinia, localStorage, etc.)
  console.log("Cerrando sesión...");
  router.push("/login");
};

// --- 5. Temas ---
type Theme = "light" | "dark" | "winter" | "night";

const setTheme = (theme: Theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
};
</script>

<template>
  <div class="min-h-screen bg-base-200">
    <header class="navbar bg-base-100 shadow-sm sticky top-0 z-40">
      <nav class="navbar-start">
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
            <li v-for="item in menuItems" :key="item.route">
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
      </nav>

      <section class="navbar-center">
        <router-link
          to="/"
          class="btn btn-ghost text-xl flex items-center gap-2"
        >
          <span
            v-if="icons?.logo"
            v-html="icons.logo"
            class="text-primary w-6 h-6"
          ></span>
          <span class="font-bold tracking-tight">MiniTicker</span>
        </router-link>
      </section>

      <aside class="navbar-end">
        <div class="dropdown dropdown-end">
          <div
            tabindex="0"
            role="button"
            class="btn btn-ghost btn-circle avatar online"
          >
            <div
              class="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2"
            >
              <img
                :alt="`Avatar de ${currentUser.nombre}`"
                :src="currentUser.fotoPerfilUrl"
              />
            </div>
          </div>

          <ul
            tabindex="-1"
            class="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-64 p-2 shadow-lg border border-base-200"
          >
            <li class="menu-title px-4 py-2">
              <span class="text-base-content font-bold">{{
                currentUser.nombre
              }}</span>
              <span class="text-xs font-medium">{{ currentUser.email }}</span>
            </li>

            <div class="divider my-0"></div>

            <li>
              <button @click="abrirPerfil" class="justify-between py-3">
                Ver Perfil
                <span class="badge badge-primary badge-outline badge-sm">{{
                  currentUser.rol
                }}</span>
              </button>
            </li>

            <li>
              <button @click="abrirNinjaKeys" class="justify-between py-3">
                Comandos
                <span class="flex gap-1">
                  <kbd class="kbd kbd-xs">Ctrl</kbd>
                  <kbd class="kbd kbd-xs">K</kbd>
                </span>
              </button>
            </li>

            <li>
              <details>
                <summary>Tema</summary>
                <ul
                  class="grid grid-cols-2 gap-2 p-2 bg-base-100 rounded-t-none"
                >
                  <li>
                    <button
                      @click="setTheme('light')"
                      class="flex items-center gap-3"
                    >
                      <BaseIcon name="sun" class="h-5 w-5 text-orange-500" />
                      Light
                    </button>
                  </li>

                  <li>
                    <button
                      @click="setTheme('dark')"
                      class="flex items-center gap-3"
                    >
                      <BaseIcon name="moon" class="h-5 w-5 text-purple-400" />
                      Dark
                    </button>
                  </li>

                  <li>
                    <button
                      @click="setTheme('winter')"
                      class="flex items-center gap-3"
                    >
                      <BaseIcon
                        name="snowflake"
                        class="h-5 w-5 text-cyan-400"
                      />
                      Winter
                    </button>
                  </li>

                  <li>
                    <button
                      @click="setTheme('night')"
                      class="flex items-center gap-3"
                    >
                      <BaseIcon
                        name="officeBuilding"
                        class="h-5 w-5 text-blue-600"
                      />
                      Night
                    </button>
                  </li>
                </ul>
              </details>
            </li>

            <div class="divider my-0"></div>

            <li>
              <button
                @click="handleLogout"
                class="text-error font-medium hover:bg-error/10"
              >
                Cerrar Sesión
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </header>

    <main class="p-4 md:p-6 max-w-7xl mx-auto w-full">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <MenuKeys ref="ninjaKeysRef" />
    <PerfilModal ref="perfilModalRef" :user="currentUser" />
  </div>
</template>

<style scoped>
/* Transición simple para el router-view */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
