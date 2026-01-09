<script setup lang="ts">
import { computed, ref } from "vue";
import { useUsers } from "@/composables/useUsers";
import { type User } from "@/types/users";
import UserCard from "./userCard.vue";
import UserTable from "./UserTable.vue";
import UserFormModal from "./UserFormModal.vue";
import BaseIcon from "@/components/BaseIcon.vue"; // Importar BaseIcon
import { useUIStore } from "@/stores/uiStore"; // IMPORTAR STORE GLOBAL

const {
  filteredUsers,
  stats,
  searchQuery,
  filterRole,
  filterStatus,
  createUser,
  updateUser,
  toggleStatus,
} = useUsers();
const uiStore = useUIStore(); // INSTANCIAR STORE
// Estado
const showModal = ref(false);
const selectedUser = ref<User | null>(null); // null = Crear, Objeto = Editar

// --- HANDLERS ---
const openCreate = () => {
  selectedUser.value = null;
  showModal.value = true;
};

const openEdit = (user: User) => {
  selectedUser.value = user;
  showModal.value = true;
};

const handleFormSubmit = (formData: any) => {
  if (selectedUser.value) {
    updateUser(formData);
  } else {
    createUser(formData);
  }
  showModal.value = false;
  selectedUser.value = null;
};

const statsConfig = computed(() => [
  {
    label: "Total",
    value: stats.value.total,
    icon: "users",
    colorClass: "bg-purple-500/10 text-purple-500",
    borderClass: "border-base-200/50",
  },
  {
    label: "Activos",
    value:  stats.value.activos,
    icon: "checkCircle",
    colorClass: "bg-emerald-500/10 text-emerald-500",
    borderClass: "border-success/20",
  },
  {
    label: "Inactivos",
    value:  stats.value.inactivos,
    icon: "userX",
    colorClass: "bg-rose-500/10 text-rose-500",
    borderClass: "border-error/20",
  },
  {
    label: "Solicitantes",
    value:  stats.value.solicitantes,
    icon: "user",
    colorClass: "bg-blue-500/10 text-blue-500",
    borderClass: "border-info/20",
  },
  {
    label: "Gestores",
    value:  stats.value.gestores,
    icon: "userSettings",
    colorClass: "bg-primary/10 text-primary",
    borderClass: "border-primary/20",
  },
  {
    label: "Admins",
    value:  stats.value.admins,
    icon: "userShield",
    colorClass: "bg-secondary/10 text-secondary",
    borderClass: "border-secondary/20",
  },
]);


</script>

<template>
  <main
    class="min-h-screen bg-base-200 p-6 md:p-10 font-sans text-base-content"
  >
    <div class="max-w-350 mx-auto">
      <header
        class="flex flex-col md:flex-row justify-between items-end gap-4 mb-8"
      >
        <div>
          <h1 class="text-3xl font-bold">Usuarios</h1>
          <p class="text-base-content/60 text-sm mt-1">
            Gestión de usuarios y permisos del sistema
          </p>
        </div>

        <button
          @click="openCreate"
          class="btn btn-primary shadow-lg shadow-primary/20 gap-2 font-bold text-white"
          aria-label="Crear nuevo usuario"
        >
          <BaseIcon name="plus" class="h-5 w-5" />
          Nuevo Usuario
        </button>
      </header>

      <section
        aria-label="Estadísticas de usuarios"
        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-8"
      >
        <article
          v-for="(stat, index) in statsConfig"
          :key="index"
          class="card bg-base-100 shadow-sm p-4 relative overflow-hidden group border"
          :class="stat.borderClass"
        >
          <div class="flex items-center gap-4">
            <div
              class="p-3 rounded-2xl group-hover:scale-110 transition-transform"
              :class="stat.colorClass"
            >
              <BaseIcon :name="stat.icon" class="size-8" />
            </div>

            <div class="overflow-hidden">
              <div
                class="text-xs text-base-content/60 mb-0.5 uppercase font-bold tracking-wide truncate"
              >
                {{ stat.label }}
              </div>
              <div class="text-2xl font-bold">
                {{ stat.value }}
              </div>
            </div>
          </div>
        </article>
      </section>

      <search
        aria-label="Filtros y búsqueda de usuarios"
        class="bg-base-100 p-4 rounded-xl shadow-sm mb-8 border border-base-200 flex flex-col md:flex-row gap-4"
      >
        <div class="form-control flex-1">
          <div class="relative">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Buscar por nombre o correo..."
              class="input input-bordered w-full pl-10 focus:input-primary bg-base-200/50 focus:bg-base-100 transition-colors"
              aria-label="Buscar usuarios"
            />
            <div
              class="absolute left-3 top-3 text-base-content/40 pointer-events-none"
            >
              <BaseIcon name="search" class="h-5 w-5" />
            </div>
          </div>
        </div>

        <select
          v-model="filterRole"
          class="select select-bordered w-full md:w-48 bg-base-200/50 focus:bg-base-100 focus:border-primary"
          aria-label="Filtrar por rol"
        >
          <option>Todos</option>
          <option>SuperAdmin</option>
          <option>Admin</option>
          <option>Gestor</option>
          <option>Solicitante</option>
        </select>

        <select
          v-model="filterStatus"
          class="select select-bordered w-full md:w-48 bg-base-200/50 focus:bg-base-100 focus:border-primary"
          aria-label="Filtrar por estado"
        >
          <option>Todos</option>
          <option>Activos</option>
          <option>Inactivos</option>
        </select>
      </search>

  
      <section class="relative">
        <transition name="fade" mode="out-in">
          <div
            v-if="uiStore.viewMode === 'grid'"
            class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            <UserCard
              v-for="user in filteredUsers"
              :key="user.id"
              :user="user"
              @edit="openEdit"
              @toggle-status="toggleStatus"
            />
          </div>

          <UserTable
            v-else
            :users="filteredUsers"
            @edit="openEdit"
            @toggle-status="toggleStatus"
          />
        </transition>

        <div
          v-if="filteredUsers.length === 0"
          class="py-12 text-center opacity-40"
        >
          <BaseIcon name="search" class="h-12 w-12 mx-auto mb-2" />
          <p>No se encontraron usuarios.</p>
        </div>
      </section>
    </div>

    <UserFormModal
      :is-open="showModal"
      :user-data="selectedUser"
      @close="showModal = false"
      @submit="handleFormSubmit"
    />
  </main>
</template>
