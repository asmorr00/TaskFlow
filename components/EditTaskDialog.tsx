import { useState, useEffect } from 'react'
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
import type { Task, Priority, Status } from '@/types/task'

interface EditTaskDialogProps {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateTask: (taskId: string, updatedTaskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => void
}

export function EditTaskDialog({ task, open, onOpenChange, onUpdateTask }: EditTaskDialogProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [status, setStatus] = useState<Status>('todo')
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined)
  const [newSubtaskName, setNewSubtaskName] = useState('')
  const [newSubtaskDescription, setNewSubtaskDescription] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  
  // Local state for subtasks (same pattern as CreateTaskDialog)
  const [localSubtasks, setLocalSubtasks] = useState<{ id?: string; name: string; description: string; completed?: boolean; position?: number }[]>([])

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description || '')
      setPriority(task.priority)
      setStatus(task.status)
      setDueDate(task.due_date ? new Date(task.due_date) : undefined)
      // Initialize local subtasks from task data
      setLocalSubtasks(task.subtasks.map(subtask => ({
        id: subtask.id,
        name: subtask.name,
        description: subtask.description || '',
        completed: subtask.completed,
        position: subtask.position
      })))
    }
  }, [task])

  const handleUpdate = async () => {
    if (!task || !title.trim()) return

    try {
      setIsUpdating(true)
      
      // Update the task with all local changes including subtasks
      const taskUpdateData = {
        ...task,
        title: title.trim(),
        description: description.trim(),
        priority,
        status,
        due_date: dueDate ? dueDate.toISOString() : null,
        subtasks: localSubtasks.map(subtask => ({
          id: subtask.id || '',
          task_id: task.id,
          name: subtask.name,
          description: subtask.description || null,
          completed: subtask.completed || false,
          position: subtask.position || 0,
          created_at: ''
        }))
      }

      onUpdateTask(task.id, taskUpdateData)

      // Reset form
      setNewSubtaskName('')
      setNewSubtaskDescription('')
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to update task:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const addSubtask = () => {
    if (!newSubtaskName.trim()) return

    setLocalSubtasks([...localSubtasks, {
      name: newSubtaskName.trim(),
      description: newSubtaskDescription.trim(),
      completed: false,
      position: localSubtasks.length + 1
    }])
    setNewSubtaskName('')
    setNewSubtaskDescription('')
  }

  const updateSubtask = (index: number, updates: { name?: string; description?: string }) => {
    setLocalSubtasks(prev => 
      prev.map((subtask, i) => 
        i === index 
          ? { ...subtask, ...updates }
          : subtask
      )
    )
  }

  const removeSubtask = (index: number) => {
    setLocalSubtasks(localSubtasks.filter((_, i) => i !== index))
  }

  if (!task) return null



  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Update your task details, priority, status, and manage subtasks.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              className="w-full"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              className="w-full min-h-[100px]"
            />
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label>Due Date (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal ${
                    !dueDate && "text-muted-foreground"
                  }`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : "Select due date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                />
                {dueDate && (
                  <div className="p-3 border-t">
                    <Button
                      variant="ghost"
                      className="w-full"
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
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(value) => setPriority(value as Priority)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as Status)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Subtasks */}
          <div className="space-y-2">
            <Label>Subtasks</Label>
            
            {/* Existing subtasks */}
            {localSubtasks.length > 0 && (
              <div className="space-y-2 mb-4">
                {localSubtasks.map((subtask, index) => (
                  <div key={subtask.id || index} className="flex items-start gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex-1 space-y-1">
                      <Input
                        value={subtask.name}
                        onChange={(e) => updateSubtask(index, { name: e.target.value })}
                        className="font-medium text-sm"
                      />
                      <Textarea
                        value={subtask.description}
                        onChange={(e) => updateSubtask(index, { description: e.target.value })}
                        placeholder="Description (optional)"
                        className="text-xs min-h-[50px]"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSubtask(index)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Add new subtask */}
            <div className="space-y-2 border rounded-lg p-3">
              <Input
                placeholder="Subtask name"
                value={newSubtaskName}
                onChange={(e) => setNewSubtaskName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && e.preventDefault()}
              />
              <Textarea
                placeholder="Subtask description (optional)"
                value={newSubtaskDescription}
                onChange={(e) => setNewSubtaskDescription(e.target.value)}
                className="min-h-[60px]"
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={addSubtask}
                disabled={!newSubtaskName.trim()}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Subtask
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpdate} disabled={!title.trim() || isUpdating}>
            {isUpdating ? 'Updating...' : 'Update Task'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}