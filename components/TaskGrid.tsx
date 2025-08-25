'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TaskTile } from './TaskTile'
import { TaskFilterToolbar } from './TaskFilterToolbar'
import { Header } from './Header'
import { Footer } from './Footer'
import { CreateTaskDialog } from './CreateTaskDialog'
import { EditTaskDialog } from './EditTaskDialog'
import type { Task, FilterOptions, SortOption, Priority, Status, ViewMode } from '@/types/task'
import { getDueDateStatus } from '@/lib/date-utils'
import type { TaskInsert } from '@/src/types/database'
import { useTasks } from '../src/hooks/useTasks'
import { Alert, AlertDescription } from './ui/alert'
import { Loader2 } from 'lucide-react'

interface TaskGridProps {
  // Props can be added here as needed in the future
}

export function TaskGrid({}: TaskGridProps = {}) {
    const {
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
    deleteSubtask
  } = useTasks()
  const [filters, setFilters] = useState<FilterOptions>({ priority: 'all', status: 'all', searchTerm: '', dueDate: 'all' })
  const [sortBy, setSortBy] = useState<SortOption>('created')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [isFocusMode, setIsFocusMode] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)

  // Get the current editing task from the tasks array to ensure it's always up-to-date
  const editingTask = editingTaskId ? tasks.find(task => task.id === editingTaskId) || null : null



  const filteredAndSortedTasks = useMemo(() => {
    let filteredTasks = tasks.filter(task => {
      const priorityMatch = filters.priority === 'all' || task.priority === filters.priority
      const statusMatch = filters.status === 'all' || task.status === filters.status
      const searchMatch = !filters.searchTerm || 
        task.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(filters.searchTerm.toLowerCase())
      
      // Due date filtering
      let dueDateMatch = true
      if (filters.dueDate && filters.dueDate !== 'all') {
        const dueDateStatus = getDueDateStatus(task.due_date)
        switch (filters.dueDate) {
          case 'overdue':
            dueDateMatch = dueDateStatus === 'overdue'
            break
          case 'today':
            dueDateMatch = dueDateStatus === 'today'
            break
          case 'this-week':
            dueDateMatch = dueDateStatus === 'today' || dueDateStatus === 'tomorrow' || dueDateStatus === 'this-week'
            break
          case 'has-due-date':
            dueDateMatch = task.due_date !== null
            break
          case 'no-due-date':
            dueDateMatch = task.due_date === null
            break
        }
      }
      
      return priorityMatch && statusMatch && searchMatch && dueDateMatch
    })

    // Only apply sorting if we're not currently dragging AND sortBy is not 'created' (manual order)
    // This preserves manual drag-and-drop order when sortBy is 'created'
    if (!draggedTask && sortBy !== 'created') {
      filteredTasks = [...filteredTasks].sort((a, b) => {
        switch (sortBy) {
          case 'priority':
            const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 }
            return priorityOrder[a.priority] - priorityOrder[b.priority]
          case 'status':
            const statusOrder = { todo: 0, 'in-progress': 1, review: 2, done: 3 }
            return statusOrder[a.status] - statusOrder[b.status]
          case 'title':
            return a.title.localeCompare(b.title)
          case 'updated':
            return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          case 'due-date':
            // Tasks with no due date go to the end
            if (!a.due_date && !b.due_date) return 0
            if (!a.due_date) return 1
            if (!b.due_date) return -1
            return new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
          default:
            return 0
        }
      })
    }

    return filteredTasks
  }, [tasks, filters, sortBy, draggedTask])

  // Container classes based on view mode
  const getContainerClasses = () => {
    if (viewMode === 'list') {
      return `
        flex flex-col gap-4 w-full 
        max-w-5xl mx-auto
        px-2 sm:px-0
      `
    }
    
    // Grid view classes with wider tiles - reduced columns for wider tiles
    return `
      grid gap-5 w-full
      grid-cols-1 
      sm:grid-cols-1 
      md:grid-cols-2 
      lg:grid-cols-2 
      xl:grid-cols-3 
      2xl:grid-cols-4
      auto-rows-min
      items-start
    `
  }

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode)
  }

  // Async wrapper functions with error handling
  const handleToggleSubtask = async (taskId: string, subtaskId: string) => {
    try {
      await toggleSubtask(taskId, subtaskId)
    } catch (error) {
      console.error('Failed to toggle subtask:', error)
    }
  }

  const handleCreateTask = async (newTaskData: Omit<TaskInsert, 'user_id' | 'created_at' | 'updated_at'>, subtasks?: { name: string; description: string }[]) => {
    try {
      const createdTask = await createTask(newTaskData)
      
      // If there are subtasks to create, add them to the new task
      if (subtasks && subtasks.length > 0) {
        for (const subtask of subtasks) {
          await createSubtask(createdTask.id, subtask)
        }
      }
      
      setIsCreateDialogOpen(false)
    } catch (error) {
      console.error('Failed to create task:', error)
    }
  }

  const handleUpdateTask = async (taskId: string, updatedTaskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { subtasks, ...taskUpdateData } = updatedTaskData

      // Update the task fields first
      await updateTask(taskId, taskUpdateData)

      // Handle subtask changes - we need to compare with current subtasks and apply changes
      const currentTask = tasks.find(t => t.id === taskId)
      if (currentTask && subtasks) {
        const currentSubtasks = currentTask.subtasks
        const newSubtasks = subtasks

        // Find subtasks to delete (exist in current but not in new)
        const subtasksToDelete = currentSubtasks.filter(
          current => !newSubtasks.find(newSub => newSub.id === current.id)
        )

        // Find subtasks to update (exist in both but content changed)
        const subtasksToUpdate = newSubtasks.filter(newSub => {
          const currentSub = currentSubtasks.find(current => current.id === newSub.id)
          return currentSub && (
            currentSub.name !== newSub.name || 
            currentSub.description !== newSub.description
          )
        })

        // Find subtasks to create (exist in new but not in current)
        const subtasksToCreate = newSubtasks.filter(newSub => !newSub.id)

        // Execute all operations
        await Promise.all([
          // Delete removed subtasks
          ...subtasksToDelete.map(subtask => deleteSubtask(taskId, subtask.id)),
          
          // Update modified subtasks
          ...subtasksToUpdate.map(subtask => 
            updateSubtask(taskId, subtask.id!, {
              name: subtask.name,
              description: subtask.description || undefined
            })
          ),
          
          // Create new subtasks
          ...subtasksToCreate.map(subtask =>
            createSubtask(taskId, {
              name: subtask.name,
              description: subtask.description || undefined
            })
          )
        ])
      }

      setEditingTaskId(null)
    } catch (error) {
      console.error('Failed to update task:', error)
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId)
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  }

  const handleDuplicateTask = async (originalTask: Task) => {
    try {
      await duplicateTask(originalTask)
    } catch (error) {
      console.error('Failed to duplicate task:', error)
    }
  }

  const handleUpdateTaskPriority = async (taskId: string, priority: Priority) => {
    try {
      await updateTaskPriority(taskId, priority)
    } catch (error) {
      console.error('Failed to update task priority:', error)
    }
  }

  const handleUpdateTaskStatus = async (taskId: string, status: Status) => {
    try {
      await updateTaskStatus(taskId, status)
    } catch (error) {
      console.error('Failed to update task status:', error)
    }
  }

  const handleBatchUpdateSubtasks = async (taskId: string, completed: boolean) => {
    try {
      await batchUpdateSubtasks(taskId, completed)
    } catch (error) {
      console.error('Failed to update subtasks:', error)
    }
  }

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    console.log('Drag started:', task.title)
    setDraggedTask(task)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', task.id)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e: React.DragEvent, targetTask: Task) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!draggedTask || draggedTask.id === targetTask.id) {
      setDraggedTask(null)
      return
    }

    try {
      // Work with the original tasks array
      const newTasks = [...tasks]
      const draggedIndex = newTasks.findIndex(task => task.id === draggedTask.id)
      const targetIndex = newTasks.findIndex(task => task.id === targetTask.id)

      if (draggedIndex === -1 || targetIndex === -1) {
        setDraggedTask(null)
        return
      }

      // Remove dragged task and insert at target position
      const [movedTask] = newTasks.splice(draggedIndex, 1)
      newTasks.splice(targetIndex, 0, movedTask)

      // Calculate new positions for all affected tasks
      const positionUpdates = newTasks.map((task, index) => ({
        id: task.id,
        position: index + 1
      }))

      // Update positions in database and local state
      await updateTaskPositions(positionUpdates)
      
      setDraggedTask(null)
    } catch (error) {
      console.error('Failed to update task positions:', error)
      setDraggedTask(null)
    }
  }

  const handleDragEnd = () => {
    setDraggedTask(null)
  }

  // Note: focus toggle is now handled directly via updateTaskFocus in TaskTile

  const toggleFocusMode = () => {
    setIsFocusMode(!isFocusMode)
  }

  const clearAllFocus = async () => {
    try {
      // Update all tasks to be focused
      await Promise.all(
        tasks.map(task => updateTaskFocus(task.id, true))
      )
      setIsFocusMode(false)
    } catch (error) {
      console.error('Failed to clear focus:', error)
    }
  }

  const focusedTaskCount = tasks.filter(task => task.is_focused).length
  const hasFocusedTasks = isFocusMode && focusedTaskCount < tasks.length

  // Show loading state
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F9FAFB] dark:bg-[#0A0A0A] font-[Inter,system-ui,sans-serif] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#4f46e5]" />
          <p className="text-slate-600 dark:text-slate-400">Loading your tasks...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F9FAFB] dark:bg-[#0A0A0A] font-[Inter,system-ui,sans-serif]">
        <div className="flex-1 p-6 overflow-visible pb-20">
          <div className="w-full max-w-[1400px] mx-auto overflow-visible">
            {/* Error Display */}
            {error && (
              <Alert className="mb-4 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
                <AlertDescription className="text-red-800 dark:text-red-200">
                  {error}
                </AlertDescription>
              </Alert>
            )}
            {/* Header */}
            <Header 
              title="Tasks"
              isFocusMode={isFocusMode}
              onToggleFocusMode={toggleFocusMode}
              viewMode={viewMode}
              onViewModeChange={handleViewModeChange}
              onOpenCreateDialog={() => setIsCreateDialogOpen(true)}
            />

          {/* Filter Toolbar */}
          <TaskFilterToolbar
            filters={filters}
            sortBy={sortBy}
            onFiltersChange={setFilters}
            onSortChange={setSortBy}
            taskCount={filteredAndSortedTasks.length}
            totalTasks={tasks.length}
          />

          {/* Focus Controls */}
          {(isFocusMode || hasFocusedTasks) && (
            <div className="mb-4 flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200/60 dark:border-blue-800/50">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                  Focus mode active • {focusedTaskCount} of {tasks.length} tasks visible
                </span>
              </div>
              <button
                onClick={clearAllFocus}
                className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-150"
              >
                Clear Focus
              </button>
            </div>
          )}

          {/* Task Grid/List */}
          <div 
            className={`
              ${getContainerClasses()}
              relative mx-auto overflow-visible
              ${viewMode === 'grid' ? `
                max-w-[1400px]
                md:max-w-[1300px]
                max-[768px]:max-w-[90vw] max-[768px]:gap-4
                max-[480px]:max-w-[95vw] max-[480px]:gap-3
              ` : ''}
            `}
          >
            <AnimatePresence mode="popLayout">
              {filteredAndSortedTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30
                  }}
                >
                  <TaskTile
                    task={task}
                    taskNumber={index + 1}
                    viewMode={viewMode}
                    onToggleSubtask={handleToggleSubtask}
                    onUpdatePriority={handleUpdateTaskPriority}
                    onUpdateStatus={handleUpdateTaskStatus}
                    onEditTask={() => setEditingTaskId(task.id)}
                    onDeleteTask={handleDeleteTask}
                    onDuplicateTask={handleDuplicateTask}

                    onBatchUpdateSubtasks={handleBatchUpdateSubtasks}
                    onToggleFocus={(taskId: string) => updateTaskFocus(taskId, !task.is_focused)}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onDragEnd={handleDragEnd}
                    isDragging={draggedTask?.id === task.id}

                    hasFocusedTasks={hasFocusedTasks}
                    draggedTask={draggedTask}
                  />
                </motion.div>
              ))}

            {/* Empty state when no tasks */}
            {filteredAndSortedTasks.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                  <div className="w-8 h-8 border-2 border-dashed border-slate-400 dark:border-slate-500 rounded" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">No tasks found</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 max-w-sm">
                  {tasks.length === 0 
                    ? "Get started by creating your first task"
                    : "Try adjusting your filters to see more tasks"
                  }
                </p>
              </div>
            )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Create Task Dialog */}
      <CreateTaskDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateTask={handleCreateTask}
      />

      {/* Edit Task Dialog */}
      <EditTaskDialog
        task={editingTask}
        open={!!editingTask}
        onOpenChange={(open) => !open && setEditingTaskId(null)}
        onUpdateTask={handleUpdateTask}
      />
    </div>
  )
}