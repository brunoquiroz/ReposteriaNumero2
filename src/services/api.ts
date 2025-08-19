// ... existing code ...

// Asegúrate de que la URL base sea correcta
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://tu-app.seenode.com/api'  // URL de producción en SeeNode
  : 'http://localhost:3001/api';      // URL de desarrollo

export interface SiteSettings {
  show_hero: string;
  [key: string]: string;
}

export const settingsAPI = {
  getAll: async (): Promise<SiteSettings> => {
    const response = await api.get('/settings');
    return response.data;
  },
  getPublic: async (): Promise<SiteSettings> => {
    const response = await fetch('http://localhost:3001/api/public/settings');
    return response.json();
  },
  update: async (key: string, value: string): Promise<void> => {
    await api.put(`/settings/${key}`, { value });
  },
};

export default api;