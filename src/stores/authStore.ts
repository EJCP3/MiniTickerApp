import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { LoginRequest, User } from '@/types';
import authService from '@/services/authService';

export const useAuthStore = defineStore('auth', () => {
  // Estado inicial
  const token = ref<string | null>(localStorage.getItem('token'));
  const user = ref<User | null>(null);

  // Intentar recuperar usuario del localStorage al cargar la app
  try {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      user.value = JSON.parse(storedUser);
    }
  } catch (e) {
    console.error("Error al leer usuario del storage", e);
    user.value = null;
  }

  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const login = async (credentials: LoginRequest) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      // 1. Petición al Backend (que ahora devuelve { token, user: {...} })
      const response = await authService.login(credentials);
      
      console.log("Login Exitoso, datos recibidos:", response);

      // 2. Extraer datos directamente
      const accessToken = response.token;
      const userData = response.user; // ¡Aquí ya viene la fotoUrl absoluta!

      // 3. Guardar en Estado (Pinia)
      token.value = accessToken;
      user.value = userData;

      // 4. Guardar en LocalStorage (Persistencia)
      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      return true;
    } catch (err: any) {
      console.error(err);
      error.value = err.response?.data?.message || 'Credenciales incorrectas';
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = () => {
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return { token, user, isLoading, error, login, logout };
});