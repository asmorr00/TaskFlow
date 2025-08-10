

import { useState } from 'react'
import { AlertTriangle, ArrowUp, Minus, ArrowDown, ChevronDown } from 'lucide-react'
import type { Priority } from '@/types/task'

interface EditablePriorityBadgeProps {
  priority: Priority
  onChange: (priority: Priority) => void
}

const priorityConfig = {
  urgent: {
    label: 'Urgent',
    icon: AlertTriangle,
    className: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200/60 dark:border-red-800/50'
  },
  high: {
    label: 'High',
    icon: ArrowUp,
    className: 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border-orange-200/60 dark:border-orange-800/50'
  },
  medium: {
    label: 'Medium',
    icon: Minus,
    className: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200/60 dark:border-yellow-800/50'
  },
  low: {
    label: 'Low',
    icon: ArrowDown,
    className: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200/60 dark:border-green-800/50'
  }
}

const priorities: Priority[] = ['urgent', 'high', 'medium', 'low']

export function EditablePriorityBadge({ priority, onChange }: EditablePriorityBadgeProps) {
  const [isOpen, setIsOpen] = useState(false)
  const config = priorityConfig[priority]
  const Icon = config.icon

  const handleSelect = (newPriority: Priority) => {
    onChange(newPriority)
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
          <div className="absolute top-full left-0 mt-1 bg-white dark:bg-[#1E1E1E] border border-slate-200/60 dark:border-slate-700/50 rounded-lg shadow-lg z-50 min-w-[120px]">
            {priorities.map((p) => {
              const itemConfig = priorityConfig[p]
              const ItemIcon = itemConfig.icon
              return (
                <button
                  key={p}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSelect(p)
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