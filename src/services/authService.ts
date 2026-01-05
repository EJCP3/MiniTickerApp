import apiClient from './client';
import type { LoginRequest, LoginResponse } from '@/types';

export default {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    // Aquí es donde se hace el POST a tu endpoint
    const response = await apiClient.post<LoginResponse>('/api/auth/login', credentials);
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};