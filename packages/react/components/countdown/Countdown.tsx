import * as React from 'react'
import { cn } from '@/lib/utils'

type Format = 'DD:HH:MM:SS' | 'HH:MM:SS' | 'MM:SS' | 'SS'

export interface CountdownRenderProps {
  days: number
  hours: number
  minutes: number
  seconds: number
  display: string
  finished: boolean
}

export interface CountdownProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Target date/time. Accepts a Date, ISO string, or epoch ms number. */
  target: Date | string | number
  /** Display format. Custom tokens: DD days, HH hours, MM minutes, SS seconds. */
  format?: Format | string
  /** Pause the countdown. */
  paused?: boolean
  /** Optional label rendered above the countdown. */
  label?: string
  /** Show leading zeros (e.g. 05 vs 5). */
  pad?: boolean
  /** Separator between units. */
  separator?: string
  /** Fired once when the countdown reaches zero. */
  onFinish?: () => void
  /** Fired every tick with the remaining ms. */
  onTick?: (remaining: number) => void
  /** Render-prop override for the whole display. Receives all parts + display string. */
  children?: ((props: CountdownRenderProps) => React.ReactNode) | React.ReactNode
  /** Render-prop override for the days unit. */
  renderDays?: (days: number) => React.ReactNode
  /** Render-prop override for the hours unit. */
  renderHours?: (hours: number) => React.ReactNode
  /** Render-prop override for the minutes unit. */
  renderMinutes?: (minutes: number) => React.ReactNode
  /** Render-prop override for the seconds unit. */
  renderSeconds?: (seconds: number) => React.ReactNode
}

const STYLE_ID = 'countdown-digit-styles'
const STYLE_CONTENT = `
@keyframes countdown-digit-flip {
  0% { opacity: 0; transform: translateY(45%) scale(0.92); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
[data-slot='countdown'] .countdown-digit {
  display: inline-block;
  animation: countdown-digit-flip 280ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
@media (prefers-reduced-motion: reduce) {
  [data-slot='countdown'] .countdown-digit {
    animation: none !important;
  }
}
`

function CountdownDigits({ value, pad }: { value: number; pad: boolean }) {
  const text = pad ? String(value).padStart(2, '0') : String(value)
  return (
    <>
      {[...text].map((ch, i) => (
        <span key={`${i}-${ch}`} className="countdown-digit tabular-nums">
          {ch}
        </span>
      ))}
    </>
  )
}

const Countdown = React.forwardRef<HTMLDivElement, CountdownProps>(
  (
    {
      target,
      format = 'DD:HH:MM:SS',
      paused = false,
      label = '',
      pad = true,
      separator = ':',
      onFinish,
      onTick,
      children,
      renderDays,
      renderHours,
      renderMinutes,
      renderSeconds,
      className,
      ...props
    },
    ref,
  ) => {
    const [now, setNow] = React.useState(() => Date.now())
    const [finished, setFinished] = React.useState(false)

    React.useLayoutEffect(() => {
      if (typeof document === 'undefined') return
      let el = document.getElementById(STYLE_ID) as HTMLStyleElement | null
      if (!el) {
        el = document.createElement('style')
        el.id = STYLE_ID
        document.head.appendChild(el)
      }
      if (el.textContent !== STYLE_CONTENT) el.textContent = STYLE_CONTENT
    }, [])

    const targetMs = React.useMemo(() => {
      if (target instanceof Date) return target.getTime()
      if (typeof target === 'number') return target
      return new Date(target).getTime()
    }, [target])

    const remainingMs = Math.max(0, targetMs - now)

    const parts = React.useMemo(() => {
      const total = remainingMs
      const days = Math.floor(total / 86_400_000)
      const hours = Math.floor((total % 86_400_000) / 3_600_000)
      const minutes = Math.floor((total % 3_600_000) / 60_000)
      const seconds = Math.floor((total % 60_000) / 1000)
      return { days, hours, minutes, seconds }
    }, [remainingMs])

    // Values painted for each unit under the active format (rolled-up totals for compact formats).
    const displayParts = React.useMemo(() => {
      const { days, hours, minutes, seconds } = parts
      if (format === 'HH:MM:SS') {
        return { days, hours: days * 24 + hours, minutes, seconds }
      }
      if (format === 'MM:SS') {
        return { days, hours, minutes: days * 24 * 60 + hours * 60 + minutes, seconds }
      }
      if (format === 'SS') {
        return { days, hours, minutes, seconds: Math.floor(remainingMs / 1000) }
      }
      return { days, hours, minutes, seconds }
    }, [format, parts, remainingMs])

    const pad2 = React.useCallback((n: number) => (pad ? String(n).padStart(2, '0') : String(n)), [pad])

    const display = React.useMemo(() => {
      const f = format
      const { days, hours, minutes, seconds } = displayParts
      const sep = separator
      if (f === 'DD:HH:MM:SS') return `${pad2(days)}${sep}${pad2(hours)}${sep}${pad2(minutes)}${sep}${pad2(seconds)}`
      if (f === 'HH:MM:SS') return `${pad2(hours)}${sep}${pad2(minutes)}${sep}${pad2(seconds)}`
      if (f === 'MM:SS') return `${pad2(minutes)}${sep}${pad2(seconds)}`
      if (f === 'SS') return pad2(seconds)
      // Custom token format: replace DD, HH, MM, SS tokens with modular parts.
      return f
        .replace('DD', pad2(parts.days))
        .replace('HH', pad2(parts.hours))
        .replace('MM', pad2(parts.minutes))
        .replace('SS', pad2(parts.seconds))
    }, [format, displayParts, separator, pad2, parts])

    // Keep latest callbacks without retriggering the interval effect.
    const onFinishRef = React.useRef(onFinish)
    const onTickRef = React.useRef(onTick)
    const finishedRef = React.useRef(false)
    onFinishRef.current = onFinish
    onTickRef.current = onTick

    // Reset finished state only when the target changes.
    React.useEffect(() => {
      finishedRef.current = false
      setFinished(false)
      setNow(Date.now())
    }, [targetMs])

    React.useEffect(() => {
      // Fire finish immediately when the target is already past (don't wait for first tick).
      const remainingNow = Math.max(0, targetMs - Date.now())
      if (remainingNow <= 0) {
        if (!finishedRef.current) {
          finishedRef.current = true
          setFinished(true)
          onFinishRef.current?.()
        }
        return
      }

      if (paused) return

      const timer = setInterval(() => {
        const next = Date.now()
        const remaining = Math.max(0, targetMs - next)
        onTickRef.current?.(remaining)
        setNow(next)
        if (remaining <= 0 && !finishedRef.current) {
          finishedRef.current = true
          setFinished(true)
          onFinishRef.current?.()
          clearInterval(timer)
        }
      }, 1000)
      return () => clearInterval(timer)
    }, [paused, targetMs])

    const renderProps: CountdownRenderProps = {
      ...parts,
      display,
      finished,
    }

    const renderDefault = () => {
      const f = format
      return (
        <>
          {f.includes('DD') &&
            (renderDays ? (
              renderDays(parts.days)
            ) : (
              <span data-slot="countdown-days" className="text-foreground inline-flex text-2xl font-semibold">
                <CountdownDigits value={displayParts.days} pad={pad} />
              </span>
            ))}
          {f.includes('DD') && f.includes('HH') && <span className="text-muted-foreground text-2xl">{separator}</span>}
          {f.includes('HH') &&
            (renderHours ? (
              renderHours(parts.hours)
            ) : (
              <span data-slot="countdown-hours" className="text-foreground inline-flex text-2xl font-semibold">
                <CountdownDigits value={displayParts.hours} pad={pad} />
              </span>
            ))}
          {f.includes('HH') && f.includes('MM') && <span className="text-muted-foreground text-2xl">{separator}</span>}
          {f.includes('MM') &&
            (renderMinutes ? (
              renderMinutes(parts.minutes)
            ) : (
              <span data-slot="countdown-minutes" className="text-foreground inline-flex text-2xl font-semibold">
                <CountdownDigits value={displayParts.minutes} pad={pad} />
              </span>
            ))}
          {f.includes('MM') && f.includes('SS') && <span className="text-muted-foreground text-2xl">{separator}</span>}
          {f.includes('SS') &&
            (renderSeconds ? (
              renderSeconds(parts.seconds)
            ) : (
              <span data-slot="countdown-seconds" className="text-foreground inline-flex text-2xl font-semibold">
                <CountdownDigits value={displayParts.seconds} pad={pad} />
              </span>
            ))}
        </>
      )
    }

    return (
      <div
        ref={ref}
        data-uipkge=""
        data-slot="countdown"
        data-finished={finished}
        data-paused={paused}
        className={cn('inline-flex flex-col gap-1', className)}
        {...props}
      >
        {label && (
          <span
            data-slot="countdown-label"
            className="text-muted-foreground text-xs font-medium tracking-wide uppercase"
          >
            {label}
          </span>
        )}
        <div
          data-slot="countdown-display"
          className="flex items-baseline gap-1 font-mono tabular-nums"
          role="timer"
          aria-live={finished || paused ? 'off' : 'polite'}
          aria-atomic="true"
        >
          {typeof children === 'function' ? children(renderProps) : (children ?? renderDefault())}
        </div>
      </div>
    )
  },
)
Countdown.displayName = 'Countdown'

export { Countdown }
