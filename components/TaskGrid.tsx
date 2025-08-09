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
import { useLocalStorage } from '@/hooks/useLocalStorage'

const createInitialTasks = (): Task[] => [
  {
    id: '1',
    title: 'Website Redesign',
    description: 'Complete the new website design and development',
    priority: 'high',
    status: 'in-progress',
    isFocused: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    subtasks: [
      { id: '1.1', name: 'Create wireframes', description: 'Design initial page layouts and user flows', completed: false },
      { id: '1.2', name: 'Develop components', description: 'Build reusable UI components', completed: false },
      { id: '1.3', name: 'Testing & QA', description: 'Perform comprehensive testing', completed: false }
    ]
  },
  {
    id: '2',
    title: 'Mobile App',
    description: 'Develop cross-platform mobile application',
    priority: 'urgent',
    status: 'in-progress',
    isFocused: true,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    subtasks: [
      { id: '2.1', name: 'Setup project', description: 'Initialize React Native project', completed: true },
      { id: '2.2', name: 'User authentication', description: 'Implement login and registration', completed: false },
      { id: '2.3', name: 'Push notifications', description: 'Add push notification support', completed: false }
    ]
  }
]

export function TaskGrid() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('floatier-tasks', createInitialTasks())
  const [filters, setFilters] = useState<FilterOptions>({ priority: 'all', status: 'all', searchTerm: '' })
  const [sortBy, setSortBy] = useState<SortOption>('created')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [isFocusMode, setIsFocusMode] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)

  const filteredAndSortedTasks = useMemo(() => {
    let filteredTasks = tasks.filter(task => {
      const priorityMatch = filters.priority === 'all' || task.priority === filters.priority
      const statusMatch = filters.status === 'all' || task.status === filters.status
      const searchMatch = !filters.searchTerm || 
        task.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(filters.searchTerm.toLowerCase())
      return priorityMatch && statusMatch && searchMatch
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
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
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

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              updatedAt: new Date(),
              subtasks: task.subtasks.map(subtask =>
                subtask.id === subtaskId
                  ? { ...subtask, completed: !subtask.completed }
                  : subtask
              )
            }
          : task
      )
    )
  }

  const createTask = (newTaskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: Date.now().toString(),
      isFocused: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      subtasks: newTaskData.subtasks.map((subtask, index) => ({
        ...subtask,
        id: `${Date.now()}-${index}`
      }))
    }
    setTasks(prevTasks => [...prevTasks, newTask])
  }

  const updateTask = (taskId: string, updatedTaskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId 
          ? { 
              ...task,
              ...updatedTaskData, 
              id: taskId,
              updatedAt: new Date()
            }
          : task
      )
    )
  }

  const deleteTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId))
  }

  const duplicateTask = (originalTask: Task) => {
    const duplicatedTask: Task = {
      ...originalTask,
      id: Date.now().toString(),
      title: `Copy of ${originalTask.title}`,
      status: 'todo',
      isFocused: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      subtasks: originalTask.subtasks.map((subtask, index) => ({
        ...subtask,
        id: `${Date.now()}-${index}`,
        completed: false
      }))
    }
    
    const originalIndex = tasks.findIndex(task => task.id === originalTask.id)
    setTasks(prevTasks => {
      const newTasks = [...prevTasks]
      newTasks.splice(originalIndex + 1, 0, duplicatedTask)
      return newTasks
    })
  }

  const updateTaskPriority = (taskId: string, priority: Priority) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, priority, updatedAt: new Date() } : task
      )
    )
  }

  const updateTaskStatus = (taskId: string, status: Status) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, status, updatedAt: new Date() } : task
      )
    )
  }

  const batchUpdateSubtasks = (taskId: string, completed: boolean) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              updatedAt: new Date(),
              subtasks: task.subtasks.map(subtask => ({ ...subtask, completed }))
            }
          : task
      )
    )
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

  const handleDrop = (e: React.DragEvent, targetTask: Task) => {
    e.preventDefault()
    e.stopPropagation()
    
    console.log('Drop event triggered')
    console.log('Dragged task:', draggedTask?.title)
    console.log('Target task:', targetTask.title)
    
    if (!draggedTask || draggedTask.id === targetTask.id) {
      console.log('No valid drag operation')
      setDraggedTask(null)
      return
    }

    // Work with the original tasks array
    const newTasks = [...tasks]
    const draggedIndex = newTasks.findIndex(task => task.id === draggedTask.id)
    const targetIndex = newTasks.findIndex(task => task.id === targetTask.id)

    console.log('Dragged index:', draggedIndex, 'Target index:', targetIndex)

    if (draggedIndex === -1 || targetIndex === -1) {
      console.log('Invalid indices')
      setDraggedTask(null)
      return
    }

    // Remove dragged task and insert at target position
    const [movedTask] = newTasks.splice(draggedIndex, 1)
    newTasks.splice(targetIndex, 0, movedTask)

    console.log('Updating tasks order')
    setTasks(newTasks)
    setDraggedTask(null)
  }

  const handleDragEnd = () => {
    console.log('Drag ended')
    setDraggedTask(null)
  }

  const toggleTaskFocus = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, isFocused: !task.isFocused, updatedAt: new Date() } : task
      )
    )
  }

  const toggleFocusMode = () => {
    setIsFocusMode(!isFocusMode)
  }

  const clearAllFocus = () => {
    setTasks(prevTasks =>
      prevTasks.map(task => ({ ...task, isFocused: true }))
    )
    setIsFocusMode(false)
  }

  const focusedTaskCount = tasks.filter(task => task.isFocused).length
  const hasFocusedTasks = isFocusMode && focusedTaskCount < tasks.length

  return (
    <div className="flex flex-col min-h-screen bg-[#F9FAFB] dark:bg-[#0A0A0A] font-[Inter,system-ui,sans-serif]">
        <div className="flex-1 p-6 overflow-visible pb-20">
          <div className="w-full max-w-[1400px] mx-auto overflow-visible">
            {/* Header */}
            <Header 
              isFocusMode={isFocusMode}
              onToggleFocusMode={toggleFocusMode}
              viewMode={viewMode}
              onViewModeChange={handleViewModeChange}
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
                    onToggleSubtask={toggleSubtask}
                    onUpdatePriority={updateTaskPriority}
                    onUpdateStatus={updateTaskStatus}
                    onEditTask={() => setEditingTask(task)}
                    onDeleteTask={deleteTask}
                    onDuplicateTask={duplicateTask}

                    onBatchUpdateSubtasks={batchUpdateSubtasks}
                    onToggleFocus={toggleTaskFocus}
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
        onCreateTask={createTask}
      />

      {/* Edit Task Dialog */}
      <EditTaskDialog
        task={editingTask}
        open={!!editingTask}
        onOpenChange={(open) => !open && setEditingTask(null)}
        onUpdateTask={(task) => {
          updateTask(task.id, task)
          setEditingTask(null)
        }}
      />
    </div>
  )
}