// src/components/ActivityFeed/useActivityActions.ts
import { ref } from "vue";
import ticketService from "@/services/ticketService";
import type { Ticket } from "@/types/modal";
import type { ActivityItem } from "@/types/activity"; // Asegúrate de que esta ruta sea correcta

export function useActivityActions() {
  const showModal = ref(false);
  const ticketSeleccionado = ref<Ticket | null>(null);
  const isLoadingDetail = ref(false);

  // 1. HELPER DE FECHAS ROBUSTO
  // Soporta tanto ISO como el formato "dd/MM/yyyy" de C#
const parsearFechaBackend = (fechaStr: string | Date): Date => {
    if (!fechaStr) return new Date();
    if (fechaStr instanceof Date) return fechaStr;

    // A. Intento estándar (ISO 8601)
    // Si viene como "2026-01-03T14:30:00", esto funciona directo.
    const fechaISO = new Date(fechaStr);
    if (!isNaN(fechaISO.getTime()) && fechaStr.includes('-')) return fechaISO;

    // B. Intento manual para formato C# "dd/MM/yyyy hh:mm tt"
    try {
       // 1. Limpieza: quitar puntos (a.m. -> am) y espacios dobles
       const str = fechaStr.toString().trim().replace(/\./g, '').replace(/\s+/g, ' ').toLowerCase();
       
       // Separamos fecha y hora
       // Ejemplo entrada: "03/01/2026 02:30 pm"
       const parts = str.split(' ');
       const datePart = parts[0]; // "03/01/2026"
       const timePart = parts[1]; // "02:30"
       const ampm = parts.length > 2 ? parts[2] : ''; // "pm"

       if (datePart.includes('/')) {
           const [dia, mes, anio] = datePart.split('/');
           
           let horas = 0;
           let minutos = 0;

           if (timePart && timePart.includes(':')) {
               const [h, m] = timePart.split(':');
               horas = parseInt(h);
               minutos = parseInt(m);

               // Ajuste 12h a 24h
               if (ampm.includes('p') && horas < 12) horas += 12;
               if (ampm.includes('a') && horas === 12) horas = 0;
           }

           return new Date(parseInt(anio), parseInt(mes) - 1, parseInt(dia), horas, minutos);
       }
    } catch (e) {
       console.warn("Error parseando fecha manual:", fechaStr);
    }
    
    return new Date(); // Fallback a 'ahora' si todo falla
  };
  const abrirDetalleTicket = async (actividad: ActivityItem) => {
    // 2. Optimista (Usamos el ticketId que viene de la actividad)
    ticketSeleccionado.value = {
      id: actividad.ticketId,
      codigo: actividad.id || "Cargando...", // A veces el ID visual viene aquí
      titulo: actividad.titulo || "Cargando...",
      descripcion: actividad.mensaje || "...",
      categoria: "...",
      prioridad: "...",
      estado: "...",
      solicitante: actividad.usuario || "Usuario",
      responsable: "...",
      fechaCreacion: parsearFechaBackend(actividad.fecha),
      ultimaActualizacion: new Date(),
      historial: [],
    } as any;

    showModal.value = true;

    try {
      // 3. Carga Real
      const [rawTicket, historialCompleto]: [any, any] = await Promise.all([
        ticketService.getTicketById(actividad.ticketId),
        ticketService.getTicketHistory(actividad.ticketId),
      ]);

      // 4. MAPEO Y FILTRADO (Aquí está la solución)
      const historialMapeado = (historialCompleto || [])
        .filter((item: any) => {
          // ELIMINAR DUPLICADOS: Si es el evento de sistema, lo saltamos
          return item.titulo !== "Comentario agregado";
        })
        .map((item: any) => {
          let nombreUsuario =
            item.subtitulo
              ?.replace("Por:", "")
              .replace("Gestor responsable:", "")
              .trim() ||
            item.usuario ||
            "Sistema";

          return {
            titulo: item.titulo,
            usuario: nombreUsuario,
            fecha: parsearFechaBackend(item.fecha), // Usamos el parser robusto
            descripcion: item.descripcion,
          };
        });

      // 5. Update final
      ticketSeleccionado.value = {
        id: rawTicket.id, // Aseguramos el GUID
        codigo: rawTicket.numero,
        titulo: rawTicket.asunto,
        descripcion: rawTicket.descripcion,
        prioridad: rawTicket.prioridad,
        estado: rawTicket.estado,
        categoria:
          rawTicket.tipoSolicitud?.nombre ||
          rawTicket.area?.nombre ||
          "General",
        solicitante: rawTicket.solicitante?.nombre || "Usuario",
        gestorId: rawTicket.gestorAsignadoId || rawTicket.gestor?.id,
        responsable: rawTicket.gestor?.nombre || "Sin asignar",
        fechaCreacion: parsearFechaBackend(rawTicket.fechaCreacion),
        ultimaActualizacion: parsearFechaBackend(rawTicket.fechaActualizacion), 
        archivoUrl: rawTicket.archivoAdjuntoUrl,
        archivoNombre: rawTicket.archivoAdjuntoUrl 
        ? rawTicket.archivoAdjuntoUrl.split('/').pop() 
        : 'Archivo Adjunto',
        historial: historialMapeado,
      };
    } catch (error) {
      console.error("Error loading details:", error);
    }
  };

  return {
    showModal,
    ticketSeleccionado,
    isLoadingDetail,
    abrirDetalleTicket,
  };
}
