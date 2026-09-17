'use client'

import { useEffect, useRef, useState } from 'react'
import { Sparkles, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

interface StickyCtaBarProps {
  /** Scroll distance in pixels before the bar reveals. */
  threshold?: number
  /** sessionStorage key holding the dismissal, so it stays closed for the session. */
  storageKey?: string
}

export function StickyCtaBar({ threshold = 480, storageKey = 'uipkge:sticky-cta-dismissed' }: StickyCtaBarProps) {
  // Starts hidden so server and first client render agree — the scroll handler
  // is the only thing that reveals it.
  const [visible, setVisible] = useState(false)
  const dismissed = useRef(false)

  useEffect(() => {
    try {
      dismissed.current = window.sessionStorage.getItem(storageKey) === '1'
    } catch {
      dismissed.current = false
    }

    const onScroll = () => setVisible(!dismissed.current && window.scrollY > threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold, storageKey])

  function dismiss() {
    dismissed.current = true
    setVisible(false)
    try {
      window.sessionStorage.setItem(storageKey, '1')
    } catch {
      // Private browsing or blocked storage: dismissing still holds for this page view.
    }
  }

  return (
    <div
      data-slot="sticky-cta-bar"
      className={`fixed inset-x-0 bottom-0 z-50 px-4 pb-4 transition duration-200 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none invisible translate-y-full opacity-0'
      }`}
      role="region"
      aria-label="Trial offer"
      aria-hidden={!visible}
    >
      <div className="border-border bg-card/95 mx-auto flex max-w-4xl flex-wrap items-center gap-x-5 gap-y-3 rounded-xl border p-3 pl-4 shadow-lg backdrop-blur">
        <Badge variant="secondary" className="gap-1.5">
          <Sparkles className="size-3" aria-hidden="true" />
          Free for 14 days
        </Badge>

        <p className="min-w-0 grow text-sm">
          <span className="font-medium">Start on the full plan.</span>
          <span className="text-muted-foreground"> No card, no sales call, cancel from the dashboard.</span>
        </p>

        <div className="flex items-center gap-2">
          <Button size="sm">Start free trial</Button>
          <Button size="sm" variant="ghost" className="hidden sm:inline-flex">
            Talk to us
          </Button>
          <Separator orientation="vertical" className="hidden h-6 sm:block" />
          <Button size="icon" variant="ghost" aria-label="Dismiss this offer" onClick={dismiss}>
            <X className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  )
}
