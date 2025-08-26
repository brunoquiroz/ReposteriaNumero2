import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan las variables de entorno de Supabase')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos de la base de datos
export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: number
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          name: string
          description?: string | null
        }
        Update: {
          name?: string
          description?: string | null
        }
      }
      products: {
        Row: {
          id: number
          name: string
          description: string | null
          price: number
          category_id: number
          image_url: string | null
          created_at: string
        }
        Insert: {
          name: string
          description?: string | null
          price: number
          category_id: number
          image_url?: string | null
        }
        Update: {
          name?: string
          description?: string | null
          price?: number
          category_id?: number
          image_url?: string | null
        }
      }
      settings: {
        Row: {
          id: number
          key: string
          value: string
          created_at: string
        }
        Insert: {
          key: string
          value: string
        }
        Update: {
          key?: string
          value?: string
        }
      }
    }
  }
}