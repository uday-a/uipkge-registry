import * as React from 'react'
import type { LucideIcon } from 'lucide-react'
import { SectionCard } from '@/components/ui/section-card'
import { ProgressItem } from '@/components/ui/progress-item'

interface BreakdownItem {
  name: string
  value: number
  secondaryLabel?: string
}

export interface ProgressBreakdownProps {
  title?: string
  description?: string
  items: BreakdownItem[]
  headerIcon?: LucideIcon
  className?: string
}

export function ProgressBreakdown({
  title,
  description,
  items,
  headerIcon: HeaderIcon,
  className,
}: ProgressBreakdownProps) {
  return (
    <SectionCard
      data-slot="progress-breakdown"
      title={title ?? 'Breakdown'}
      description={description}
      className={className}
      contentClassName="space-y-4"
      headerAction={HeaderIcon ? <HeaderIcon className="text-muted-foreground size-5" /> : undefined}
    >
      {items.map((item, index) => (
        <ProgressItem
          key={item.name}
          label={item.name}
          value={item.value}
          secondaryLabel={item.secondaryLabel}
          colorIndex={index}
        />
      ))}
    </SectionCard>
  )
}
