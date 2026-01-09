import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useUIStore = defineStore('ui', () => {
  // Inicializamos con el valor guardado en el navegador o 'grid' por defecto
  const viewMode = ref<'grid' | 'table'>(
    (localStorage.getItem('viewMode') as 'grid' | 'table') || 'grid'
  )

  // Función para cambiar el modo
  const setViewMode = (mode: 'grid' | 'table') => {
    viewMode.value = mode
  }

  const toggleViewMode = () => {
    viewMode.value = viewMode.value === 'grid' ? 'table' : 'grid'
  }

  // Escuchamos cambios para guardar en el navegador
  watch(viewMode, (newMode) => {
    localStorage.setItem('viewMode', newMode)
  })

  return {
    viewMode,
    setViewMode,
    toggleViewMode
  }
})