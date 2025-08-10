

import { useState } from 'react'
import { Circle, Clock, Eye, CheckCircle, ChevronDown } from 'lucide-react'
import type { Status } from '@/types/task'

interface EditableStatusBadgeProps {
  status: Status
  onChange: (status: Status) => void
}

const statusConfig = {
  todo: {
    label: 'To Do',
    icon: Circle,
    className: 'bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-slate-200/60 dark:border-slate-700/50'
  },
  'in-progress': {
    label: 'In Progress',
    icon: Clock,
    className: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200/60 dark:border-blue-800/50'
  },
  review: {
    label: 'Review',
    icon: Eye,
    className: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-200/60 dark:border-purple-800/50'
  },
  done: {
    label: 'Done',
    icon: CheckCircle,
    className: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200/60 dark:border-green-800/50'
  }
}

const statuses: Status[] = ['todo', 'in-progress', 'review', 'done']

export function EditableStatusBadge({ status, onChange }: EditableStatusBadgeProps) {
  const [isOpen, setIsOpen] = useState(false)
  const config = statusConfig[status]
  const Icon = config.icon

  const handleSelect = (newStatus: Status) => {
    onChange(newStatus)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        className={`
          inline-flex items-center gap-1 px-2 py-1 rounded-md border text-xs font-medium tracking-tight
          transition-all duration-150 ease-in-out hover:opacity-80
          ${config.className}
        `}
      >
        <Icon className="w-3 h-3" />
        <span>{config.label}</span>
        <ChevronDown className="w-3 h-3 ml-0.5" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-1 bg-white dark:bg-[#1E1E1E] border border-slate-200/60 dark:border-slate-700/50 rounded-lg shadow-lg z-50 min-w-[130px]">
            {statuses.map((s) => {
              const itemConfig = statusConfig[s]
              const ItemIcon = itemConfig.icon
              return (
                <button
                  key={s}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSelect(s)
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 first:rounded-t-lg last:rounded-b-lg transition-colors duration-150"
                >
                  <ItemIcon className="w-3 h-3" />
                  {itemConfig.label}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}