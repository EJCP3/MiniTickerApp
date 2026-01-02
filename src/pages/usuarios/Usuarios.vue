<script setup lang="ts">
import { ref } from "vue";
import { useUsers } from "@/composables/useUsers";
import { type User } from "@/types/users";
import UserCard from "./userCard.vue";
import UserFormModal from "./UserFormModal.vue"; 
import BaseIcon from "@/components/BaseIcon.vue"; // Importar BaseIcon

// Lógica del Composable
const {
  filteredUsers,
  stats,
  searchQuery,
  filterRole,
  filterStatus,
  createUser,
  updateUser,
  deleteUser,
} = useUsers();

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

const handleDelete = (id: string) => {
  if (confirm("¿Eliminar usuario?")) deleteUser(id);
};
</script>

<template>
  <main class="min-h-screen bg-base-200 p-6 md:p-10 font-sans text-base-content">
    <div class="max-w-350 mx-auto">
      
      <header class="flex flex-col md:flex-row justify-between items-end gap-4 mb-8">
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
        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8"
      >
        <article class="card bg-base-100 shadow-sm border border-base-200/50 p-4 relative overflow-hidden group">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-purple-500/10 text-purple-500 rounded-2xl group-hover:scale-110 transition-transform">
              <BaseIcon name="users" class="size-8" />
            </div>
            <div>
              <div class="text-xs text-base-content/60 mb-0.5 uppercase font-bold tracking-wide">Total</div>
              <div class="text-2xl font-bold">{{ stats.total }}</div>
            </div>
          </div>
        </article>

        <article class="card bg-base-100 shadow-sm border border-success/20 p-4 relative overflow-hidden group">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl group-hover:scale-110 transition-transform">
              <BaseIcon name="checkCircle" class="size-8" />
            </div>
            <div>
              <div class="text-xs text-base-content/60 mb-0.5 uppercase font-bold tracking-wide">Activos</div>
              <div class="text-2xl font-bold">{{ stats.activos }}</div>
            </div>
          </div>
        </article>

        <article class="card bg-base-100 shadow-sm border border-error/20 p-4 relative overflow-hidden group">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-rose-500/10 text-rose-500 rounded-2xl group-hover:scale-110 transition-transform">
              <BaseIcon name="userX" class="size-8" />
            </div>
            <div>
              <div class="text-xs text-base-content/60 mb-0.5 uppercase font-bold tracking-wide">Inactivos</div>
              <div class="text-2xl font-bold">{{ stats.inactivos }}</div>
            </div>
          </div>
        </article>

        <article class="card bg-base-100 shadow-sm border border-info/20 p-4 relative overflow-hidden group">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-blue-500/10 text-blue-500 rounded-2xl group-hover:scale-110 transition-transform">
              <BaseIcon name="user" class="size-8" />
            </div>
            <div>
              <div class="text-xs text-base-content/60 mb-0.5 uppercase font-bold tracking-wide truncate">Solicitantes</div>
              <div class="text-2xl font-bold">{{ stats.solicitantes }}</div>
            </div>
          </div>
        </article>

        <article class="card bg-base-100 shadow-sm border border-primary/20 p-4 relative overflow-hidden group">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-primary/10 text-primary rounded-2xl group-hover:scale-110 transition-transform">
              <BaseIcon name="userSettings" class="size-8" />
            </div>
            <div>
              <div class="text-xs text-base-content/60 mb-0.5 uppercase font-bold tracking-wide truncate">Responsables</div>
              <div class="text-2xl font-bold">{{ stats.gestores }}</div>
            </div>
          </div>
        </article>

        <article class="card bg-base-100 shadow-sm border border-secondary/20 p-4 relative overflow-hidden group">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-secondary/10 text-secondary rounded-2xl group-hover:scale-110 transition-transform">
              <BaseIcon name="userShield" class="size-8" />
            </div>
            <div>
              <div class="text-xs text-base-content/60 mb-0.5 uppercase font-bold tracking-wide">Admins</div>
              <div class="text-2xl font-bold">{{ stats.admins }}</div>
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
            <div class="absolute left-3 top-3 text-base-content/40 pointer-events-none">
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

      <section 
        aria-label="Lista de usuarios"
        class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
      >
        <UserCard
          v-for="user in filteredUsers"
          :key="user.Id"
          :user="user"
          @edit="openEdit"
          @delete="handleDelete"
        />
        
        <div v-if="filteredUsers.length === 0" class="col-span-full py-12 text-center text-base-content/40 flex flex-col items-center">
          <BaseIcon name="search" class="h-12 w-12 mb-2 opacity-20" />
          <p class="font-medium">No se encontraron usuarios.</p>
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