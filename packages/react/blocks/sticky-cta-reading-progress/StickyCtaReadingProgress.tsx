'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowRight, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'

export function StickyCtaReadingProgress({ revealAt = 15 }: { revealAt?: number }) {
  // Both start at rest so server and first client paint agree; the scroll
  // handler is the only thing that reveals the bar or moves the progress.
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)
  const dismissed = useRef(false)

  useEffect(() => {
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const percent = scrollable > 0 ? Math.min(Math.round((window.scrollY / scrollable) * 100), 100) : 0
      setProgress(percent)
      setVisible(!dismissed.current && percent >= revealAt)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [revealAt])

  return (
    <div
      data-slot="sticky-cta-reading-progress"
      className={`border-border bg-card/95 fixed inset-x-0 bottom-0 z-50 border-t backdrop-blur transition duration-200 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none invisible translate-y-full opacity-0'
      }`}
      role="region"
      aria-label="Reading progress and trial offer"
      aria-hidden={!visible}
    >
      <Progress value={progress} className="h-0.5 rounded-none" aria-label="Reading progress" />

      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-5 gap-y-2 px-6 py-3">
        <Badge variant="secondary" className="shrink-0 tabular-nums">
          {progress}% read
        </Badge>

        <p className="min-w-0 grow text-sm">
          <span className="font-medium">Finished the technical detail?</span>
          <span className="text-muted-foreground"> The trial runs on your real warehouse, read-only.</span>
        </p>

        <div className="flex shrink-0 items-center gap-2">
          <Button size="sm">
            Start free
            <ArrowRight className="ml-1.5 size-3.5" aria-hidden="true" />
          </Button>
          <Separator orientation="vertical" className="hidden h-5 sm:block" />
          <Button
            size="icon"
            variant="ghost"
            className="size-7"
            aria-label="Dismiss"
            onClick={() => {
              dismissed.current = true
              setVisible(false)
            }}
          >
            <X className="size-3.5" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  )
}
