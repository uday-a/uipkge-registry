'use client'

import * as React from 'react'
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, Terminal, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export interface AnnouncementItem {
  id: string
  category: 'release' | 'security' | 'maintenance' | 'feature'
  badgeText: string
  title: string
  actionLabel: string
  actionUrl?: string
  cliSnippet?: string
}

export interface AnnouncementBannerProps {
  variant?: 'floating-pill' | 'top-bar' | 'interactive-ticker'
  autoplay?: boolean
  className?: string
}

const announcements: AnnouncementItem[] = [
  {
    id: 'ann-1',
    category: 'release',
    badgeText: 'v2.4.0 Release',
    title: 'Tailwind CSS v4 OKLCH tokens & 281+ production workbenches are live.',
    actionLabel: 'Read Changelog',
    actionUrl: 'https://uipkge.dev/changelog',
    cliSnippet: 'npx shadcn-vue@latest add https://uipkge.dev/r/vue/init.json',
  },
  {
    id: 'ann-2',
    category: 'feature',
    badgeText: 'Dual-Framework',
    title: '100% Vue 3.5 & React 19 component parity achieved with zero runtime CSS.',
    actionLabel: 'Explore Parity Matrix',
    actionUrl: 'https://uipkge.dev/components',
    cliSnippet: 'npx shadcn@latest add https://uipkge.dev/r/react/init.json',
  },
  {
    id: 'ann-3',
    category: 'security',
    badgeText: 'Security Notice',
    title: 'Upstream Reka UI & Radix dependency security patches verified and updated.',
    actionLabel: 'Security Advisory',
    actionUrl: 'https://uipkge.dev/security',
  },
]

export function AnnouncementBanner({
  variant = 'interactive-ticker',
  autoplay = true,
  className,
}: AnnouncementBannerProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [dismissed, setDismissed] = React.useState(false)
  const [isPaused, setIsPaused] = React.useState(false)
  const [copiedCli, setCopiedCli] = React.useState(false)

  React.useEffect(() => {
    if (!autoplay || isPaused) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [autoplay, isPaused])

  const nextAnnouncement = () => {
    setCurrentIndex((prev) => (prev + 1) % announcements.length)
  }

  const prevAnnouncement = () => {
    setCurrentIndex((prev) => (prev - 1 + announcements.length) % announcements.length)
  }

  const copyCliSnippet = (snippet?: string) => {
    if (!snippet) return
    navigator.clipboard.writeText(snippet)
    setCopiedCli(true)
    setTimeout(() => setCopiedCli(false), 2000)
  }

  if (dismissed) return null

  const current = announcements[currentIndex]

  return (
    <div
      data-slot="announcement-banner"
      data-variant={variant}
      role="region"
      aria-label="Announcement"
      className={cn('relative z-50 transition-all duration-200', className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 1. Interactive Ticker Mode (Default) */}
      {variant === 'interactive-ticker' && (
        <div className="bg-muted/70 border-border text-foreground flex items-center justify-between gap-3 overflow-hidden border-b px-4 py-2 text-xs shadow-xs backdrop-blur-md">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
            {/* Left: Status Beacon & Item Indicator */}
            <div className="flex shrink-0 items-center gap-3">
              <div className="text-muted-foreground flex items-center gap-1.5 font-mono text-xs">
                <span className="bg-primary size-2 animate-pulse rounded-full" />
                <span className="text-foreground font-semibold">Live Dispatch</span>
              </div>

              <Badge
                variant="secondary"
                className={cn(
                  'px-2 py-0.5 font-mono text-xs',
                  current.category === 'release' && 'bg-primary/10 text-primary border-primary/20',
                  current.category === 'security' &&
                    'border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400',
                  current.category === 'feature' &&
                    'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
                )}
              >
                {current.badgeText}
              </Badge>
            </div>

            {/* Center: Dynamic Headline & Action Link */}
            <div className="flex flex-1 items-center justify-center gap-2 truncate">
              <p className="text-foreground truncate font-medium">{current.title}</p>
              {current.actionUrl && (
                <a
                  href={current.actionUrl}
                  className="text-primary hidden shrink-0 items-center gap-1 font-semibold hover:underline sm:inline-flex"
                >
                  {current.actionLabel} <ArrowRight className="size-3" />
                </a>
              )}
            </div>

            {/* Right: Ticker Navigation & CLI / Dismiss */}
            <div className="flex shrink-0 items-center gap-2">
              {current.cliSnippet && (
                <button
                  type="button"
                  className="bg-background border-border text-muted-foreground hover:text-foreground hidden items-center gap-1.5 rounded border px-2 py-0.5 font-mono text-xs transition-colors md:inline-flex"
                  onClick={() => copyCliSnippet(current.cliSnippet)}
                >
                  <Terminal className="text-primary size-3" />
                  <span>{copiedCli ? 'Copied CLI!' : 'Copy CLI'}</span>
                </button>
              )}

              <div className="border-border bg-background flex items-center overflow-hidden rounded-md border">
                <button
                  type="button"
                  className="hover:bg-muted text-muted-foreground hover:text-foreground p-1 transition-colors"
                  aria-label="Previous announcement"
                  onClick={prevAnnouncement}
                >
                  <ChevronLeft className="size-3.5" />
                </button>
                <span className="text-muted-foreground px-1.5 font-mono text-xs">
                  {currentIndex + 1}/{announcements.length}
                </span>
                <button
                  type="button"
                  className="hover:bg-muted text-muted-foreground hover:text-foreground p-1 transition-colors"
                  aria-label="Next announcement"
                  onClick={nextAnnouncement}
                >
                  <ChevronRight className="size-3.5" />
                </button>
              </div>

              <button
                type="button"
                aria-label="Dismiss banner"
                className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-md p-1 transition-colors"
                onClick={() => setDismissed(true)}
              >
                <X className="size-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Floating Pill Mode */}
      {variant === 'floating-pill' && (
        <div className="mx-auto w-fit max-w-2xl px-4 py-2">
          <div className="bg-card/90 border-border text-foreground hover:border-primary/40 flex items-center gap-3 rounded-full border py-1.5 pr-2 pl-3 text-xs shadow-md backdrop-blur-md transition-colors">
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary border-primary/20 px-2 py-0.5 font-mono text-xs"
            >
              {current.badgeText}
            </Badge>
            <p className="text-foreground max-w-sm truncate font-medium">{current.title}</p>
            {current.actionUrl && (
              <a
                href={current.actionUrl}
                className="text-primary inline-flex shrink-0 items-center gap-1 font-semibold hover:underline"
              >
                {current.actionLabel} <ArrowRight className="size-3" />
              </a>
            )}
            <button
              type="button"
              aria-label="Dismiss announcement"
              className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-full p-1 transition-colors"
              onClick={() => setDismissed(true)}
            >
              <X className="size-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 3. Top Solid Bar Mode */}
      {variant === 'top-bar' && (
        <div className="bg-primary text-primary-foreground flex items-center justify-between gap-3 px-4 py-2 text-xs shadow-xs">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
            <div className="flex items-center gap-2 truncate">
              <Sparkles className="size-4 shrink-0" />
              <span className="font-mono font-bold">[{current.badgeText}]</span>
              <span className="truncate">{current.title}</span>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              {current.actionUrl && (
                <a
                  href={current.actionUrl}
                  className="inline-flex items-center gap-1 font-semibold underline-offset-4 hover:underline"
                >
                  {current.actionLabel} <ArrowRight className="size-3" />
                </a>
              )}
              <button
                type="button"
                aria-label="Dismiss banner"
                className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/15 rounded p-1 transition-colors"
                onClick={() => setDismissed(true)}
              >
                <X className="size-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default AnnouncementBanner
