'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ScrollProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Bar thickness in pixels. */
  height?: number
  /** Any CSS color or gradient — applied to `background` verbatim. */
  color?: string
  /** `fixed` pins to the viewport; `absolute` fills a positioned scrollable parent. */
  position?: 'fixed' | 'absolute'
  /** Scrollable element to measure. Defaults to the window/document. */
  container?: HTMLElement | null
  /** Lerp-smooth the displayed value toward the real progress each frame. */
  smooth?: boolean
}

const ScrollProgress = React.forwardRef<HTMLDivElement, ScrollProgressProps>(
  (
    {
      className,
      style,
      height = 3,
      color = 'var(--primary)',
      position = 'fixed',
      container = null,
      smooth = true,
      ...props
    },
    ref,
  ) => {
    const [progress, setProgress] = React.useState(0)
    const displayRef = React.useRef(0)
    const targetRef = React.useRef(0)
    const rafRef = React.useRef<number | null>(null)

    // Read through a ref so toggling `smooth` does not re-attach listeners.
    const smoothRef = React.useRef(smooth)
    smoothRef.current = smooth

    React.useEffect(() => {
      if (typeof window === 'undefined') return

      const clamp01 = (value: number) => Math.min(1, Math.max(0, value))
      const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

      const read = () => {
        if (container) {
          const max = container.scrollHeight - container.clientHeight
          return max > 0 ? clamp01(container.scrollTop / max) : 0
        }
        const doc = document.documentElement
        const scrollTop = window.scrollY || doc.scrollTop || document.body.scrollTop || 0
        const max = doc.scrollHeight - doc.clientHeight
        return max > 0 ? clamp01(scrollTop / max) : 0
      }

      const stopLoop = () => {
        if (rafRef.current !== null) {
          cancelAnimationFrame(rafRef.current)
          rafRef.current = null
        }
      }

      const tick = () => {
        displayRef.current += (targetRef.current - displayRef.current) * 0.18
        setProgress(displayRef.current)
        if (Math.abs(targetRef.current - displayRef.current) < 0.001) {
          displayRef.current = targetRef.current
          setProgress(targetRef.current)
          rafRef.current = null
          return
        }
        rafRef.current = requestAnimationFrame(tick)
      }

      const sync = () => {
        targetRef.current = read()
        if (!smoothRef.current || reducedMotion()) {
          stopLoop()
          displayRef.current = targetRef.current
          setProgress(targetRef.current)
          return
        }
        if (rafRef.current === null) rafRef.current = requestAnimationFrame(tick)
      }

      // EventTarget union keeps addEventListener compatible across HTMLElement | Window.
      const bound: EventTarget = container ?? window
      bound.addEventListener('scroll', sync, { passive: true })
      window.addEventListener('resize', sync)

      // Sync instantly on mount / container swap so the bar never animates up from zero.
      targetRef.current = read()
      displayRef.current = targetRef.current
      setProgress(targetRef.current)

      return () => {
        bound.removeEventListener('scroll', sync)
        window.removeEventListener('resize', sync)
        stopLoop()
      }
    }, [container])

    return (
      <div
        ref={ref}
        data-uipkge=""
        data-slot="scroll-progress"
        aria-hidden="true"
        data-position={position}
        data-smooth={smooth || undefined}
        className={cn(
          'pointer-events-none top-0 left-0 z-50 w-full origin-left',
          position === 'fixed' ? 'fixed' : 'absolute',
          className,
        )}
        style={{
          height: `${height}px`,
          background: color,
          transform: `scaleX(${progress})`,
          willChange: 'transform',
          ...style,
        }}
        {...props}
      />
    )
  },
)
ScrollProgress.displayName = 'ScrollProgress'

export { ScrollProgress }
