'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import {
  TimelineContext,
  TimelineItemContext,
  type TimelineAlign,
  type TimelineDensity,
  type TimelineDirection,
  type TimelineItemContextValue,
  type TimelineSide,
  type TimelineStatus,
} from './context'
import { timelineMediaVariants, type TimelineMediaVariant } from './timeline.variants'

// React's own useId -- SSR-safe and avoids a module-level counter that would
// hydrate-mismatch. (React 19's useRef requires an initial arg.)
const useId = () => React.useId()

const TIMELINE_STYLE_ID = 'timeline-motion-styles'
const TIMELINE_STYLE_CONTENT = `
@keyframes timeline-item-enter {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes timeline-current-pulse {
  0%, 100% { box-shadow: 0 0 0 0 color-mix(in oklab, var(--primary) 45%, transparent); }
  50% { box-shadow: 0 0 0 6px color-mix(in oklab, var(--primary) 0%, transparent); }
}
[data-slot='timeline-item'].timeline-item-enter {
  animation: timeline-item-enter 320ms cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: var(--timeline-stagger, 0ms);
}
[data-slot='timeline-item'].timeline-item-current [data-slot='timeline-media-marker'],
[data-slot='timeline-item'].timeline-item-current [data-slot='timeline-separator-marker'] {
  animation: timeline-current-pulse 1.8s ease-in-out infinite;
}
@media (prefers-reduced-motion: reduce) {
  [data-slot='timeline-item'].timeline-item-enter,
  [data-slot='timeline-item'].timeline-item-current [data-slot='timeline-media-marker'],
  [data-slot='timeline-item'].timeline-item-current [data-slot='timeline-separator-marker'] {
    animation: none !important;
  }
}
`

function ensureTimelineStyles() {
  if (typeof document === 'undefined') return
  let el = document.getElementById(TIMELINE_STYLE_ID) as HTMLStyleElement | null
  if (!el) {
    el = document.createElement('style')
    el.id = TIMELINE_STYLE_ID
    document.head.appendChild(el)
  }
  if (el.textContent !== TIMELINE_STYLE_CONTENT) el.textContent = TIMELINE_STYLE_CONTENT
}

/* ------------------------------------------------------------------ Timeline */

export interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: TimelineDirection
  align?: TimelineAlign
  side?: TimelineSide
  density?: TimelineDensity
}

function Timeline({
  className,
  direction = 'vertical',
  align = 'start',
  side,
  density = 'default',
  children,
  ...props
}: TimelineProps) {
  const [ids, setIds] = React.useState<string[]>([])

  const register = React.useCallback((id: string) => {
    setIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }, [])
  const unregister = React.useCallback((id: string) => {
    setIds((prev) => prev.filter((i) => i !== id))
  }, [])
  const indexOf = React.useCallback((id: string) => ids.indexOf(id), [ids])

  const resolvedSide: TimelineSide = side ?? (direction === 'horizontal' ? 'top' : 'left')

  const ctx = React.useMemo(
    () => ({
      direction,
      align,
      side: resolvedSide,
      density,
      count: ids.length,
      register,
      unregister,
      indexOf,
    }),
    [direction, align, resolvedSide, density, ids.length, register, unregister, indexOf],
  )

  return (
    <TimelineContext.Provider value={ctx}>
      <div
        data-uipkge=""
        data-slot="timeline"
        data-direction={direction}
        data-align={align}
        className={cn('relative', direction === 'vertical' ? 'flex flex-col' : 'flex flex-row', className)}
        {...props}
      >
        {children}
      </div>
    </TimelineContext.Provider>
  )
}

/* -------------------------------------------------------------- TimelineItem */

export interface TimelineItemRenderProps {
  index: number
  isLast: boolean
  side: TimelineSide
  status: TimelineStatus
}

export interface TimelineItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  side?: TimelineSide
  status?: TimelineStatus
  children?: React.ReactNode | ((props: TimelineItemRenderProps) => React.ReactNode)
}

function TimelineItem({ className, side, status = 'default', children, ...props }: TimelineItemProps) {
  const ctx = React.useContext(TimelineContext)
  const id = useId()

  React.useLayoutEffect(() => {
    ensureTimelineStyles()
  }, [])

  React.useEffect(() => {
    if (!ctx) return
    ctx.register(id)
    return () => ctx.unregister(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, ctx?.register, ctx?.unregister])

  const index = ctx ? ctx.indexOf(id) : 0
  const isFirst = index === 0
  const isLast = ctx ? index === ctx.count - 1 : false

  const effectiveSide: TimelineSide = (() => {
    if (side) return side
    if (!ctx) return 'left'
    if (ctx.align === 'center') {
      if (ctx.direction === 'vertical') return index % 2 === 0 ? 'left' : 'right'
      return index % 2 === 0 ? 'top' : 'bottom'
    }
    return ctx.side
  })()

  const direction = ctx?.direction ?? 'vertical'
  const density = ctx?.density ?? 'default'
  const isCenter = ctx?.align === 'center'

  const verticalSpacing = isLast
    ? ''
    : {
        compact: '[&>[data-slot=timeline-content]]:pb-2',
        default: '[&>[data-slot=timeline-content]]:pb-6',
        comfortable: '[&>[data-slot=timeline-content]]:pb-10',
      }[density]

  const horizontalSpacing = isLast
    ? ''
    : {
        compact: '[&>[data-slot=timeline-content]]:pr-3',
        default: '[&>[data-slot=timeline-content]]:pr-6',
        comfortable: '[&>[data-slot=timeline-content]]:pr-10',
      }[density]

  const itemCtx: TimelineItemContextValue = {
    index,
    isFirst,
    isLast,
    side: effectiveSide,
    status,
    direction,
    density,
  }

  const resolvedChildren =
    typeof children === 'function' ? children({ index, isLast, side: effectiveSide, status }) : children

  return (
    <TimelineItemContext.Provider value={itemCtx}>
      <div
        data-uipkge=""
        data-slot="timeline-item"
        data-side={effectiveSide}
        data-status={status}
        data-last={isLast || undefined}
        style={
          {
            '--timeline-stagger': `${Math.min(index, 12) * 55}ms`,
          } as React.CSSProperties
        }
        className={cn(
          'timeline-item-enter relative',
          status === 'current' && 'timeline-item-current',
          // start mode (default): simple flex
          // No item padding — TimelineMedia's continuous line relies on items
          // butting up edge-to-edge. Use TimelineContent's own padding for
          // breathing room between rows/cards.
          !isCenter &&
            direction === 'vertical' &&
            cn('flex gap-4', effectiveSide === 'right' && 'flex-row-reverse text-right', verticalSpacing),
          !isCenter &&
            direction === 'horizontal' &&
            cn('flex flex-col gap-2', effectiveSide === 'bottom' && 'flex-col-reverse', horizontalSpacing),
          // center alternating: 3-col / 3-row grid
          isCenter &&
            direction === 'vertical' &&
            cn(
              'grid grid-cols-[1fr_auto_1fr] items-start gap-x-4',
              '[&>[data-slot=timeline-media]]:col-start-2',
              '[&>[data-slot=timeline-separator]]:col-start-2',
              effectiveSide === 'left' &&
                '[&>[data-slot=timeline-content]]:col-start-1 [&>[data-slot=timeline-content]]:text-right',
              effectiveSide === 'right' && '[&>[data-slot=timeline-content]]:col-start-3',
              verticalSpacing,
            ),
          isCenter &&
            direction === 'horizontal' &&
            cn(
              'grid grid-rows-[1fr_auto_1fr] items-start gap-y-2',
              '[&>[data-slot=timeline-media]]:row-start-2',
              '[&>[data-slot=timeline-separator]]:row-start-2',
              effectiveSide === 'top' &&
                '[&>[data-slot=timeline-content]]:row-start-1 [&>[data-slot=timeline-content]]:self-end',
              effectiveSide === 'bottom' && '[&>[data-slot=timeline-content]]:row-start-3',
              horizontalSpacing,
            ),
          className,
        )}
        {...props}
      >
        {resolvedChildren}
      </div>
    </TimelineItemContext.Provider>
  )
}

/* ------------------------------------------------------------- TimelineMedia */

export interface TimelineMediaProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: TimelineMediaVariant
  status?: TimelineStatus
  /** Manually hide the auto-generated connector line. */
  hideConnector?: boolean
  /**
   * Color the connector line below the marker using the item's status
   * (success → green, muted → gray, etc) instead of the neutral border.
   * Opt-in so existing timelines stay visually unchanged.
   */
  coloredConnector?: boolean
}

function TimelineMedia({
  className,
  variant = 'dot',
  status,
  hideConnector,
  coloredConnector,
  children,
  ...props
}: TimelineMediaProps) {
  const item = React.useContext(TimelineItemContext)

  const direction = item?.direction ?? 'vertical'
  const isFirst = item?.isFirst ?? true
  const isLast = item?.isLast ?? true
  const effectiveStatus: TimelineStatus = status ?? item?.status ?? 'default'
  const showConnector = !hideConnector && !(isFirst && isLast)

  // Marker half-size in rem, used to crop the line so it visually emerges
  // from the marker center on the first item.
  const markerHalfRem = {
    dot: '0.375rem', // size-3 = 12px / 2
    icon: '1rem', // size-8 = 32px / 2
    avatar: '1.125rem', // size-9 = 36px / 2
  }[(variant ?? 'dot') as 'dot' | 'icon' | 'avatar']

  const connectorBgClass = !coloredConnector
    ? 'bg-border'
    : {
        default: 'bg-primary',
        current: 'bg-primary',
        success: 'bg-success',
        warning: 'bg-warning',
        error: 'bg-destructive',
        info: 'bg-info',
        muted: 'bg-muted-foreground/40',
      }[effectiveStatus]

  return (
    <div
      data-uipkge=""
      data-slot="timeline-media"
      className={cn(
        'relative shrink-0 self-stretch',
        direction === 'vertical' ? 'flex w-9 flex-col items-center' : 'flex h-9 flex-row items-center',
        className,
      )}
      style={{ '--timeline-marker-half': markerHalfRem } as React.CSSProperties}
      {...props}
    >
      {/* Single continuous connector line, positioned through the marker.
          The marker's bg + ring-background acts as a "punch-through" so the
          line appears to break at each marker without any per-item math. */}
      {showConnector && (
        <div
          data-uipkge=""
          data-slot="timeline-media-connector"
          aria-hidden="true"
          className={
            direction === 'vertical'
              ? cn('absolute left-1/2 w-px -translate-x-1/2', connectorBgClass)
              : cn('absolute top-1/2 h-px -translate-y-1/2', connectorBgClass)
          }
          style={
            direction === 'vertical'
              ? {
                  top: isFirst ? 'var(--timeline-marker-half)' : '0',
                  bottom: isLast ? 'calc(100% - var(--timeline-marker-half))' : '0',
                }
              : {
                  left: isFirst ? 'var(--timeline-marker-half)' : '0',
                  right: isLast ? 'calc(100% - var(--timeline-marker-half))' : '0',
                }
          }
        />
      )}

      {/* Marker — its bg + ring-background hides the line behind it. */}
      <div
        data-uipkge=""
        data-slot="timeline-media-marker"
        className={cn(timelineMediaVariants({ variant, status: effectiveStatus }), 'relative z-10')}
      >
        {children}
      </div>
    </div>
  )
}

/* --------------------------------------------------------- TimelineSeparator */

export interface TimelineSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Manually hide the auto-generated connector line. */
  hideConnector?: boolean
  /** Override the inner dot (React equivalent of the Vue `#dot` slot). */
  dot?: React.ReactNode
}

function TimelineSeparator({ className, hideConnector, dot, ...props }: TimelineSeparatorProps) {
  const item = React.useContext(TimelineItemContext)
  const direction = item?.direction ?? 'vertical'
  const isFirst = item?.isFirst ?? true
  const isLast = item?.isLast ?? true
  const showConnector = !hideConnector && !(isFirst && isLast)

  return (
    // Legacy compact separator: 16px marker, customizable inner dot via `dot`
    // prop. Uses the same single-absolute-line strategy as TimelineMedia so
    // the connector is pixel-aligned across items. --marker-half = 0.5rem
    // (= size-4 / 2).
    <div
      data-uipkge=""
      data-slot="timeline-separator"
      className={cn(
        'relative shrink-0 self-stretch',
        direction === 'vertical' ? 'flex w-4 flex-col items-center' : 'flex h-4 flex-row items-center',
        className,
      )}
      style={{ '--timeline-marker-half': '0.5rem' } as React.CSSProperties}
      {...props}
    >
      {showConnector && (
        <div
          aria-hidden="true"
          className={
            direction === 'vertical'
              ? 'bg-border absolute left-1/2 w-px -translate-x-1/2'
              : 'bg-border absolute top-1/2 h-px -translate-y-1/2'
          }
          style={
            direction === 'vertical'
              ? {
                  top: isFirst ? 'var(--timeline-marker-half)' : '0',
                  bottom: isLast ? 'calc(100% - var(--timeline-marker-half))' : '0',
                }
              : {
                  left: isFirst ? 'var(--timeline-marker-half)' : '0',
                  right: isLast ? 'calc(100% - var(--timeline-marker-half))' : '0',
                }
          }
        />
      )}
      <div
        data-slot="timeline-separator-marker"
        className="bg-primary ring-background relative z-10 flex size-4 items-center justify-center rounded-full ring-4"
      >
        {dot ?? <div className="bg-primary-foreground size-2 rounded-full" />}
      </div>
    </div>
  )
}

/* ----------------------------------------------------------- TimelineContent */

function TimelineContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div data-uipkge="" data-slot="timeline-content" className={cn('flex-1 space-y-1', className)} {...props} />
}

/* ------------------------------------------------------------- TimelineTitle */

export interface TimelineTitleProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div'
}

function TimelineTitle({ as, className, ...props }: TimelineTitleProps) {
  const Comp = (as ?? 'h3') as React.ElementType
  return (
    <Comp
      data-uipkge=""
      data-slot="timeline-title"
      className={cn('text-sm leading-none font-semibold tracking-tight', className)}
      {...props}
    />
  )
}

/* ------------------------------------------------------- TimelineDescription */

function TimelineDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      data-uipkge=""
      data-slot="timeline-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}

/* -------------------------------------------------------------- TimelineDate */

function TimelineDate({ className, ...props }: React.TimeHTMLAttributes<HTMLTimeElement>) {
  return (
    <time
      data-uipkge=""
      data-slot="timeline-date"
      className={cn('text-muted-foreground text-xs', className)}
      {...props}
    />
  )
}

export {
  Timeline,
  TimelineItem,
  TimelineMedia,
  TimelineSeparator,
  TimelineContent,
  TimelineTitle,
  TimelineDescription,
  TimelineDate,
}
