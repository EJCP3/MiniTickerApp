<script setup lang="ts">
import { ref, computed } from 'vue'

// --- INTERFACES ---
interface AreaStats {
  total: number
  activas: number
  completadas: number
  pendientesMsg?: string
}

interface Area {
  id: string
  nombre: string
  prefijo: string
  estado: boolean // true = Activo
  responsableId: string // Guardamos el ID del usuario
  color: string 
  stats: AreaStats
}

// NUEVA INTERFAZ: Tipo de Solicitud
interface TipoSolicitud {
  id: string
  areaId: string
  nombre: string
  activo: boolean
}

// --- DATOS MOCK (Simulando Base de Datos) ---

// 1. Catálogo de Gestores/Usuarios del Sistema
const gestoresOptions = [
  { label: 'Luis Hernández (TI)', value: 'u1' },
  { label: 'Pedro Martínez (Mantenimiento)', value: 'u2' },
  { label: 'Jorge Flores (Logística)', value: 'u3' },
  { label: 'Ana López (Finanzas)', value: 'u4' },
  { label: 'María Rivera (RRHH)', value: 'u5' },
]

// Helper para obtener nombre por ID
const getResponsableName = (id: string) => {
  const gestor = gestoresOptions.find(g => g.value === id)
  return gestor ? gestor.label.split(' (')[0] : 'Sin Asignar'
}

// 2. Departamentos Iniciales
const areas = ref<Area[]>([
  {
    id: '1',
    nombre: 'Tecnología de Información',
    prefijo: 'TI',
    estado: true,
    responsableId: 'u1',
    color: 'primary',
    stats: { total: 2, activas: 2, completadas: 0, pendientesMsg: '2 solicitudes pendientes' }
  },
  {
    id: '2',
    nombre: 'Mantenimiento',
    prefijo: 'MNT',
    estado: true,
    responsableId: 'u2',
    color: 'warning',
    stats: { total: 4, activas: 2, completadas: 2, pendientesMsg: '1 solicitud requiere repuestos' }
  },
  {
    id: '3',
    nombre: 'Transporte',
    prefijo: 'TRS',
    estado: true,
    responsableId: 'u3',
    color: 'info',
    stats: { total: 12, activas: 5, completadas: 7 }
  },
  {
    id: '4',
    nombre: 'Compras',
    prefijo: 'CMP',
    estado: false,
    responsableId: 'u4',
    color: 'success',
    stats: { total: 8, activas: 0, completadas: 8 }
  }
])

// 3. NUEVO: Tipos de Solicitud (Mock Data)
const tiposSolicitud = ref<TipoSolicitud[]>([
  { id: 't1', areaId: '1', nombre: 'Soporte de Hardware', activo: true },
  { id: 't2', areaId: '1', nombre: 'Instalación de Software', activo: true },
  { id: 't3', areaId: '2', nombre: 'Reparación de Aire', activo: true },
])

// --- ESTADO DE MODALES ---
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showTypesModal = ref(false) // Nuevo Modal
const isSubmitting = ref(false)

// Estado para gestión de tipos
const selectedArea = ref<Area | null>(null)
const newTypeInput = ref('')

// Modelos de Formularios
const newArea = ref({
  nombre: '',
  prefijo: '',
  responsableId: ''
})

const editingArea = ref({
  id: '',
  nombre: '',
  prefijo: '',
  responsableId: '',
  estado: true
})

// --- COMPUTADOS ---
const totalAreas = computed(() => areas.value.length)
const activas = computed(() => areas.value.filter(a => a.estado).length)
const inactivas = computed(() => areas.value.filter(a => !a.estado).length)
const totalSolicitudes = computed(() => areas.value.reduce((acc, curr) => acc + curr.stats.total, 0))

// NUEVO: Filtra los tipos del área seleccionada
const currentAreaTypes = computed(() => {
  if (!selectedArea.value) return []
  return tiposSolicitud.value.filter(t => t.areaId === selectedArea.value?.id)
})

// --- FUNCIONES ---

// Crear Nueva Área
const handleCreate = async () => {
  isSubmitting.value = true
  await new Promise(r => setTimeout(r, 800)) // Simular API
  
  areas.value.push({
    id: Date.now().toString(),
    nombre: newArea.value.nombre,
    prefijo: newArea.value.prefijo.toUpperCase(),
    estado: true,
    responsableId: newArea.value.responsableId,
    color: 'secondary',
    stats: { total: 0, activas: 0, completadas: 0 }
  })

  newArea.value = { nombre: '', prefijo: '', responsableId: '' }
  isSubmitting.value = false
  showCreateModal.value = false
}

// Abrir Modal de Edición
const openEditModal = (area: Area) => {
  editingArea.value = {
    id: area.id,
    nombre: area.nombre,
    prefijo: area.prefijo,
    responsableId: area.responsableId,
    estado: area.estado
  }
  showEditModal.value = true
}

// Guardar Edición
const handleUpdate = async () => {
  isSubmitting.value = true
  await new Promise(r => setTimeout(r, 800)) 

  const index = areas.value.findIndex(a => a.id === editingArea.value.id)
  if (index !== -1) {
    areas.value[index] = {
      ...areas.value[index], 
      nombre: editingArea.value.nombre,
      responsableId: editingArea.value.responsableId,
      estado: editingArea.value.estado
    }
  }

  isSubmitting.value = false
  showEditModal.value = false
}

// NUEVAS FUNCIONES PARA TIPOS
const openTypesModal = (area: Area) => {
  selectedArea.value = area
  newTypeInput.value = ''
  showTypesModal.value = true
}

const handleAddType = () => {
  if (!newTypeInput.value.trim() || !selectedArea.value) return
  
  tiposSolicitud.value.push({
    id: Date.now().toString(),
    areaId: selectedArea.value.id,
    nombre: newTypeInput.value,
    activo: true
  })
  newTypeInput.value = ''
}

const handleDeleteType = (id: string) => {
  if(confirm('¿Eliminar este tipo de solicitud?')) {
    tiposSolicitud.value = tiposSolicitud.value.filter(t => t.id !== id)
  }
}

// Helpers de Estilo
const getBorderClass = (color: string) => `border-l-${color}`
const getIconBgClass = (color: string) => `bg-${color} text-${color}-content`

const getDynamicBorder = (color: string) => {
    const borders: any = { primary: 'border-l-primary', secondary: 'border-l-secondary', info: 'border-l-info', success: 'border-l-success', warning: 'border-l-warning', error: 'border-l-error' }
    return borders[color] || 'border-l-neutral'
}
const getDynamicBg = (color: string) => {
    const bgs: any = { primary: 'bg-primary text-primary-content', secondary: 'bg-secondary text-secondary-content', info: 'bg-info text-info-content', success: 'bg-success text-success-content', warning: 'bg-warning text-warning-content', error: 'bg-error text-error-content' }
    return bgs[color] || 'bg-neutral text-neutral-content'
}

</script>

<template>
  <div class="min-h-screen bg-base-200 p-6 md:p-10 font-sans text-base-content">
    <div class="max-w-7xl mx-auto">
      
      <div class="flex flex-col md:flex-row justify-between items-end gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-bold">Departamentos</h1>
          <p class="text-base-content/60 text-sm mt-1">Gestión de catálogo de departamentos y áreas</p>
        </div>
        <button @click="showCreateModal = true" class="btn btn-primary shadow-lg shadow-primary/20 gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" /></svg>
          Nuevo Departamento
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div class="card bg-base-100 shadow-sm border border-base-200 p-4 flex-row items-center gap-4">
            <div class="p-3 bg-purple-100 text-purple-600 rounded-xl"><svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg></div>
            <div><div class="text-xs opacity-50 font-bold uppercase">Total</div><div class="text-2xl font-black">{{ totalAreas }}</div></div>
        </div>
        <div class="card bg-base-100 shadow-sm border border-base-200 p-4 flex-row items-center gap-4">
            <div class="p-3 bg-emerald-100 text-emerald-600 rounded-xl"><svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
            <div><div class="text-xs opacity-50 font-bold uppercase">Activos</div><div class="text-2xl font-black">{{ activas }}</div></div>
        </div>
        <div class="card bg-base-100 shadow-sm border border-base-200 p-4 flex-row items-center gap-4">
            <div class="p-3 bg-rose-100 text-rose-600 rounded-xl"><svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg></div>
            <div><div class="text-xs opacity-50 font-bold uppercase">Inactivos</div><div class="text-2xl font-black">{{ inactivas }}</div></div>
        </div>
        <div class="card bg-base-100 shadow-sm border border-base-200 p-4 flex-row items-center gap-4">
            <div class="p-3 bg-blue-100 text-blue-600 rounded-xl"><svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg></div>
            <div><div class="text-xs opacity-50 font-bold uppercase">Solicitudes</div><div class="text-2xl font-black">{{ totalSolicitudes }}</div></div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          v-for="area in areas" 
          :key="area.id"
          class="card bg-base-100 shadow-xl border-l-[6px] transition-all hover:-translate-y-1 hover:shadow-2xl"
          :class="getDynamicBorder(area.color)"
        >
          <div class="card-body p-6">
            
            <div class="flex justify-between items-start mb-4">
              <div class="flex gap-4">
                <div class="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm" :class="getDynamicBg(area.color)">
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                </div>
                <div>
                  <h3 class="font-bold text-lg leading-tight">{{ area.nombre }}</h3>
                  <div class="flex gap-2 mt-1">
                    <span class="badge badge-sm font-mono font-bold opacity-70">{{ area.prefijo }}</span>
                    <span class="badge badge-sm" :class="area.estado ? 'badge-success text-white' : 'badge-error text-white'">
                      {{ area.estado ? 'Activo' : 'Inactivo' }}
                    </span>
                  </div>
                </div>
              </div>
              
              <div class="flex gap-1">
                <button @click="openTypesModal(area)" class="btn btn-ghost btn-sm btn-circle text-base-content/40 hover:text-info tooltip tooltip-left" data-tip="Tipos de Solicitud">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                </button>
                
                <button @click="openEditModal(area)" class="btn btn-ghost btn-sm btn-circle text-base-content/40 hover:text-primary tooltip tooltip-left" data-tip="Editar">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </button>
              </div>

            </div>

            <div class="bg-base-200/50 rounded-lg p-3 mb-4 border border-base-200 flex items-center justify-between">
              <div>
                <div class="text-[10px] text-base-content/50 uppercase font-bold tracking-wider mb-0.5">Responsable</div>
                <div class="font-semibold text-sm">{{ getResponsableName(area.responsableId) }}</div>
              </div>
              <div class="avatar placeholder">
                <div class="bg-base-300 text-base-content rounded-full w-8">
                  <span class="text-xs">{{ getResponsableName(area.responsableId).charAt(0) }}</span>
                </div>
              </div> 
            </div>

            <div class="grid grid-cols-3 gap-2 mb-4">
              <div class="text-center p-2 rounded-lg bg-base-200/30">
                <div class="text-lg font-bold">{{ area.stats.total }}</div>
                <div class="text-[10px] text-base-content/60 uppercase">Total</div>
              </div>
              <div class="text-center p-2 rounded-lg bg-base-200/30">
                <div class="text-lg font-bold text-warning">{{ area.stats.activas }}</div>
                <div class="text-[10px] text-base-content/60 uppercase">Activas</div>
              </div>
              <div class="text-center p-2 rounded-lg bg-base-200/30">
                <div class="text-lg font-bold text-success">{{ area.stats.completadas }}</div>
                <div class="text-[10px] text-base-content/60 uppercase">Hechas</div>
              </div>
            </div>

            <div v-if="area.stats.pendientesMsg" class="alert alert-warning bg-warning/10 text-warning-content border-none py-2 px-3 text-xs flex justify-start rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              <span class="font-medium text-warning-700">{{ area.stats.pendientesMsg }}</span>
            </div>
            <div v-else class="h-[40px]"></div>

          </div>
        </div>
      </div>
    </div>

    <dialog class="modal" :class="{ 'modal-open': showTypesModal }">
      <div class="modal-box w-11/12 max-w-2xl">
        <form method="dialog">
          <button @click="showTypesModal = false" class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>

        <div class="flex items-center gap-3 mb-6">
           <div class="w-10 h-10 rounded-lg bg-info text-info-content flex items-center justify-center">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
           </div>
           <div>
             <h3 class="font-bold text-lg">Tipos de Solicitud</h3>
             <p class="text-xs text-base-content/60">Configurando: <span class="font-bold text-primary">{{ selectedArea?.nombre }}</span></p>
           </div>
        </div>

        <div class="bg-base-200 p-4 rounded-lg mb-6 flex gap-2 items-end">
           <div class="flex-1">
             <label class="label text-xs font-bold text-base-content/50 uppercase">Agregar Nuevo Tipo</label>
             <input 
                v-model="newTypeInput" 
                @keyup.enter="handleAddType"
                type="text" 
                placeholder="Ej. Reparación de Impresora" 
                class="input input-bordered w-full focus:input-primary bg-base-100" 
             />
           </div>
           <button @click="handleAddType" class="btn btn-primary">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" /></svg>
             Agregar
           </button>
        </div>

        <div class="overflow-x-auto border border-base-200 rounded-lg">
          <table class="table w-full">
            <thead class="bg-base-200">
              <tr>
                <th>Nombre del Tipo</th>
                <th class="text-center">Estado</th>
                <th class="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="currentAreaTypes.length === 0">
                <td colspan="3" class="text-center py-8 text-base-content/40">
                  No hay tipos configurados.
                </td>
              </tr>
              <tr v-for="tipo in currentAreaTypes" :key="tipo.id" class="hover">
                <td class="font-medium">{{ tipo.nombre }}</td>
                <td class="text-center">
                   <input type="checkbox" class="toggle toggle-success toggle-sm" v-model="tipo.activo" />
                </td>
                <td class="text-right">
                  <button @click="handleDeleteType(tipo.id)" class="btn btn-ghost btn-xs text-error hover:bg-error/10">
                    Eliminar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="modal-action">
          <button @click="showTypesModal = false" class="btn">Cerrar</button>
        </div>

      </div>
      <form method="dialog" class="modal-backdrop"><button @click="showTypesModal = false">close</button></form>
    </dialog>

    <dialog class="modal" :class="{ 'modal-open': showCreateModal }">
      <div class="modal-box max-w-lg">
        <form method="dialog">
          <button @click="showCreateModal = false" class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        
        <h3 class="font-bold text-lg mb-4 flex items-center gap-2">
           <span class="w-8 h-8 rounded bg-primary text-primary-content flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" /></svg></span>
           Nuevo Departamento
        </h3>

        <FormKit type="form" v-model="newArea" :actions="false" @submit="handleCreate" form-class="space-y-4">
          <FormKit type="text" name="nombre" label="Nombre" placeholder="Ej. Recursos Humanos" validation="required|length:3" label-class="label-text font-bold block mb-1" input-class="input input-bordered w-full focus:input-primary" />
          
          <div class="grid grid-cols-2 gap-4">
            <FormKit type="text" name="prefijo" label="Prefijo" placeholder="Ej. RRHH" validation="required|length:2,5" label-class="label-text font-bold block mb-1" input-class="input input-bordered w-full focus:input-primary uppercase placeholder:normal-case" />
            
            <FormKit type="select" name="responsableId" label="Responsable" placeholder="Selecciona un gestor" :options="gestoresOptions" validation="required" label-class="label-text font-bold block mb-1" input-class="select select-bordered w-full focus:select-primary" />
          </div>

          <div class="modal-action">
             <button type="button" @click="showCreateModal = false" class="btn btn-ghost">Cancelar</button>
             <button type="submit" :disabled="isSubmitting" class="btn btn-primary"><span v-if="isSubmitting" class="loading loading-spinner"></span>Guardar</button>
          </div>
        </FormKit>
      </div>
      <form method="dialog" class="modal-backdrop"><button @click="showCreateModal = false">close</button></form>
    </dialog>


    <dialog class="modal" :class="{ 'modal-open': showEditModal }">
      <div class="modal-box max-w-lg">
        <form method="dialog">
          <button @click="showEditModal = false" class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        
        <h3 class="font-bold text-lg mb-4 flex items-center gap-2">
           <span class="w-8 h-8 rounded bg-secondary text-secondary-content flex items-center justify-center">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
           </span>
           Editar Departamento
        </h3>

        <FormKit type="form" v-model="editingArea" :actions="false" @submit="handleUpdate" form-class="space-y-4">
          
          <FormKit type="text" name="nombre" label="Nombre" validation="required|length:3" label-class="label-text font-bold block mb-1" input-class="input input-bordered w-full focus:input-primary" />

          <FormKit type="text" name="prefijo" label="Prefijo (No editable)" disabled label-class="label-text font-bold block mb-1" input-class="input input-bordered w-full bg-base-200 text-base-content/50" />
            
          <FormKit type="select" name="responsableId" label="Cambiar Responsable" :options="gestoresOptions" validation="required" label-class="label-text font-bold block mb-1" input-class="select select-bordered w-full focus:select-primary" />

          <div class="form-control">
             <FormKit 
                type="checkbox" 
                name="estado" 
                label="Departamento Activo"
                outer-class="form-control"
                wrapper-class="flex items-center gap-3 p-3 border border-base-300 rounded-lg cursor-pointer hover:bg-base-200/50 transition-colors"
                label-class="label-text font-bold cursor-pointer flex-1"
                input-class="checkbox checkbox-primary"
             >
                <template #label="context">
                    <span class="flex-1 font-bold">Estado del Departamento</span>
                    <span class="badge" :class="context.value ? 'badge-success text-white' : 'badge-error text-white'">
                        {{ context.value ? 'Operativo' : 'Deshabilitado' }}
                    </span>
                </template>
             </FormKit>
          </div>

          <div class="modal-action">
             <button type="button" @click="showEditModal = false" class="btn btn-ghost">Cancelar</button>
             <button type="submit" :disabled="isSubmitting" class="btn btn-primary"><span v-if="isSubmitting" class="loading loading-spinner"></span>Actualizar Cambios</button>
          </div>
        </FormKit>
      </div>
      <form method="dialog" class="modal-backdrop"><button @click="showEditModal = false">close</button></form>
    </dialog>

  </div>
</template>