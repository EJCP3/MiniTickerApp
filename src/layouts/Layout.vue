<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/authStore";

// Componentes
import TheNavbar from "@/components/layout/TheNavbar.vue";
import MenuKeys from "@/components/MenuKeys.vue";
import PerfilModal from "@/components/PerfilModal.vue";

// --- 1. Lógica de Estado Global ---
const authStore = useAuthStore();
// Usamos los datos REALES de Pinia, borré el mock 'currentUser' que tenías
const { user } = storeToRefs(authStore);

// --- 2. Referencias a Modales ---
const perfilModalRef = ref<InstanceType<typeof PerfilModal> | null>(null);
const ninjaKeysRef = ref<InstanceType<typeof MenuKeys> | null>(null);

// --- 3. Funciones de apertura (Reciben eventos del Navbar) ---
const handleOpenPerfil = () => {
  perfilModalRef.value?.openModal();
};

const handleOpenCommands = () => {
  ninjaKeysRef.value?.openNinjaKeys();
};
</script>

<template>
  <div class="min-h-screen bg-base-200">
    
    <TheNavbar 
      :user="user"
      @open-profile="handleOpenPerfil"
      @open-commands="handleOpenCommands"
    />

    <main class="p-4 md:p-6 w-full max-w-7xl mx-auto ">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <MenuKeys ref="ninjaKeysRef" />
    <PerfilModal ref="perfilModalRef" :user="user" />
    
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>