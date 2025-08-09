export interface Subtask {
  id: string
  name: string
  description: string
  completed: boolean
}

export interface Task {
  id: string
  title: string
  description: string
  priority: 'urgent' | 'high' | 'medium' | 'low'
  status: 'todo' | 'in-progress' | 'review' | 'done'
  subtasks: Subtask[]
  isFocused: boolean
  createdAt: Date
  updatedAt: Date
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