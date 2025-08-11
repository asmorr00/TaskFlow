import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, X } from 'lucide-react'
import type { Task, Priority, Status } from '@/types/task'
import { useTasks } from '@/src/hooks/useTasks'

interface EditTaskDialogProps {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateTask: (task: Task) => void
}

export function EditTaskDialog({ task, open, onOpenChange, onUpdateTask }: EditTaskDialogProps) {
  const { createSubtask, updateSubtask, deleteSubtask } = useTasks()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [status, setStatus] = useState<Status>('todo')
  const [newSubtaskName, setNewSubtaskName] = useState('')
  const [newSubtaskDescription, setNewSubtaskDescription] = useState('')
  const [isAddingSubtask, setIsAddingSubtask] = useState(false)

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description || '')
      setPriority(task.priority)
      setStatus(task.status)
    }
  }, [task])

  const handleUpdate = () => {
    if (!task || !title.trim()) return

    onUpdateTask({
      ...task,
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      updated_at: new Date().toISOString()
    })

    // Reset form
    setNewSubtaskName('')
    setNewSubtaskDescription('')
    onOpenChange(false)
  }

  const addSubtask = async () => {
    if (!newSubtaskName.trim() || !task) return

    try {
      setIsAddingSubtask(true)
      await createSubtask(task.id, {
        name: newSubtaskName.trim(),
        description: newSubtaskDescription.trim() || undefined
      })
      setNewSubtaskName('')
      setNewSubtaskDescription('')
    } catch (error) {
      console.error('Failed to add subtask:', error)
    } finally {
      setIsAddingSubtask(false)
    }
  }

  const handleUpdateSubtask = async (subtaskId: string, updates: { name?: string; description?: string }) => {
    if (!task) return

    try {
      await updateSubtask(task.id, subtaskId, updates)
    } catch (error) {
      console.error('Failed to update subtask:', error)
    }
  }

  const handleRemoveSubtask = async (subtaskId: string) => {
    if (!task) return

    try {
      await deleteSubtask(task.id, subtaskId)
    } catch (error) {
      console.error('Failed to delete subtask:', error)
    }
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
            {task.subtasks.length > 0 && (
              <div className="space-y-2 mb-4">
                {task.subtasks.map((subtask) => (
                  <div key={subtask.id} className="flex items-start gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex-1 space-y-1">
                      <Input
                        value={subtask.name}
                        onChange={(e) => handleUpdateSubtask(subtask.id, { name: e.target.value })}
                        className="font-medium text-sm"
                      />
                      <Textarea
                        value={subtask.description || ''}
                        onChange={(e) => handleUpdateSubtask(subtask.id, { description: e.target.value })}
                        placeholder="Description (optional)"
                        className="text-xs min-h-[50px]"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSubtask(subtask.id)}
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
                disabled={!newSubtaskName.trim() || isAddingSubtask}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                {isAddingSubtask ? 'Adding...' : 'Add Subtask'}
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpdate} disabled={!title.trim()}>
            Update Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}