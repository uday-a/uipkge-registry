'use client'

import { Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getDueStatus, formatDueDate } from '@/lib/use-kanban'

export function DueDateBadge({
  dueDate,
  variant,
  className,
}: {
  dueDate: string
  variant?: 'chip' | 'inline'
  className?: string
}) {
  const status = getDueStatus(dueDate)
  const formatted = formatDueDate(dueDate)

  const chipClasses =
    status === 'overdue'
      ? 'bg-destructive/10 text-destructive'
      : status === 'soon'
        ? 'bg-warning/10 text-warning'
        : 'text-muted-foreground bg-muted'

  const inlineClasses =
    status === 'overdue' ? 'text-destructive' : status === 'soon' ? 'text-warning' : 'text-foreground'

  if (variant === 'chip') {
    return (
      <div
        data-slot="kanban-board"
        className={cn('flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium', chipClasses, className)}
      >
        <Clock className="size-3" />
        {formatted}
      </div>
    )
  }

  return (
    <p className={cn('flex items-center gap-1 text-sm leading-tight font-medium', inlineClasses, className)}>
      <Clock className="size-3" />
      {formatted}
    </p>
  )
}
