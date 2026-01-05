<script setup lang="ts">
import { computed, ref } from 'vue';
import { useTicketStore } from '@/stores/ticketModalStore';
import BaseIcon from '../BaseIcon.vue';

const store = useTicketStore();
const ordenAscendente = ref(false); // false = Más recientes arriba

// --- 1. DICCIONARIO DE ÍCONOS ---
const getIcono = (tipo: number) => {
  switch (tipo) {
    case 0: return { name: 'plus', color: 'text-green-600', bg: 'bg-green-100 border-green-200' };
    case 1: return { name: 'refresh', color: 'text-blue-600', bg: 'bg-blue-100 border-blue-200' };
    case 2: return { name: 'chat', color: 'text-primary', bg: 'bg-primary/10 border-primary/20' };
    case 3: return { name: 'userShield', color: 'text-orange-600', bg: 'bg-orange-100 border-orange-200' };
    default: return { name: 'bell', color: 'text-gray-400', bg: 'bg-gray-100 border-gray-200' };
  }
};

// --- HELPER LOCAL PARA PARSEAR FECHA (Solo para ordenar) ---
const parseFechaSort = (fechaStr: string) => {
    try {
        if (!fechaStr) return 0;
        // Limpiamos "p. m." y espacios
        let clean = fechaStr.toLowerCase().replace(/\./g, '').replace(/\u00A0/g, ' ').trim();
        const parts = clean.split(' ');
        const dateParts = parts[0].split('/'); // [04, 01, 2026]
        const timeParts = parts[1].split(':'); // [08, 47]
        const isPM = clean.includes('p');

        let hours = parseInt(timeParts[0]);
        if (isPM && hours < 12) hours += 12;
        if (!isPM && hours === 12) hours = 0;

        // Retornamos timestamp numérico para restar fácil
        return new Date(parseInt(dateParts[2]), parseInt(dateParts[1])-1, parseInt(dateParts[0]), hours, parseInt(timeParts[1])).getTime();
    } catch (e) {
        return 0;
    }
};

// --- 2. ORDENAMIENTO CON DESEMPATE ---
const historialOrdenado = computed(() => {
  const lista = store.currentTicket?.historial || [];
  const copia = [...lista];

  return copia.sort((a, b) => {
      // A. Comparar Fechas
      const fechaA = parseFechaSort(a.fecha);
      const fechaB = parseFechaSort(b.fecha);
      const diff = fechaA - fechaB;

      // Si las fechas son distintas, ordenamos por fecha
      if (diff !== 0) {
          return ordenAscendente.value ? diff : -diff;
      }

      // B. DESEMPATE (Si la fecha es IDÉNTICA)
      // Definimos "Pesos": Qué evento consideramos que "pasa después" lógicamente.
      // 0 (Crear) < 2 (Comentar) < 3 (Asignar) < 1 (Cambiar Estado)
      const pesos: Record<number, number> = { 
          0: 0, // Creación (Siempre primero)
          2: 1, // Comentario (Segundo)
          3: 2, // Asignación (Tercero)
          1: 3  // Cambio Estado (Siempre el último/más reciente si coincide la hora)
      };

      const pesoA = pesos[a.tipoEvento] || 1;
      const pesoB = pesos[b.tipoEvento] || 1;

      // Aplicamos el ordenamiento por peso
      return ordenAscendente.value ? (pesoA - pesoB) : (pesoB - pesoA);
  });
});

const toggleOrden = () => {
  ordenAscendente.value = !ordenAscendente.value;
};
</script>

<template>
  <div class="animate-fade-in pt-2">
    
    <div class="flex items-center justify-between pb-4 border-b border-base-200 mb-6 pl-2">
        <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <BaseIcon name="clock" class="h-4 w-4"/> Línea de Tiempo
        </h3>
        
        <button 
            @click="toggleOrden"
            class="btn btn-xs btn-ghost gap-2 text-gray-500 hover:text-primary transition-colors"
        >
            <span class="text-[10px] font-semibold">
                {{ ordenAscendente ? 'Más Antiguos' : 'Más Recientes' }}
            </span>
            <BaseIcon 
                :name="ordenAscendente ? 'arrowUp' : 'arrowDown'" 
                class="h-3 w-3" 
            />
        </button>
    </div>

    <div class="relative space-y-8 pl-2">
      <div class="absolute left-5 top-2 bottom-6 w-0.5 bg-base-200" v-if="historialOrdenado.length > 0"></div>

      <div v-for="(item, index) in historialOrdenado" :key="index" class="relative pl-12 group">
        
        <div 
            class="absolute left-0 top-0 w-10 h-10 border-2 rounded-full flex items-center justify-center z-10 shadow-sm transition-transform group-hover:scale-110"
            :class="getIcono(item.tipoEvento || 0).bg"
        >
           <BaseIcon 
             :name="getIcono(item.tipoEvento || 0).name" 
             class="w-5 h-5" 
             :class="getIcono(item.tipoEvento || 0).color"
           />
        </div>

        <div class="flex flex-col gap-1">
            <div class="flex justify-between items-start">
                <h4 class="font-bold text-sm text-base-content leading-tight">
                    {{ item.titulo }}
                </h4>
                <span class="text-xs text-gray-400 font-medium whitespace-nowrap ml-4">
                    {{ store.formatBackendDate(item.fecha) }}
                </span>
            </div>

            <div class="text-xs font-bold text-primary opacity-80 mb-1">
                {{ item.subtitulo }}
            </div>

            <div class="bg-base-100 border border-base-200 p-3 rounded-xl shadow-sm group-hover:shadow-md transition-shadow">
                <p class="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {{ item.descripcion }}
                </p>
            </div>
        </div>
      </div>
    </div>

    <div v-if="!historialOrdenado || historialOrdenado.length === 0" class="flex flex-col items-center justify-center py-12 opacity-50">
      <p class="text-gray-500 font-medium">No hay historial disponible</p>
    </div>

  </div>
</template>

<style scoped>
.animate-fade-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>


<!-- <script setup lang="ts">
import { computed, ref } from 'vue';
import { useTicketFormat } from '@/composables/useTicketFormat';
import type { HistorialItem } from '@/types/modal';
import BaseIcon from '../BaseIcon.vue';

const props = defineProps<{
  historial: HistorialItem[];
}>();

const { formatearFecha } = useTicketFormat();

const parseFechaEsp = (valor: string | Date) => {
  // 1. Validación de nulos
  if (!valor) return new Date(0); 

  // 2. CORRECCIÓN PRINCIPAL:
  // Si el valor YA es un objeto Date real, lo devolvemos directamente.
  // Esto evita el error de .includes()
  if (valor instanceof Date) return valor;

  // 3. Aseguramos que sea string para las siguientes comprobaciones
  const fechaStr = valor.toString();

  // 4. Si es formato ISO (tiene guiones "2025-01-01"), JS lo entiende nativo
  if (fechaStr.includes('-')) return new Date(fechaStr);

  try {
    // 5. Lógica manual para formato español "dd/MM/yyyy hh:mm tt"
    const [fechaPart, horaPart, ampm] = fechaStr.split(' ');
    
    // Validación extra por si el split falla (string vacío o formato raro)
    if (!fechaPart || !horaPart) return new Date(fechaStr);

    const [dia, mes, anio] = fechaPart.split('/');
    let [horas, minutos] = horaPart.split(':');

    let horaNum = parseInt(horas);
    if (ampm === 'PM' && horaNum < 12) horaNum += 12;
    if (ampm === 'AM' && horaNum === 12) horaNum = 0;

    // Mes - 1 porque en JS enero es 0
    return new Date(parseInt(anio), parseInt(mes) - 1, parseInt(dia), horaNum, parseInt(minutos));
  } catch (e) {
    console.warn("Error parseando fecha manual:", fechaStr);
    return new Date(); 
  }
};


const ordenAscendente = ref(false);

// const historialOrdenado = computed(() => {
//   if (!props.historial) return [];
  
//   return [...props.historial].sort((a, b) => {
//     const fechaA = new Date(a.fecha).getTime();
//     const fechaB = new Date(b.fecha).getTime();
    
//     // Si es ascendente: (A - B) -> Antiguos arriba
//     // Si es descendente: (B - A) -> Recientes arriba
//     return ordenAscendente.value ? fechaA - fechaB : fechaB - fechaA;
//   });
// });

const historialOrdenado = computed(() => {
  if (!props.historial) return [];
  
  return [...props.historial].sort((a, b) => {
    const fechaA = parseFechaEsp(a.fecha).getTime();
    const fechaB = parseFechaEsp(b.fecha).getTime();
    
    // Si ordenAscendente es false (default), pone lo más nuevo (mayor timestamp) primero
    return ordenAscendente.value ? fechaA - fechaB : fechaB - fechaA;
  });
});

const toggleOrden = () => {
  ordenAscendente.value = !ordenAscendente.value;
};
</script>

<template>
  <div class="animate-fade-in pt-2">
    <div class="relative space-y-6 pl-2">


      <div class="flex items-center justify-between pb-2 border-b border-base-200">
        <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Línea de Tiempo
        </h3>
        
        <button 
            @click="toggleOrden"
            class="btn btn-xs btn-ghost gap-2 text-gray-500 hover:text-primary transition-colors"
            :title="ordenAscendente ? 'Cambiar a más recientes' : 'Cambiar a más antiguos'"
        >
            <span class="text-[10px] font-semibold">
                {{ ordenAscendente ? 'Más Antiguos' : 'Más Recientes' }}
            </span>
            <BaseIcon 
                :name="ordenAscendente ? 'arrowUp' : 'arrowDown'" 
                class="h-3 w-3" 
            />
        </button>
    </div>


      <div class="absolute left-4.75 top-2 bottom-4 w-0.5 bg-base-200" v-if="historialOrdenado?.length"></div>

      <div v-for="(item, index) in historialOrdenado" :key="index" class="relative pl-10 group">
        <div class="absolute left-0 top-0 w-10 h-10 bg-base-100 border-2 border-primary/20 rounded-full flex items-center justify-center z-10 shadow-sm group-hover:border-primary group-hover:scale-110 transition-all">
          <BaseIcon name="chat" class="w-5 h-5 text-primary" v-if="(item.titulo || '').includes('Comentario')" />
          <BaseIcon name="refresh" class="w-5 h-5 text-blue-500" v-else-if="(item.titulo || '').includes('Estado') || (item.titulo || '').includes('Asignado')" />
          <BaseIcon name="plus" class="w-5 h-5 text-green-500" v-else-if="(item.titulo || '').includes('Creada')" />
          <BaseIcon name="bell" class="w-5 h-5 text-gray-400" v-else />
        </div>

        <div class="bg-base-100 border border-base-200 rounded-xl p-4 shadow-sm group-hover:shadow-md transition-shadow">
          <div class="flex justify-between items-start mb-1">
            <h4 class="font-bold text-sm text-base-content">{{ item.titulo }}</h4>
            <span class="text-xs text-gray-400 font-medium whitespace-nowrap">{{ formatearFecha(item.fecha) }}</span>
          </div>
          <div class="text-xs font-semibold text-primary mb-2">{{ item.usuario }}</div>
          <p class="text-sm text-gray-600 leading-relaxed">{{ item.descripcion }}</p>
        </div>
      </div>
    </div>

    <div v-if="!historial || historial.length === 0" class="flex flex-col items-center justify-center py-12 opacity-50">
      <div class="w-16 h-16 bg-base-200 rounded-full flex items-center justify-center mb-3">
        <BaseIcon name="history" class="h-8 w-8 text-gray-400" />
      </div>
      <p class="text-gray-500 font-medium">No hay historial disponible</p>
    </div>
  </div>
</template> -->