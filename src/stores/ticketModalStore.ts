import { defineStore } from 'pinia';
import ticketService from '@/services/ticketService';
import type { Ticket } from '@/types/modal';

export const useTicketStore = defineStore('ticket', {
  state: () => ({
    currentTicket: null as Ticket | null,
    isLoading: false,
    error: null as string | null,
    isActionLoading: false,
  }),

  actions: {
  async fetchTicket(id: string) {
      this.isLoading = true;
      this.error = null;
      this.currentTicket = null;

      try {
        // 1. Pedir datos en paralelo
        const [ticketResponse, historyResponse] = await Promise.all([
            ticketService.getTicketById(id),
            ticketService.getTicketHistory(id).catch(() => [])
        ]);

        const finalTicket: any = ticketResponse;
        
        // 2. Seleccionar la mejor fuente de historial
        let rawHistorial = [];
        if (Array.isArray(historyResponse) && historyResponse.length > 0) {
            rawHistorial = historyResponse;
        } else if (finalTicket.historial) {
            rawHistorial = finalTicket.historial;
        }

        // --- ZONA DE FILTRADO AVANZADO ---
        const uniqueHistory: any[] = [];
        const seenKeys = new Set<string>();

        // Trabajamos con una copia invertida para procesar (generalmente) de nuevo a viejo
        const listaParaProcesar = [...rawHistorial].reverse();

        for (const item of listaParaProcesar) {
            const descClean = (item.descripcion || '').trim();
            const fecha = item.fecha;
            
            // 1. FILTRO DE DUPLICADOS EXACTOS (El que ya teníamos)
            // Evita que aparezcan dos comentarios idénticos ("Bueno dias" x2)
            const exactKey = `${fecha}_${descClean}`;
            if (seenKeys.has(exactKey)) {
                continue; // Ya existe uno igual, saltar.
            }

            // 2. FILTRO DE REDUNDANCIA POR ESTADO (NUEVO)
            // Si el ítem es un COMENTARIO (Tipo 2)...
            if (item.tipoEvento === 2) {
                // ...buscamos si existe un CAMBIO DE ESTADO (Tipo 1) 
                // con la MISMA FECHA que contenga este texto en su descripción.
                const esRedundante = listaParaProcesar.some(otro => 
                    otro !== item &&                 // No es él mismo
                    otro.fecha === fecha &&          // Misma hora exacta (string del backend)
                    otro.tipoEvento === 1 &&         // Es un cambio de estado
                    otro.descripcion &&              // Tiene descripción
                    otro.descripcion.includes(descClean) // Ej: ". Motivo: Hola" contiene "Hola"
                );

                // Si encontramos al "padre" (el cambio de estado), ocultamos este comentario "hijo".
                if (esRedundante) {
                    continue; 
                }
            }

            // Si pasó las pruebas, lo agregamos
            seenKeys.add(exactKey);
            uniqueHistory.unshift(item); // Unshift porque recorremos en reversa
        }

        finalTicket.historial = uniqueHistory;
        // --------------------------------------------------

        console.log("Historial Filtrado:", finalTicket.historial);
        this.currentTicket = finalTicket;

      } catch (e) {
        console.error("Error cargando ticket:", e);
        this.error = "No se pudo cargar la información completa.";
      } finally {
        this.isLoading = false;
      }
    },
    
    // --- TUS OTRAS ACCIONES (addComment, assignManager) ---
    // Copialas aquí igual que antes...
    async addComment(texto: string) {
        if (!this.currentTicket) return;
        await ticketService.addComment(this.currentTicket.id, texto);
        await this.fetchTicket(this.currentTicket.id);
    },
    async assignManager(gestorId: string) {
        if (!this.currentTicket) return;
        await ticketService.assignManager(this.currentTicket.id, gestorId);
        await this.fetchTicket(this.currentTicket.id);
    },
    async changeStatus(estado: number, motivo: string) {
        if (!this.currentTicket) return;
        await ticketService.changeStatus(this.currentTicket.id, estado, motivo);
        await this.fetchTicket(this.currentTicket.id);
    },

    async updateTicket(id: string, formulario: { asunto: string; descripcion: string; prioridad: number; archivo?: File }) {
      this.isActionLoading = true;
      try {
        const formData = new FormData();
        formData.append('Asunto', formulario.asunto);
        formData.append('Descripcion', formulario.descripcion);
        formData.append('Prioridad', formulario.prioridad.toString());
        
        // Solo adjuntamos archivo si el usuario seleccionó uno nuevo
        if (formulario.archivo) {
            formData.append('ArchivoAdjunto', formulario.archivo);
        }

        

        await ticketService.update(id, formData);
     
        // Recargamos el ticket para ver los cambios
        await this.fetchTicket(id);
        return true; // Retornamos true para saber que salió bien y cerrar el modo edición
      } catch (e) {
        console.error("Error actualizando ticket:", e);
        this.error = "Error al actualizar el ticket.";
        return false;
      } finally {
        this.isActionLoading = false;
      }
    },
  },

  getters: {
    // --- LA SOLUCIÓN AL PROBLEMA DE FECHAS ---
    // Convierte "04/01/2026 05:37 p. m." -> Date legible
    formatBackendDate: () => (fechaString: string | undefined) => {
        if (!fechaString || fechaString.includes('0001-01-01')) return '---';

        try {
            // 1. Limpiamos espacios raros (non-breaking spaces) y puntos
            // "04/01/2026 05:37 p. m." -> "04/01/2026 05:37 pm"
            let clean = fechaString.toLowerCase().replace(/\./g, '').replace(/\u00A0/g, ' ').trim();
            
            // 2. Separar fecha y hora
            // [0] = "04/01/2026", [1] = "05:37", [2] = "pm"
            const parts = clean.split(' ');
            if (parts.length < 2) return fechaString; // Si falla, devuelve original

            const dateParts = parts[0].split('/'); // [04, 01, 2026]
            const timeParts = parts[1].split(':'); // [05, 37]
            const isPM = clean.includes('p') && !clean.includes('a'); // Detectar PM

            let hours = parseInt(timeParts[0]);
            const minutes = parseInt(timeParts[1]);

            // Convertir 12h a 24h
            if (isPM && hours < 12) hours += 12;
            if (!isPM && hours === 12) hours = 0; // 12 am es 00:00

            // Crear fecha (Mes va de 0 a 11 en JS)
            const fechaObj = new Date(
                parseInt(dateParts[2]), // Año
                parseInt(dateParts[1]) - 1, // Mes
                parseInt(dateParts[0]), // Dia
                hours,
                minutes
            );

            // Formatear bonito para el usuario
            return new Intl.DateTimeFormat('es-DO', {
                day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true
            }).format(fechaObj);

        } catch (e) {
            console.error("Error formateando fecha custom:", fechaString);
            return fechaString; // Fallback
        }
    }
  }
});