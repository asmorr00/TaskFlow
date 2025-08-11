export interface Subtask {
  id: string
  task_id: string
  name: string
  description: string | null
  completed: boolean
  position: number
  created_at: string
}

export interface Task {
  id: string
  user_id: string
  title: string
  description: string | null
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'todo' | 'in-progress' | 'review' | 'done'
  subtasks: Subtask[]
  is_focused: boolean
  position: number
  created_at: string
  updated_at: string
}

export type Priority = Task['priority']
export type Status = Task['status']

export interface FilterOptions {
  priority?: Priority | 'all'
  status?: Status | 'all'
  searchTerm?: string
}

export type SortOption = 'created' | 'updated' | 'priority' | 'status' | 'title'

export type ViewMode = 'grid' | 'list'