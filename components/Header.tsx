'use client'

import { useState } from 'react'
import { Plus, Focus, Grid3X3, List } from 'lucide-react'
import type { ViewMode } from '@/types/task'

import { CreateTaskDialog } from './CreateTaskDialog'


interface HeaderProps {
  isFocusMode: boolean
  onToggleFocusMode: () => void
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
}

export function Header({ isFocusMode, onToggleFocusMode, viewMode, onViewModeChange }: HeaderProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const handleCreateTask = () => {
    setIsCreateDialogOpen(false)
  }

  return (
    <>
      <header className="w-full mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
          Floatier
        </h1>
        
        <div className="flex items-center gap-3 pr-8">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`
                p-2 rounded-md transition-colors duration-200
                ${viewMode === 'grid' 
                  ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }
              `}
              title="Grid View"
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`
                p-2 rounded-md transition-colors duration-200
                ${viewMode === 'list' 
                  ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }
              `}
              title="List View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          {/* Focus Mode Toggle */}
          <button
            onClick={onToggleFocusMode}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ease-in-out shadow-sm hover:shadow-md
              text-sm font-medium tracking-tight
              ${isFocusMode 
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
              }
            `}
            title={isFocusMode ? "Exit focus mode" : "Enter focus mode"}
          >
            <Focus className="w-4 h-4" />
            {isFocusMode ? 'Focus On' : 'Focus'}
          </button>
          <button
            onClick={() => setIsCreateDialogOpen(true)}
            className="
              flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg
              transition-all duration-200 ease-in-out shadow-sm hover:shadow-md
              text-sm font-medium tracking-tight
            "
          >
            <Plus className="w-4 h-4" />
            Add Task
          </button>

        </div>
      </header>

      <CreateTaskDialog 
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateTask={handleCreateTask}
      />
    </>
  )
}