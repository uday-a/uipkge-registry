import * as React from 'react'
import { cn } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'

export interface ProgressItemProps {
  label: string
  value: number
  secondaryLabel?: string
  barClass?: string
  className?: string
  colorIndex?: number
}

// Maps to canonical shadcn chart tokens (chart-1..5). Cycles through 5 hues.
const barColors = [
  '[&_[data-slot=progress-indicator]]:bg-primary',
  '[&_[data-slot=progress-indicator]]:bg-[var(--chart-1)]',
  '[&_[data-slot=progress-indicator]]:bg-[var(--chart-2)]',
  '[&_[data-slot=progress-indicator]]:bg-[var(--chart-3)]',
  '[&_[data-slot=progress-indicator]]:bg-[var(--chart-4)]',
  '[&_[data-slot=progress-indicator]]:bg-[var(--chart-5)]',
]

function ProgressItem({ label, value, secondaryLabel, barClass, className, colorIndex }: ProgressItemProps) {
  const colorClass = colorIndex !== undefined ? barColors[colorIndex % barColors.length] : ''

  return (
    <div data-uipkge="" data-slot="progress-item" className={cn('group/progress space-y-1.5', className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground text-xs tabular-nums">{secondaryLabel ?? `${value}%`}</span>
      </div>
      <Progress value={value} className={cn('h-2 transition-colors duration-200', colorClass, barClass)} />
    </div>
  )
}

export { ProgressItem }
