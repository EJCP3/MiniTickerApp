import jsPDF from "jspdf";
import type { Ticket, HistorialDto } from "@/types/modal"; // Asegúrate de importar tus tipos si están en un archivo

export const useTicketPdf = () => {

  // --- 1. FORMATEADOR DE FECHAS ---
  const formatDateSafe = (dateVal: string | undefined) => {
    if (!dateVal) return "N/A";

    // Si la fecha ya viene formateada (ej: "04/01/2026..."), la devolvemos tal cual
    if (dateVal.includes("/")) return dateVal;

    // Si viene en formato ISO (Backend), intentamos formatearla
    let dateStr = String(dateVal);
    if (dateStr.includes("T") && !dateStr.endsWith("Z")) {
        dateStr += "Z";
    }

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateVal; // Devolver original si falla

    return new Intl.DateTimeFormat("es-DO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    }).format(date);
  };

  const generatePdf = (ticket: Ticket) => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;

    const colors = {
      primary: "#3B82F6",    
      textDark: "#111827",   
      textGray: "#6B7280",   
      bgLight: "#F9FAFB",    
      border: "#E5E7EB",     
      timelineLine: "#E5E7EB",
      orange: "#F59E0B",     
      green: "#10B981"       
    };

    let y = 20;

    // ==========================================
    // 1. ENCABEZADO
    // ==========================================
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(colors.primary);
    doc.text(`TICKET #${ticket.numero || "---"}`, margin, y);

    const statusText = (ticket.estado || "NUEVA").toUpperCase();
    doc.setTextColor(colors.textDark);
    const statusW = doc.getTextWidth(statusText);
    doc.text(statusText, pageWidth - margin - statusW, y);
    
    y += 10;

    // Título
    doc.setFontSize(18);
    doc.setTextColor(colors.textDark);
    doc.setFont("helvetica", "bold");
    const titleLines = doc.splitTextToSize(ticket.asunto || "Sin Asunto", contentWidth);
    doc.text(titleLines, margin, y);
    y += (titleLines.length * 8) + 5;

    doc.setDrawColor(colors.border);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    // ==========================================
    // 2. GRID INFO (Solicitante y Gestor)
    // ==========================================
    const colWidth = contentWidth / 2;
    
    const drawCell = (label: string, value: string, subValue: string, x: number, currentY: number) => {
        doc.setFontSize(8);
        doc.setTextColor(colors.textGray);
        doc.setFont("helvetica", "bold");
        doc.text(label.toUpperCase(), x, currentY);

        doc.setFontSize(10);
        doc.setTextColor(colors.textDark);
        doc.setFont("helvetica", "normal");
        doc.text(value || "N/A", x, currentY + 5);

        if (subValue) {
            doc.setFontSize(9);
            doc.setTextColor(colors.textGray);
            doc.text(subValue, x, currentY + 10);
        }
    };

    // Fila 1: Personas
    // Mapeo: ticket.solicitante (UsuarioDto)
    drawCell("Solicitante", ticket.solicitante?.nombre, ticket.solicitante?.email, margin, y);
    
    // Mapeo: ticket.gestor (UsuarioDto) - Antes era 'responsable'
    const gestorNombre = ticket.gestor?.nombre || "Sin Asignar";
    const gestorEmail = ticket.gestor?.email || "";
    drawCell("Gestor / Responsable", gestorNombre, gestorEmail, margin + colWidth, y);
    y += 20;

    // Fila 2: Fechas y Área
    drawCell("Creado El", formatDateSafe(ticket.fechaCreacion), "", margin, y);
    
    // Área (ticket.area o ticket.tipoSolicitud)
    const areaNombre = ticket.area?.nombre || ticket.tipoSolicitud?.nombre || "General";
    drawCell("Área / Tipo", areaNombre, "", margin + colWidth, y);
    y += 20;

    // ==========================================
    // 3. DESCRIPCIÓN
    // ==========================================
    doc.setFontSize(9);
    doc.setTextColor(colors.textGray);
    doc.setFont("helvetica", "bold");
    doc.text("DESCRIPCIÓN DEL PROBLEMA", margin, y);
    y += 5;

    doc.setFillColor(colors.bgLight);
    doc.setDrawColor(colors.border);
    
    doc.setFontSize(10);
    doc.setTextColor(colors.textDark);
    doc.setFont("helvetica", "normal");
    const descLines = doc.splitTextToSize(ticket.descripcion || "No hay descripción.", contentWidth - 10);
    const boxHeight = (descLines.length * 6) + 10;

    doc.roundedRect(margin, y, contentWidth, boxHeight, 3, 3, "FD");
    doc.text(descLines, margin + 5, y + 8);

    y += boxHeight + 15;

    // ==========================================
    // 4. HISTORIAL (Basado en HistorialDto)
    // ==========================================
    if (y > pageHeight - 40) { doc.addPage(); y = 20; }

    doc.setFontSize(10);
    doc.setTextColor(colors.textGray);
    doc.setFont("helvetica", "bold");
    doc.text("LÍNEA DE TIEMPO / HISTORIAL", margin, y);
    y += 10;

    const historial = ticket.historial || [];
    const timelineX = margin + 4;

    if (historial.length > 0) {
        historial.forEach((item: HistorialDto, index: number) => {
            if (y > pageHeight - 30) { doc.addPage(); y = 20; }

            // Línea vertical
            if (index < historial.length - 1) {
                doc.setDrawColor(colors.timelineLine);
                doc.setLineWidth(0.5);
                doc.line(timelineX, y, timelineX, y + 25);
            }

            // --- Lógica de Colores basada en TITULO ---
            let dotColor = colors.primary; 
            const tituloLower = (item.titulo || "").toLowerCase();
            
            if (tituloLower.includes("estado") || tituloLower.includes("prioridad")) dotColor = colors.orange;
            if (tituloLower.includes("asignado") || tituloLower.includes("tomado")) dotColor = colors.green;

            // Punto
            doc.setFillColor(dotColor);
            doc.setDrawColor("white");
            doc.circle(timelineX, y + 2, 2.5, "FD");

            const contentX = timelineX + 12;
            
            // --- HEADER DEL ITEM (Título y Subtítulo) ---
            // Título (Acción): "Estado actualizado a EnProceso"
            doc.setFontSize(10);
            doc.setTextColor(colors.textDark);
            doc.setFont("helvetica", "bold");
            doc.text(item.titulo || "Evento", contentX, y + 3);

            // Fecha (Derecha)
            const fechaStr = formatDateSafe(item.fecha);
            doc.setFontSize(8);
            doc.setTextColor(colors.textGray);
            doc.setFont("helvetica", "normal");
            const dateWidth = doc.getTextWidth(fechaStr);
            doc.text(fechaStr, pageWidth - margin - dateWidth, y + 3);
            
            // Subtítulo (Autor): "Por: Juan12"
            if (item.subtitulo) {
                y += 5;
                doc.setFontSize(9);
                doc.setTextColor(colors.textGray);
                doc.text(item.subtitulo, contentX, y + 3);
            }

            y += 6;

            // --- CUERPO DEL ITEM (Descripción) ---
            // "Cambio de estado de Nueva a EnProceso"
            doc.setDrawColor(colors.border);
            doc.setFillColor("white");
            
            const rawText = item.descripcion || "";
            if (rawText) {
                const msgWidth = contentWidth - 12 - 5;
                doc.setFontSize(9);
                doc.setTextColor(colors.textDark);
                
                const msgLines = doc.splitTextToSize(rawText, msgWidth - 6);
                const msgBoxHeight = (msgLines.length * 5) + 6;

                doc.roundedRect(contentX, y, msgWidth, msgBoxHeight, 2, 2, "S");
                doc.text(msgLines, contentX + 3, y + 5);

                y += msgBoxHeight + 8;
            } else {
                y += 5; // Espacio si no hay descripción
            }
        });
    } else {
        doc.setFont("helvetica", "italic");
        doc.text("No hay historial disponible.", margin, y + 5);
    }

    doc.save(`Ticket-${ticket.numero}.pdf`);
  };

  return { generatePdf };
};