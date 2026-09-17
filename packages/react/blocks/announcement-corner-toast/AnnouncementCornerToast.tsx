'use client'

import { useEffect, useState } from 'react'
import { ArrowRight, Sparkles, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

interface AnnouncementCornerToastProps {
  /** Milliseconds before the card slides in. */
  delay?: number
  /** sessionStorage key holding the dismissal. */
  storageKey?: string
}

export function AnnouncementCornerToast({
  delay = 1200,
  storageKey = 'uipkge:corner-announcement-dismissed',
}: AnnouncementCornerToastProps) {
  // Hidden on the server and on first paint; the delay timer is what reveals it.
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const wasDismissed = () => {
      try {
        return window.sessionStorage.getItem(storageKey) === '1'
      } catch {
        return false
      }
    }
    if (wasDismissed()) return
    const timer = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay, storageKey])

  function dismiss() {
    setVisible(false)
    try {
      window.sessionStorage.setItem(storageKey, '1')
    } catch {
      // Blocked storage: the dismissal still holds for this page view.
    }
  }

  return (
    <div
      data-slot="announcement-corner-toast"
      className={`fixed right-4 bottom-4 z-50 w-[22rem] max-w-[calc(100vw-2rem)] transition duration-300 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none invisible translate-y-4 opacity-0'
      }`}
      role="complementary"
      aria-label="Product announcement"
      aria-hidden={!visible}
    >
      <Card className="shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <span
              className="border-border bg-muted flex size-10 shrink-0 items-center justify-center rounded-lg border"
              aria-hidden="true"
            >
              <Sparkles className="text-primary size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <Badge variant="secondary" className="mb-1.5">
                New
              </Badge>
              <p className="text-sm font-semibold">Scoping now follows SCIM groups</p>
              <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                Move someone between teams in your IdP and their dashboards follow within the sync window.
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="-mt-1 -mr-1 size-7 shrink-0"
              aria-label="Dismiss announcement"
              onClick={dismiss}
            >
              <X className="size-3.5" aria-hidden="true" />
            </Button>
          </div>

          <Separator className="my-3" />

          <div className="flex items-center gap-2">
            <Button size="sm" className="h-7">
              Read the changelog
              <ArrowRight className="ml-1 size-3.5" aria-hidden="true" />
            </Button>
            <Button variant="ghost" size="sm" className="h-7" onClick={dismiss}>
              Not now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
