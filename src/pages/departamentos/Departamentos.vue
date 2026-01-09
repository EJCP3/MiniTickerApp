<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia"; // Importante para destructurar reactividad
import { useDepartmentStore } from "@/stores/departmentStore";
import type { Area } from "@/types/department";

// Componentes
import DepartmentCard from "./DepartmentCard.vue";
import CreateAreaModal from "./CreateAreaModal.vue";
import EditAreaModal from "./EditAreaModal.vue";
import ManageTypesModal from "./ManageTypesModal.vue";
import DepartmentKPIs from "./DepartmentKPIs.vue";
import BaseIcon from "@/components/BaseIcon.vue";
import AreaTable from "./AreaTable.vue";
import { useUIStore } from "@/stores/uiStore";

const uiStore = useUIStore();

// --- Lógica Store ---
const store = useDepartmentStore();
// Extraemos state reactivo
const { areas, currentTypes } = storeToRefs(store);

// Estado Local UI
const showCreate = ref(false);
const showEdit = ref(false);
const showTypes = ref(false);
const selectedArea = ref<Area | null>(null);

// Handlers
const openEdit = (area: Area) => {
  selectedArea.value = area;
  showEdit.value = true;
};

const openTypes = (area: Area) => {
  selectedArea.value = area;
  // Le decimos al store que cargue los tipos de ESTA área
  store.selectAreaForTypes(area.id);
  showTypes.value = true;
};

const handleCreateSubmit = async (data: any) => {
  await store.addArea(data);

  showCreate.value = false;
};

const handleEditSubmit = async (data: Partial<Area>) => {
  if (selectedArea.value) {
    await store.updateArea({ id: selectedArea.value.id, data });
    showEdit.value = false;
  }
};

const handleTypeAdd = (nombre: string) => {
  if (selectedArea.value) {
    store.addType({ areaId: selectedArea.value.id, nombre });
  }
};

const handleTypeToggle = async (payload: { id: string; activo: boolean }) => {
  await store.updateType({
    id: payload.id,
    activo: payload.activo,
  });
};
const handleTypeDelete = (id: string) => {
  store.deleteType(id);
};
</script>

<template>
  <main
    class="min-h-screen bg-base-200 p-6 md:p-10 font-sans text-base-content"
  >
    <div class="max-w-7xl mx-auto">
      <header
        class="flex flex-col md:flex-row justify-between items-end gap-4 mb-8"
      >
        <div>
          <h1 class="text-3xl font-bold">Área</h1>
          <p class="text-base-content/60 text-sm mt-1">
            Gestión de catálogo de Área y tipos de solicitud asociados.
          </p>
        </div>

        <button
          @click="showCreate = true"
          class="btn btn-primary shadow-lg gap-2 font-bold text-white"
          aria-label="Crear nuevo departamento"
        >
          <BaseIcon name="plus" class="size-10" />
          Nueva Área
        </button>
      </header>

      <DepartmentKPIs />

      <section
        aria-label="Listado de departamentos existentes"
        class="w-full relative"
      >
        <!-- <DepartmentCard
          v-for="area in areas"
          :key="area.id"
          :area="area"
          @edit="openEdit"
          @manage-types="openTypes"
        /> -->

        <transition name="fade" mode="out-in">
          <div
            v-if="uiStore.viewMode === 'grid'"
            :key="'grid-view'"
            class="w-full grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <DepartmentCard
              v-for="area in areas"
              :key="area.id"
              :area="area"
              @edit="openEdit"
              @manage-types="openTypes"
            />
          </div>

          <AreaTable
            v-else
            :key="'table-view'"
            :areas="areas"
            @edit="openEdit"
            @manage-types="openTypes"
          />
        </transition>
      </section>

      <CreateAreaModal
        :is-open="showCreate"
        :is-submitting="store.isCreatingArea"
        @close="showCreate = false"
        @submit="handleCreateSubmit"
      />
      <EditAreaModal
        :is-open="showEdit"
        :area-data="selectedArea"
        @close="showEdit = false"
        @submit="handleEditSubmit"
      />
      <ManageTypesModal
        :is-open="showTypes"
        :area-data="selectedArea"
        :types="currentTypes || []"
        @close="showTypes = false"
        @add="handleTypeAdd"
        @delete="handleTypeDelete"
        @toggle-status="handleTypeToggle"
      />
    </div>
  </main>
</template>
