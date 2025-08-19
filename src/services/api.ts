// ... existing code ...

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