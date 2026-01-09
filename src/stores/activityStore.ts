import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue'; // ✅ Añadido watch
import { useQuery, useQueryCache } from '@pinia/colada';
import activityService from '@/services/activityService';
import { toast } from 'vue-sonner';

export const useActivityStore = defineStore('activity', () => {
  const queryCache = useQueryCache();
  const initialLoadDone = ref(false); // ✅ Control para evitar toast al cargar la página

  const filterArea = ref<string>('Todas');
  const filterUser = ref<string>('Todos');
  
  const apiAreaId = computed(() => filterArea.value === 'Todas' ? undefined : filterArea.value);
  const apiUserId = computed(() => filterUser.value === 'Todos' ? undefined : filterUser.value);

  const { data: globalActivities, status: globalStatus, refresh: refreshGlobal } = useQuery({
    key: () => ['activity-global', { area: apiAreaId.value, user: apiUserId.value }],
    query: () => activityService.getActivityGlobal(apiAreaId.value, apiUserId.value),
    staleTime: 10000,
  });

  const { data: myActivities, status: myStatus, refresh: refreshMine } = useQuery({
    key: ['activity-mine'],
    query: () => activityService.getMyActivity(),
    staleTime: 10000,
  });

  // ✅ MONITOR DE NUEVAS ACTIVIDADES
 watch(globalActivities, (newList, oldList) => {
    if (!initialLoadDone.value) {
        if (newList?.length > 0) initialLoadDone.value = true;
        return;
    }

    if (newList?.length > 0 && oldList?.length > 0) {
        if (newList[0].id !== oldList[0].id) {
            toast("Nueva Actividad", {
                description: newList[0].titulo,
                duration: 5000
            });
        } 
    }
}, { deep: true });

  setInterval(() => {
    refreshGlobal();
    refreshMine();
  }, 30000); // Refresca cada 10s
  const activities = computed(() => Array.isArray(globalActivities.value) ? globalActivities.value : []);
  const myActivitiesList = computed(() => Array.isArray(myActivities.value) ? myActivities.value : []);

  const stats = computed(() => {
    const lista = activities.value || [];
    const total = lista.length;

    const hoy = lista.filter(act => {
      const f = act.fecha.toLowerCase();
      return f.includes('min') || f.includes('h') || f.includes('momento');
    }).length;

    const semana = lista.filter(act => {
      const f = act.fecha.toLowerCase();
      if (f.includes('min') || f.includes('h') || f.includes('momento')) return true;
      if (f.includes('d')) {
        const dias = parseInt(f.match(/\d+/)?.[0] || '0');
        return dias < 7;
      }
      return false;
    }).length;

    return { total, hoy, semana };
  });

  const isLoadingGlobal = computed(() => globalStatus.value === 'pending');
  const isLoadingMine = computed(() => myStatus.value === 'pending');

  const clearFilters = () => {
    filterArea.value = 'Todas';
    filterUser.value = 'Todos';
  };

  return { 
    activities,
    myActivitiesList,
    filterArea,
    filterUser,
    clearFilters,
    stats,
    isLoadingGlobal,
    isLoadingMine,
    refreshGlobal,
    refreshMine
  };
});