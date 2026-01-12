import { defineStore } from "pinia";
import { ref } from "vue";
import { useQueryCache } from "@pinia/colada";
import type { LoginRequest, User } from "@/types";
import authService from "@/services/authService";
import router from "@/router";
import { toast } from "vue-sonner"; // Opcional, para feedback visual

// Importamos los otros stores para usarlos solo dentro de logout
import { useSolicitudesStore } from "./useSolicitudesStore";
import { useActivityStore } from "./activityStore";

export const useAuthStore = defineStore("auth", () => {
  const queryCache = useQueryCache();
  const token = ref<string | null>(localStorage.getItem("token"));
  const user = ref<User | null>(null);

  const debeCambiarPassword = ref(false);

  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      user.value = parsedUser;

      
      debeCambiarPassword.value = parsedUser.debeCambiarPassword === true;
    }
  } catch (e) {
    console.error("Error al leer usuario del storage", e);
    user.value = null;
  }

  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // --- LOGIN ---
  // En authStore.ts

const login = async (credentials: LoginRequest) => {
  isLoading.value = true;
  error.value = null;
  
  try {
    const response = await authService.login(credentials);
    const accessToken = response.token;
    
    // 1. Tomamos el usuario que viene del backend
    const userData = response.user;

    // 👇 2. EL TRUCO: Sincronización Forzada
    // Sobrescribimos la propiedad dentro del usuario con el valor real que vino en la raíz.
    // Esto arregla el problema si el DTO interno venía con false.
    userData.debeCambiarPassword = response.debeCambiarPassword;

    token.value = accessToken;
    user.value = userData;
    
    // Actualizamos la variable reactiva del store
    debeCambiarPassword.value = response.debeCambiarPassword;

    // 3. Guardar en LocalStorage (Ahora userData SÍ lleva el true garantizado)
    localStorage.setItem('token', accessToken);
    localStorage.setItem('user', JSON.stringify(userData));
    
    if (debeCambiarPassword.value) {
      router.push('/initial');
    } 
    
    return true;
  } catch (err: any) {
    error.value = err.response?.data?.message || "Credenciales incorrectas";
    return false;
  } finally {
    isLoading.value = false;
  }
};

  // --- COMPLETAR SETUP INICIAL (Nueva contraseña + Foto) ---
  const completeInitialSetup = async (
    password: string,
    fotoFile: File | null
  ) => {
    try {
      // Llamamos al servicio (que ya usa FormData internamente)
      const data = await authService.completeSetup(password, fotoFile);

      // Actualizamos datos locales del usuario (URL de la foto nueva)
      if (user.value) {
        user.value.fotoPerfilUrl = data.fotoUrl;
        user.value.debeCambiarPassword = false;
        // Actualizamos también el localStorage para que persista al recargar
       localStorage.setItem('user', JSON.stringify(user.value));
      }

      // 👇 LIBERAR AL USUARIO DEL BLOQUEO
      debeCambiarPassword.value = false;

      toast.success("Perfil configurado correctamente");
      return true;
    } catch (err) {
      console.error("Error en setup:", err);
      toast.error("Error al guardar la configuración");
      return false;
    }
  };

  // --- LOGOUT ---
  const logout = async () => {
    try {
      // 1. Avisar al backend (Fire and forget)
      await authService.logout();
    } catch (err) {
      console.warn("No se pudo registrar el logout en el servidor", err);
    } finally {
      // 2. Limpieza Local
      queryCache.invalidateQueries();

      const solicitudesStore = useSolicitudesStore();
      const activityStore = useActivityStore();

      solicitudesStore.resetFilters();
      activityStore.clearFilters();

      token.value = null;
      user.value = null;
      debeCambiarPassword.value = false; // Resetear flag por seguridad

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      router.push("/login");
    }
  };

  return {
    token,
    user,
    isLoading,
    error,
    debeCambiarPassword, // 👈 Exportar estado
    login,
    logout,
    completeInitialSetup, // 👈 Exportar función
  };
});
