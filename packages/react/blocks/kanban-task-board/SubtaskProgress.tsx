'use client'

import { CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function SubtaskProgress({ done, total, className }: { done: number; total: number; className?: string }) {
  if (total <= 0) return null
  const percent = total > 0 ? Math.round((done / total) * 100) : 0
  const isComplete = done === total && total > 0
  return (
    <div data-slot="kanban-board" className={className}>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-muted-foreground text-xs">
          {isComplete && <CheckCircle2 className="text-success mr-0.5 inline size-3" />}
          {done}/{total} subtasks
        </span>
        <span className="text-muted-foreground text-xs font-medium tabular-nums">{percent}%</span>
      </div>
      <div className="bg-muted h-1.5 overflow-hidden rounded-full">
        <div
          className={cn('h-full rounded-full transition-all duration-500', isComplete ? 'bg-success' : 'bg-primary')}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
