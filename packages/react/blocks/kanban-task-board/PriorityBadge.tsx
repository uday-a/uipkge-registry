'use client'

import { cn } from '@/lib/utils'
import { priorityConfig } from '@/lib/use-kanban'

export function PriorityBadge({
  priority,
  iconSize = 'size-3.5',
  className,
}: {
  priority: string
  iconSize?: string
  className?: string
}) {
  const config = priorityConfig[priority]
  if (!config) return null
  const Icon = config.icon
  return (
    <div data-slot="kanban-board" className={cn('flex items-center gap-1', className)}>
      <Icon className={cn(iconSize, config.class)} />
      <span className={cn('text-xs font-semibold', config.class)}>{config.label}</span>
    </div>
  )
}
