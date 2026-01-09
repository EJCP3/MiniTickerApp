
export const generateUserEmail = (nombre: string): string => {
  const emailTemplate = "@miniticker.com";

  // 1. Limpiamos el nombre: pasamos a minúsculas y quitamos espacios
  const cleanName = nombre
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "") // Quita todos los espacios intermedios
    .normalize("NFD") // Descompone caracteres con tildes
    .replace(/[\u0300-\u036f]/g, ""); // Elimina las tildes

  return `${cleanName}${emailTemplate}`;
};

