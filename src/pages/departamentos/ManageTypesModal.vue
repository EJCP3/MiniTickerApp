<script setup lang="ts">
import { ref } from 'vue'
import type { Area, TipoSolicitud } from '@/types/department'
import BaseIcon from '@/components/BaseIcon.vue' // Importamos BaseIcon

const props = defineProps<{ 
  isOpen: boolean, 
  areaData: Area | null, 
  types: TipoSolicitud[] 
}>()

const emit = defineEmits(['close', 'add', 'delete'])

const newTypeInput = ref('')
const idToDelete = ref<string | null>(null) // Estado para guardar el ID a eliminar

// Manejador para agregar
const handleAdd = () => {
  if (!newTypeInput.value.trim()) return
  emit('add', newTypeInput.value)
  newTypeInput.value = ''
}

// Manejador para abrir confirmación
const confirmDelete = (id: string) => {
  idToDelete.value = id
}

// Manejador para ejecutar eliminación
const executeDelete = () => {
  if (idToDelete.value) {
    emit('delete', idToDelete.value)
    idToDelete.value = null // Reseteamos
  }
}

// Cancelar eliminación
const cancelDelete = () => {
  idToDelete.value = null
}
</script>

<template>
  <dialog class="modal" :class="{ 'modal-open': isOpen }">
    <div class="modal-box w-11/12 max-w-2xl bg-base-100">
      <form method="dialog">
        <button @click="$emit('close')" class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" aria-label="Cerrar">
          <BaseIcon name="close" class="h-5 w-5" />
        </button>
      </form>
      
      <header class="flex items-center gap-3 mb-6">
        <div class="w-10 h-10 rounded-lg bg-info/10 text-info flex items-center justify-center">
          <BaseIcon name="list" class="size-10" />
        </div>
        <div>
          <h3 class="font-bold text-lg text-base-content">Tipos de Solicitud</h3>
          <p class="text-xs text-base-content/60">
            Configurando: <span class="font-bold text-primary">{{ areaData?.nombre }}</span>
          </p>
        </div>
      </header>

      <section class="bg-base-200 p-4 rounded-lg mb-6 flex gap-2 items-end shadow-inner">
        <div class="flex-1">
          <label class="label text-xs font-bold text-base-content/50 uppercase">Agregar Nuevo Tipo</label>
          <input 
            v-model="newTypeInput" 
            @keyup.enter="handleAdd" 
            type="text" 
            placeholder="Ej. Reparación de Hardware..." 
            class="input input-bordered w-full focus:input-primary bg-base-100 h-10" 
          />
        </div>
        <button @click="handleAdd" class="btn btn-primary btn-sm h-10 px-4 font-bold text-white">
          <BaseIcon name="plus" class="size-10 mr-1" />
          Agregar
        </button>
      </section>

      <section class="overflow-x-auto border border-base-200 rounded-lg shadow-sm">
        <table class="table w-full">
          <thead class="bg-base-200 text-base-content/70">
            <tr>
              <th scope="col">Nombre</th>
              <th scope="col" class="text-center">Estado</th>
              <th scope="col" class="text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="types.length === 0">
              <td colspan="3" class="text-center py-8 text-base-content/40 italic">
                Sin tipos configurados para este departamento.
              </td>
            </tr>
            <tr v-for="tipo in types" :key="tipo.id" class="hover:bg-base-200/50 transition-colors">
              <td class="font-medium text-base-content">{{ tipo.nombre }}</td>
              <td class="text-center">
                <input type="checkbox" class="toggle toggle-success toggle-sm" v-model="tipo.activo" aria-label="Activar o desactivar tipo" />
              </td>
              <td class="text-right">
                <button 
                  @click="confirmDelete(tipo.id)" 
                  class="btn btn-ghost btn-xs text-error hover:bg-error/10 text-xs"
                  aria-label="Eliminar tipo"
                >
                  <BaseIcon name="trash" class="size-10 mr-1" />
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <div class="modal-action">
        <button @click="$emit('close')" class="btn btn-ghost">Cerrar</button>
      </div>
    </div>
    
    <form method="dialog" class="modal-backdrop">
      <button @click="$emit('close')">close</button>
    </form>
  </dialog>


  <dialog class="modal" :class="{ 'modal-open': idToDelete !== null }">
    <div class="modal-box w-full max-w-sm bg-base-100 text-center shadow-xl border border-base-200">
      
      <div class="flex justify-center mb-4 text-error">
        <BaseIcon name="alertCircle" class="h-12 w-12" />
      </div>
      
      <h3 class="font-bold text-lg text-base-content">¿Estás seguro?</h3>
      <p class="py-4 text-sm text-base-content/70">
        Esta acción eliminará el tipo de solicitud permanentemente. No se puede deshacer.
      </p>
      
      <div class="modal-action justify-center gap-2 mt-2">
        <button @click="cancelDelete" class="btn btn-sm btn-ghost">Cancelar</button>
        <button @click="executeDelete" class="btn btn-sm btn-error text-white">
          Sí, eliminar
        </button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button @click="cancelDelete">close</button>
    </form>
  </dialog>
</template>