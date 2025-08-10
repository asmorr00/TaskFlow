import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.VITE_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for your database
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          priority: 'low' | 'medium' | 'high' | 'urgent'
          status: 'todo' | 'in-progress' | 'review' | 'done'
          is_focused: boolean
          position: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          status?: 'todo' | 'in-progress' | 'review' | 'done'
          is_focused?: boolean
          position?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          status?: 'todo' | 'in-progress' | 'review' | 'done'
          is_focused?: boolean
          position?: number
          created_at?: string
          updated_at?: string
        }
      }
      subtasks: {
        Row: {
          id: string
          task_id: string
          name: string
          description: string | null
          completed: boolean
          position: number
          created_at: string
        }
        Insert: {
          id?: string
          task_id: string
          name: string
          description?: string | null
          completed?: boolean
          position?: number
          created_at?: string
        }
        Update: {
          id?: string
          task_id?: string
          name?: string
          description?: string | null
          completed?: boolean
          position?: number
          created_at?: string
        }
      }
    }
  }
}