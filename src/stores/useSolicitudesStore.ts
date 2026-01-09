import { defineStore } from "pinia";
import { ref, computed, watch, onMounted } from "vue";
import { useQuery } from "@pinia/colada";
import ticketService from "@/services/ticketService";
import catalogsService from "@/services/catalogoService";
import { useAuthStore } from "./authStore";
import type { Solicitud, TabType } from "@/types/solicitudes";

const EstadoMap: Record<string, number | undefined> = {
  todas: undefined,
  nueva: 0,
  proceso: 1,
  resuelta: 2,
  cerrada: 3,
  rechazada: 4,
};

const PrioridadMap: Record<string, number | undefined> = {
  todas: undefined,
  Baja: 0,
  Media: 1,
  Alta: 2,
};




const formatearFecha = (fechaStr: any) => {
  if (!fechaStr) return "---";
  if (typeof fechaStr === "string" && fechaStr.includes("/")) {
    return fechaStr.split(" ")[0];
  }
  const fechaObj = new Date(fechaStr);
  if (!isNaN(fechaObj.getTime())) {
    return fechaObj.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }
  return fechaStr;
};

export const useSolicitudesStore = defineStore("solicitudes", () => {
  const authStore = useAuthStore();


  const hasGestorFilter = ref("todos"); // "todos", "con", "sin"
  const currentPage = ref(1);
  const pageSize = ref(12); // Ajustado para Grid de 3 columnas
  const areasList = ref<{ label: string; value: string }[]>([]);
  const searchTerm = ref("");
  const typeFilter = ref("todos");
  const priorityFilter = ref("todas");
  const activeTab = ref<TabType>("todas");

  const fetchAreas = async () => {
   try {
    const areas = await catalogsService.getAreas(false);
    const user = authStore.user; // Datos frescos del usuario

    areasList.value = areas
      .filter((a) => user?.rol !== "Gestor" || a.id === user?.areaId)
      .map((a) => ({
        label: a.nombre,
        value: a.id,
      }));
  } catch (e) {
    console.error(e);
  }
  };

  const {
    data: rawData,
    isLoading,
    refetch,
  } = useQuery({
    key: () => [
      "tickets-list",
      {
        userId: authStore.user?.id,
        areaId: authStore.user?.areaId,
        search: searchTerm.value,
        area: typeFilter.value,
        priority: priorityFilter.value,
        status: activeTab.value,
        gestor: hasGestorFilter.value, // Nueva dependencia
        page: currentPage.value       // Nueva dependencia
      },
    ],
   query: async () => {
      const miRol = authStore.user?.rol;
      const params = {
        Page: currentPage.value,
        PageSize: pageSize.value,
        TextoBusqueda: searchTerm.value || undefined,
        Prioridad: PrioridadMap[priorityFilter.value],
        Estado: EstadoMap[activeTab.value],
        AreaId: miRol === "Gestor" ? authStore.user?.areaId : (typeFilter.value !== "todos" ? typeFilter.value : undefined),
        UsuarioId: miRol === "Solicitante" ? authStore.user?.id : undefined,
        // Nuevo: Lógica para filtrar por asignación
        TieneGestor: hasGestorFilter.value === "todos" ? undefined : (hasGestorFilter.value === "con")
      };
      return await ticketService.getAll(params);
    },
  });

 const { data: summaryData, refetch: refetchSummary } = useQuery({
  key: () => [
    "tickets-summary", 
    authStore.user?.id, 
    authStore.user?.areaId,
    // ✅ Agregamos estas dependencias para que el conteo se actualice al filtrar
    searchTerm.value, 
    typeFilter.value, 
    priorityFilter.value, 
    hasGestorFilter.value 
  ],
  query: () => {
    const miRol = authStore.user?.rol;
    
    // ✅ Construimos el objeto de parámetros igual que en el listado de tickets
    const params = {
      TextoBusqueda: searchTerm.value || undefined,
      Prioridad: PrioridadMap[priorityFilter.value],
      AreaId: miRol === "Gestor" ? authStore.user?.areaId : (typeFilter.value !== "todos" ? typeFilter.value : undefined),
      UsuarioId: miRol === "Solicitante" ? authStore.user?.id : undefined,
      TieneGestor: hasGestorFilter.value === "todos" ? undefined : (hasGestorFilter.value === "con")
    };

    return ticketService.getSummary(params);
  },
  staleTime: 1000 * 60 * 2,
});

  const filteredSolicitudes = computed<Solicitud[]>(() => {
    const items = rawData.value?.items || [];

    return items.map((t: any) => {
    // Definimos el mapeo explícito
    const prioridades = ["Baja", "Media", "Alta"];
    
    // Verificamos si t.prioridad ya es un string o es el índice numérico
    const prioridadTexto = typeof t.prioridad === 'number' 
      ? prioridades[t.prioridad] 
      : t.prioridad;

    return{
      uuid: t.id,
      id: t.numero,
      titulo: t.asunto,
      descripcion: t.descripcion,
      prioridad: prioridadTexto || "Media",
      tipo: t.area?.nombre || "General",
      estado: ["Nueva", "En Proceso", "Resuelta", "Cerrada", "Rechazada"][t.estado] || "Nueva",
      fecha: formatearFecha(t.fechaCreacion),
      solicitante: t.solicitante?.nombre || "Desconocido",
      responsable: t.gestor?.nombre || null,
      };
    });
  });

 const totalPages = computed(() => {
    // CAMBIO AQUÍ: Usamos 'total' porque así viene en tu JSON
    const totalRegistros = rawData.value?.total || 0; 
    
    // Usamos el pageSize que tienes definido (12)
    return Math.ceil(totalRegistros / pageSize.value) || 1;
  });

  
  // Resetear página al cambiar filtros
  watch([searchTerm, typeFilter, priorityFilter, activeTab, hasGestorFilter], () => {
    currentPage.value = 1;
  });

  watch(() => authStore.user?.areaId, (newAreaId, oldAreaId) => {
if (newAreaId === oldAreaId && areasList.value.length > 0) return;
console.log("Cambio de área detectado...");
  // Limpiamos los filtros que dependen del área
  typeFilter.value = "todos";
  currentPage.value = 1;
  
  // Limpiamos la lista de áreas para que fetchAreas la vuelva a generar con el nuevo permiso
  areasList.value = [];
  fetchAreas(); 
  
  // Forzamos la actualización de useQuery
  refetch();
}, { immediate: true });


  const counts = computed(() => {
  // 1. Extraemos los datos reales. Pinia Colada a veces envuelve la respuesta.
  // Si ves "[Object Object]" en la pantalla, es porque estamos recibiendo la respuesta completa de Axios.
  const s = summaryData.value?.data || summaryData.value || {};

  // 2. Filtramos solo los valores que son números para el total global
  const totalGlobal = Object.entries(s)
    .filter(([key, value]) => !isNaN(Number(key)) && typeof value === 'number')
    .reduce((a, [_, b]) => a + (b as number), 0);

  return {
    todas: totalGlobal,
    nueva: s["0"] || 0,
    proceso: s["1"] || 0,
    resuelta: s["2"] || 0,
    cerrada: s["3"] || 0,
    rechazada: s["4"] || 0,
  };
});

watch([searchTerm, typeFilter, priorityFilter, activeTab, hasGestorFilter], () => {
  currentPage.value = 1;
  refetchSummary(); 
});

  const resetFilters = () => {
    searchTerm.value = "";
    typeFilter.value = "todos";
    priorityFilter.value = "todas";
    activeTab.value = "todas";
  };

  return {
    searchTerm, typeFilter, priorityFilter, activeTab,
    hasGestorFilter, currentPage, totalPages, // Exportar nuevos
    areasList, fetchAreas, refetch, filteredSolicitudes,
    isLoading: computed(() => isLoading.value), counts,
    resetFilters,
  
  };
});