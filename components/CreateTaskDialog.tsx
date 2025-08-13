import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Plus, X, CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import type { Priority, Status } from '@/types/task'
import type { TaskInsert } from '@/src/types/database'

interface CreateTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateTask: (task: Omit<TaskInsert, 'user_id' | 'created_at' | 'updated_at'>, subtasks?: { name: string; description: string }[]) => void
}

export function CreateTaskDialog({ open, onOpenChange, onCreateTask }: CreateTaskDialogProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [status, setStatus] = useState<Status>('todo')
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined)
  const [subtasks, setSubtasks] = useState<{ name: string; description: string }[]>([])
  const [newSubtaskName, setNewSubtaskName] = useState('')
  const [newSubtaskDescription, setNewSubtaskDescription] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const handleCreate = async () => {
    if (!title.trim()) return

    try {
      setIsCreating(true)
      
      onCreateTask({
        title: title.trim(),
        description: description.trim(),
        priority,
        status,
        is_focused: true,
        due_date: dueDate ? dueDate.toISOString() : null
        // position will be auto-calculated by DatabaseService
      }, subtasks)

      // Reset form
      setTitle('')
      setDescription('')
      setPriority('medium')
      setStatus('todo')
      setDueDate(undefined)
      setSubtasks([])
      setNewSubtaskName('')
      setNewSubtaskDescription('')
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to create task:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const addSubtask = () => {
    if (!newSubtaskName.trim()) return

    setSubtasks([...subtasks, {
      name: newSubtaskName.trim(),
      description: newSubtaskDescription.trim()
    }])
    setNewSubtaskName('')
    setNewSubtaskDescription('')
  }

  const removeSubtask = (index: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== index))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-slate-100">Create New Task</DialogTitle>
          <DialogDescription>
            Create a new task with details, priority, status, and optional subtasks.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-slate-700 dark:text-slate-300">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              className="w-full bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-slate-700 dark:text-slate-300">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              className="w-full min-h-[100px] bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
            />
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label className="text-slate-700 dark:text-slate-300">Due Date (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 ${
                    !dueDate && "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : "Select due date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                  className="bg-white dark:bg-slate-800"
                />
                {dueDate && (
                  <div className="p-3 border-t border-slate-200 dark:border-slate-700">
                    <Button
                      variant="ghost"
                      className="w-full text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                      onClick={() => setDueDate(undefined)}
                    >
                      Clear due date
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          </div>

          {/* Priority and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-700 dark:text-slate-300">Priority</Label>
              <Select value={priority} onValueChange={(value) => setPriority(value as Priority)}>
                <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600">
                  <SelectItem value="urgent" className="text-slate-900 dark:text-slate-100 focus:bg-slate-100 dark:focus:bg-slate-700">Urgent</SelectItem>
                  <SelectItem value="high" className="text-slate-900 dark:text-slate-100 focus:bg-slate-100 dark:focus:bg-slate-700">High</SelectItem>
                  <SelectItem value="medium" className="text-slate-900 dark:text-slate-100 focus:bg-slate-100 dark:focus:bg-slate-700">Medium</SelectItem>
                  <SelectItem value="low" className="text-slate-900 dark:text-slate-100 focus:bg-slate-100 dark:focus:bg-slate-700">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-700 dark:text-slate-300">Status</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as Status)}>
                <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600">
                  <SelectItem value="todo" className="text-slate-900 dark:text-slate-100 focus:bg-slate-100 dark:focus:bg-slate-700">To Do</SelectItem>
                  <SelectItem value="in-progress" className="text-slate-900 dark:text-slate-100 focus:bg-slate-100 dark:focus:bg-slate-700">In Progress</SelectItem>
                  <SelectItem value="review" className="text-slate-900 dark:text-slate-100 focus:bg-slate-100 dark:focus:bg-slate-700">Review</SelectItem>
                  <SelectItem value="done" className="text-slate-900 dark:text-slate-100 focus:bg-slate-100 dark:focus:bg-slate-700">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Subtasks */}
          <div className="space-y-2">
            <Label className="text-slate-700 dark:text-slate-300">Subtasks</Label>
            
            {/* Existing subtasks */}
            {subtasks.length > 0 && (
              <div className="space-y-2 mb-4">
                {subtasks.map((subtask, index) => (
                  <div key={index} className="flex items-start gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div className="flex-1">
                      <p className="font-medium text-sm text-slate-900 dark:text-slate-100">{subtask.name}</p>
                      {subtask.description && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{subtask.description}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSubtask(index)}
                      className="h-8 w-8 p-0 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Add new subtask */}
            <div className="space-y-2 border border-slate-200 dark:border-slate-700 rounded-lg p-3 bg-slate-50 dark:bg-slate-800">
              <Input
                placeholder="Subtask name"
                value={newSubtaskName}
                onChange={(e) => setNewSubtaskName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && e.preventDefault()}
                className="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
              />
              <Textarea
                placeholder="Subtask description (optional)"
                value={newSubtaskDescription}
                onChange={(e) => setNewSubtaskDescription(e.target.value)}
                className="min-h-[60px] bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={addSubtask}
                disabled={!newSubtaskName.trim()}
                className="w-full bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100 hover:bg-slate-300 dark:hover:bg-slate-600 border-slate-300 dark:border-slate-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Subtask
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreate} 
            disabled={!title.trim() || isCreating}
            className="bg-blue-600 dark:bg-blue-600 text-white hover:bg-blue-700 dark:hover:bg-blue-700"
          >
            {isCreating ? 'Creating...' : 'Create Task'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}