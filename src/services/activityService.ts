// src/api/activityService.ts
import apiClient from './client';
import type { ActivityItem } from '@/types/activity';

export default {
  async getMyActivity(): Promise<ActivityItem[]> {
    // Llamada al endpoint que pediste
    const response = await apiClient.get<ActivityItem[]>('/api/activity/mine');
    return response.data;
  },

  async getActivityGlobal(areaId?: string, userId?: string): Promise<ActivityItem[]> {
    // Llamada al endpoint que pediste
    const response = await apiClient.get<ActivityItem[]>('/api/activity/global', {
      params: { areaId, userId }
    });
    return response.data;
  }
};