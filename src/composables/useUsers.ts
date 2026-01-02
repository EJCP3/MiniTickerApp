import { ref, computed } from 'vue'
import type { User, RolUsuario } from '@/types/users'
import { DEFAULT_PHOTO } from '@/types/users'

// Estado global simulado
const users = ref<User[]>([
  {
    Id: '1', Nombre: 'Roberto Super', Email: 'roberto@empresa.com', Rol: 'SuperAdmin',
    Activo: true, FechaCreacion: '2023-01-01', FotoPerfilUrl: ''
  },
  {
    Id: '2', Nombre: 'Carlos Admin', Email: 'admin@empresa.com', Rol: 'Admin',
    Activo: true, FechaCreacion: '2023-06-15'
  },
  {
    Id: '3', Nombre: 'Pedro Gestor', Email: 'pedro.gestor@empresa.com', Rol: 'Gestor', AreaId: 'area-1',
    Activo: true, FechaCreacion: '2024-02-10'
  },
  {
    Id: '4', Nombre: 'Ana Solicitante', Email: 'ana.user@empresa.com', Rol: 'Solicitante', AreaId: 'area-3',
    Activo: true, FechaCreacion: '2024-03-05'
  }
])

export function useUsers() {
  const searchQuery = ref('')
  const filterRole = ref('Todos')
  const filterStatus = ref('Todos')

  // Filtros
  const filteredUsers = computed(() => {
    return users.value.filter(user => {
      const matchSearch = user.Nombre.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                          user.Email.toLowerCase().includes(searchQuery.value.toLowerCase())
      
      const matchRole = filterRole.value === 'Todos' || user.Rol === filterRole.value
      
      const matchStatus = filterStatus.value === 'Todos' || 
                          (filterStatus.value === 'Activos' && user.Activo) || 
                          (filterStatus.value === 'Inactivos' && !user.Activo)
      
      return matchSearch && matchRole && matchStatus
    })
  })

  // KPIs
  const stats = computed(() => ({
    total: users.value.length,
    activos: users.value.filter(u => u.Activo).length,
    inactivos: users.value.filter(u => !u.Activo).length,
    superadmins: users.value.filter(u => u.Rol === 'SuperAdmin').length,
    admins: users.value.filter(u => u.Rol === 'Admin').length,
    gestores: users.value.filter(u => u.Rol === 'Gestor').length,
    solicitantes: users.value.filter(u => u.Rol === 'Solicitante').length
  }))

  // Acciones
  const createUser = (userData: any) => {
    users.value.push({
      Id: Date.now().toString(),
      Nombre: userData.Nombre,
      Email: userData.Email,
      Rol: userData.Rol as RolUsuario,
      AreaId: userData.AreaId || undefined,
      Activo: userData.Activo,
      FechaCreacion: new Date().toISOString(),
      FotoPerfilUrl: userData.Foto ? DEFAULT_PHOTO : ''
    })
  }

  const updateUser = (userData: any) => {
    const index = users.value.findIndex(u => u.Id === userData.Id)
    if (index !== -1) {
      users.value[index] = {
        ...users.value[index],
        Nombre: userData.Nombre,
        Email: userData.Email,
        Rol: userData.Rol as RolUsuario,
        AreaId: userData.AreaId || undefined,
        Activo: userData.Activo,
        FotoPerfilUrl: userData.Foto ? DEFAULT_PHOTO : users.value[index].FotoPerfilUrl
      }
    }
  }

  const deleteUser = (id: string) => {
    users.value = users.value.filter(u => u.Id !== id)
  }

  return {
    users,
    filteredUsers,
    stats,
    searchQuery,
    filterRole,
    filterStatus,
    createUser,
    updateUser,
    deleteUser
  }
}