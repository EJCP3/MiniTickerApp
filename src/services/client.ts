// src/api/client.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 

const apiClient = axios.create({
  baseURL: API_BASE_URL, // Asegúrate que sea tu URL base
});

// --- INTERCEPTOR DE SOLICITUD (El arreglo para el 401) ---
apiClient.interceptors.request.use(
  (config) => {
    // 1. Leemos el token guardado
    const token = localStorage.getItem('token');
    
    // 2. Si existe, lo agregamos al header Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- INTERCEPTOR DE RESPUESTA (Opcional: Manejo de errores globales) ---
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el token expiró o es inválido (401), podemos cerrar sesión automáticamente
    if (error.response && error.response.status === 401) {
      console.warn("Sesión expirada o no autorizada");
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login'; // Redirigir al login a la fuerza
    }
    return Promise.reject(error);
  }
);

export default apiClient;