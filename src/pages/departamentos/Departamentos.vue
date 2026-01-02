<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDepartments } from '@/composables/useDepartments'
import type { Area } from '@/types/department'

// Componentes
import DepartmentCard from './DepartmentCard.vue'
import CreateAreaModal from './CreateAreaModal.vue'
import EditAreaModal from './EditAreaModal.vue'
import ManageTypesModal from './ManageTypesModal.vue'
import DepartmentKPIs from './DepartmentKPIs.vue'
import BaseIcon from '@/components/BaseIcon.vue' // Importamos BaseIcon

// Lógica Composable
const { areas, addArea, updateArea, getTypesByArea, addType, deleteType } = useDepartments()

// Estado Local Modales
const showCreate = ref(false)
const showEdit = ref(false)
const showTypes = ref(false)
const selectedArea = ref<Area | null>(null)

// Computed para pasar tipos al modal
const currentTypes = computed(() => selectedArea.value ? getTypesByArea(selectedArea.value.id).value : [])

// Handlers
const openEdit = (area: Area) => { selectedArea.value = area; showEdit.value = true }
const openTypes = (area: Area) => { selectedArea.value = area; showTypes.value = true }

const handleCreateSubmit = (data: any) => { addArea(data); showCreate.value = false }
const handleEditSubmit = (data: any) => { updateArea(data); showEdit.value = false }
const handleTypeAdd = (nombre: string) => { if(selectedArea.value) addType(selectedArea.value.id, nombre) }
const handleTypeDelete = (id: string) => { deleteType(id) }
</script>

<template>
  <main class="min-h-screen bg-base-200 p-6 md:p-10 font-sans text-base-content">
    <div class="max-w-7xl mx-auto">
      
      <header class="flex flex-col md:flex-row justify-between items-end gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-bold">Departamentos</h1>
          <p class="text-base-content/60 text-sm mt-1">Gestión de catálogo de departamentos y áreas</p>
        </div>
        
        <button 
          @click="showCreate = true" 
          class="btn btn-primary shadow-lg gap-2 font-bold text-white"
          aria-label="Crear nuevo departamento"
        >
          <BaseIcon name="plus" class="size-10" />
          Nuevo Departamento
        </button>
      </header>

      <DepartmentKPIs />

      <section 
        aria-label="Listado de departamentos existentes"
        class="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <DepartmentCard 
          v-for="area in areas" 
          :key="area.id" 
          :area="area" 
          @edit="openEdit" 
          @manage-types="openTypes" 
        />
      </section>

      <CreateAreaModal :is-open="showCreate" @close="showCreate = false" @submit="handleCreateSubmit" />
      <EditAreaModal :is-open="showEdit" :area-data="selectedArea" @close="showEdit = false" @submit="handleEditSubmit" />
      <ManageTypesModal :is-open="showTypes" :area-data="selectedArea" :types="currentTypes" @close="showTypes = false" @add="handleTypeAdd" @delete="handleTypeDelete" />

    </div>
  </main>
</template>