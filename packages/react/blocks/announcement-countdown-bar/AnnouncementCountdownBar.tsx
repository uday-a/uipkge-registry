'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, Timer, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

interface AnnouncementCountdownBarProps {
  /** ISO timestamp the countdown runs to. */
  deadline?: string
  /** sessionStorage key holding the dismissal. */
  storageKey?: string
}

export function AnnouncementCountdownBar({
  deadline = '',
  storageKey = 'uipkge:countdown-dismissed',
}: AnnouncementCountdownBarProps) {
  const [dismissed, setDismissed] = useState(false)
  // Null until mounted: the server has no clock the client agrees with, so the
  // digits only appear once the timer is running.
  const [remaining, setRemaining] = useState<number | null>(null)

  const target = useMemo(() => {
    const parsed = deadline ? Date.parse(deadline) : Number.NaN
    // Fall back to 72 hours out so the demo and a mis-set prop still read sensibly.
    return Number.isNaN(parsed) ? Date.now() + 72 * 60 * 60 * 1000 : parsed
  }, [deadline])

  useEffect(() => {
    try {
      setDismissed(window.sessionStorage.getItem(storageKey) === '1')
    } catch {
      setDismissed(false)
    }
    const tick = () => setRemaining(target - Date.now())
    tick()
    const timer = setInterval(tick, 1000)
    return () => clearInterval(timer)
  }, [target, storageKey])

  function dismiss() {
    setDismissed(true)
    try {
      window.sessionStorage.setItem(storageKey, '1')
    } catch {
      // Blocked storage: the dismissal still holds for this page view.
    }
  }

  if (dismissed) return null

  const total = Math.floor(Math.max(remaining ?? 0, 0) / 1000)
  const parts = [
    { label: 'd', value: Math.floor(total / 86400) },
    { label: 'h', value: Math.floor((total % 86400) / 3600) },
    { label: 'm', value: Math.floor((total % 3600) / 60) },
    { label: 's', value: total % 60 },
  ]

  return (
    <div data-slot="announcement-countdown-bar" className="border-border bg-muted/60 border-b backdrop-blur">
      <div className="mx-auto flex min-h-11 max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-6 py-2 text-sm">
        <Badge variant="secondary" className="shrink-0 gap-1.5">
          <Timer className="size-3" aria-hidden="true" />
          Ends soon
        </Badge>

        <p className="min-w-0">
          <span className="font-medium">Annual plans are 20% off</span>
          <span className="text-muted-foreground"> for teams that start before the quarter closes.</span>
        </p>

        {/* tabular-nums + fixed-width cells keep the bar from reflowing each second. */}
        {remaining !== null && (
          <div className="text-muted-foreground flex items-center gap-1 font-mono text-xs">
            {parts.map((part) => (
              <span key={part.label} className="tabular-nums">
                <span className="text-foreground inline-block min-w-[2ch] text-right font-semibold">
                  {String(part.value).padStart(2, '0')}
                </span>
                {part.label}
              </span>
            ))}
          </div>
        )}

        <div className="ml-auto flex shrink-0 items-center gap-1">
          <Button variant="ghost" size="sm" className="h-7">
            Claim it
            <ArrowRight className="ml-1 size-3.5" aria-hidden="true" />
          </Button>
          <Separator orientation="vertical" className="hidden h-5 sm:block" />
          <Button variant="ghost" size="icon" className="size-7" aria-label="Dismiss announcement" onClick={dismiss}>
            <X className="size-3.5" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  )
}
