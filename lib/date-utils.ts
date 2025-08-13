import { format, isToday, isTomorrow, isPast, isWithinInterval, startOfDay, addDays } from 'date-fns'

export type DueDateStatus = 'overdue' | 'today' | 'tomorrow' | 'this-week' | 'upcoming' | null

/**
 * Get the status of a task based on its due date
 */
export function getDueDateStatus(dueDate: string | null): DueDateStatus {
  if (!dueDate) return null
  
  const date = new Date(dueDate)
  const now = new Date()
  
  // Check if overdue (past and not today)
  if (isPast(date) && !isToday(date)) {
    return 'overdue'
  }
  
  // Check if due today
  if (isToday(date)) {
    return 'today'
  }
  
  // Check if due tomorrow
  if (isTomorrow(date)) {
    return 'tomorrow'
  }
  
  // Check if due within the next 7 days
  const weekFromNow = addDays(startOfDay(now), 7)
  if (isWithinInterval(date, { start: now, end: weekFromNow })) {
    return 'this-week'
  }
  
  // Otherwise it's upcoming (more than a week away)
  return 'upcoming'
}

/**
 * Get the color class for a due date status
 */
export function getDueDateColor(status: DueDateStatus): string {
  switch (status) {
    case 'overdue':
      return 'text-red-500 dark:text-red-400'
    case 'today':
      return 'text-orange-500 dark:text-orange-400'
    case 'tomorrow':
      return 'text-amber-500 dark:text-amber-400'
    case 'this-week':
      return 'text-yellow-500 dark:text-yellow-400'
    case 'upcoming':
      return 'text-blue-500 dark:text-blue-400'
    default:
      return 'text-gray-500 dark:text-gray-400'
  }
}

/**
 * Get the background color class for a due date status (for badges)
 */
export function getDueDateBgColor(status: DueDateStatus): string {
  switch (status) {
    case 'overdue':
      return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
    case 'today':
      return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
    case 'tomorrow':
      return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
    case 'this-week':
      return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
    case 'upcoming':
      return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
    default:
      return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300'
  }
}

/**
 * Format a due date for display
 */
export function formatDueDate(dueDate: string | null): string {
  if (!dueDate) return ''
  
  const date = new Date(dueDate)
  const status = getDueDateStatus(dueDate)
  
  switch (status) {
    case 'overdue':
      return `Overdue (${format(date, 'MMM d')})`
    case 'today':
      return 'Due today'
    case 'tomorrow':
      return 'Due tomorrow'
    default:
      // For dates within the week or upcoming, show the actual date
      return format(date, 'MMM d, yyyy')
  }
}

/**
 * Get a short format for the due date (for compact display)
 */
export function formatDueDateShort(dueDate: string | null): string {
  if (!dueDate) return ''
  
  const date = new Date(dueDate)
  const status = getDueDateStatus(dueDate)
  
  switch (status) {
    case 'overdue':
      return format(date, 'MMM d')
    case 'today':
      return 'Today'
    case 'tomorrow':
      return 'Tomorrow'
    default:
      return format(date, 'MMM d')
  }
}

/**
 * Convert a date to ISO string for storage
 */
export function toISOString(date: Date | null): string | null {
  return date ? date.toISOString() : null
}

/**
 * Parse a date string or return null
 */
export function parseDate(dateString: string | null): Date | null {
  return dateString ? new Date(dateString) : null
}