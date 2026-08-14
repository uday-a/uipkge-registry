'use client'

/**
 * EventCalendar -- a full month-view event calendar with stats strip,
 * drag/shift range select, side rail (selected day or range summary),
 * upcoming list, and per-event/per-cell context menus.
 *
 * Configurable surface:
 *   - events / onEventsChange  CalendarEvent[]   the source of truth
 *   - eventTypes    Record<typeKey, EventTypeMeta>  visual config per type
 *   - initialDate   YYYY-MM-DD        which month opens first
 *   - weekStartsOn  0 | 1             Sunday vs Monday
 *   - loading                          skeleton state during fetch
 *   - title / description / show* toggles per pane
 *
 * Render-prop slots:
 *   - headerActions       extra controls to the right of search/view/new
 *   - eventDialog         full override of the detail dialog body
 *   - emptyDay            node shown when a selected day has no events
 *
 * Callbacks:
 *   - onEventClick(event)
 *   - onEventCreate(dateKey)            requested from "New event" or
 *                                       the per-cell context menu
 *   - onEventEdit / onEventDuplicate / onEventDelete(event)
 *   - onRangeChange({ lo, hi })         fires when the selection range moves
 */
import * as React from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  Users,
  Search,
  CalendarDays,
  ListFilter,
  Sparkles,
  Copy,
  X,
  CalendarPlus,
  ArrowRight,
  MousePointer2,
  Pencil,
  Trash2,
  Eye,
  CopyPlus,
} from 'lucide-react'
import { useMonthGrid, dateFromKey } from '@/lib/use-month-grid'
import type { CalendarEvent, EventTypeMeta } from './types'
import { defaultEventTypes } from './defaults'

export type { CalendarEvent, EventTypeMeta } from './types'
export { defaultEventTypes } from './defaults'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
  ContextMenuLabel,
} from '@/components/ui/context-menu'

export interface EventCalendarProps {
  /** Source of truth. Pair with onEventsChange. */
  events?: CalendarEvent[]
  onEventsChange?: (value: CalendarEvent[]) => void
  /** Visual + semantic theme per event type. Falls back to defaultEventTypes. */
  eventTypes?: Record<string, EventTypeMeta>
  /** YYYY-MM-DD -- month to open first. Defaults to today. */
  initialDate?: string
  /** 0 = Sunday (default), 1 = Monday. */
  weekStartsOn?: 0 | 1
  /** Show the skeleton placeholders instead of cells / rail rows. */
  loading?: boolean
  title?: string
  description?: string
  /** Default = true. Stats strip across the top. */
  showStats?: boolean
  /** Default = true. Side rail to the right of the grid. */
  showSideRail?: boolean
  /** Default = true. Search input in the header. */
  showSearch?: boolean
  /** Default = true. Month/Week/Day select. Week/Day not implemented yet
   *  -- the select is purely visual until you wire up the modes. */
  showViewSelect?: boolean
  /** Default = true. Legend strip under the grid. */
  showLegend?: boolean
  /** Default = true. "Up next" pane under the side rail. */
  showUpcoming?: boolean
  onEventClick?: (event: CalendarEvent) => void
  onEventCreate?: (dateKey: string) => void
  onEventEdit?: (event: CalendarEvent) => void
  onEventDuplicate?: (event: CalendarEvent) => void
  onEventDelete?: (event: CalendarEvent) => void
  onRangeChange?: (bounds: { lo: string; hi: string }) => void
  /** Render-prop override for the controls to the right of search/view. */
  headerActions?: React.ReactNode
  /** Render-prop override for the dialog body. */
  eventDialog?: (event: CalendarEvent) => React.ReactNode
  /** Render-prop override for the empty selected-day state. */
  emptyDay?: React.ReactNode
}

export function EventCalendar({
  events = [],
  onEventsChange: _onEventsChange,
  eventTypes = defaultEventTypes,
  initialDate,
  weekStartsOn = 0,
  loading = false,
  title = 'Calendar',
  description = 'Schedule, meetings, and deadlines. Drag or shift-click to select a range.',
  showStats = true,
  showSideRail = true,
  showSearch = true,
  showViewSelect = true,
  showLegend = true,
  showUpcoming = true,
  onEventClick,
  onEventCreate,
  onEventEdit,
  onEventDuplicate,
  onEventDelete,
  onRangeChange,
  headerActions,
  eventDialog,
  emptyDay,
}: EventCalendarProps) {
  const [view, setView] = React.useState<'month' | 'week' | 'day'>('month')
  const [eventOpen, setEventOpen] = React.useState(false)
  const [selectedEvent, setSelectedEvent] = React.useState<CalendarEvent | null>(null)
  const [search, setSearch] = React.useState('')

  const {
    todayKey,
    cursor,
    monthLabel,
    gridDays,
    weekdays,
    rangeStart,
    rangeBounds,
    rangeDayCount,
    isRange,
    inRange,
    prevMonth,
    nextMonth,
    goToToday,
    selectWeekOf,
    clearRange,
    onCellMouseDown,
    onCellMouseEnter,
    endDrag,
  } = useMonthGrid({ initialDate, weekStartsOn })

  React.useEffect(() => {
    onRangeChange?.(rangeBounds)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rangeBounds.lo, rangeBounds.hi])

  // Fall through to a neutral style for unknown event types so the calendar
  // doesn't crash when a consumer passes a type that's missing from the map.
  const neutralMeta: EventTypeMeta = {
    label: 'Event',
    icon: CalendarDays,
    chip: 'bg-muted text-muted-foreground ring-muted-foreground/20',
    bar: 'bg-muted-foreground',
    dot: 'bg-muted-foreground',
    glow: 'bg-muted-foreground/10',
    text: 'text-muted-foreground',
    ring: 'hover:ring-muted-foreground/30',
  }
  function metaFor(type: string): EventTypeMeta {
    return eventTypes[type] ?? neutralMeta
  }

  const typeKeys = React.useMemo(() => Object.keys(eventTypes), [eventTypes])

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return events
    return events.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        (e.description ?? '').toLowerCase().includes(q) ||
        (e.location ?? '').toLowerCase().includes(q),
    )
  }, [events, search])

  const eventsByDate = React.useMemo(() => {
    const map = new Map<string, CalendarEvent[]>()
    for (const e of filtered) {
      if (!map.has(e.date)) map.set(e.date, [])
      map.get(e.date)!.push(e)
    }
    for (const arr of map.values()) arr.sort((a, b) => a.start.localeCompare(b.start))
    return map
  }, [filtered])

  const monthCounts = React.useMemo(() => {
    const y = cursor.getFullYear()
    const m = cursor.getMonth()
    const out: Record<string, number> & { total: number } = { total: 0 }
    for (const k of typeKeys) out[k] = 0
    for (const e of events) {
      const d = new Date(e.date)
      if (d.getFullYear() === y && d.getMonth() === m) {
        if (out[e.type] !== undefined) out[e.type]!++
        out.total++
      }
    }
    return out
  }, [cursor, typeKeys, events])

  const typeStats = React.useMemo(() => {
    const y = cursor.getFullYear()
    const m = cursor.getMonth()
    const out: Record<string, { weeks: number[]; next: CalendarEvent | null }> = {}
    for (const k of typeKeys) out[k] = { weeks: [0, 0, 0, 0, 0, 0], next: null }
    const firstOffset = new Date(y, m, 1).getDay()

    for (const e of events) {
      const d = new Date(e.date)
      if (d.getFullYear() === y && d.getMonth() === m && out[e.type]) {
        const week = Math.floor((d.getDate() - 1 + firstOffset) / 7)
        out[e.type]!.weeks[week]!++
      }
    }
    for (const t of typeKeys) {
      const next = events
        .filter((e) => e.type === t && e.date >= todayKey)
        .sort((a, b) => a.date.localeCompare(b.date) || a.start.localeCompare(b.start))[0]
      out[t]!.next = next ?? null
    }
    return out
  }, [cursor, typeKeys, events, todayKey])

  function fmtNextDate(key: string) {
    if (key === todayKey) return 'Today'
    return dateFromKey(key).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const rangeEvents = React.useMemo(() => {
    const { lo, hi } = rangeBounds
    return filtered
      .filter((e) => e.date >= lo && e.date <= hi)
      .sort((a, b) => a.date.localeCompare(b.date) || a.start.localeCompare(b.start))
  }, [filtered, rangeBounds])

  const rangeTypeCounts = React.useMemo(() => {
    const init: Record<string, number> = {}
    for (const k of typeKeys) init[k] = 0
    for (const e of rangeEvents) {
      if (init[e.type] !== undefined) init[e.type]!++
    }
    return init
  }, [typeKeys, rangeEvents])

  const selectedDayEvents = eventsByDate.get(rangeStart) ?? []

  const upcoming = React.useMemo(
    () =>
      filtered
        .filter((e) => e.date > todayKey)
        .sort((a, b) => a.date.localeCompare(b.date) || a.start.localeCompare(b.start))
        .slice(0, 4),
    [filtered, todayKey],
  )

  function openEvent(e: CalendarEvent) {
    setSelectedEvent(e)
    setEventOpen(true)
    onEventClick?.(e)
  }

  function copyDate(key: string) {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(key).catch(() => {
        /* clipboard may be denied; nothing to do */
      })
    }
  }

  function fmtDayLong(key: string) {
    return dateFromKey(key).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  }
  function fmtDayShort(key: string) {
    return dateFromKey(key).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  function initials(name: string) {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
  }

  function cellRangeClass(key: string, inMonth: boolean) {
    const { lo, hi } = rangeBounds
    if (!inRange(key)) return inMonth ? 'bg-background hover:bg-accent/40' : 'bg-muted/20 hover:bg-muted/30'
    if (key === lo && key === hi) return 'bg-accent/30 ring-1 ring-inset ring-primary/60'
    let cls = 'bg-primary/10 hover:bg-primary/15'
    if (key === lo) cls += ' ring-1 ring-inset ring-primary/60'
    if (key === hi) cls += ' ring-1 ring-inset ring-primary/60'
    return cls
  }

  return (
    <div data-slot="event-calendar" className="flex flex-col gap-5" onMouseUp={endDrag}>
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {description && <p className="text-muted-foreground mt-1 text-sm">{description}</p>}
        </div>
        <div className="flex items-center gap-2">
          {showSearch && (
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events"
                className="h-8 w-56 pl-8 text-xs"
              />
            </div>
          )}
          {showViewSelect && (
            <Select value={view} onValueChange={(v) => setView(v as 'month' | 'week' | 'day')}>
              <SelectTrigger className="h-8 w-24 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="day">Day</SelectItem>
              </SelectContent>
            </Select>
          )}
          {headerActions ?? (
            <Button size="sm" className="gap-1.5" onClick={() => onEventCreate?.(rangeStart)}>
              <Plus className="size-3.5" />
              New event
            </Button>
          )}
        </div>
      </header>

      {/* Stats strip */}
      {showStats && (
        <div className={`grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-${Math.min(typeKeys.length, 4)}`}>
          {typeKeys.map((key) => {
            const Icon = eventTypes[key]!.icon
            return (
              <button
                key={key}
                type="button"
                className={[
                  'group bg-card/40 hover:bg-card relative isolate flex flex-col overflow-hidden rounded-xl border p-4 text-left ring-1 ring-transparent backdrop-blur transition-all ring-inset hover:-translate-y-px hover:shadow-lg',
                  eventTypes[key]!.ring,
                ].join(' ')}
                onClick={() =>
                  setSearch(
                    eventTypes[key]!.label.toLowerCase() === search.toLowerCase()
                      ? ''
                      : eventTypes[key]!.label.toLowerCase(),
                  )
                }
              >
                <Icon
                  className={[
                    'pointer-events-none absolute -top-4 -right-4 size-24 opacity-[0.06] transition-opacity group-hover:opacity-[0.12]',
                    eventTypes[key]!.text,
                  ].join(' ')}
                />
                <div
                  className={[
                    'pointer-events-none absolute -right-12 -bottom-12 size-32 rounded-full blur-2xl',
                    eventTypes[key]!.glow,
                  ].join(' ')}
                />

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className={['size-1.5 rounded-full', eventTypes[key]!.dot].join(' ')} />
                    <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                      {eventTypes[key]!.label}
                    </p>
                  </div>
                  <div
                    className={[
                      'flex size-7 items-center justify-center rounded-md ring-1 ring-inset',
                      eventTypes[key]!.chip,
                    ].join(' ')}
                  >
                    <Icon className="size-3.5" />
                  </div>
                </div>

                <div className="mt-2 flex items-baseline gap-1.5">
                  <p className="text-3xl leading-none font-semibold tabular-nums">{monthCounts[key] ?? 0}</p>
                  <p className="text-muted-foreground text-xs tracking-wider uppercase">this month</p>
                </div>

                <div className="mt-3 flex h-6 items-end gap-1">
                  {typeStats[key]!.weeks.slice(0, 6).map((n, i) => (
                    <span
                      key={i}
                      className={[
                        'flex-1 rounded-sm transition-colors',
                        n > 0 ? eventTypes[key]!.bar : 'bg-muted/40',
                        n > 0 ? 'opacity-70 group-hover:opacity-100' : '',
                      ].join(' ')}
                      style={{ height: n > 0 ? `${Math.min(100, 30 + n * 35)}%` : '20%' }}
                      title={`Week ${i + 1}: ${n} ${eventTypes[key]!.label.toLowerCase()}${n === 1 ? '' : 's'}`}
                    />
                  ))}
                </div>

                <div className="border-border/50 mt-3 min-h-[2.25rem] border-t pt-2">
                  {typeStats[key]!.next ? (
                    <>
                      <p className="text-muted-foreground text-xs tracking-wider uppercase">
                        Next <span className={eventTypes[key]!.text}>{fmtNextDate(typeStats[key]!.next!.date)}</span>
                      </p>
                      <p className="mt-0.5 truncate text-xs font-medium">{typeStats[key]!.next!.title}</p>
                    </>
                  ) : (
                    <>
                      <p className="text-muted-foreground text-xs tracking-wider uppercase">No upcoming</p>
                      <p className="text-muted-foreground/70 mt-0.5 text-xs">All clear</p>
                    </>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      )}

      {/* Main: calendar + side rail */}
      <div className={['grid gap-4', showSideRail ? 'lg:grid-cols-[minmax(0,1fr)_320px]' : ''].join(' ')}>
        {/* Month grid */}
        <div className="bg-card/40 overflow-hidden rounded-xl border">
          <div className="bg-muted/30 flex flex-wrap items-center justify-between gap-3 border-b px-4 py-2.5">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="size-7" aria-label="Previous month" onClick={prevMonth}>
                <ChevronLeft className="size-4" />
              </Button>
              <Button variant="outline" size="icon" className="size-7" aria-label="Next month" onClick={nextMonth}>
                <ChevronRight className="size-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={goToToday}>
                Today
              </Button>
              <h2 className="ml-2 text-sm font-semibold">{monthLabel}</h2>
            </div>
            <div className="text-muted-foreground flex items-center gap-3 text-xs">
              {isRange && (
                <div className="bg-primary/10 text-primary ring-primary/20 flex items-center gap-1.5 rounded-full px-2 py-0.5 ring-1 ring-inset">
                  <MousePointer2 className="size-3" />
                  <span>
                    {rangeDayCount} days, {rangeEvents.length} events
                  </span>
                  <button className="hover:text-foreground ml-0.5" aria-label="Clear date range" onClick={clearRange}>
                    <X className="size-3" />
                  </button>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Sparkles className="size-3" />
                <span>
                  {monthCounts.total} event{monthCounts.total === 1 ? '' : 's'} this month
                </span>
              </div>
            </div>
          </div>

          <div className="bg-muted/10 text-muted-foreground grid grid-cols-7 border-b text-xs tracking-wider uppercase">
            {weekdays.map((w) => (
              <div key={w} className="px-2 py-2 font-medium">
                {w}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 select-none">
            {loading
              ? Array.from({ length: 42 }).map((_, i) => (
                  <div key={i} className="h-24 border-r border-b p-1.5 last:border-r-0">
                    <Skeleton className="h-3 w-6" />
                    <Skeleton className="mt-2 h-3 w-full" />
                  </div>
                ))
              : gridDays.map((d, i) => (
                  <ContextMenu key={d.key}>
                    <ContextMenuTrigger asChild>
                      <button
                        type="button"
                        className={[
                          'group focus-visible:ring-ring relative flex h-24 flex-col gap-1 border-r border-b p-1.5 text-left transition-colors focus-visible:z-10 focus-visible:ring-2 focus-visible:outline-none',
                          (i + 1) % 7 === 0 ? 'border-r-0' : '',
                          i >= 35 ? 'border-b-0' : '',
                          cellRangeClass(d.key, d.inMonth),
                          !d.inMonth && !inRange(d.key) ? 'text-muted-foreground/60' : '',
                        ].join(' ')}
                        onMouseDown={(e) => onCellMouseDown(d.key, e)}
                        onMouseEnter={() => onCellMouseEnter(d.key)}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={[
                              'inline-flex size-5 items-center justify-center rounded-full text-xs tabular-nums',
                              d.key === todayKey ? 'bg-primary text-primary-foreground font-semibold' : '',
                              d.key !== todayKey && d.inMonth ? 'text-foreground' : '',
                              !d.inMonth ? 'text-muted-foreground/60' : '',
                            ].join(' ')}
                          >
                            {d.date.getDate()}
                          </span>
                          {(eventsByDate.get(d.key)?.length ?? 0) > 0 && (
                            <span className="text-muted-foreground text-xs tabular-nums">
                              {eventsByDate.get(d.key)!.length}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col gap-0.5">
                          {(eventsByDate.get(d.key) ?? []).slice(0, 2).map((e) => (
                            <ContextMenu key={e.id}>
                              <ContextMenuTrigger asChild>
                                <span
                                  className={[
                                    'flex cursor-pointer items-center gap-1 truncate rounded px-1 py-0.5 text-xs ring-1 ring-inset',
                                    metaFor(e.type).chip,
                                  ].join(' ')}
                                  onMouseDown={(ev) => ev.stopPropagation()}
                                  onClick={(ev) => {
                                    ev.stopPropagation()
                                    openEvent(e)
                                  }}
                                  onContextMenu={(ev) => ev.stopPropagation()}
                                >
                                  <span className="tabular-nums opacity-70">{e.start}</span>
                                  <span className="truncate">{e.title}</span>
                                </span>
                              </ContextMenuTrigger>
                              <ContextMenuContent className="w-52">
                                <ContextMenuLabel className="text-muted-foreground flex items-center gap-1.5 text-xs">
                                  <span className={['size-1.5 rounded-full', metaFor(e.type).dot].join(' ')} />
                                  <span className="truncate">{e.title}</span>
                                </ContextMenuLabel>
                                <ContextMenuSeparator />
                                <ContextMenuItem className="gap-2" onSelect={() => openEvent(e)}>
                                  <Eye className="size-3.5" /> View details
                                  <ContextMenuShortcut>Enter</ContextMenuShortcut>
                                </ContextMenuItem>
                                <ContextMenuItem className="gap-2" onSelect={() => onEventEdit?.(e)}>
                                  <Pencil className="size-3.5" /> Edit
                                </ContextMenuItem>
                                <ContextMenuItem className="gap-2" onSelect={() => onEventDuplicate?.(e)}>
                                  <CopyPlus className="size-3.5" /> Duplicate
                                </ContextMenuItem>
                                <ContextMenuItem className="gap-2" onSelect={() => copyDate(e.date)}>
                                  <Copy className="size-3.5" /> Copy date
                                </ContextMenuItem>
                                <ContextMenuSeparator />
                                <ContextMenuItem
                                  className="text-destructive focus:text-destructive gap-2"
                                  onSelect={() => onEventDelete?.(e)}
                                >
                                  <Trash2 className="size-3.5" /> Cancel event
                                </ContextMenuItem>
                              </ContextMenuContent>
                            </ContextMenu>
                          ))}
                          {(eventsByDate.get(d.key)?.length ?? 0) > 2 && (
                            <span className="text-muted-foreground px-1 text-xs">
                              +{eventsByDate.get(d.key)!.length - 2} more
                            </span>
                          )}
                        </div>
                      </button>
                    </ContextMenuTrigger>
                    <ContextMenuContent className="w-56">
                      <ContextMenuLabel className="text-muted-foreground text-xs">{fmtDayLong(d.key)}</ContextMenuLabel>
                      <ContextMenuSeparator />
                      <ContextMenuItem className="gap-2" onSelect={() => onEventCreate?.(d.key)}>
                        <CalendarPlus className="size-3.5" /> New event
                        <ContextMenuShortcut>N</ContextMenuShortcut>
                      </ContextMenuItem>
                      <ContextMenuItem className="gap-2" onSelect={() => selectWeekOf(d.key)}>
                        <CalendarDays className="size-3.5" /> Select this week
                      </ContextMenuItem>
                      <ContextMenuSeparator />
                      <ContextMenuItem className="gap-2" onSelect={() => copyDate(d.key)}>
                        <Copy className="size-3.5" /> Copy date
                        <ContextMenuShortcut className="tabular-nums">{d.key}</ContextMenuShortcut>
                      </ContextMenuItem>
                      <ContextMenuItem className="gap-2" onSelect={goToToday}>
                        <ArrowRight className="size-3.5" /> Go to today
                      </ContextMenuItem>
                      {isRange && (
                        <ContextMenuItem
                          className="text-destructive focus:text-destructive gap-2"
                          onSelect={clearRange}
                        >
                          <X className="size-3.5" /> Clear range
                        </ContextMenuItem>
                      )}
                    </ContextMenuContent>
                  </ContextMenu>
                ))}
          </div>

          {showLegend && (
            <div className="bg-muted/20 text-muted-foreground flex flex-wrap items-center gap-3 border-t px-4 py-2 text-xs">
              <ListFilter className="size-3" />
              {typeKeys.map((key) => (
                <div key={key} className="flex items-center gap-1.5">
                  <span className={['size-2 rounded-full', eventTypes[key]!.dot].join(' ')} />
                  {eventTypes[key]!.label}
                </div>
              ))}
              <span className="ml-auto text-xs">Tip: drag or shift-click to range. Right-click for actions.</span>
            </div>
          )}
        </div>

        {/* Side rail */}
        {showSideRail && (
          <aside className="flex flex-col gap-4">
            {!isRange ? (
              <div className="bg-card/40 overflow-hidden rounded-xl border">
                <div className="bg-muted/30 border-b px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-xs tracking-wider uppercase">
                        {rangeStart === todayKey ? 'Today' : 'Selected'}
                      </p>
                      <p className="mt-0.5 text-sm font-semibold">{fmtDayLong(rangeStart)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground text-xs tracking-wider uppercase">Events</p>
                      <p className="text-sm font-semibold tabular-nums">{selectedDayEvents.length}</p>
                    </div>
                  </div>
                </div>
                <div className="max-h-[420px] overflow-y-auto p-3">
                  {loading
                    ? Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="mb-2 space-y-2 rounded-lg border p-3">
                          <Skeleton className="h-3 w-32" />
                          <Skeleton className="h-2 w-20" />
                        </div>
                      ))
                    : selectedDayEvents.length === 0
                      ? (emptyDay ?? (
                          <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
                            <div className="bg-muted flex size-10 items-center justify-center rounded-full">
                              <CalendarDays className="text-muted-foreground size-5" />
                            </div>
                            <p className="text-sm font-medium">Nothing scheduled</p>
                            <p className="text-muted-foreground text-xs">Click a date or add a new event.</p>
                            <Button
                              size="sm"
                              variant="outline"
                              className="mt-1 h-7 gap-1.5 text-xs"
                              onClick={() => onEventCreate?.(rangeStart)}
                            >
                              <Plus className="size-3" /> New event
                            </Button>
                          </div>
                        ))
                      : selectedDayEvents.map((e) => (
                          <ContextMenu key={e.id}>
                            <ContextMenuTrigger asChild>
                              <div
                                className="group hover:bg-accent/50 relative flex cursor-pointer gap-3 rounded-lg p-2.5 transition-colors"
                                onClick={() => openEvent(e)}
                              >
                                <div className={['w-0.5 shrink-0 rounded-full', metaFor(e.type).bar].join(' ')} />
                                <div className="min-w-0 flex-1 space-y-1">
                                  <div className="flex items-start justify-between gap-2">
                                    <p className="text-sm leading-tight font-medium">{e.title}</p>
                                    <span
                                      className={[
                                        'shrink-0 rounded px-1.5 py-0.5 text-xs tracking-wider uppercase ring-1 ring-inset',
                                        metaFor(e.type).chip,
                                      ].join(' ')}
                                    >
                                      {metaFor(e.type).label}
                                    </span>
                                  </div>
                                  <div className="text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
                                    <span className="inline-flex items-center gap-1">
                                      <Clock className="size-3" />
                                      {e.start}-{e.end}
                                    </span>
                                    {e.location && (
                                      <span className="inline-flex items-center gap-1">
                                        <MapPin className="size-3" />
                                        {e.location}
                                      </span>
                                    )}
                                  </div>
                                  {e.attendees?.length ? (
                                    <div className="flex items-center -space-x-1.5 pt-0.5">
                                      {e.attendees.slice(0, 4).map((a, i) => (
                                        <Avatar key={i} className="border-background size-5 border-2">
                                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                            {initials(a)}
                                          </AvatarFallback>
                                        </Avatar>
                                      ))}
                                      {e.attendees.length > 4 && (
                                        <span className="text-muted-foreground pl-2 text-xs">
                                          +{e.attendees.length - 4}
                                        </span>
                                      )}
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            </ContextMenuTrigger>
                            <ContextMenuContent className="w-48">
                              <ContextMenuLabel className="text-muted-foreground truncate text-xs">
                                {e.title}
                              </ContextMenuLabel>
                              <ContextMenuSeparator />
                              <ContextMenuItem className="gap-2" onSelect={() => openEvent(e)}>
                                <Eye className="size-3.5" /> View details
                              </ContextMenuItem>
                              <ContextMenuItem className="gap-2" onSelect={() => onEventEdit?.(e)}>
                                <Pencil className="size-3.5" /> Edit
                              </ContextMenuItem>
                              <ContextMenuItem className="gap-2" onSelect={() => onEventDuplicate?.(e)}>
                                <CopyPlus className="size-3.5" /> Duplicate
                              </ContextMenuItem>
                              <ContextMenuSeparator />
                              <ContextMenuItem
                                className="text-destructive focus:text-destructive gap-2"
                                onSelect={() => onEventDelete?.(e)}
                              >
                                <Trash2 className="size-3.5" /> Cancel event
                              </ContextMenuItem>
                            </ContextMenuContent>
                          </ContextMenu>
                        ))}
                </div>
              </div>
            ) : (
              <div className="bg-card/40 overflow-hidden rounded-xl border">
                <div className="from-primary/10 border-b bg-gradient-to-r to-transparent px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-muted-foreground text-xs tracking-wider uppercase">
                        Range, {rangeDayCount} days
                      </p>
                      <p className="mt-0.5 truncate text-sm font-semibold">
                        {fmtDayShort(rangeBounds.lo)} -&gt; {fmtDayShort(rangeBounds.hi)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      aria-label="Clear date range"
                      onClick={clearRange}
                    >
                      <X className="size-3.5" />
                    </Button>
                  </div>
                  <div className={`mt-3 grid gap-2 grid-cols-${Math.min(typeKeys.length, 4)}`}>
                    {typeKeys.map((key) => (
                      <div key={key} className="bg-background/40 rounded-md border px-2 py-1.5">
                        <div className="text-muted-foreground flex items-center gap-1 text-xs tracking-wider uppercase">
                          <span className={['size-1.5 rounded-full', eventTypes[key]!.dot].join(' ')} />
                          {eventTypes[key]!.label}
                        </div>
                        <p className="mt-0.5 text-sm font-semibold tabular-nums">{rangeTypeCounts[key] ?? 0}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="max-h-[420px] overflow-y-auto">
                  {rangeEvents.length === 0 ? (
                    <p className="text-muted-foreground px-4 py-8 text-center text-xs">No events in range.</p>
                  ) : (
                    rangeEvents.map((e) => (
                      <div
                        key={e.id}
                        className="hover:bg-accent/40 flex cursor-pointer items-start gap-3 border-b px-3 py-2.5 transition-colors last:border-b-0"
                        onClick={() => openEvent(e)}
                      >
                        <div className="bg-background/60 flex w-10 shrink-0 flex-col items-center rounded-md border px-1 py-1 text-center">
                          <span className="text-muted-foreground text-xs uppercase">
                            {new Date(e.date).toLocaleDateString('en-US', { month: 'short' })}
                          </span>
                          <span className="text-sm leading-none font-semibold tabular-nums">
                            {new Date(e.date).getDate()}
                          </span>
                        </div>
                        <div className={['w-0.5 shrink-0 self-stretch rounded-full', metaFor(e.type).bar].join(' ')} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-medium">{e.title}</p>
                          <p className="text-muted-foreground mt-0.5 text-xs tabular-nums">
                            {e.start}-{e.end}
                            {e.location && <span> {e.location}</span>}
                          </p>
                        </div>
                        <span
                          className={[
                            'shrink-0 rounded px-1.5 py-0.5 text-xs tracking-wider uppercase ring-1 ring-inset',
                            metaFor(e.type).chip,
                          ].join(' ')}
                        >
                          {metaFor(e.type).label}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {showUpcoming && (
              <div className="bg-card/40 overflow-hidden rounded-xl border">
                <div className="bg-muted/30 border-b px-4 py-2.5">
                  <p className="text-sm font-semibold">Up next</p>
                  <p className="text-muted-foreground text-xs">After today</p>
                </div>
                <div className="divide-y">
                  {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3 p-3">
                        <Skeleton className="size-9 rounded-md" />
                        <div className="flex-1 space-y-1">
                          <Skeleton className="h-3 w-32" />
                          <Skeleton className="h-2 w-20" />
                        </div>
                      </div>
                    ))
                  ) : upcoming.length === 0 ? (
                    <p className="text-muted-foreground px-4 py-6 text-center text-xs">Nothing on the horizon.</p>
                  ) : (
                    upcoming.map((e) => (
                      <button
                        key={e.id}
                        type="button"
                        className="group hover:bg-accent/40 flex w-full items-center gap-3 p-3 text-left transition-colors"
                        onClick={() => openEvent(e)}
                      >
                        <div className="bg-background flex size-10 shrink-0 flex-col items-center justify-center rounded-md border text-center">
                          <span className="text-muted-foreground text-xs uppercase">
                            {new Date(e.date).toLocaleDateString('en-US', { month: 'short' })}
                          </span>
                          <span className="text-sm leading-none font-semibold tabular-nums">
                            {new Date(e.date).getDate()}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className={['size-1.5 rounded-full', metaFor(e.type).dot].join(' ')} />
                            <p className="truncate text-xs font-medium">{e.title}</p>
                          </div>
                          <p className="text-muted-foreground mt-0.5 text-xs tabular-nums">
                            {e.start}-{e.end}
                            {e.location && <span> {e.location}</span>}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </aside>
        )}
      </div>

      {/* Event Detail Dialog */}
      <Dialog open={eventOpen} onOpenChange={setEventOpen}>
        {selectedEvent && (
          <DialogContent className="sm:max-w-md">
            {eventDialog ? (
              eventDialog(selectedEvent)
            ) : (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-2">
                    <div
                      className={[
                        'flex size-8 items-center justify-center rounded-md ring-1 ring-inset',
                        metaFor(selectedEvent.type).chip,
                      ].join(' ')}
                    >
                      {React.createElement(metaFor(selectedEvent.type).icon, { className: 'size-4' })}
                    </div>
                    <div>
                      <DialogTitle className="text-base">{selectedEvent.title}</DialogTitle>
                      <DialogDescription className="text-xs">
                        {metaFor(selectedEvent.type).label}
                        {selectedEvent.status && <span> {selectedEvent.status}</span>}
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>
                <div className="space-y-3 py-2">
                  {selectedEvent.description && (
                    <p className="text-muted-foreground text-sm">{selectedEvent.description}</p>
                  )}
                  <Separator />
                  <div className="grid gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="text-muted-foreground size-4" />
                      <span>
                        {selectedEvent.date} {selectedEvent.start} - {selectedEvent.end}
                      </span>
                    </div>
                    {selectedEvent.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="text-muted-foreground size-4" />
                        <span>{selectedEvent.location}</span>
                      </div>
                    )}
                    {selectedEvent.attendees?.length ? (
                      <div className="flex items-start gap-2">
                        <Users className="text-muted-foreground mt-0.5 size-4" />
                        <div className="flex flex-wrap items-center gap-1.5">
                          {selectedEvent.attendees.map((a) => (
                            <div
                              key={a}
                              className="bg-muted flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs"
                            >
                              <Avatar className="size-4">
                                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                  {initials(a)}
                                </AvatarFallback>
                              </Avatar>
                              <span>{a}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onEventEdit?.(selectedEvent)
                      setEventOpen(false)
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      onEventDelete?.(selectedEvent)
                      setEventOpen(false)
                    }}
                  >
                    Cancel event
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
