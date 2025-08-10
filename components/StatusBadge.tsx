


import { Circle, Clock, Eye, CheckCircle } from 'lucide-react'

export type Status = 'todo' | 'in-progress' | 'review' | 'done'

interface StatusBadgeProps {
  status: Status
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

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status]
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