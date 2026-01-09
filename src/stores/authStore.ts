// import { defineStore } from 'pinia';
// import { ref } from 'vue';
// import { useQueryCache } from '@pinia/colada'; //
// import type { LoginRequest, User } from '@/types';
// import authService from '@/services/authService';

// // Importamos los otros stores para usarlos solo dentro de logout
// import { useSolicitudesStore } from './useSolicitudesStore'; //
// import { useActivityStore } from './activityStore'; //

// export const useAuthStore = defineStore('auth', () => {
//   const queryCache = useQueryCache(); //
//   const token = ref<string | null>(localStorage.getItem('token'));
//   const user = ref<User | null>(null);

//   try {
//     const storedUser = localStorage.getItem('user');
//     if (storedUser) {
//       user.value = JSON.parse(storedUser);
//     }
//   } catch (e) {
//     console.error("Error al leer usuario del storage", e);
//     user.value = null;
//   }

//   const isLoading = ref(false);
//   const error = ref<string | null>(null);

//   const login = async (credentials: LoginRequest) => {
//     isLoading.value = true;
//     error.value = null;
    
//     try {
//       const response = await authService.login(credentials);
//       const accessToken = response.token;
//       const userData = response.user;

//       token.value = accessToken;
//       user.value = userData;

//       localStorage.setItem('token', accessToken);
//       localStorage.setItem('user', JSON.stringify(userData));
      
//       return true;
//     } catch (err: any) {
//       error.value = err.response?.data?.message || 'Credenciales incorrectas';
//       return false;
//     } finally {
//       isLoading.value = false;
//     }
//   };

//   const logout = () => {
//     // 1. Limpiar el caché de Pinia Colada para borrar datos de queries anteriores
//     queryCache.invalidateQueries(); //

//     // 2. Instanciar stores de forma diferida para evitar loop infinito
//     const solicitudesStore = useSolicitudesStore(); //
//     const activityStore = useActivityStore(); //

//     // 3. Resetear estados y filtros manuales
//     solicitudesStore.resetFilters(); //
//     activityStore.clearFilters(); //

//     // 4. Limpiar estado de autenticación
//     token.value = null;
//     user.value = null;
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');

   
//   };




//   return { token, user, isLoading, error, login, logout };
// });

import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useQueryCache } from '@pinia/colada';
import type { LoginRequest, User } from '@/types';
import authService from '@/services/authService';
import router from '@/router'; // 👈 Importamos el router para redirigir

// Importamos los otros stores para usarlos solo dentro de logout
import { useSolicitudesStore } from './useSolicitudesStore';
import { useActivityStore } from './activityStore';

export const useAuthStore = defineStore('auth', () => {
  const queryCache = useQueryCache();
  const token = ref<string | null>(localStorage.getItem('token'));
  const user = ref<User | null>(null);

  // Inicialización del usuario desde LocalStorage
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

  // --- LOGIN ---
  const login = async (credentials: LoginRequest) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await authService.login(credentials);
      const accessToken = response.token;
      const userData = response.user;

      token.value = accessToken;
      user.value = userData;

      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      return true;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Credenciales incorrectas';
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  // --- LOGOUT (Actualizado) ---
  const logout = async () => {
    try {
      // 1. Avisar al backend (Fire and forget)
      // Lo hacemos antes de borrar el token para que el backend sepa quién hace logout
      await authService.logout(); 
    } catch (err) {
      console.warn("No se pudo registrar el logout en el servidor", err);
    } finally {
      // 2. Limpieza Local (Se ejecuta ocurra error o no en el servidor)

      // a. Limpiar caché de Pinia Colada
      queryCache.invalidateQueries();

      // b. Resetear stores secundarios (instanciados aquí para evitar ciclos)
      const solicitudesStore = useSolicitudesStore();
      const activityStore = useActivityStore();
      
      solicitudesStore.resetFilters();
      activityStore.clearFilters();

      // c. Limpiar estado de Auth y LocalStorage
      token.value = null;
      user.value = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // d. Redirigir al login
      router.push('/login');
    }
  };

  return { token, user, isLoading, error, login, logout };
});