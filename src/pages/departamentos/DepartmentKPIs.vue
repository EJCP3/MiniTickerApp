<script setup lang="ts">
import { useDepartments } from '@/composables/useDepartments'
import BaseIcon from '@/components/BaseIcon.vue' // Importamos el componente de iconos

const { totalAreas, activas, inactivas, totalSolicitudes } = useDepartments()
</script>

<template>
  <section 
    aria-label="Indicadores de Departamentos" 
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
  >
    
    <article class="card bg-base-100 shadow-sm border border-base-200 p-4 flex-row items-center gap-4">
      <div class="p-3 bg-purple-100 text-purple-600 rounded-xl" aria-hidden="true">
        <BaseIcon name="officeBuilding" class="size-10" />
      </div>
      <dl>
        <dt class="text-xs opacity-50 font-bold uppercase">Total</dt>
        <dd class="text-2xl font-black m-0">{{ totalAreas }}</dd>
      </dl>
    </article>

    <article class="card bg-base-100 shadow-sm border border-base-200 p-4 flex-row items-center gap-4">
      <div class="p-3 bg-emerald-100 text-emerald-600 rounded-xl" aria-hidden="true">
        <BaseIcon name="checkCircle" class="size-10" />
      </div>
      <dl>
        <dt class="text-xs opacity-50 font-bold uppercase">Activos</dt>
        <dd class="text-2xl font-black m-0">{{ activas }}</dd>
      </dl>
    </article>

    <article class="card bg-base-100 shadow-sm border border-base-200 p-4 flex-row items-center gap-4">
      <div class="p-3 bg-rose-100 text-rose-600 rounded-xl" aria-hidden="true">
        <BaseIcon name="ban" class="size-10" />
      </div>
      <dl>
        <dt class="text-xs opacity-50 font-bold uppercase">Inactivos</dt>
        <dd class="text-2xl font-black m-0">{{ inactivas }}</dd>
      </dl>
    </article>

    <article class="card bg-base-100 shadow-sm border border-base-200 p-4 flex-row items-center gap-4">
      <div class="p-3 bg-blue-100 text-blue-600 rounded-xl" aria-hidden="true">
        <BaseIcon name="clipboard" class="size-10" />
      </div>
      <dl>
        <dt class="text-xs opacity-50 font-bold uppercase">Solicitudes</dt>
        <dd class="text-2xl font-black m-0">{{ totalSolicitudes }}</dd>
      </dl>
    </article>

  </section>
</template>