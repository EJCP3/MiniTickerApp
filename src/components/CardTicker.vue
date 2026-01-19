<script setup>
import { computed } from "vue";
import BaseIcon from "./BaseIcon.vue";

const props = defineProps({
  numero: String,
  type: String,
  priority: String,
  title: String,
  description: String,
  user: String,
  date: String,
  fechaVencimiento: String, 
  status: String,
  responsible: String,
});

defineEmits(["click"]);

// 1. Detectamos si está vencida por el estado
const esVencido = computed(() => props.status?.toLowerCase() === "vencida");
const esFinalizado = computed(() => ["cerrada", "resuelta", "rechazada"].includes(props.status?.toLowerCase()));

// 2. FUNCIÓN MÁGICA: Convierte el texto "14/01/2026..." a "Hace 2 horas"
const textoRelativo = computed(() => {
  if (!props.fechaVencimiento) return "Sin fecha";
  
  // Si NO está vencida, mostramos la fecha normal
  if (!esVencido.value) return props.fechaVencimiento;

  try {
    // A. LIMPIEZA: "14/01/2026 03:35 p. m." -> "14/01/2026 03:35 pm"
    let clean = props.fechaVencimiento.toLowerCase().replace(/\./g, "").replace(/\s+/g, " ").trim();
    
    // B. PARSEO MANUAL (Separamos día, mes, año, hora)
    const [fechaPart, horaPart] = clean.split(" "); // ["14/01/2026", "03:35"]
    const [dia, mes, anio] = fechaPart.split("/");
    const [hora, min] = horaPart.split(":"); // Falta manejar el am/pm
    
    let horaNum = parseInt(hora);
    const esPM = clean.includes("pm") || clean.includes("p m");
    
    // Ajuste de 12h a 24h
    if (esPM && horaNum < 12) horaNum += 12;
    if (!esPM && horaNum === 12) horaNum = 0; // 12 am es 0

    // Creamos la fecha real en JS (Mes es index 0-11)
    const fechaVencimientoObj = new Date(anio, parseInt(mes) - 1, dia, horaNum, parseInt(min));
    const ahora = new Date();

    // C. CÁLCULO DE TIEMPO
    const diffMs = ahora - fechaVencimientoObj; // Diferencia en milisegundos
    const diffMin = Math.floor(diffMs / 60000);
    const diffHoras = Math.floor(diffMin / 60);
    const diffDias = Math.floor(diffHoras / 24);

    // D. RETORNO DE TEXTO AMIGABLE
    if (diffMin < 60) return `Hace ${diffMin} min`;
    if (diffHoras < 24) return `Hace ${diffHoras} horas`;
    if (diffDias === 1) return `Hace 1 día`;
    return `Hace ${diffDias} días`;

  } catch (e) {
    console.error("Error calculando fecha relativa", e);
    return props.fechaVencimiento; // Si falla, mostramos la original
  }
});

// --- ESTILOS ---
const clasesVencimiento = computed(() => {
  if (!props.fechaVencimiento) return "text-gray-400 bg-gray-50 border-transparent";
  if (esVencido.value) return "text-red-700 bg-red-100 border border-red-200 font-bold shadow-sm";
  if (esFinalizado.value) return "text-green-700 bg-green-50 border border-green-200 opacity-75";
  return "text-blue-600 bg-blue-50 border border-blue-100";
});

const claseBorde = computed(() => {
  if (esVencido.value) return "bg-red-500";
  if (esFinalizado.value) return "bg-green-500";
  return "bg-gray-200";
});
</script>

<template>
  <article
    @click="$emit('click')"
    class="bg-white p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] max-w-sm w-full relative overflow-hidden font-sans cursor-pointer hover:bg-gray-50 transition-colors group"
  >
    <div class="absolute top-0 left-0 w-2 h-full transition-colors duration-300" :class="claseBorde" aria-hidden="true"></div>

    <header class="flex items-center justify-between mb-4 pl-4">
      <div class="flex items-center gap-3">
        <span class="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full uppercase tracking-wider">
          {{ type }}
        </span>
        <span class="text-gray-400 text-sm font-medium">{{ numero }}</span>
      </div>
      <span class="px-3 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full uppercase tracking-wider">
        {{ priority }}
      </span>
    </header>

    <h3 class="text-xl font-bold text-gray-800 mb-2 pl-4 group-hover:text-primary transition-colors">
      {{ title }}
    </h3>
    <p class="text-gray-500 text-sm leading-relaxed mb-6 pl-4 line-clamp-3">
      {{ description }}
    </p>

    <footer class="flex items-center justify-between mb-6 pl-4">
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2 text-gray-600 text-sm font-medium">
          <BaseIcon name="user" class="h-5 w-5 text-gray-400" />
          <span>{{ user }}</span>
        </div>
        <div class="flex items-center gap-2 text-gray-400 text-xs">
          <BaseIcon name="clock" class="h-5 w-5" />
          <time>{{ date }}</time>
        </div>

        <div 
            class="flex items-center gap-2 text-xs px-2 py-1.5 rounded-md w-fit transition-all duration-300"
            :class="clasesVencimiento"
        >
          <BaseIcon :name="esVencido ? 'alert' : 'calendar'" class="h-4 w-4" />
          
          <div class="flex flex-col leading-none">
             <span v-if="esVencido" class="block font-extrabold text-[10px] uppercase mb-0.5 animate-pulse">
                ¡VENCIDA!
             </span>
             
             <time class="font-medium whitespace-nowrap">
                {{ textoRelativo }}
             </time>
          </div>
        </div> 

      </div>

      <span class="px-4 py-1.5 bg-blue-100 text-blue-600 text-sm font-bold rounded-full self-end">
        {{ status }}
      </span>
    </footer>

    <div class="bg-gray-50 p-4 rounded-xl flex items-center gap-2 text-sm pl-6 border border-gray-100">
      <span class="font-bold text-gray-400 uppercase text-xs tracking-wider">Responsable:</span>
      <span class="font-bold text-gray-700">{{ responsible || "N/A" }}</span>
    </div>
  </article>
</template>