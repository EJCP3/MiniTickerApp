// src/stores/activityStore.ts
import { defineStore } from 'pinia';
import { computed, onUnmounted } from 'vue';
import { useQuery } from '@pinia/colada';
import activityService from '@/services/activityService';

export const useActivityStore = defineStore('activity', () => {
  
  const { data: activities, status, error, refresh } = useQuery({
    key: ['activity-mine'],
    query: async () => {
      const data = await activityService.getMyActivity();
      // Verificamos si devuelve un array o un objeto paginado (ajusta según tu backend)
      return Array.isArray(data) ? data : (data as any).items || [];
    },
    staleTime: 1000 * 30, // 30 segundos de caché
  });

  // Auto-refresco cada 30 segundos (Polling) para ver nuevos eventos
  const intervalId = setInterval(() => {
    refresh();
  }, 30000);

  onUnmounted(() => clearInterval(intervalId));

  const isLoading = computed(() => status.value === 'pending');

  return { 
    activities, 
    isLoading, 
    error, 
    refresh 
  };
});