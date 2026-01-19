<script setup lang="ts">
import { computed } from 'vue'
import type { Solicitud } from '@/types/solicitudes'
import BaseIcon from '@/components/BaseIcon.vue'

const props = defineProps<{
  solicitud: Solicitud
}>()

// --- 1. CONFIGURACIÓN DE PRIORIDAD (Tu código original) ---
const priorityConfig: Record<string, { border: string, badge: string, dot: string }> = {
  'Baja': { 
    border: 'border-l-emerald-500', 
    badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    dot: 'bg-emerald-500'
  },
  'Media': { 
    border: 'border-l-amber-500', 
    badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    dot: 'bg-amber-500'
  },
  'Alta': { 
    border: 'border-l-rose-500', 
    badge: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    dot: 'bg-rose-500'
  }
}

const getPriorityData = (prioridad: string) => {
  return priorityConfig[prioridad] || { 
    border: 'border-l-base-300', 
    badge: 'bg-base-200 text-base-content/70 border-base-300', 
    dot: 'bg-base-400'
  }
}

const getStatusClass = (estado: string) => {
  const map: Record<string, string> = {
    'Nueva': 'badge-ghost border-base-300 text-base-content/80',
    'En Proceso': 'badge-info text-info-content shadow-sm',
    'Resuelta': 'badge-success text-success-content shadow-sm',
    'Cerrada': 'bg-base-300 text-base-content/40 border-none',
    'Rechazada': 'badge-error text-error-content shadow-sm',
    'Vencida': 'badge-error text-white font-bold shadow-md' // Agregado por si acaso
  }
  return map[estado] || 'badge-ghost'
}

// --- 2. LÓGICA DE TIEMPO Y VENCIMIENTO (NUEVO) ---

// Detectar si ya es un estado final (donde no importa el vencimiento)
const esFinalizado = computed(() => 
  ['Cerrada', 'Resuelta', 'Rechazada'].includes(props.solicitud.estado)
)

const esVencida = computed(() => 
  props.solicitud.estado === 'Vencida'
)

// Función para calcular texto relativo ("En 2 días" o "Hace 5 horas")
const infoVencimiento = computed(() => {
  const fechaStr = props.solicitud.fechaVencimiento
if (!fechaStr) return { texto: 'No especificada', urgente: false, pasado: false }

  // Si ya terminó el ticket, mostramos la fecha estática
  if (esFinalizado.value) {
    return { texto: fechaStr.split(' ')[0], urgente: false, pasado: false } // Solo la fecha
  }

  try {
    // A. Parseo manual del string "14/01/2026 03:35 p. m."
    let clean = fechaStr.toLowerCase().replace(/\./g, "").replace(/\s+/g, " ").trim()
    
    const [fechaPart, horaPart] = clean.split(" ") 
    if(!fechaPart || !horaPart) return { texto: fechaStr, urgente: false, pasado: false }

    const [dia, mes, anio] = fechaPart.split("/")
    const [hora, min] = horaPart.split(":") 
    
    let horaNum = parseInt(hora)
    const esPM = clean.includes("pm") || clean.includes("p m")
    
    if (esPM && horaNum < 12) horaNum += 12
    if (!esPM && horaNum === 12) horaNum = 0 

    const fechaObj = new Date(parseInt(anio), parseInt(mes) - 1, parseInt(dia), horaNum, parseInt(min))
    const ahora = new Date()

    // B. Cálculo de diferencia
    const diffMs = fechaObj.getTime() - ahora.getTime() // Positivo = Futuro, Negativo = Pasado
    const diffMin = Math.floor(Math.abs(diffMs) / 60000)
    const diffHoras = Math.floor(diffMin / 60)
    const diffDias = Math.floor(diffHoras / 24)

    const esPasado = diffMs < 0

    // C. Construcción del texto
    let texto = ''
    if (diffMin < 60) texto = `${diffMin} min`
    else if (diffHoras < 24) texto = `${diffHoras} h`
    else texto = `${diffDias} días`

    texto = esPasado ? `Hace ${texto}` : `En ${texto}`

    // Determinar urgencia (menos de 24h y en el futuro)
    const urgente = !esPasado && diffHoras < 24

    return { texto, urgente, pasado: esPasado }

  } catch (e) {
    return { texto: fechaStr, urgente: false, pasado: false }
  }
})

// Clases dinámicas para el badge de vencimiento
const claseVencimiento = computed(() => {
  if (!props.solicitud.fechaVencimiento) return 'text-base-content/50 bg-base-200/50 border-base-200'
  if (esFinalizado.value) return 'text-base-content/40 bg-base-200 border-transparent' // Gris
  if (esVencida.value || infoVencimiento.value.pasado) return 'text-red-600 bg-red-100 border-red-200 font-bold' // Rojo
  if (infoVencimiento.value.urgente) return 'text-amber-600 bg-amber-100 border-amber-200 font-bold' // Naranja
  return 'text-blue-600 bg-blue-50 border-blue-200' // Azul normal
})

</script>

<template>
  <article 
    class="card bg-base-100 shadow-sm hover:shadow-md transition-all duration-200 border border-base-200 h-full border-l-[6px] cursor-pointer group"
    :class="getPriorityData(solicitud.prioridad).border"
    @click="$emit('click')"
  >
    <div class="card-body p-5">
      
      <header class="flex justify-between items-start mb-3">
        <div class="flex items-center gap-2">
          <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border bg-base-200/50 text-base-content/70 border-base-300">
            {{ solicitud.tipo }}
          </span>
          <span class="text-[12px] text-base-content font-mono italic">#{{  solicitud.id }}</span>
        </div>
        
        <div class="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase"
          :class="getPriorityData(solicitud.prioridad).badge"
        >
          <span class="size-1.5 rounded-full" :class="getPriorityData(solicitud.prioridad).dot"></span>
          {{ solicitud.prioridad }}
        </div>
      </header>

      <div class="mb-4">
        <h3 class="font-bold text-base text-base-content leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-2">
          {{ solicitud.titulo  }}
        </h3>
        <p class="text-xs text-base-content/60 line-clamp-2 leading-relaxed">
          {{ solicitud.descripcion }}
        </p>
      </div>

      <footer class="mt-auto pt-3 border-t border-base-200/50">
        <div class="flex justify-between items-center mb-2">
          
          <div class="flex flex-col gap-0.5">
             <div class="flex items-center gap-1.5 text-[10px] font-bold text-base-content">
              <BaseIcon name="user" class="size-5 opacity-50" />
              {{ solicitud.solicitante }}
            </div>
            
            <div class="flex items-center gap-1.5 text-[10px] font-bold text-base-content/70">
              <BaseIcon name="calendar" class="size-5 opacity-50" />
              {{ solicitud.fecha }}
            </div>
          </div>
          
          <div class="badge badge-sm font-bold" :class="getStatusClass(solicitud.estado)">
            {{ solicitud.estado }}
          </div>
        </div>

      <div class="flex items-center justify-between mt-2 gap-2">
    
    <div class="flex items-center gap-1.5 px-2 py-1 rounded text-[10px] border transition-colors w-fit"
         :class="claseVencimiento">
        
        <BaseIcon 
            v-if="props.solicitud.fechaVencimiento && (esVencida || infoVencimiento.pasado)" 
            name="clock" 
            class="size-3" 
        />
        <BaseIcon v-else name="clock" class="size-5" />
        
        <span class="uppercase tracking-wide font-medium">
            {{ esVencida ? '¡Vencida!' : (esFinalizado ? 'Finalizada' : infoVencimiento.texto) }}
        </span>
    </div>

    <div v-if="solicitud.responsable" 
        class="flex items-center gap-1 text-[10px] text-base-content/60 italic max-w-[120px]"
        title="Gestor asignado">
        <span class="truncate">{{ solicitud.responsable   }}</span>
        <BaseIcon name="user" class="size-5 shrink-0" />
    </div>
</div>
      </footer>
    </div>
  </article>
</template>