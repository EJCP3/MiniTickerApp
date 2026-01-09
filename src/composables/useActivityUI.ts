// src/composables/useActivityUI.ts
import { computed } from "vue";
import type { IconName } from "@/utils/icons"; // Asegúrate de importar el tipo

export function useActivityUI() {
  const getActivityConfig = (tipo: string): { circleClass: string, iconName: IconName, label?: string } => {
    switch (tipo) {
      // ==========================================
      // 🎫 TICKETS (Ya funcionaban, los dejamos igual)
      // ==========================================
      case "Creado":
        return {
          circleClass: "bg-emerald-100 text-emerald-600 border-emerald-200",
          iconName: "plus",
          label: "Ticket Creado"
        };
      case "CambioEstado":
        return {
          circleClass: "bg-blue-100 text-blue-600 border-blue-200",
          iconName: "refresh",
          label: "Cambio de Estado"
        };
      case "ComentarioADD":
        return {
          circleClass: "bg-orange-100 text-orange-500 border-orange-200",
          iconName: "chat",
          label: "Nuevo Comentario"
        };
      case "Asignado":
        return {
          circleClass: "bg-purple-100 text-purple-600 border-purple-200",
          iconName: "userCheck",
          label: "Asignado"
        };
      case "PrioridadCritica":
        return {
          circleClass: "bg-red-100 text-red-600 border-red-200",
          iconName: "alertCircle",
          label: "Prioridad Crítica"
        };

      // ==========================================
      // 🟢 SISTEMA Y SESIÓN (Corregidos al formato Tailwind)
      // ==========================================
      case "Login":
        return {
          circleClass: "bg-emerald-100 text-emerald-600 border-emerald-200",
          iconName: "login",
          label: "Sesión Iniciada"
        };
      case "Logout":
        return {
          circleClass: "bg-gray-100 text-gray-500 border-gray-200",
          iconName: "logout",
          label: "Sesión Cerrada"
        };

      // ==========================================
      // 🔵 USUARIOS (Corregidos)
      // ==========================================
      case "UsuarioCreado":
        return {
          circleClass: "bg-cyan-100 text-cyan-600 border-cyan-200",
          iconName: "userPlus", // Asegúrate de tener este icono en icons.ts
          label: "Usuario Registrado"
        };
      case "UsuarioActualizado":
        return {
          circleClass: "bg-indigo-100 text-indigo-600 border-indigo-200",
          iconName: "userSettings",
          label: "Perfil Actualizado"
        };
      case "UsuarioEstadoCambio":
        return {
          circleClass: "bg-amber-100 text-amber-600 border-amber-200",
          iconName: "userShield",
          label: "Estado Usuario"
        };

      // ==========================================
      // 🟣 ÁREAS (Corregidos)
      // ==========================================
      case "AreaCreada":
        return {
          circleClass: "bg-fuchsia-100 text-fuchsia-600 border-fuchsia-200",
          iconName: "building",
          label: "Área Creada"
        };
      case "AreaActualizada":
        return {
          circleClass: "bg-pink-100 text-pink-600 border-pink-200",
          iconName: "edit",
          label: "Área Editada"
        };
      case "AreaEliminada":
        return {
          circleClass: "bg-rose-100 text-rose-600 border-rose-200",
          iconName: "trash",
          label: "Área Eliminada"
        };
      case "AreaEstadoCambio":
        return {
          circleClass: "bg-orange-100 text-orange-600 border-orange-200",
          iconName: "refresh",
          label: "Estado Área"
        };
        
      case "AreaResponsableQuitar":
        return {
          circleClass: "bg-slate-100 text-slate-600 border-slate-200",
          iconName: "userX",
          label: "Responsable Desvinculado"
        };

      // ==========================================
      // 🟠 TIPOS DE SOLICITUD (Corregidos)
      // ==========================================
      case "TipoSolicitudCreado":
        return {
          circleClass: "bg-teal-100 text-teal-600 border-teal-200",
          iconName: "filePlus",
          label: "Tipo Creado"
        };
      case "TipoSolicitudEliminado":
        return {
          circleClass: "bg-red-100 text-red-600 border-red-200",
          iconName: "fileMinus",
          label: "Tipo Eliminado"
        };
      case "TipoSolicitudEstadoCambio":
        return {
          circleClass: "bg-yellow-100 text-yellow-600 border-yellow-200",
          iconName: "refresh",
          label: "Estado Tipo"
        };

      // ==========================================
      // ⚪ DEFAULT
      // ==========================================
      default:
        return {
          circleClass: "bg-base-200 text-base-content/50 border-base-300",
          iconName: "infoCircle",
          label: "Actividad"
        };
    }
  };

  return { getActivityConfig };
}