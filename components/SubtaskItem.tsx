'use client'


import { Checkbox } from './ui/checkbox'
import type { Subtask } from '@/types/task'

interface SubtaskItemProps {
  subtask: Subtask
  subtaskNumber: string
  onToggle: () => void
}

export function SubtaskItem({ subtask, subtaskNumber, onToggle }: SubtaskItemProps) {
  return (
    <div
      className={`
        flex items-start transition-all duration-150 ease-in-out hover:bg-slate-50/50 dark:hover:bg-slate-800/30 
        rounded-md p-2 -m-2 group
        max-[480px]:p-1.5 max-[480px]:-m-1.5
        ${subtask.completed ? 'opacity-75' : ''}
      `}
    >
      {/* Checkbox */}
      <Checkbox
        checked={subtask.completed}
        onCheckedChange={onToggle}
        className="mt-0.5 mr-3 max-[480px]:mr-2.5"
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className={`
          text-sm font-medium text-slate-900 dark:text-slate-100 mb-0.5 leading-snug tracking-tight
          max-[768px]:text-[13px]
          max-[480px]:text-xs
          ${subtask.completed ? 'line-through text-slate-500 dark:text-slate-400' : ''}
        `}>
          {subtask.name}
          <span className="text-xs text-slate-400 dark:text-slate-500 font-normal ml-2 tracking-normal
                           max-[768px]:text-[10px]
                           max-[480px]:text-[9px]">
            {subtaskNumber}
          </span>
        </div>
        <div className={`
          text-xs text-slate-500 dark:text-slate-400 leading-relaxed tracking-tight
          max-[768px]:text-[11px]
          max-[480px]:text-[10px]
          ${subtask.completed ? 'line-through opacity-75' : ''}
        `}>
          {subtask.description}
        </div>
      </div>
    </div>
  )
}