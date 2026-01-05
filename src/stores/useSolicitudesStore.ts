import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useQuery } from '@pinia/colada' 
import ticketService from '@/services/ticketService'
import catalogsService from '@/services/catalogoService'
import type { Solicitud, TabType } from '@/types/solicitudes'

// --- MAPEOS (Frontend String <-> Backend Int) ---
// Estos objetos traducen lo que selecciona el usuario a lo que entiende C#

const EstadoMap: Record<string, number | undefined> = {
  'todas': undefined,
  'nueva': 0,      // Enum.Nueva
  'proceso': 1,    // Enum.EnProceso
  'resuelta': 2,   // Enum.Resuelta
  'cerrada': 3,    // Enum.Cerrada
  'rechazada': 4   // Enum.Rechazada
}

const PrioridadMap: Record<string, number | undefined> = {
  'todas': undefined,
  'Baja': 0,
  'Media': 1,
  'Alta': 2
}

const formatearFecha = (fechaRaw: string) => {
  if (!fechaRaw) return 'Sin fecha';
  
  // 1. Intentamos parsear directo (ISO standard)
  const fecha = new Date(fechaRaw);
  
  // 2. Verificamos si es válida
  if (!isNaN(fecha.getTime())) {
    return fecha.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  }

  // 3. (Opcional) Si tu backend manda "dd/MM/yyyy", lo parseamos manual
  // Ej: "15/12/2024 10:00:00" -> split
  try {
      const parteFecha = fechaRaw.split(' ')[0]; // Tomamos solo la parte de fecha
      const [dia, mes, anio] = parteFecha.split('/');
      // Ojo: mes - 1 porque en JS enero es 0
      const fechaManual = new Date(Number(anio), Number(mes) - 1, Number(dia));
      if (!isNaN(fechaManual.getTime())) {
          return fechaManual.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
      }
  } catch (e) {
      console.error("Error parseando fecha manual:", fechaRaw);
  }

  return 'Fecha inválida'; // Fallback final
};

export const useSolicitudesStore = defineStore('solicitudes', () => {
  
  // --- 1. ESTADO (Filtros Reactivos) ---
  const searchTerm = ref('')
  const typeFilter = ref('todos') // Aquí guardamos el AreaId (UUID) o 'todos'
  const priorityFilter = ref('todas')
  const activeTab = ref<TabType>('todas')
  
  // Lista de áreas para el select (se carga una vez)
  const areasList = ref<{ label: string; value: string }[]>([])

  // --- 2. ACCIONES ---
  const fetchAreas = async () => {
    if (areasList.value.length > 0) return; // Evitar recargar si ya existen
    try {
        const areas = await catalogsService.getAreas();
        areasList.value = areas.map(a => ({ label: a.nombre, value: a.id }));
    } catch (e) {
        console.error("Error cargando áreas", e);
    }
  }

  // --- 3. QUERY PRINCIPAL (Lista de Tickets) ---
  // Se ejecuta cada vez que cambian los filtros (activeTab, searchTerm, etc.)
  const { data: rawData, isLoading, refetch } = useQuery({
    key: () => ['tickets-list', { 
        search: searchTerm.value, 
        area: typeFilter.value, 
        priority: priorityFilter.value,
        status: activeTab.value
    }],
    query: async () => {
      const params = {
        Page: 1,
        PageSize: 50, // Ajusta según necesites
        TextoBusqueda: searchTerm.value || undefined,
        AreaId: typeFilter.value !== 'todos' ? typeFilter.value : undefined,
        Prioridad: PrioridadMap[priorityFilter.value],
        Estado: EstadoMap[activeTab.value],
      };
      return await ticketService.getAll(params);
    },
    staleTime: 1000 * 60 * 5, // Cache de 5 minutos
  })

  // --- 4. QUERY SECUNDARIA (Resumen/Contadores) ---
  // Se ejecuta en paralelo para llenar los badges de las pestañas
  const { data: summaryData } = useQuery({
    key: ['tickets-summary'], 
    query: () => ticketService.getSummary(),
    staleTime: 1000 * 60 * 2, // Se refresca cada 2 minutos
  })

  // --- 5. COMPUTED: Lista Visual (Transformación) ---
  const filteredSolicitudes = computed<Solicitud[]>(() => {
    const items = rawData.value?.items || [];
    
    // Transformamos el objeto complejo del backend a la tarjeta simple del frontend
    return items.map((t: any) => ({
      uuid: t.id,
      id: t.numero, // Ej: "TI-2026-001"
      titulo: t.asunto,
      descripcion: t.descripcion,
      prioridad: ['Baja', 'Media', 'Alta'][t.prioridad] || 'Media',
      tipo: t.area?.nombre || 'General', 
      estado: ['Nueva', 'En Proceso', 'Resuelta', 'Cerrada', 'Rechazada'][t.estado] || 'Nueva',
     fecha: formatearFecha(t.fechaCreacion),
      solicitante: t.solicitante?.nombre || 'Desconocido',
      responsable: t.gestor?.nombre || null
    }));
  });

  // --- 6. COMPUTED: Contadores (Badges) ---
  const counts = computed(() => {
    // summaryData viene como { "0": 5, "1": 3 ... }
    const s = summaryData.value || {};
    
    // Sumamos todos los valores del diccionario para obtener el total global real
    const totalGlobal = Object.values(s).reduce((a, b) => a + (b as number), 0);
    
    // El total de la lista actual (paginada)
    const totalLista = rawData.value?.total || 0;

    return {
      // Si estamos en la tab "todas", mostramos cuántos hay en la lista filtrada.
      // Si no, mostramos la suma total del resumen.
      todas: activeTab.value === 'todas' ? totalLista : totalGlobal,

      // Mapeo: Backend Int (Keys del objeto) -> Frontend String (Keys de este return)
      nueva:     s['0'] || 0,
      proceso:   s['1'] || 0,
      resuelta:  s['2'] || 0,
      cerrada:   s['3'] || 0,
      rechazada: s['4'] || 0
    }
  })

  // Acción para resetear todo si sales de la pantalla (opcional)
  const resetFilters = () => {
      searchTerm.value = ''
      typeFilter.value = 'todos'
      priorityFilter.value = 'todas'
      activeTab.value = 'todas'
  }

  return {
    // Estado
    searchTerm,
    typeFilter,
    priorityFilter,
    activeTab,
    areasList,
    
    // Acciones
    fetchAreas,
    resetFilters,
    refetch,

    // Datos procesados
    filteredSolicitudes,
    isLoading: computed(() => isLoading.value), // Carga inicial fuerte
    // Carga de fondo (spinner pequeño)
    counts // Los numeritos mágicos
  }
})