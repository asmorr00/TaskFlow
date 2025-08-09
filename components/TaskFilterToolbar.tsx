'use client'


import { Filter, ArrowUpDown, X, Search } from 'lucide-react'
import type { Priority, Status, FilterOptions, SortOption } from '@/types/task'

interface TaskFilterToolbarProps {
  filters: FilterOptions
  sortBy: SortOption
  onFiltersChange: (filters: FilterOptions) => void
  onSortChange: (sort: SortOption) => void
  taskCount: number
  totalTasks?: number
}

export function TaskFilterToolbar({ 
  filters, 
  sortBy, 
  onFiltersChange, 
  onSortChange, 
  taskCount,
  totalTasks = taskCount
}: TaskFilterToolbarProps) {
  const hasActiveFilters = filters.priority !== 'all' || filters.status !== 'all' || (filters.searchTerm && filters.searchTerm.length > 0)
  const isFiltered = taskCount !== totalTasks

  const clearFilters = () => {
    onFiltersChange({ priority: 'all', status: 'all', searchTerm: '' })
    onSortChange('created')
  }

  return (
    <div className="flex flex-col gap-4 mb-6 p-4 bg-white dark:bg-[#1E1E1E] border border-slate-200/60 dark:border-slate-700/50 rounded-lg">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search tasks..."
          value={filters.searchTerm || ''}
          onChange={(e) => onFiltersChange({ ...filters, searchTerm: e.target.value })}
          className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-[#141414] border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-150"
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Filters:</span>
          </div>

          {/* Priority Filter */}
          <select
            value={filters.priority}
            onChange={(e) => onFiltersChange({ ...filters, priority: e.target.value as Priority | 'all' })}
            className="px-3 py-1.5 text-xs font-medium bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 rounded-md text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => onFiltersChange({ ...filters, status: e.target.value as Status | 'all' })}
            className="px-3 py-1.5 text-xs font-medium bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 rounded-md text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
          </select>

          {/* Sort Options */}
          <div className="flex items-center gap-2 border-l border-slate-200/60 dark:border-slate-700/50 pl-4">
            <ArrowUpDown className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="px-3 py-1.5 text-xs font-medium bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 rounded-md text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="created">Created (Newest First)</option>
              <option value="updated">Updated (Most Recent)</option>
              <option value="priority">Priority (High to Low)</option>
              <option value="status">Status</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {isFiltered ? (
              <>
                {taskCount} of {totalTasks} {totalTasks === 1 ? 'task' : 'tasks'}
              </>
            ) : (
              <>
                {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
              </>
            )}
          </span>
          
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors duration-150"
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  )
}