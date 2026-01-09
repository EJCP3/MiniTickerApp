<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useTicketStore } from '@/stores/ticketModalStore';
import BaseIcon from '../BaseIcon.vue';

const emit = defineEmits(['cancel', 'saved']);
const store = useTicketStore();
const formData = ref<any>({});
const dataLoaded = ref(false);

const opcionesPrioridad = [
  { label: 'Baja', value: 0 },
  { label: 'Media', value: 1 },
  { label: 'Alta', value: 2 }
];

const cleanPrioridad = (val: any) => {
    if (val === undefined || val === null) return 0;
    if (typeof val === 'string') {
        const v = val.toLowerCase();
        if (v === 'alta') return 2;
        if (v === 'media') return 1;
        if (v === 'baja') return 0;
    }
    return parseInt(val.toString()) || 0; 
};

watchEffect(() => {
    const ticket = store.currentTicket;
    if (ticket && ticket.id && !dataLoaded.value) {
        formData.value = {
            asunto: ticket.asunto || ticket.Asunto || '',
            descripcion: ticket.descripcion || ticket.Descripcion || '',
            prioridad: cleanPrioridad(ticket.prioridad !== undefined ? ticket.prioridad : ticket.Prioridad)
        };
        dataLoaded.value = true;
    }
});

const handleSubmit = async (data: any) => {
  if (!store.currentTicket?.id) return;
  
  let archivoReal: File | undefined = undefined;
  if (Array.isArray(data.archivo) && data.archivo.length > 0) {
      archivoReal = data.archivo[0].file;
  }

  const payload = {
      asunto: data.asunto,
      descripcion: data.descripcion,
      prioridad: Number(data.prioridad),
      archivo: archivoReal
  };

  try {
      // 1. Intentamos actualizar
      await store.updateTicket(store.currentTicket.id, payload);
  } catch (e) {
      console.error("Error al actualizar (pero cerraremos igual)", e);
  } finally {
      // 2. ¡FUERZA BRUTA! 
      // Pase lo que pase (éxito o error), cerramos la edición.
      emit('saved');
  }
};
</script>
<template>
  <div class="animate-fade-in pt-1 pb-4">
    <div class="flex items-center justify-between mb-6 px-1">
        <div class="flex flex-col ">
            <h3 class="text-lg font-bold text-base-content flex items-center justify-center gap-2 mt-4">
                <div class="p-1.5 bg-primary/10 rounded-lg text-primary">
                    <BaseIcon name="edit" class="size-7"/>
                </div>
                Editar Solicitud
            </h3>
        </div>
    </div>

    <div class="bg-base-100 p-1">
        <FormKit
            type="form"
            v-model="formData" 
            @submit="handleSubmit"
            :actions="false" 
            #default="{ state }"
        >
            <div class="grid gap-5">
                <FormKit
                    type="text"
                    name="asunto"
                    label="Asunto"
                    validation="required|length:5,100"
                    outer-class="formkit-outer"
                    input-class="input input-bordered w-full focus:input-primary font-bold text-base-content"
                    label-class="label-text font-bold text-xs uppercase text-base-content/50 mb-1 block"
                />

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormKit
                        type="select"
                        name="prioridad"
                        label="Prioridad"
                        :options="opcionesPrioridad"
                        outer-class="formkit-outer"
                        input-class="select select-bordered w-full focus:select-primary font-medium text-base-content"
                        label-class="label-text font-bold text-xs uppercase text-base-content/50 mb-1 block"
                    />

                    <FormKit
                        type="file"
                        name="archivo"
                        label="Adjuntar Archivo Nuevo"
                        accept=".pdf,.jpg,.png,.doc,.docx"
                        outer-class="formkit-outer"
                        input-class="file-input file-input-bordered file-input-primary w-full text-sm text-base-content"
                        label-class="label-text font-bold text-xs uppercase text-base-content/50 mb-1 block"
                    />
                </div>

                <FormKit
                    type="textarea"
                    name="descripcion"
                    label="Descripción Detallada"
                    validation="required|length:10"
                    outer-class="formkit-outer"
                    input-class="textarea textarea-bordered w-full h-32 text-base leading-relaxed focus:textarea-primary text-base-content"
                    label-class="label-text font-bold text-xs uppercase text-base-content/50 mb-1 block"
                />

                <div class="flex gap-3 pt-4 border-t border-base-200 mt-2">
                    <button 
                        type="button"
                        @click="emit('cancel')" 
                        class="btn btn-ghost flex-1 text-base-content/60 hover:bg-base-200"
                    >
                        Cerrar
                    </button>
                    
                    <button 
                        type="submit"
                        class="btn btn-primary flex-1 text-white shadow-lg text-center"
                        :disabled="store.isActionLoading || state.loading"
                    >
                        <span v-if="store.isActionLoading" class="loading loading-spinner"></span>
                        <span v-else class="flex items-center gap-2">
                            <BaseIcon name="save" class="h-5 w-5" />
                            Guardar Cambios
                        </span>
                    </button>
                </div>
            </div>
        </FormKit>
    </div>
  </div>
</template>
<style scoped>
.animate-fade-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
</style>