<script setup lang="ts">
import { ref, computed } from 'vue'

// --- 1. DEFINICIÓN DE ROLES ---
type RolUsuario = 'SuperAdmin' | 'Admin' | 'Gestor' | 'Solicitante'

// --- 2. INTERFAZ DE USUARIO ---
interface User {
  Id: string
  Nombre: string
  Email: string
  Rol: RolUsuario
  AreaId?: string 
  Activo: boolean
  FotoPerfilUrl?: string
  FechaCreacion: string
}

// CONSTANTE: Imagen por defecto solicitada
const DEFAULT_PHOTO = "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"

// --- 3. DATOS MOCK ---
const areasOptions = [
  { label: 'Tecnología (TI)', value: 'area-1' },
  { label: 'Recursos Humanos', value: 'area-2' },
  { label: 'Ventas', value: 'area-3' },
  { label: 'Marketing', value: 'area-4' },
]

const users = ref<User[]>([
  {
    Id: '1',
    Nombre: 'Roberto Super',
    Email: 'roberto@empresa.com',
    Rol: 'SuperAdmin',
    Activo: true,
    FechaCreacion: '2023-01-01',
    FotoPerfilUrl: '' // Usará default
  },
  {
    Id: '2',
    Nombre: 'Carlos Admin',
    Email: 'admin@empresa.com',
    Rol: 'Admin',
    Activo: true,
    FechaCreacion: '2023-06-15'
  },
  {
    Id: '3',
    Nombre: 'Pedro Gestor',
    Email: 'pedro.gestor@empresa.com',
    Rol: 'Gestor',
    AreaId: 'area-1',
    Activo: true,
    FechaCreacion: '2024-02-10'
  },
  {
    Id: '4',
    Nombre: 'Ana Solicitante',
    Email: 'ana.user@empresa.com',
    Rol: 'Solicitante',
    AreaId: 'area-3',
    Activo: true,
    FechaCreacion: '2024-03-05'
  }
])

// --- 4. ESTADO ---
const searchQuery = ref('')
const filterRole = ref('Todos')
const filterStatus = ref('Todos')
const isSubmitting = ref(false)

// Modales
const showCreateModal = ref(false)
const showEditModal = ref(false)

// Formularios
const newUser = ref({
  Nombre: '',
  Email: '',
  Password: '', 
  Rol: 'Solicitante',
  AreaId: '',
  Activo: true,
  Foto: null // Para el archivo subido
})

const editingUser = ref({
  Id: '',
  Nombre: '',
  Email: '',
  Rol: '',
  AreaId: '',
  Activo: true,
  Foto: null
})

// --- 5. COMPUTADOS ---
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

const stats = computed(() => {
  return {
    total: users.value.length,
    activos: users.value.filter(u => u.Activo).length,
    inactivos: users.value.filter(u => !u.Activo).length,
    superadmins: users.value.filter(u => u.Rol === 'SuperAdmin').length,
    admins: users.value.filter(u => u.Rol === 'Admin').length,
    gestores: users.value.filter(u => u.Rol === 'Gestor').length,
    solicitantes: users.value.filter(u => u.Rol === 'Solicitante').length
  }
})

// --- 6. FUNCIONES ---
const getAreaName = (areaId?: string) => {
  if (!areaId) return 'General'
  const area = areasOptions.find(a => a.value === areaId)
  return area ? area.label : 'Desconocida'
}

const getRoleBadgeClass = (rol: string) => {
  switch (rol) {
    case 'SuperAdmin': return 'badge-secondary badge-soft '
    case 'Admin': return 'badge-primary badge-soft '
    case 'Gestor': return 'badge-accent badge-soft '
    default: return 'badge-soft'
  }
}

// CREAR
const handleCreateUser = async () => {
  isSubmitting.value = true
  await new Promise(r => setTimeout(r, 1000))

  users.value.push({
    Id: Date.now().toString(),
    Nombre: newUser.value.Nombre,
    Email: newUser.value.Email,
    Rol: newUser.value.Rol as RolUsuario,
    AreaId: newUser.value.AreaId || undefined,
    Activo: newUser.value.Activo,
    FechaCreacion: new Date().toISOString(),
    // En un app real, aquí subirías el archivo y obtendrías la URL
    FotoPerfilUrl: newUser.value.Foto ? DEFAULT_PHOTO : '' 
  })

  isSubmitting.value = false
  showCreateModal.value = false
  // Reset
  newUser.value = { Nombre: '', Email: '', Password: '', Rol: 'Solicitante', AreaId: '', Activo: true, Foto: null }
}

// EDITAR (Abrir)
const openEditModal = (user: User) => {
  editingUser.value = {
    Id: user.Id,
    Nombre: user.Nombre,
    Email: user.Email,
    Rol: user.Rol,
    AreaId: user.AreaId || '',
    Activo: user.Activo,
    Foto: null // Resetear input de archivo
  }
  showEditModal.value = true
}

// EDITAR (Guardar)
const handleUpdateUser = async () => {
  isSubmitting.value = true
  await new Promise(r => setTimeout(r, 1000))

  const index = users.value.findIndex(u => u.Id === editingUser.value.Id)
  if (index !== -1) {
    users.value[index] = {
      ...users.value[index],
      Nombre: editingUser.value.Nombre,
      Email: editingUser.value.Email,
      Rol: editingUser.value.Rol as RolUsuario,
      AreaId: editingUser.value.AreaId || undefined,
      Activo: editingUser.value.Activo,
      // Si subió foto nueva, la actualizamos (simulado)
      FotoPerfilUrl: editingUser.value.Foto ? DEFAULT_PHOTO : users.value[index].FotoPerfilUrl
    }
  }

  isSubmitting.value = false
  showEditModal.value = false
}

const handleDelete = (id: string) => {
  if (confirm('¿Eliminar usuario?')) users.value = users.value.filter(u => u.Id !== id)
}
</script>

<template>
  <div class="min-h-screen bg-base-200 p-6 md:p-10 font-sans text-base-content">
    <div class="max-w-[1400px] mx-auto">
      
      <div class="flex flex-col md:flex-row justify-between items-end gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-bold">Usuarios</h1>
          <p class="text-base-content/60 text-sm mt-1">Gestión de usuarios y permisos del sistema</p>
        </div>
        <button @click="showCreateModal = true" class="btn btn-primary shadow-lg shadow-primary/20 gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" /></svg>
          Nuevo Usuario
        </button>
      </div>

     <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        
        <div class="card bg-base-100 shadow-sm border border-base-200/50 p-4 relative overflow-hidden group">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-purple-500/10 text-purple-500 rounded-2xl group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
            <div>
              <div class="text-xs text-base-content/60 mb-0.5">Total</div>
              <div class="text-2xl font-bold">{{ stats.total }}</div>
            </div>
          </div>
        </div>

        <div class="card bg-base-100 shadow-sm border border-success/20 p-4 relative overflow-hidden group">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <div class="text-xs text-base-content/60 mb-0.5">Activos</div>
              <div class="text-2xl font-bold">{{ stats.activos }}</div>
            </div>
          </div>
        </div>

        <div class="card bg-base-100 shadow-sm border border-error/20 p-4 relative overflow-hidden group">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-rose-500/10 text-rose-500 rounded-2xl group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
            </div>
            <div>
              <div class="text-xs text-base-content/60 mb-0.5">Inactivos</div>
              <div class="text-2xl font-bold">{{ stats.inactivos }}</div>
            </div>
          </div>
        </div>

        <div class="card bg-base-100 shadow-sm border border-info/20 p-4 relative overflow-hidden group">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-blue-500/10 text-blue-500 rounded-2xl group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            <div>
              <div class="text-xs text-base-content/60 mb-0.5">Solicitantes</div>
              <div class="text-2xl font-bold">{{ stats.solicitantes }}</div>
            </div>
          </div>
        </div>

        <div class="card bg-base-100 shadow-sm border border-primary/20 p-4 relative overflow-hidden group">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-primary/10 text-primary rounded-2xl group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <div>
              <div class="text-xs text-base-content/60 mb-0.5">Responsables</div>
              <div class="text-2xl font-bold">{{ stats.gestores }}</div>
            </div>
          </div>
        </div>

        <div class="card bg-base-100 shadow-sm border border-secondary/20 p-4 relative overflow-hidden group">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-secondary/10 text-secondary rounded-2xl group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <div>
              <div class="text-xs text-base-content/60 mb-0.5">Admins</div>
              <div class="text-2xl font-bold">{{ stats.admins }}</div>
            </div>
          </div>
        </div>

      </div>

      <div class="bg-base-100 p-4 rounded-xl shadow-sm mb-8 border border-base-200 flex flex-col md:flex-row gap-4">
        <div class="form-control flex-1">
          <div class="relative">
            <input type="text" v-model="searchQuery" placeholder="Buscar..." class="input input-bordered w-full pl-10" />
            <svg class="h-5 w-5 absolute left-3 top-3 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        </div>
        <select v-model="filterRole" class="select select-bordered w-full md:w-48">
          <option>Todos</option><option>SuperAdmin</option><option>Admin</option><option>Gestor</option><option>Solicitante</option>
        </select>
        <select v-model="filterStatus" class="select select-bordered w-full md:w-48">
          <option>Todos</option><option>Activos</option><option>Inactivos</option>
        </select>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div v-for="user in filteredUsers" :key="user.Id" class="card bg-base-100 shadow-sm border border-base-200 hover:shadow-md transition-all group">
          <div class="card-body p-6">
            <div class="flex justify-between items-start">
              <div class="flex gap-4">
                <div class="avatar">
                  <div class="w-12 h-12 rounded-full ring ring-base-200 ring-offset-base-100 ring-offset-2">
                    <img :src="user.FotoPerfilUrl || DEFAULT_PHOTO" alt="Avatar" />
                  </div>
                </div>
                
                <div class="overflow-hidden">
                  <h3 class="font-bold text-lg leading-tight truncate" :title="user.Nombre">{{ user.Nombre }}</h3>
                  <p class="text-sm text-base-content/60 mb-2 truncate" :title="user.Email">{{ user.Email }}</p>
                  
                  <div class="flex flex-wrap gap-2">
                    <span class="badge badge-sm gap-1.5 py-3 pl-2 pr-3" :class="getRoleBadgeClass(user.Rol)">
                      {{ user.Rol }}
                    </span>
                    <span v-if="user.AreaId" class="badge badge-ghost badge-sm opacity-80">
                      {{ getAreaName(user.AreaId) }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="tooltip tooltip-left" :data-tip="user.Activo ? 'Activo' : 'Inactivo'">
                <div class="w-3 h-3 rounded-full mt-2" :class="user.Activo ? 'bg-success shadow-[0_0_8px] shadow-success' : 'bg-error'"></div>
              </div>
            </div>

            <div class="mt-4 pt-4 border-t border-base-200 flex gap-2">
              <button @click="openEditModal(user)" class="btn btn-sm btn-outline flex-1 gap-2 hover:btn-primary">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                Editar
              </button>
              <button @click="handleDelete(user.Id)" class="btn btn-sm btn-outline btn-error square">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <dialog class="modal" :class="{ 'modal-open': showCreateModal }">
      <div class="modal-box w-11/12 max-w-lg">
        <form method="dialog"><button @click="showCreateModal = false" class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button></form>
        <h3 class="font-bold text-lg mb-4 flex items-center gap-2">
           <span class="w-8 h-8 rounded bg-primary text-primary-content flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" /></svg></span>
           Nuevo Usuario
        </h3>

        <FormKit type="form" v-model="newUser" :actions="false" @submit="handleCreateUser" form-class="space-y-4">
          
          <div class="flex justify-center mb-4">
             <div class="form-control w-full max-w-xs">
                <label class="label"><span class="label-text">Foto de Perfil</span></label>
                <FormKit type="file" name="Foto" accept=".png,.jpg,.jpeg,.webp" input-class="file-input file-input-bordered w-full file-input-primary" />
             </div>
          </div>

          <FormKit type="text" name="Nombre" label="Nombre Completo" validation="required|length:3" label-class="label-text font-bold block mb-1" input-class="input input-bordered w-full focus:input-primary" />
          <FormKit type="email" name="Email" label="Correo Electrónico" validation="required|email" label-class="label-text font-bold block mb-1" input-class="input input-bordered w-full focus:input-primary" />
          <FormKit type="password" name="Password" label="Contraseña" validation="required|length:6" label-class="label-text font-bold block mb-1" input-class="input input-bordered w-full focus:input-primary" />

          <div class="grid grid-cols-2 gap-4">
            <FormKit type="select" name="Rol" label="Rol" :options="['Solicitante', 'Gestor', 'Admin', 'SuperAdmin']" validation="required" label-class="label-text font-bold block mb-1" input-class="select select-bordered w-full focus:select-primary" />
            <FormKit type="select" name="AreaId" label="Área" placeholder="General" :options="areasOptions" label-class="label-text font-bold block mb-1" input-class="select select-bordered w-full focus:select-primary" />
          </div>

          <div class="form-control mt-2 border border-base-200 rounded-lg p-3">
             <FormKit type="checkbox" name="Activo" label="Usuario Activo" outer-class="form-control" wrapper-class="flex items-center gap-3 cursor-pointer" label-class="label-text font-bold cursor-pointer flex-1" input-class="checkbox checkbox-primary">
                <template #label="context"><span class="flex-1 font-bold">Estado de Cuenta</span><span class="badge" :class="context.value ? 'badge-success text-white' : 'badge-ghost'">{{ context.value ? 'Habilitado' : 'Deshabilitado' }}</span></template>
             </FormKit>
          </div>

          <div class="modal-action mt-6"><button type="button" @click="showCreateModal = false" class="btn btn-ghost">Cancelar</button><button type="submit" :disabled="isSubmitting" class="btn btn-primary"><span v-if="isSubmitting" class="loading loading-spinner"></span>Guardar</button></div>
        </FormKit>
      </div>
      <form method="dialog" class="modal-backdrop"><button @click="showCreateModal = false">close</button></form>
    </dialog>

    <dialog class="modal" :class="{ 'modal-open': showEditModal }">
      <div class="modal-box w-11/12 max-w-lg">
        <form method="dialog"><button @click="showEditModal = false" class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button></form>
        <h3 class="font-bold text-lg mb-4 flex items-center gap-2">
           <span class="w-8 h-8 rounded bg-secondary text-secondary-content flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></span>
           Editar Usuario
        </h3>

        <FormKit type="form" v-model="editingUser" :actions="false" @submit="handleUpdateUser" form-class="space-y-4">
          
          <div class="flex justify-center mb-4">
             <div class="flex flex-col items-center gap-2">
                <div class="avatar">
                  <div class="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img :src="editingUser.Foto ? DEFAULT_PHOTO : (users.find(u => u.Id === editingUser.Id)?.FotoPerfilUrl || DEFAULT_PHOTO)" />
                  </div>
                </div>
                <FormKit type="file" name="Foto" label="Cambiar Foto" accept=".png,.jpg,.jpeg,.webp" input-class="file-input file-input-sm file-input-bordered w-full max-w-xs" />
             </div>
          </div>

          <FormKit type="text" name="Nombre" label="Nombre Completo" validation="required|length:3" label-class="label-text font-bold block mb-1" input-class="input input-bordered w-full focus:input-primary" />
          <FormKit type="email" name="Email" label="Correo Electrónico" validation="required|email" label-class="label-text font-bold block mb-1" input-class="input input-bordered w-full focus:input-primary" />
          
          <div class="grid grid-cols-1 gap-4">
            <FormKit type="select" name="Rol" label="Rol" :options="['Solicitante', 'Gestor', 'Admin', 'SuperAdmin']" validation="required" label-class="label-text font-bold block mb-1" input-class="select select-bordered w-full focus:select-primary" />
            <FormKit type="select" name="AreaId" label="Área" placeholder="General" :options="areasOptions" label-class="label-text font-bold block mb-1" input-class="select select-bordered w-full focus:select-primary" />
             <FormKit type="password" name="Password" label="Contraseña" validation="required|length:6" label-class="label-text font-bold block mb-1" input-class="input input-bordered w-full focus:input-primary" />
          </div>

          <div class="form-control mt-2 border border-base-200 rounded-lg p-3">
             <FormKit type="checkbox" name="Activo" label="Usuario Activo" outer-class="form-control" wrapper-class="flex items-center gap-3 cursor-pointer" label-class="label-text font-bold cursor-pointer flex-1" input-class="checkbox checkbox-primary">
                <template #label="context"><span class="flex-1 font-bold">Estado de Cuenta</span><span class="badge" :class="context.value ? 'badge-success text-white' : 'badge-ghost'">{{ context.value ? 'Habilitado' : 'Deshabilitado' }}</span></template>
             </FormKit>
          </div>

          <div class="modal-action mt-6"><button type="button" @click="showEditModal = false" class="btn btn-ghost">Cancelar</button><button type="submit" :disabled="isSubmitting" class="btn btn-primary"><span v-if="isSubmitting" class="loading loading-spinner"></span>Actualizar</button></div>
        </FormKit>
      </div>
      <form method="dialog" class="modal-backdrop"><button @click="showEditModal = false">close</button></form>
    </dialog>

  </div>
</template>