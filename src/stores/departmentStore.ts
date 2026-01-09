import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { toast } from "vue-sonner"; //
import { useQuery, useMutation, useQueryCache } from "@pinia/colada";
import catalogoService from "@/services/catalogoService";
import type { Area, TipoSolicitud } from "@/types/department";
import usuariosService from "@/services/usuarios";
import authService from "@/services/authService";
import { useAuthStore } from "./authStore";
import { RolUsuario, User } from "@/types";
export const useDepartmentStore = defineStore("department", () => {
  const queryCache = useQueryCache();



  const refreshAllData = () => {
    queryCache.invalidateQueries({ key: ["areas"] });
    queryCache.invalidateQueries({ key: ["users"] });
    queryCache.invalidateQueries({ key: ["active-managers-selection"] });
    // Si hay un área seleccionada para ver sus tipos, refrescamos sus tipos también
    if (selectedAreaIdForTypes.value) {
        queryCache.invalidateQueries({ key: ["types"] });
    }
  };

  
  // --- STATE ---
  const selectedAreaIdForTypes = ref<string | null>(null);
  const authStore = useAuthStore();
  // --- GETTERS (QUERIES) ---

  // 1. OBTENER ÁREAS (Uniendo Activos + Inactivos)
  const { data: areas, isPending: isLoadingAreas } = useQuery({
    key: ["areas"],
    query: async () => {
      // Lanzamos las dos peticiones en paralelo
      const [areasActivas, areasInactivas] = await Promise.all([
        catalogoService.getAreas(false), // Trae solo activos
        catalogoService.getAreas(true), // Trae solo inactivos
      ]);

      // Unimos los dos arrays en uno solo
      return [...areasActivas, ...areasInactivas];
    },
  });

  const { data: usuarios } = useQuery({
    key: ["users"],
    query: () => usuariosService.getUsers(),
  });


const { data: managersRaw, refetch: refreshManagers } = useQuery({
  key: ["active-managers-selection"],
  query: () => usuariosService.getActiveManagers(),
});

const gestoresOptions = computed(() => {
  const listaUsuarios = managersRaw.value || [];
  return listaUsuarios
    .map(u => ({
      value: u.id,
      label: u.nombre,
      foto: u.fotoPerfilUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.nombre)}`
    }));
});




  // 2. OBTENER TIPOS (Uniendo Activos + Inactivos)
  const { data: currentTypes } = useQuery({
    key: () => ["types", selectedAreaIdForTypes.value],
    query: async () => {
      const areaId = selectedAreaIdForTypes.value || "";

      // Igual aquí: pedimos ambas listas y las unimos
      const [tiposActivos, tiposInactivos] = await Promise.all([
        catalogoService.getTipoSolicitudes(areaId, false),
        catalogoService.getTipoSolicitudes(areaId, true),
      ]);

      return [...tiposActivos, ...tiposInactivos];
    },
    enabled: computed(() => !!selectedAreaIdForTypes.value),
  });

  // --- KPIs (Funcionarán perfecto ahora) ---
  const safeAreas = computed(() => areas.value || []);
  const totalAreas = computed(() => safeAreas.value.length);

  const activas = computed(
    () => safeAreas.value.filter((a) => a.activo).length
  );
  const inactivas = computed(
    () => safeAreas.value.filter((a) => !a.activo).length
  );

  const totalSolicitudes = computed(() =>
    safeAreas.value.reduce((acc, curr) => acc + (curr.stats?.total || 0), 0)
  );

  // --- MUTATIONS (Se mantienen igual) ---

  const { mutateAsync: addArea, isLoading: isCreatingArea } = useMutation<
    Area,
    Partial<Area>,
    Error
  >({
    mutation: (newArea) => catalogoService.createArea(newArea),
    onSuccess: () => {
      refreshAllData();
      queryCache.invalidateQueries({ key: ["areas"] });

    },
  });

  const { mutateAsync: updateArea, isLoading: isUpdatingArea } = useMutation<
    Area,
    { id: string; data: Partial<Area> },
    Error
  >({
    mutation: (vars) => catalogoService.editArea(vars),
    onSuccess: () =>{
       refreshAllData();
              queryCache.invalidateQueries({ key: ["areas"] });

    }
  });

  const { mutateAsync: addType } = useMutation<
    TipoSolicitud,
    Partial<TipoSolicitud>,
    Error
  >({
    mutation: (tipoData) => catalogoService.createTipoSolicitud(tipoData),
    onSuccess: (_, vars) => {
      {    refreshAllData();
         if (vars.areaId)
        queryCache.invalidateQueries({ key: ["types", vars.areaId] });
    }
      }
     
  });

  // src/stores/departmentStore.ts
async function removerResponsable(areaId: string, usuarioId: string) {
  try {
    // Verificamos que lleguen los IDs antes de disparar
    if (!areaId || !usuarioId) return;

    await catalogoService.quitarResponsable(areaId, usuarioId);
    refreshAllData();
    // Opcional: Refrescar la lista de áreas localmente
    queryCache.invalidateQueries({ key: ['areas'] });
    return true;
  } catch (error) {
    console.error("Error al quitar responsable en el store:", error);
    throw error;
  }
}

  const { mutateAsync: deleteType } = useMutation<void, string, Error>({
  mutation: (id) => catalogoService.deleteTipoSolicitud(id),
  onSuccess: () => {
    // Importante: invalidamos con la key completa para que se refresque el modal
    refreshAllData();
    queryCache.invalidateQueries({ key: ["types"] });
    toast.success("Tipo eliminado", {
      description: "El tipo de solicitud se eliminó correctamente."
    });
  },
  onError: (error: any) => {
    // Extraemos el mensaje del error 500/400 del backend
    const serverMessage = error.response?.data?.message 
                       || error.response?.data 
                       || "No se pudo eliminar el tipo";
    
    toast.error("Error del servidor", {
      description: serverMessage,
      duration: 5000
    });
  }
});

  const { mutateAsync: updateType } = useMutation({
    mutation: (params: { id: string; activo: boolean }) =>

      catalogoService.toggleTipoSolicitud(params.id, params.activo),

    onSuccess: () => {
      refreshAllData();
      queryCache.invalidateQueries({ key: ["types"] });
    },
  });

  function selectAreaForTypes(areaId: string) {
    selectedAreaIdForTypes.value = areaId;
  }

 const { mutateAsync: deleteArea } = useMutation({
  mutation: (id: string) => catalogoService.deleteArea(id),
  onSuccess: () => {
    refreshAllData();
    queryCache.invalidateQueries({ key: ['areas'] });
    toast.success("Área borrada correctamente"); //
  },
  onError: (error: any) => {
    const serverMessage = error.response?.data?.message || "Error al eliminar el área";
    
    // Si el mensaje es el de tickets pendientes que pusimos en C#
    if (serverMessage.includes("tickets pendientes")) {
       toast.error("Acción Bloqueada", {
         description: "El área tiene tickets activos que deben cerrarse primero.",
         duration: 5000,
       });
    } else {
       toast.error(serverMessage);
    }
  }
});

  // Helper para traducir o limpiar el mensaje del servidor

  const areasOptions = computed(() => {
    return safeAreas.value
      .filter((a) => a.activo) // Importante: solo las que el usuario puede usar
      .map((a) => ({ label: a.nombre, value: a.id }));
  });

  const tiposOptions = computed(() => {
    return (currentTypes.value || [])
      .filter((t) => t.activo) // Solo tipos habilitados
      .map((t) => ({ label: t.nombre, value: t.id }));
  });

  // 2. Variable para seguir el estado de carga de tipos específicamente
  const isLoadingTypes = computed(() => {
    // Pinia Colada marca isLoading/isPending automáticamente basándose en la key
    return !!selectedAreaIdForTypes.value && !currentTypes.value;
  });

  return {
    areas: safeAreas,
    currentTypes,
    isLoadingAreas,
    totalAreas,
    activas,
    inactivas,
    totalSolicitudes,
    addArea,
    updateArea,
    addType,
    deleteType,
    updateType,
    selectAreaForTypes,
    deleteArea,
    isCreatingArea,
    isUpdatingArea,
    gestoresOptions,
    areasOptions,
    tiposOptions,
    isLoadingTypes,
    removerResponsable,
    selectedAreaIdForTypes,
  };
});
