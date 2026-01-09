import { ref, computed } from 'vue';
import { useUserStore } from '@/stores/userStore';
import type { User } from '@/types';

export function useUsers() {
  const store = useUserStore();

  const searchQuery = ref('');
  const filterRole = ref('Todos');
  const filterStatus = ref('Todos');

  // --- FILTROS Y BÚSQUEDA ---
  const filteredUsers = computed(() => {
    let list = store.users || [];

    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase();
      list = list.filter(u => 
        u.nombre.toLowerCase().includes(q) || 
        u.email.toLowerCase().includes(q)
      );
    }

    if (filterRole.value !== 'Todos') {
      list = list.filter(u => u.rol === filterRole.value);
    }

    if (filterStatus.value !== 'Todos') {
      const activeRequested = filterStatus.value === 'Activos';
      list = list.filter(u => u.activo === activeRequested);
    }

    return list;
  });

  // --- ESTADÍSTICAS ---
  const stats = computed(() => {
    const list = store.users || [];
    return {
      total: list.length,
      activos: list.filter(u => u.activo).length,
      inactivos: list.filter(u => !u.activo).length,
      solicitantes: list.filter(u => u.rol === 'Solicitante').length,
      gestores: list.filter(u => u.rol === 'Gestor').length,
      admins: list.filter(u => u.rol === 'Admin' || u.rol === 'SuperAdmin').length,
    };
  });

  // --- ACCIONES WRAPPERS ---
  const createUser = (data: Partial<User>) => store.addUser(data);
  
 const updateExistingUser = async (formData: FormData) => {
  // Extraemos el ID que acabamos de meter en el modal
  const userId = formData.get("Id") as string;

  if (!userId) {
    console.error("Error: ID de usuario no encontrado en el FormData");
    return;
  }

  // Enviamos tanto el ID (para la URL) como el FormData (para el body)
  return await store.updateUser({ id: userId, data: formData });
};


  return {
    filteredUsers,
    stats,
    searchQuery,
    filterRole,
    filterStatus,
    isLoading: computed(() => store.status === 'pending'),
    createUser,
    updateUser: updateExistingUser,
    toggleStatus: (id: string, active: boolean) => store.toggleStatus({ id, active })
  };
}