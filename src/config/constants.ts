// Configuración para producción con base de datos remota
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
// Eliminamos API_URL ya que no se usa consistentemente