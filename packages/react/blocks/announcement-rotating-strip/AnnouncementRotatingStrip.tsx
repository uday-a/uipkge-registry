'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const messages = [
  { label: 'New', text: 'Row-level scoping now evaluates against SCIM groups.', cta: 'Changelog' },
  { label: 'Event', text: 'Live walkthrough of the five-week rollout, every Thursday.', cta: 'Save a seat' },
  { label: 'Docs', text: 'The reconciliation checklist for your first close is published.', cta: 'Read it' },
]

export function AnnouncementRotatingStrip({ interval = 6000 }: { interval?: number }) {
  const [index, setIndex] = useState(0)
  const paused = useRef(false)

  useEffect(() => {
    const timer = setInterval(() => {
      if (!paused.current) setIndex((value) => (value + 1) % messages.length)
    }, interval)
    return () => clearInterval(timer)
  }, [interval])

  return (
    <div
      data-slot="announcement-rotating-strip"
      className="border-border bg-muted/60 border-b backdrop-blur"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      onFocus={() => (paused.current = true)}
      onBlur={() => (paused.current = false)}
    >
      <div className="mx-auto flex h-11 max-w-6xl items-center gap-3 px-6 text-sm">
        {/* aria-live announces the rotation to screen readers without stealing focus. */}
        <div className="flex min-w-0 flex-1 items-center gap-3" aria-live="polite" aria-atomic="true">
          <Badge variant="secondary" className="shrink-0">
            {messages[index].label}
          </Badge>
          <p className="min-w-0 truncate">{messages[index].text}</p>
          <Button variant="link" size="sm" className="hidden h-auto shrink-0 p-0 text-xs sm:inline-flex">
            {messages[index].cta}
            <ArrowRight className="ml-1 size-3" aria-hidden="true" />
          </Button>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {messages.map((message, i) => (
            <button
              key={message.text}
              type="button"
              className={`focus-visible:ring-ring size-1.5 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none ${
                i === index ? 'bg-foreground' : 'bg-muted-foreground/40 hover:bg-muted-foreground'
              }`}
              aria-label={`Show announcement ${i + 1} of ${messages.length}`}
              aria-current={i === index ? 'true' : undefined}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
