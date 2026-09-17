import * as React from 'react'
import { ArrowUpRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { SectionCard } from '@/components/ui/section-card'
import { IconBox } from '@/components/ui/icon-box'

interface QuickAction {
  id: string | number
  label: string
  icon?: LucideIcon
  route: string
}

export interface QuickActionsProps {
  title?: string
  description?: string
  actions: QuickAction[]
  /** Link element to render for each action — `'a'` (default) or a router
   *  Link component (e.g. Next.js `Link`). It receives `to`, `href`, and
   *  `className`, mirroring the Vue polymorphic `linkComponent`. */
  linkComponent?: React.ElementType
  className?: string
}

export function QuickActions({
  title,
  description,
  actions,
  linkComponent: LinkComponent = 'a',
  className,
}: QuickActionsProps) {
  return (
    <SectionCard
      data-slot="quick-actions"
      title={title ?? 'Quick Actions'}
      description={description}
      contentClassName="flex flex-col gap-2"
      className={className}
    >
      {actions.map((action) => (
        <LinkComponent
          key={action.id}
          to={action.route}
          href={action.route}
          className="hover:border-border hover:bg-muted/50 group flex cursor-pointer items-center gap-3 rounded-lg border border-transparent p-3 transition-all duration-200"
        >
          {action.icon && <IconBox icon={action.icon} />}
          <span className="flex-1 text-sm font-medium">{action.label}</span>
          <ArrowUpRight className="text-muted-foreground size-4 opacity-0 transition-all duration-200 group-hover:opacity-100" />
        </LinkComponent>
      ))}
    </SectionCard>
  )
}
