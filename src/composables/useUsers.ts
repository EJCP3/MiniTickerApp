import { ref, computed } from 'vue'
import type { User, RolUsuario } from '@/types'

// Estado global simulado
const users = ref<User[]>([
  {
    id: '1', nombre: 'Roberto Super', email: 'roberto@empresa.com', rol: 'SuperAdmin',
    activo: true, fechaCreacion: '2023-01-01', fotoPerfilUrl: ''
  },
  {
    id: '2', nombre: 'Carlos Admin', email: 'admin@empresa.com', rol: 'Admin',
    activo: true, fechaCreacion: '2023-06-15', fotoPerfilUrl: ''
  },
  {
    id: '3', nombre: 'Pedro Gestor', email: 'pedro.gestor@empresa.com', rol: 'Gestor', 
    activo: true, fechaCreacion: '2024-02-10', fotoPerfilUrl: ''
  },
  {
    id: '4', nombre: 'Ana Solicitante', email: 'ana.user@empresa.com', rol: 'Solicitante', 
    activo: true, fechaCreacion: '2024-03-05', fotoPerfilUrl: ''
  }
])

export function useUsers() {
  const searchQuery = ref('')
  const filterRole = ref('Todos')
  const filterStatus = ref('Todos')

  // Filtros
  const filteredUsers = computed(() => {
    return users.value.filter(user => {
      const matchSearch = user.nombre.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
      
      const matchRole = filterRole.value === 'Todos' || user.rol === filterRole.value
      
      const matchStatus = filterStatus.value === 'Todos' || 
                          (filterStatus.value === 'Activos' && user.activo) || 
                          (filterStatus.value === 'Inactivos' && !user.activo)
      
      return matchSearch && matchRole && matchStatus
    })
  })

  // KPIs
  const stats = computed(() => ({
    total: users.value.length,
    activos: users.value.filter(u => u.activo).length,
    inactivos: users.value.filter(u => !u.activo).length,
    superadmins: users.value.filter(u => u.rol === 'SuperAdmin').length,
    admins: users.value.filter(u => u.rol === 'Admin').length,
    gestores: users.value.filter(u => u.rol === 'Gestor').length,
    solicitantes: users.value.filter(u => u.rol === 'Solicitante').length
  }))

  // Acciones
  const createUser = (userData: any) => {
    users.value.push({
      id: Date.now().toString(),
      nombre: userData.nombre,
      email: userData.email,
      rol: userData.rol as RolUsuario,
      activo: userData.activo,
      fechaCreacion: new Date().toISOString(),
      fotoPerfilUrl: userData.foto ? `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.nombre)}&background=random` : ''
    })
  }

  const updateUser = (userData: any) => {
    const index = users.value.findIndex(u => u.id === userData.id)
    if (index !== -1) {
      users.value[index] = {
        ...users.value[index],
        nombre: userData.nombre,
        email: userData.email,
        rol: userData.rol as RolUsuario,
        activo: userData.activo,
        fotoPerfilUrl: userData.foto ? `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.nombre)}&background=random` : users.value[index].fotoPerfilUrl
      }
    }
  }

  const deleteUser = (id: string) => {
    users.value = users.value.filter(u => u.id !== id)
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