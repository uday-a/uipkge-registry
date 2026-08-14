'use client'

import * as React from 'react'
import { Plus, X, CheckCircle2, Calendar as CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  type KanbanColumn as KanbanColumnType,
  type KanbanTask,
  priorityConfig,
  assignees,
  tagPresets,
} from '@/lib/use-kanban'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogScrollContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { RichTextEditor } from '@/components/ui/rich-text-editor'

interface AddTaskForm {
  title: string
  description: string
  priority: KanbanTask['priority']
  assigneeKey: keyof typeof assignees
  tagKeys: (keyof typeof tagPresets)[]
  subtaskTexts: string[]
}

const emptyForm = (): AddTaskForm => ({
  title: '',
  description: '',
  priority: 'medium',
  assigneeKey: 'alice',
  tagKeys: [],
  subtaskTexts: [],
})

export function KanbanAddTaskDialog({
  open,
  columns,
  initialColumnId,
  onOpenChange,
  onCreate,
}: {
  open: boolean
  columns: KanbanColumnType[]
  initialColumnId: string
  onOpenChange: (value: boolean) => void
  onCreate: (columnId: string, tasks: KanbanTask[]) => void
}) {
  const [columnId, setColumnId] = React.useState(initialColumnId)
  const [dueDate, setDueDate] = React.useState<Date | undefined>(undefined)
  const [form, setForm] = React.useState<AddTaskForm>(emptyForm)
  const [newSubtaskText, setNewSubtaskText] = React.useState('')

  React.useEffect(() => {
    setColumnId(initialColumnId)
  }, [initialColumnId])

  React.useEffect(() => {
    if (open) {
      setColumnId(initialColumnId)
      setForm(emptyForm())
      setDueDate(undefined)
      setNewSubtaskText('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  function addSubtask() {
    const text = newSubtaskText.trim()
    if (!text) return
    setForm((f) => ({ ...f, subtaskTexts: [...f.subtaskTexts, text] }))
    setNewSubtaskText('')
  }

  function removeSubtask(index: number) {
    setForm((f) => ({ ...f, subtaskTexts: f.subtaskTexts.filter((_, i) => i !== index) }))
  }

  function toggleTag(key: keyof typeof tagPresets) {
    setForm((f) => {
      const idx = f.tagKeys.indexOf(key)
      const tagKeys = idx >= 0 ? f.tagKeys.filter((k) => k !== key) : [...f.tagKeys, key]
      return { ...f, tagKeys }
    })
  }

  function submit() {
    if (!form.title.trim()) return
    const maxId = columns
      .flatMap((c) => c.tasks)
      .reduce((max, t) => {
        const num = parseInt(t.id.replace(/^[A-Z]+-/, ''), 10)
        return num > max ? num : max
      }, 0)
    const idPrefix = columns.flatMap((c) => c.tasks)[0]?.id.split('-')[0] ?? 'TASK'
    const parentId = `${idPrefix}-${maxId + 1}`
    const subtaskTasks: KanbanTask[] = form.subtaskTexts.map((text, i) => ({
      id: `${idPrefix}-${maxId + 2 + i}`,
      title: text,
      priority: 'medium' as const,
      assignee: assignees[form.assigneeKey],
      tags: [],
      parentId,
      subtaskIds: [],
      commentItems: [],
      fileItems: [],
    }))
    const newTask: KanbanTask = {
      id: parentId,
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      priority: form.priority,
      assignee: assignees[form.assigneeKey],
      tags: form.tagKeys.map((k) => tagPresets[k]),
      dueDate: dueDate ? dueDate.toISOString().slice(0, 10) : undefined,
      subtaskIds: subtaskTasks.map((t) => t.id),
      commentItems: [],
      fileItems: [],
    }
    onCreate(columnId, [newTask, ...subtaskTasks])
    onOpenChange(false)
  }

  return (
    <Dialog data-slot="kanban-board" open={open} onOpenChange={onOpenChange}>
      <DialogScrollContent className="max-w-[680px] sm:max-w-full">
        <DialogHeader>
          <DialogTitle>New Task</DialogTitle>
          <DialogDescription>
            Adding task to {columns.find((c) => c.id === columnId)?.title ?? 'column'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-1.5">
            <Label htmlFor="task-title">Title</Label>
            <Input
              id="task-title"
              value={form.title}
              placeholder="Enter task title"
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
          </div>

          <div className="grid gap-1.5">
            <Label>
              Description
              <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            <RichTextEditor
              value={form.description}
              onValueChange={(val) => setForm((f) => ({ ...f, description: val }))}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="task-priority">Priority</Label>
              <Select
                value={form.priority}
                onValueChange={(val) => setForm((f) => ({ ...f, priority: val as KanbanTask['priority'] }))}
              >
                <SelectTrigger id="task-priority">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(priorityConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="task-assignee">Assignee</Label>
              <Select
                value={form.assigneeKey}
                onValueChange={(val) => setForm((f) => ({ ...f, assigneeKey: val as keyof typeof assignees }))}
              >
                <SelectTrigger id="task-assignee">
                  <SelectValue placeholder="Assignee" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(assignees).map(([key, person]) => (
                    <SelectItem key={key} value={key}>
                      {person.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="task-column">Column</Label>
              <Select value={columnId} onValueChange={setColumnId}>
                <SelectTrigger id="task-column">
                  <SelectValue placeholder="Column" />
                </SelectTrigger>
                <SelectContent>
                  {columns.map((col) => (
                    <SelectItem key={col.id} value={col.id}>
                      {col.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label>
              Due Date
              <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn('w-full justify-start text-left font-normal', !dueDate && 'text-muted-foreground')}
                >
                  <CalendarIcon className="mr-2 size-4" />
                  {dueDate ? dueDate.toLocaleDateString('en-US', { dateStyle: 'medium' }) : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={dueDate} onSelect={setDueDate} />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-1.5">
            <Label>
              Tags
              <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(tagPresets).map(([key, tag]) => {
                const active = form.tagKeys.includes(key as keyof typeof tagPresets)
                return (
                  <button
                    key={key}
                    type="button"
                    className={cn(
                      'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                      active
                        ? 'bg-primary text-primary-foreground border-transparent'
                        : 'border-border bg-background text-foreground hover:bg-muted',
                    )}
                    onClick={() => toggleTag(key as keyof typeof tagPresets)}
                  >
                    {active && <CheckCircle2 className="size-3" />}
                    {tag.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label>
              Subtasks
              <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            {form.subtaskTexts.length > 0 && (
              <div className="space-y-2">
                {form.subtaskTexts.map((text, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="flex-1 text-sm">{text}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-6"
                      aria-label="Remove subtask"
                      onClick={() => removeSubtask(index)}
                    >
                      <X className="size-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2">
              <Input
                value={newSubtaskText}
                placeholder="Add a subtask"
                onChange={(e) => setNewSubtaskText(e.target.value)}
                onKeyUp={(e) => e.key === 'Enter' && addSubtask()}
              />
              <Button variant="outline" size="icon" aria-label="Add subtask" onClick={addSubtask}>
                <Plus className="size-4" />
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button disabled={!form.title.trim()} onClick={submit}>
            Create Task
          </Button>
        </DialogFooter>
      </DialogScrollContent>
    </Dialog>
  )
}
