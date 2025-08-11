import { useState, useEffect, useCallback } from 'react'
import { Task, Priority, Status } from '../../types/task'
import { TaskInsert, TaskUpdate } from '../types/database'
import { databaseService, TaskWithSubtasks } from '../services/database'
import { useAuth } from '../components/AuthProvider'

interface UseTasksState {
  tasks: Task[]
  loading: boolean
  error: string | null
}

interface UseTasksActions {
  createTask: (taskData: Omit<TaskInsert, 'user_id' | 'created_at' | 'updated_at'>) => Promise<TaskWithSubtasks>
  updateTask: (taskId: string, updates: Partial<TaskUpdate>) => Promise<void>
  deleteTask: (taskId: string) => Promise<void>
  duplicateTask: (originalTask: Task) => Promise<void>
  updateTaskPriority: (taskId: string, priority: Priority) => Promise<void>
  updateTaskStatus: (taskId: string, status: Status) => Promise<void>
  updateTaskFocus: (taskId: string, isFocused: boolean) => Promise<void>
  updateTaskPositions: (taskPositions: { id: string; position: number }[]) => Promise<void>
  toggleSubtask: (taskId: string, subtaskId: string) => Promise<void>
  batchUpdateSubtasks: (taskId: string, completed: boolean) => Promise<void>
  createSubtask: (taskId: string, subtaskData: { name: string; description?: string }) => Promise<void>
  updateSubtask: (taskId: string, subtaskId: string, updates: { name?: string; description?: string }) => Promise<void>
  deleteSubtask: (taskId: string, subtaskId: string) => Promise<void>
  refreshTasks: () => Promise<void>
}

export function useTasks(): UseTasksState & UseTasksActions {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load tasks when user changes
  useEffect(() => {
    if (user) {
      loadTasks()
    } else {
      setTasks([])
      setLoading(false)
    }
  }, [user])

  const loadTasks = useCallback(async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)
      const userTasks = await databaseService.getTasks(user.id)
      // Ensure tasks have the required structure
      setTasks(userTasks as Task[])
    } catch (err) {
      console.error('Error loading tasks:', err)
      setError(err instanceof Error ? err.message : 'Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }, [user])

  const refreshTasks = useCallback(async () => {
    await loadTasks()
  }, [loadTasks])

  const createTask = useCallback(async (taskData: Omit<TaskInsert, 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('User not authenticated')

    try {
      setError(null)
      const newTask = await databaseService.createTask(user.id, {
        ...taskData,
        user_id: user.id
      })
      
      // Add the new task to local state
      setTasks(prevTasks => [...prevTasks, newTask as Task])
      
      return newTask
    } catch (err) {
      console.error('Error creating task:', err)
      setError(err instanceof Error ? err.message : 'Failed to create task')
      throw err
    }
  }, [user])

  const updateTask = useCallback(async (taskId: string, updates: Partial<TaskUpdate>) => {
    if (!user) throw new Error('User not authenticated')

    try {
      setError(null)
      const updatedTask = await databaseService.updateTask(taskId, updates)
      
      // Update local state
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? updatedTask as Task : task
        )
      )
    } catch (err) {
      console.error('Error updating task:', err)
      setError(err instanceof Error ? err.message : 'Failed to update task')
      throw err
    }
  }, [user])

  const deleteTask = useCallback(async (taskId: string) => {
    if (!user) throw new Error('User not authenticated')

    try {
      setError(null)
      await databaseService.deleteTask(taskId)
      
      // Remove from local state
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId))
    } catch (err) {
      console.error('Error deleting task:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete task')
      throw err
    }
  }, [user])

  const duplicateTask = useCallback(async (originalTask: Task) => {
    if (!user) throw new Error('User not authenticated')

    try {
      setError(null)
      
      // Create task data for duplication
      const taskData: Omit<TaskInsert, 'user_id' | 'created_at' | 'updated_at'> = {
        title: `Copy of ${originalTask.title}`,
        description: originalTask.description,
        priority: originalTask.priority,
        status: 'todo',
        is_focused: true,
        position: originalTask.position + 1
      }

      const newTask = await databaseService.createTask(user.id, {
        ...taskData,
        user_id: user.id
      })

      // Duplicate subtasks
      for (let i = 0; i < originalTask.subtasks.length; i++) {
        const subtask = originalTask.subtasks[i]
        await databaseService.createSubtask(newTask.id, {
          task_id: newTask.id,
          name: subtask.name,
          description: subtask.description,
          completed: false,
          position: i + 1
        })
      }

      // Refresh tasks to get the complete task with subtasks
      await refreshTasks()
    } catch (err) {
      console.error('Error duplicating task:', err)
      setError(err instanceof Error ? err.message : 'Failed to duplicate task')
      throw err
    }
  }, [user, refreshTasks])

  const updateTaskPriority = useCallback(async (taskId: string, priority: Priority) => {
    await updateTask(taskId, { priority })
  }, [updateTask])

  const updateTaskStatus = useCallback(async (taskId: string, status: Status) => {
    await updateTask(taskId, { status })
  }, [updateTask])

  const updateTaskFocus = useCallback(async (taskId: string, isFocused: boolean) => {
    await updateTask(taskId, { is_focused: isFocused })
  }, [updateTask])

  const updateTaskPositions = useCallback(async (taskPositions: { id: string; position: number }[]) => {
    if (!user) throw new Error('User not authenticated')

    try {
      setError(null)
      
      // Update positions in database
      await databaseService.updateTaskPositions(taskPositions)
      
      // Update local state with new positions
      setTasks(prevTasks => {
        const tasksMap = new Map(prevTasks.map(task => [task.id, task]))
        
        // Apply position updates
        taskPositions.forEach(({ id, position }) => {
          const task = tasksMap.get(id)
          if (task) {
            task.position = position
          }
        })
        
        // Return sorted by position
        return Array.from(tasksMap.values()).sort((a, b) => a.position - b.position)
      })
    } catch (err) {
      console.error('Error updating task positions:', err)
      setError(err instanceof Error ? err.message : 'Failed to update task positions')
      throw err
    }
  }, [user])

  const toggleSubtask = useCallback(async (taskId: string, subtaskId: string) => {
    if (!user) throw new Error('User not authenticated')

    try {
      setError(null)
      
      // Find the current subtask to toggle its completed status
      const task = tasks.find(t => t.id === taskId)
      const subtask = task?.subtasks.find(s => s.id === subtaskId)
      
      if (!subtask) {
        throw new Error('Subtask not found')
      }

      // Update subtask in database
      await databaseService.updateSubtask(subtaskId, {
        completed: !subtask.completed
      })

      // Update local state
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId
            ? {
                ...task,
                subtasks: task.subtasks.map(st =>
                  st.id === subtaskId
                    ? { ...st, completed: !st.completed }
                    : st
                )
              }
            : task
        )
      )
    } catch (err) {
      console.error('Error toggling subtask:', err)
      setError(err instanceof Error ? err.message : 'Failed to update subtask')
      throw err
    }
  }, [user, tasks])

  const batchUpdateSubtasks = useCallback(async (taskId: string, completed: boolean) => {
    if (!user) throw new Error('User not authenticated')

    try {
      setError(null)
      
      const task = tasks.find(t => t.id === taskId)
      if (!task) {
        throw new Error('Task not found')
      }

      // Update all subtasks in parallel
      await Promise.all(
        task.subtasks.map(subtask =>
          databaseService.updateSubtask(subtask.id, { completed })
        )
      )

      // Update local state
      setTasks(prevTasks =>
        prevTasks.map(t =>
          t.id === taskId
            ? {
                ...t,
                subtasks: t.subtasks.map(subtask => ({ ...subtask, completed }))
              }
            : t
        )
      )
    } catch (err) {
      console.error('Error batch updating subtasks:', err)
      setError(err instanceof Error ? err.message : 'Failed to update subtasks')
      throw err
    }
  }, [user, tasks])

  const createSubtask = useCallback(async (taskId: string, subtaskData: { name: string; description?: string }) => {
    if (!user) throw new Error('User not authenticated')

    try {
      setError(null)
      
      const newSubtask = await databaseService.createSubtask(taskId, {
        task_id: taskId,
        name: subtaskData.name,
        description: subtaskData.description || null,
        completed: false
      })

      // Update local state
      setTasks(prevTasks => {
        const updatedTasks = prevTasks.map(task =>
          task.id === taskId
            ? {
                ...task,
                subtasks: [...task.subtasks, newSubtask].sort((a, b) => a.position - b.position)
              }
            : task
        )

        return updatedTasks
      })
    } catch (err) {
      console.error('Error creating subtask:', err)
      setError(err instanceof Error ? err.message : 'Failed to create subtask')
      throw err
    }
  }, [user])

  const updateSubtask = useCallback(async (taskId: string, subtaskId: string, updates: { name?: string; description?: string }) => {
    if (!user) throw new Error('User not authenticated')

    try {
      setError(null)
      
      await databaseService.updateSubtask(subtaskId, updates)

      // Update local state
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId
            ? {
                ...task,
                subtasks: task.subtasks.map(subtask =>
                  subtask.id === subtaskId
                    ? { ...subtask, ...updates }
                    : subtask
                )
              }
            : task
        )
      )
    } catch (err) {
      console.error('Error updating subtask:', err)
      setError(err instanceof Error ? err.message : 'Failed to update subtask')
      throw err
    }
  }, [user])

  const deleteSubtask = useCallback(async (taskId: string, subtaskId: string) => {
    if (!user) throw new Error('User not authenticated')

    try {
      setError(null)
      
      await databaseService.deleteSubtask(subtaskId)

      // Update local state
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId
            ? {
                ...task,
                subtasks: task.subtasks.filter(subtask => subtask.id !== subtaskId)
              }
            : task
        )
      )
    } catch (err) {
      console.error('Error deleting subtask:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete subtask')
      throw err
    }
  }, [user])

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    duplicateTask,
    updateTaskPriority,
    updateTaskStatus,
    updateTaskFocus,
    updateTaskPositions,
    toggleSubtask,
    batchUpdateSubtasks,
    createSubtask,
    updateSubtask,
    deleteSubtask,
    refreshTasks
  }
}
