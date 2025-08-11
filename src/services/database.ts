import { supabase } from '../../lib/supabase'
import type { 
  Task as DatabaseTask, 
  Subtask, 
  Profile,
  TaskInsert, 
  TaskUpdate, 
  SubtaskInsert, 
  SubtaskUpdate 
} from '../types/database'

// Extended Task type that includes subtasks array (database Task + subtasks)
export type TaskWithSubtasks = DatabaseTask & { subtasks: Subtask[] }

export class DatabaseService {
  
  // ==================== TASK METHODS ====================
  
  /**
   * Fetch all tasks for a user with their subtasks
   */
  async getTasks(userId: string): Promise<TaskWithSubtasks[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        subtasks (
          id,
          task_id,
          name,
          description,
          completed,
          position,
          created_at
        )
      `)
      .eq('user_id', userId)
      .order('position', { ascending: true })

    if (error) {
      throw new Error(`Failed to fetch tasks: ${error.message}`)
    }

    // Transform the data to match our Task type with subtasks array
    return (data || []).map(task => ({
      ...task,
      subtasks: (task.subtasks || []).sort((a: Subtask, b: Subtask) => a.position - b.position)
    })) as TaskWithSubtasks[]
  }

  /**
   * Create a new task
   */
  async createTask(userId: string, task: TaskInsert): Promise<TaskWithSubtasks> {
    // Get the next position for this user's tasks
    const { data: lastTask } = await supabase
      .from('tasks')
      .select('position')
      .eq('user_id', userId)
      .order('position', { ascending: false })
      .limit(1)
      .single()

    const nextPosition = lastTask ? lastTask.position + 1 : 1

    const taskData: TaskInsert = {
      ...task,
      user_id: userId,
      position: task.position ?? nextPosition,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert(taskData)
      .select(`
        *,
        subtasks (
          id,
          task_id,
          name,
          description,
          completed,
          position,
          created_at
        )
      `)
      .single()

    if (error) {
      throw new Error(`Failed to create task: ${error.message}`)
    }

    return {
      ...data,
      subtasks: data.subtasks || []
    } as TaskWithSubtasks
  }

  /**
   * Update an existing task
   */
  async updateTask(taskId: string, updates: TaskUpdate): Promise<TaskWithSubtasks> {
    const updateData: TaskUpdate = {
      ...updates,
      updated_at: new Date().toISOString()
    }

    // First update the task
    const { error: updateError } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', taskId)

    if (updateError) {
      throw new Error(`Failed to update task: ${updateError.message}`)
    }

    // Then fetch the updated task with subtasks
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        subtasks (
          id,
          task_id,
          name,
          description,
          completed,
          position,
          created_at
        )
      `)
      .eq('id', taskId)
      .single()

    if (error) {
      throw new Error(`Failed to fetch updated task: ${error.message}`)
    }

    return {
      ...data,
      subtasks: (data.subtasks || []).sort((a: Subtask, b: Subtask) => a.position - b.position)
    } as TaskWithSubtasks
  }

  /**
   * Delete a task and all its subtasks
   */
  async deleteTask(taskId: string): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)

    if (error) {
      throw new Error(`Failed to delete task: ${error.message}`)
    }
  }

  // ==================== SUBTASK METHODS ====================

  /**
   * Create a new subtask for a task
   */
  async createSubtask(taskId: string, subtask: SubtaskInsert): Promise<Subtask> {
    // Get the next position for this task's subtasks
    const { data: lastSubtask } = await supabase
      .from('subtasks')
      .select('position')
      .eq('task_id', taskId)
      .order('position', { ascending: false })
      .limit(1)
      .single()

    const nextPosition = lastSubtask ? lastSubtask.position + 1 : 1

    const subtaskData: SubtaskInsert = {
      ...subtask,
      task_id: taskId,
      position: subtask.position ?? nextPosition,
      created_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('subtasks')
      .insert(subtaskData)
      .select('*')
      .single()

    if (error) {
      throw new Error(`Failed to create subtask: ${error.message}`)
    }

    return data as Subtask
  }

  /**
   * Update an existing subtask
   */
  async updateSubtask(subtaskId: string, updates: SubtaskUpdate): Promise<Subtask> {
    const { data, error } = await supabase
      .from('subtasks')
      .update(updates)
      .eq('id', subtaskId)
      .select('*')
      .single()

    if (error) {
      throw new Error(`Failed to update subtask: ${error.message}`)
    }

    return data as Subtask
  }

  /**
   * Delete a subtask
   */
  async deleteSubtask(subtaskId: string): Promise<void> {
    const { error } = await supabase
      .from('subtasks')
      .delete()
      .eq('id', subtaskId)

    if (error) {
      throw new Error(`Failed to delete subtask: ${error.message}`)
    }
  }

  // ==================== POSITION/ORDERING METHODS ====================

  /**
   * Update positions of multiple tasks for drag-and-drop reordering
   */
  async updateTaskPositions(tasks: { id: string; position: number }[]): Promise<void> {
    // Update each task individually to avoid RLS issues with upsert
    const updatePromises = tasks.map(async ({ id, position }) => {
      const { error } = await supabase
        .from('tasks')
        .update({ 
          position, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id)

      if (error) {
        throw new Error(`Failed to update task ${id} position: ${error.message}`)
      }
    })

    await Promise.all(updatePromises)
  }

  /**
   * Update positions of multiple subtasks for drag-and-drop reordering
   */
  async updateSubtaskPositions(subtasks: { id: string; position: number }[]): Promise<void> {
    const updates = subtasks.map(({ id, position }) => ({ id, position }))

    const { error } = await supabase
      .from('subtasks')
      .upsert(updates, { 
        onConflict: 'id',
        ignoreDuplicates: false 
      })

    if (error) {
      throw new Error(`Failed to update subtask positions: ${error.message}`)
    }
  }

  // ==================== PROFILE METHODS ====================

  /**
   * Get user profile information
   */
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No profile found
        return null
      }
      throw new Error(`Failed to fetch profile: ${error.message}`)
    }

    return data as Profile
  }

  /**
   * Update user profile information
   */
  async updateProfile(userId: string, updates: { full_name?: string; email?: string }): Promise<Profile> {
    const updateData = {
      ...updates,
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select('*')
      .single()

    if (error) {
      throw new Error(`Failed to update profile: ${error.message}`)
    }

    return data as Profile
  }

  /**
   * Create a new user profile (usually called during user registration)
   */
  async createProfile(userId: string, email: string, fullName?: string): Promise<Profile> {
    const profileData = {
      id: userId,
      email,
      full_name: fullName || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('profiles')
      .insert(profileData)
      .select('*')
      .single()

    if (error) {
      throw new Error(`Failed to create profile: ${error.message}`)
    }

    return data as Profile
  }
}

// Export a singleton instance
export const databaseService = new DatabaseService()
