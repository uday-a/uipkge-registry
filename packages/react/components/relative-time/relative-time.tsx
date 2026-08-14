import * as React from 'react'
import { cn } from '@/lib/utils'
import {
  formatAbsoluteTime,
  formatVisibleTime,
  toDate,
  type RelativeTimeDisplay,
  type RelativeTimeNumeric,
  type RelativeTimeParseAs,
  type RelativeTimeStyle,
} from './format-relative-time'

export interface RelativeTimeProps extends Omit<React.TimeHTMLAttributes<HTMLTimeElement>, 'dateTime'> {
  /** Instant to display. Accepts a Date, ISO string, or epoch ms. */
  date: Date | string | number
  /** Clock used for the delta. Pass in tests and SSR to keep output stable. */
  now?: Date | string | number
  /** Intl relative style. */
  formatStyle?: RelativeTimeStyle
  /** `auto` yields "yesterday"; `always` yields "1 day ago". */
  numeric?: RelativeTimeNumeric
  /** BCP 47 locale. Defaults to the runtime locale. */
  locale?: string
  /** Visible label: relative (default), absolute clock, or both. */
  display?: RelativeTimeDisplay
  /** IANA zone for absolute text and the title tooltip. Omit for the browser local zone. Pass `UTC` for UTC. */
  timeZone?: string
  /** How to parse date strings with no offset. `local` is JS default; `utc` treats naive ISO as UTC. */
  parseAs?: RelativeTimeParseAs
  /** Tick interval in ms. `0` freezes the clock. */
  updateInterval?: number
}

const RelativeTime = React.forwardRef<HTMLTimeElement, RelativeTimeProps>(
  (
    {
      date,
      now,
      formatStyle = 'long',
      numeric = 'auto',
      locale,
      display = 'relative',
      timeZone,
      parseAs = 'local',
      updateInterval = 30_000,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const [tick, setTick] = React.useState(0)

    React.useEffect(() => {
      if (updateInterval <= 0 || now !== undefined) return
      const timer = setInterval(() => setTick((n) => n + 1), updateInterval)
      return () => clearInterval(timer)
    }, [updateInterval, now])

    const resolvedDate = toDate(date, parseAs)
    const resolvedNow = now === undefined ? new Date() : toDate(now, parseAs)
    void tick

    const label = formatVisibleTime(resolvedDate, resolvedNow, {
      display,
      style: formatStyle,
      numeric,
      locale,
      timeZone,
    })
    const absolute = formatAbsoluteTime(resolvedDate, locale, timeZone)

    return (
      <time
        ref={ref}
        data-uipkge=""
        data-slot="relative-time"
        data-display={display}
        data-timezone={timeZone || 'local'}
        data-parse-as={parseAs}
        dateTime={resolvedDate.toISOString()}
        title={absolute}
        className={cn('text-muted-foreground text-sm tabular-nums', className)}
        {...props}
      >
        {children ?? label}
      </time>
    )
  },
)
RelativeTime.displayName = 'RelativeTime'

export { RelativeTime }
