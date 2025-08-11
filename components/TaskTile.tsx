

import React, { useState } from 'react'
import { SubtaskItem } from './SubtaskItem'
import { EditablePriorityBadge } from './EditablePriorityBadge'
import { EditableStatusBadge } from './EditableStatusBadge'
import type { Task, Priority, Status, ViewMode } from '@/types/task'
import { Edit3, Eye, EyeOff, MoreHorizontal, Copy, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface TaskTileProps {
  task: Task
  taskNumber: number
  viewMode?: ViewMode
  onToggleSubtask: (taskId: string, subtaskId: string) => void
  onUpdatePriority: (taskId: string, priority: Priority) => void
  onUpdateStatus: (taskId: string, status: Status) => void
  onEditTask: () => void
  onDeleteTask: (taskId: string) => void
  onDuplicateTask: (task: Task) => void

  onBatchUpdateSubtasks: (taskId: string, completed: boolean) => void
  onToggleFocus: (taskId: string) => void
  onDragStart: (e: React.DragEvent, task: Task) => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent, task: Task) => void
  onDragEnd: () => void
  isDragging: boolean

  hasFocusedTasks: boolean
  draggedTask?: Task | null
}

export function TaskTile({
  task,
  taskNumber,
  viewMode = 'grid',
  onToggleSubtask,
  onUpdatePriority,
  onUpdateStatus,
  onEditTask,
  onDeleteTask,
  onDuplicateTask,

  onBatchUpdateSubtasks,
  onToggleFocus,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  isDragging,

  hasFocusedTasks,
  draggedTask
}: TaskTileProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [showActions, setShowActions] = useState(false)
  const [subtasksExpanded, setSubtasksExpanded] = useState(false)

  // Close actions menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showActions && !(event.target as Element).closest('.actions-menu')) {
        setShowActions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showActions])

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    if (draggedTask?.id !== task.id) {
      setIsDragOver(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    // Only set to false if we're leaving the entire tile
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX
    const y = e.clientY
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDragOver(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    onDrop(e, task)
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEditTask()
  }

  const allSubtasksCompleted = task.subtasks.length > 0 && task.subtasks.every(subtask => subtask.completed)

  const handleBatchComplete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onBatchUpdateSubtasks(task.id, !allSubtasksCompleted)
  }

  const handleFocusToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleFocus(task.id)
  }

  const isBlurred = hasFocusedTasks && !task.is_focused
  const showFocusButton = true // Always show focus button for better UX

  // Get container classes based on view mode
  const getContainerClasses = () => {
    const baseClasses = `
      bg-white dark:bg-[#1E1E1E] rounded-lg border border-slate-200/60 dark:border-slate-700/50 
      overflow-visible relative cursor-grab transition-all duration-200 ease-in-out select-none
      shadow-sm hover:shadow-md hover:border-slate-300/60 dark:hover:border-slate-600/50
      active:cursor-grabbing group
      ${isDragging ? 'rotate-1 scale-105 shadow-lg ring-2 ring-blue-500/20 z-[1000] opacity-95' : ''}
      ${isDragOver ? 'ring-2 ring-blue-500/40 bg-blue-50/50 dark:bg-blue-900/10 border-blue-400/60' : ''}
      ${isBlurred ? 'blur-sm opacity-40' : ''}
      ${task.is_focused && hasFocusedTasks ? 'ring-1 ring-blue-500/30 shadow-lg' : ''}
      ${subtasksExpanded && task.subtasks.length > 3 ? 'z-20' : 'z-10'}
    `
    
    if (viewMode === 'list') {
      return `${baseClasses} 
        w-full
        flex flex-col sm:flex-row items-start gap-6 sm:gap-8
        min-h-[140px] p-6
        overflow-visible
        max-[768px]:p-5
        max-[480px]:p-4
      `
    }
    
    // Grid view with wider padding
    return `${baseClasses}
      flex flex-col p-6 h-auto min-h-fit
      overflow-visible
      max-[768px]:p-5
      max-[480px]:p-4
    `
  }

  // Get content layout classes
  const getContentClasses = () => {
    if (viewMode === 'list') {
      return `
        flex-1 flex flex-col gap-4 min-w-0
      `
    }
    
    return `
      flex flex-col gap-4
    `
  }

  // Get subtask container classes
  const getSubtaskContainerClasses = () => {
    if (viewMode === 'list') {
      return `
        flex-shrink-0 w-full sm:w-96
        max-h-96 overflow-y-auto
        pl-6 border-l border-slate-100 dark:border-slate-700
      `
    }
    
    return `
      mt-4
    `
  }

  return (
    <div
        draggable={!isBlurred}
        onDragStart={(e) => {
          if (isBlurred) {
            e.preventDefault()
            return
          }
          onDragStart(e, task)
        }}
        onDragOver={onDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onDragEnd={onDragEnd}
        onClick={isBlurred ? handleFocusToggle : undefined}
        className={getContainerClasses()}
      >
        {/* Task Number */}
        <div className="absolute top-5 right-5 z-10">
          {viewMode === 'list' ? (
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-tight">
              {taskNumber}.0
            </span>
          ) : (
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-tight
                            max-[768px]:text-[11px] max-[768px]:top-4 max-[768px]:right-4
                            max-[480px]:text-[10px] max-[480px]:top-3 max-[480px]:right-3">
              {taskNumber}.0
            </span>
          )}
        </div>

        {/* Actions Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            setShowActions(!showActions)
          }}
          className="
            absolute top-5 right-16 p-1.5 rounded-md transition-all duration-200 ease-in-out
            opacity-0 group-hover:opacity-100 z-10
            hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400
            max-[768px]:top-4 max-[768px]:right-14
            max-[480px]:top-3 max-[480px]:right-13
          "
          title="Task actions"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>

        {/* Focus Button - moved to bottom right corner */}
        {showFocusButton && (
          <button
            onClick={handleFocusToggle}
            className={`
              absolute bottom-5 right-5 p-2 rounded-md transition-all duration-200 ease-in-out z-20
              opacity-0 group-hover:opacity-100
              hover:bg-slate-100 dark:hover:bg-slate-800
              max-[768px]:bottom-4 max-[768px]:right-4
              max-[480px]:bottom-3 max-[480px]:right-3
              ${task.is_focused 
                ? 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300' 
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400'
              }
            `}
            title={task.is_focused ? "Remove from focus" : "Add to focus"}
          >
            {task.is_focused ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        )}

        {/* Main Content */}
        <div className={`${getContentClasses()} ${viewMode === 'list' ? 'pr-16' : ''}`}>
          {/* Header with title, priority, status */}
          <div className="flex items-start justify-between gap-4">
            <div className={`flex-1 min-w-0 ${viewMode === 'grid' ? 'pr-16' : 'pr-4'} max-w-xs`}>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3 leading-tight tracking-tight break-words
                             max-[768px]:text-base
                             max-[480px]:text-[15px]">
                {task.title}
              </h3>
              {task.description && (
                <p className={`text-sm text-slate-600 dark:text-slate-400 leading-relaxed tracking-tight
                              max-[768px]:text-[13px]
                              max-[480px]:text-xs
                              ${viewMode === 'list' ? 'line-clamp-2' : ''}`}>
                  {task.description}
                </p>
              )}
            </div>
          </div>

          {/* Priority and Status badges */}
          <div className="flex gap-3 flex-wrap" onClick={(e) => e.stopPropagation()}>
            <EditablePriorityBadge 
              priority={task.priority} 
              onChange={(priority) => onUpdatePriority(task.id, priority)}
            />
            <EditableStatusBadge 
              status={task.status} 
              onChange={(status) => onUpdateStatus(task.id, status)}
            />
          </div>
        </div>

        {/* Subtasks - positioned differently based on view mode */}
        {task.subtasks.length > 0 && (
          <div className={getSubtaskContainerClasses()}>
            {/* Subtasks header */}
            <div className="flex items-center justify-between mb-4 gap-4" onClick={(e) => e.stopPropagation()}>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex-shrink-0">
                Subtasks ({task.subtasks.filter(s => s.completed).length}/{task.subtasks.length})
              </span>
              
              {/* Bulk action button - positioned to avoid overlap with task number */}
              <div className={`flex items-center gap-2 ${viewMode === 'list' ? 'pr-24' : ''}`}>
                {task.subtasks.length > (viewMode === 'list' ? 10 : 3) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setSubtasksExpanded(!subtasksExpanded)
                    }}
                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors duration-150 relative z-10"
                    title={subtasksExpanded ? "Show fewer subtasks" : "Show all subtasks"}
                  >
                    {subtasksExpanded ? (
                      <ChevronUp className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                    ) : (
                      <ChevronDown className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                    )}
                  </button>
                )}
                {task.subtasks.length > 1 && (
                  <button
                    onClick={handleBatchComplete}
                    className="text-xs px-3 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-md transition-colors duration-200 whitespace-nowrap relative z-10"
                    title={allSubtasksCompleted ? "Mark all incomplete" : "Mark all complete"}
                  >
                    {allSubtasksCompleted ? 'Mark all incomplete' : 'Mark all complete'}
                  </button>
                )}
              </div>
            </div>
            
            {/* Subtasks list */}
            <div className="space-y-3">
              {(subtasksExpanded ? task.subtasks : task.subtasks.slice(0, viewMode === 'list' ? 10 : 3)).map((subtask, index) => (
                <motion.div
                  key={subtask.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                >
                  <SubtaskItem
                    subtask={subtask}
                    subtaskNumber={`${taskNumber}.${index + 1}`}
                    onToggle={() => onToggleSubtask(task.id, subtask.id)}
                  />
                </motion.div>
              ))}
              
              {task.subtasks.length > (viewMode === 'list' ? 10 : 3) && !subtasksExpanded && (
                <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                  +{task.subtasks.length - (viewMode === 'list' ? 10 : 3)} more subtask{task.subtasks.length - (viewMode === 'list' ? 10 : 3) === 1 ? '' : 's'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Actions Menu */}
        <AnimatePresence>
          {showActions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="actions-menu absolute top-12 right-16 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-1 z-20"
            >
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              >
                <Edit3 className="w-3 h-3" />
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDuplicateTask(task)
                  setShowActions(false)
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              >
                <Copy className="w-3 h-3" />
                Duplicate
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteTask(task.id)
                  setShowActions(false)
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                Delete
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
  )
}