'use client'

import { ArrowRight, CircleAlert, Info } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export function AnnouncementBannerSplit({ tone = 'neutral' }: { tone?: 'neutral' | 'attention' }) {
  const Icon = tone === 'attention' ? CircleAlert : Info

  return (
    <section
      data-slot="announcement-banner-split"
      className={`border-b ${tone === 'attention' ? 'border-border bg-muted' : 'border-border bg-card'}`}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:gap-8">
        {/* Message column carries the classification; the action column stays
            the same width whatever the message length, so a stack of these
            banners aligns down the page. */}
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <Icon
            className={`mt-0.5 size-4 shrink-0 ${tone === 'attention' ? 'text-destructive' : 'text-muted-foreground'}`}
            aria-hidden="true"
          />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={tone === 'attention' ? 'outline' : 'secondary'}>
                {tone === 'attention' ? 'Scheduled maintenance' : 'Release 2.4.0'}
              </Badge>
              <span className="text-muted-foreground font-mono text-xs">Aug 14, 2026 · 02:00–04:00 UTC</span>
            </div>
            <p className="mt-1.5 text-sm leading-relaxed">
              {tone === 'attention'
                ? 'Query serving stays online. Scheduled materialisation pauses for the window and resumes automatically.'
                : 'Command palette, table virtualisation past 10k rows, and AA-contrast sidebar badges in dark mode.'}
            </p>
          </div>
        </div>

        <Separator orientation="vertical" className="hidden h-10 sm:block" />

        <div className="flex shrink-0 items-center gap-2">
          <Button variant="outline" size="sm">
            {tone === 'attention' ? 'Status page' : 'Full changelog'}
            <ArrowRight className="ml-1.5 size-3.5" aria-hidden="true" />
          </Button>
          <Button variant="ghost" size="sm">
            Subscribe
          </Button>
        </div>
      </div>
    </section>
  )
}
