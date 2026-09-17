'use client'

import * as React from 'react'
import { ArrowRight, Sparkles, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export interface BannerAnnouncementStickyProps {
  className?: string
}

export function BannerAnnouncementSticky({ className }: BannerAnnouncementStickyProps) {
  const [isVisible, setIsVisible] = React.useState(true)

  if (!isVisible) return null

  return (
    <aside
      data-slot="banner-announcement-sticky"
      className={cn(
        'border-border bg-card/90 relative z-50 border-b px-4 py-2.5 backdrop-blur-md transition-all sm:px-6',
        className,
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 font-mono text-xs">
        {/* Left / Center Content */}
        <div className="flex min-w-0 flex-1 items-center justify-center gap-3 sm:justify-start">
          <Badge
            variant="secondary"
            className="bg-primary/10 text-primary border-primary/20 shrink-0 px-2 py-0.5 text-xs font-bold tracking-wider uppercase"
          >
            v2.4.0 Release
          </Badge>

          <p className="text-foreground flex items-center gap-1.5 truncate">
            <Sparkles className="hidden size-3 shrink-0 text-amber-500 sm:inline" />
            <span>Announcing 450+ Marketing &amp; SaaS Blocks with Tailwind v4 OKLCH token engine.</span>
          </p>

          <a href="#" className="text-primary inline-flex shrink-0 items-center gap-1 font-bold hover:underline">
            <span>Read Release Notes</span>
            <ArrowRight className="size-3" />
          </a>
        </div>

        {/* Dismiss Trigger Button */}
        <button
          type="button"
          className="hover:bg-muted text-muted-foreground hover:text-foreground flex size-6 shrink-0 items-center justify-center rounded-md transition-colors"
          aria-label="Dismiss banner"
          onClick={() => setIsVisible(false)}
        >
          <X className="size-3.5" />
        </button>
      </div>
    </aside>
  )
}
export default BannerAnnouncementSticky
