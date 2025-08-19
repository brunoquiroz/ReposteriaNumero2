import axios from 'axios';

// ... existing code ...

// Asegúrate de que la URL base sea correcta
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://up-de-fra1-mysql-1.db.run-on-seenode.com:11550'  // URL de producción en SeeNode
  : 'http://localhost:3001/api';      // URL de desarrollo

// Crear instancia de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token de autenticación
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category_id: number;
  image_url?: string;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface SiteSettings {
  show_hero: string;
  [key: string]: string;
}

// API para productos
export const productsAPI = {
  getAll: async (): Promise<Product[]> => {
    const response = await api.get('/products');
    return response.data;
  },
  create: async (product: Omit<Product, 'id' | 'created_at'>): Promise<Product> => {
    const response = await api.post('/products', product);
    return response.data;
  },
  update: async (id: number, product: Partial<Product>): Promise<Product> => {
    const response = await api.put(`/products/${id}`, product);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};

// API para categorías
export const categoriesAPI = {
  getAll: async (): Promise<Category[]> => {
    const response = await api.get('/categories');
    return response.data;
  },
  create: async (category: Omit<Category, 'id'>): Promise<Category> => {
    const response = await api.post('/categories', category);
    return response.data;
  },
  update: async (id: number, category: Partial<Category>): Promise<Category> => {
    const response = await api.put(`/categories/${id}`, category);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};

// API para configuraciones
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

// API para autenticación
export const authAPI = {
  login: async (username: string, password: string): Promise<{ token: string }> => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },
};

export default api;