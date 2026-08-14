'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface LoadingBarHandle {
  start: (from?: number) => void
  finish: () => void
  error: () => void
  fail: () => void
  inc: (amount?: number) => void
  set: (value: number) => void
}

export interface LoadingBarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** 0–100 progress value. Use with value/onChange or drive via the hook. */
  value?: number
  /** Bar color. Accepts any CSS color value. */
  color?: string
  /** Bar height in px. */
  height?: number
  /** Indeterminate sliding animation (ignores value). */
  indeterminate?: boolean
  /** Anchor the bar to the top or bottom of the viewport. */
  position?: 'top' | 'bottom'
  /** Show a spinner at the trailing edge of the bar. */
  spinner?: boolean
  /** Error state tints the bar. */
  error?: boolean
  /** Hide the bar entirely (e.g. when finished). */
  hidden?: boolean
  /** Fired with the new value on every internal update (v-model equivalent). */
  onValueChange?: (value: number) => void
  /** Fired when progress reaches 100. */
  onFinish?: () => void
}

const LoadingBar = React.forwardRef<LoadingBarHandle, LoadingBarProps>(
  (
    {
      value = 0,
      color = '',
      height = 3,
      indeterminate = false,
      position = 'top',
      spinner = false,
      error = false,
      hidden = false,
      className,
      onValueChange,
      onFinish,
      ...props
    },
    ref,
  ) => {
    const [internal, setInternal] = React.useState(value)
    /** Imperative fail() tints the bar without requiring the error prop. */
    const [internalError, setInternalError] = React.useState(false)
    /** After finish/fail, fade out then reset. */
    const [fading, setFading] = React.useState(false)
    const rafRef = React.useRef<number | null>(null)
    const hideTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
    /** Bumped on start/finish/fail so in-flight trickle frames abort. */
    const generationRef = React.useRef(0)
    const onValueChangeRef = React.useRef(onValueChange)
    const onFinishRef = React.useRef(onFinish)
    onValueChangeRef.current = onValueChange
    onFinishRef.current = onFinish

    // Keep internal in sync when the controlled value prop changes.
    React.useEffect(() => {
      setInternal(value)
    }, [value])

    const clearTimers = React.useCallback(() => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current)
        hideTimerRef.current = null
      }
    }, [])

    const set = React.useCallback((v: number) => {
      setInternal(v)
      onValueChangeRef.current?.(v)
    }, [])

    /** Slowly creep the bar toward a soft ceiling so progress feels alive. */
    const trickle = React.useCallback((gen: number) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      const step = () => {
        if (gen !== generationRef.current) return
        setInternal((prev) => {
          if (gen !== generationRef.current || prev >= 95) return prev
          const next = Math.min(95, prev + (95 - prev) * 0.04 + 0.15)
          onValueChangeRef.current?.(next)
          if (next < 95 && gen === generationRef.current) {
            rafRef.current = requestAnimationFrame(step)
          }
          return next
        })
      }
      rafRef.current = requestAnimationFrame(step)
    }, [])

    const start = React.useCallback(
      (from = 20) => {
        clearTimers()
        generationRef.current += 1
        const gen = generationRef.current
        setInternalError(false)
        setFading(false)
        set(from)
        trickle(gen)
      },
      [set, trickle, clearTimers],
    )

    const inc = React.useCallback((amount = 10) => {
      setInternal((prev) => {
        const next = Math.min(99, prev + amount)
        onValueChangeRef.current?.(next)
        return next
      })
    }, [])

    const finish = React.useCallback(() => {
      clearTimers()
      generationRef.current += 1
      setInternalError(false)
      set(100)
      onFinishRef.current?.()
      // Hold full bar briefly, then fade + reset so the next start() is clean.
      hideTimerRef.current = setTimeout(() => {
        setFading(true)
        hideTimerRef.current = setTimeout(() => {
          setInternal(0)
          onValueChangeRef.current?.(0)
          setFading(false)
          hideTimerRef.current = null
        }, 300)
      }, 200)
    }, [set, clearTimers])

    const fail = React.useCallback(() => {
      clearTimers()
      generationRef.current += 1
      setInternalError(true)
      setInternal(100)
      onValueChangeRef.current?.(100)
      onFinishRef.current?.()
      hideTimerRef.current = setTimeout(() => {
        setFading(true)
        hideTimerRef.current = setTimeout(() => {
          setInternal(0)
          setInternalError(false)
          onValueChangeRef.current?.(0)
          setFading(false)
          hideTimerRef.current = null
        }, 300)
      }, 400)
    }, [clearTimers])

    React.useEffect(() => {
      return () => {
        clearTimers()
      }
    }, [clearTimers])

    React.useImperativeHandle(ref, () => ({ start, finish, error: fail, fail, inc, set }), [
      start,
      finish,
      fail,
      inc,
      set,
    ])

    const pct = Math.min(100, Math.max(0, internal))
    const isError = error || internalError
    const barColor = color || (isError ? 'var(--destructive)' : 'var(--primary)')
    const visible = !hidden && !fading && (indeterminate || internal > 0)

    return (
      <div
        data-uipkge=""
        data-slot="loading-bar"
        data-position={position}
        data-state={isError ? 'error' : indeterminate ? 'indeterminate' : 'determinate'}
        className={cn(
          'pointer-events-none fixed left-0 z-[9999] w-full transition-opacity duration-300',
          position === 'top' ? 'top-0' : 'bottom-0',
          visible ? 'opacity-100' : 'opacity-0',
          className,
        )}
        style={{ height: `${height}px`, ...(props.style ?? {}) }}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={indeterminate ? undefined : pct}
        aria-busy={visible && !isError ? true : undefined}
        aria-hidden={!visible}
        {...props}
      >
        {/* Track */}
        <div className="absolute inset-0 bg-transparent" />

        {indeterminate ? (
          // Indeterminate sliding bar
          <div
            data-slot="loading-bar-indeterminate"
            className="loading-bar-indeterminate absolute inset-y-0 w-1/3"
            style={{ backgroundColor: barColor }}
          >
            {spinner && (
              <div
                data-slot="loading-bar-spinner"
                className="absolute top-1/2 right-0 size-3 translate-x-1/2 -translate-y-1/2 animate-spin rounded-full border-2 border-current border-t-transparent"
                style={{ color: barColor }}
              />
            )}
          </div>
        ) : (
          // Determinate bar
          <div
            data-slot="loading-bar-fill"
            className="absolute inset-y-0 left-0 transition-[width] duration-200 ease-out"
            style={{ width: `${pct}%`, backgroundColor: barColor }}
          >
            {spinner && (
              <div
                data-slot="loading-bar-spinner"
                className="absolute top-1/2 right-0 size-3 translate-x-1/2 -translate-y-1/2 animate-spin rounded-full border-2 border-current border-t-transparent"
                style={{ color: barColor }}
              />
            )}
          </div>
        )}

        <style>{`
@media (prefers-reduced-motion: no-preference) {
  .loading-bar-indeterminate {
    animation: loading-bar-slide 1.2s ease-in-out infinite;
  }
}
@keyframes loading-bar-slide {
  0% { left: -33%; }
  100% { left: 100%; }
}
`}</style>
      </div>
    )
  },
)
LoadingBar.displayName = 'LoadingBar'

export { LoadingBar }
