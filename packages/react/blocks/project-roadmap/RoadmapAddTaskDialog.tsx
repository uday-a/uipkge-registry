'use client'

import * as React from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { GanttTask } from '@/components/ui/gantt'

export interface RoadmapAddTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddTask: (task: GanttTask) => void
}

export function RoadmapAddTaskDialog({ open, onOpenChange, onAddTask }: RoadmapAddTaskDialogProps) {
  const [name, setName] = React.useState('')
  const [startDate, setStartDate] = React.useState('2026-08-20')
  const [endDate, setEndDate] = React.useState('2026-08-28')
  const [status, setStatus] = React.useState<'todo' | 'in-progress' | 'done'>('todo')
  const [isMilestone, setIsMilestone] = React.useState(false)
  const [assigneeName, setAssigneeName] = React.useState('Marcus Rivera')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    const newTask: GanttTask = {
      id: `task-${Date.now()}`,
      name: name.trim(),
      startDate,
      endDate: isMilestone ? startDate : endDate,
      status,
      progress: isMilestone ? 100 : 0,
      isMilestone,
      assignee: {
        name: assigneeName,
        initials: assigneeName
          .split(' ')
          .map((p) => p[0])
          .join(''),
      },
    }

    onAddTask(newTask)
    onOpenChange(false)
    setName('')
    setIsMilestone(false)
  }

  return (
    <Dialog data-slot="project-roadmap" open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[480px] sm:max-w-full">
        <DialogHeader>
          <DialogTitle>Add Roadmap Task</DialogTitle>
          <DialogDescription>
            Create a new scheduled deliverable or critical milestone in the project Gantt timeline.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="task-name">Task Name</Label>
            <Input
              id="task-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Design Token Hierarchy & Specs"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                disabled={isMilestone}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="border-border/80 bg-muted/20 flex items-center space-x-2 rounded-md border p-3">
            <Checkbox
              id="milestone-toggle"
              checked={isMilestone}
              onCheckedChange={(checked) => setIsMilestone(!!checked)}
            />
            <div className="grid gap-0.5 leading-none">
              <label
                htmlFor="milestone-toggle"
                className="text-foreground cursor-pointer text-xs font-semibold select-none"
              >
                Key Project Milestone
              </label>
              <p className="text-muted-foreground text-xs">
                Marks a zero-duration target deliverable (e.g. Beta Release, Audit sign-off)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Initial Status</Label>
              <Select value={status} onValueChange={(val: any) => setStatus(val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="done">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Assignee</Label>
              <Select value={assigneeName} onValueChange={setAssigneeName}>
                <SelectTrigger>
                  <SelectValue placeholder="Assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Marcus Rivera">Marcus Rivera</SelectItem>
                  <SelectItem value="Sarah Connor">Sarah Connor</SelectItem>
                  <SelectItem value="Priya Nair">Priya Nair</SelectItem>
                  <SelectItem value="Sundar Krishnan">Sundar Krishnan</SelectItem>
                  <SelectItem value="Diane Cho">Diane Cho</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              <Plus className="mr-1.5 size-3.5" />
              Create Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
