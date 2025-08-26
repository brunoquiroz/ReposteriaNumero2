import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'

type Product = Database['public']['Tables']['products']['Row']
type Category = Database['public']['Tables']['categories']['Row']
type ProductInsert = Database['public']['Tables']['products']['Insert']
type CategoryInsert = Database['public']['Tables']['categories']['Insert']

export interface SiteSettings {
  show_hero: string
  [key: string]: string
}

// API para productos
export const productsAPI = {
  getAll: async (): Promise<Product[]> => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  getPublic: async (): Promise<Product[]> => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  create: async (product: ProductInsert): Promise<Product> => {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  update: async (id: number, product: Partial<ProductInsert>): Promise<Product> => {
    const { data, error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  delete: async (id: number): Promise<void> => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  uploadImage: async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop()
    const fileName = `product-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, file)
    
    if (uploadError) throw uploadError
    
    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName)
    
    return data.publicUrl
  }
}

// API para categorías
export const categoriesAPI = {
  getAll: async (): Promise<Category[]> => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data || []
  },

  getPublic: async (): Promise<Category[]> => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data || []
  },

  create: async (category: CategoryInsert): Promise<Category> => {
    const { data, error } = await supabase
      .from('categories')
      .insert(category)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  update: async (id: number, category: Partial<CategoryInsert>): Promise<Category> => {
    const { data, error } = await supabase
      .from('categories')
      .update(category)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  delete: async (id: number): Promise<void> => {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// API para configuraciones
export const settingsAPI = {
  getAll: async (): Promise<SiteSettings> => {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
    
    if (error) throw error
    
    const settings: SiteSettings = { show_hero: 'true' }
    data?.forEach(setting => {
      settings[setting.key] = setting.value
    })
    
    return settings
  },

  getPublic: async (): Promise<SiteSettings> => {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
    
    if (error) throw error
    
    const settings: SiteSettings = { show_hero: 'true' }
    data?.forEach(setting => {
      settings[setting.key] = setting.value
    })
    
    return settings
  },

  update: async (key: string, value: string): Promise<void> => {
    const { error } = await supabase
      .from('settings')
      .upsert({ key, value })
    
    if (error) throw error
  }
}

// API para autenticación (usando Supabase Auth)
export const authAPI = {
  login: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return { token: data.session?.access_token || '' }
  },

  logout: async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  }
}

export { supabase }
export type { Product, Category }