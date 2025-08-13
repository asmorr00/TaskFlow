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
          due_date: string | null
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
          due_date?: string | null
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
          due_date?: string | null
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

// Helper types for easier usage
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Task = Database['public']['Tables']['tasks']['Row']
export type Subtask = Database['public']['Tables']['subtasks']['Row']

export type TaskInsert = Database['public']['Tables']['tasks']['Insert']
export type TaskUpdate = Database['public']['Tables']['tasks']['Update']
export type SubtaskInsert = Database['public']['Tables']['subtasks']['Insert']
export type SubtaskUpdate = Database['public']['Tables']['subtasks']['Update']
