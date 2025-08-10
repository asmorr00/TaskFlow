


import { AlertTriangle, ArrowUp, Minus, ArrowDown } from 'lucide-react'

export type Priority = 'urgent' | 'high' | 'medium' | 'low'

interface PriorityBadgeProps {
  priority: Priority
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

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = priorityConfig[priority]
  const Icon = config.icon

  return (
    <div className={`
      inline-flex items-center gap-1 px-2 py-1 rounded-md border text-xs font-medium tracking-tight
      ${config.className}
    `}>
      <Icon className="w-3 h-3" />
      <span>{config.label}</span>
    </div>
  )
}