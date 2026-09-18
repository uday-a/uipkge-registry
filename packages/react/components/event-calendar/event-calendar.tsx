'use client'

import * as React from 'react'
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import type { CalendarView, CalendarCategory, CalendarEvent, EventCalendarProps, TimeClickPayload } from './types'
import {
  parseDate,
  formatDateKey,
  formatTime,
  formatHourLabel,
  isSameDay,
  isToday,
  getMonthDays,
  getWeekDays,
  getWorkWeekDays,
  calculateTimedEventPositions,
  getCurrentTimePosition,
  getEventMinutes,
} from './date-utils'
import { calendarEventVariants } from './event-calendar.variants'

export function EventCalendar({
  value,
  defaultValue,
  view: controlledView,
  defaultView = 'month',
  events = [],
  categories = [],
  weekStartsOn = 0,
  firstInterval = 0,
  intervalCount = 24,
  intervalMinutes = 60,
  intervalHeight = 52,
  timeFormat = '12h',
  maxEventsPerDay = 3,
  showNowIndicator = true,
  showHeader = true,
  className,
  onDateChange,
  onViewChange,
  onEventClick,
  onDateClick,
  onTimeClick,
  onMoreClick,
  renderHeader,
  renderEvent,
  renderDayHeader,
  renderAllDay,
  renderInterval,
  headerActions,
}: EventCalendarProps) {
  // Controlled or uncontrolled active date
  const [internalDate, setInternalDate] = React.useState<Date>(() => parseDate(value ?? defaultValue ?? new Date()))
  const activeDate = value ? parseDate(value) : internalDate

  const setDate = React.useCallback(
    (newDate: Date) => {
      setInternalDate(newDate)
      onDateChange?.(newDate)
    },
    [onDateChange],
  )

  // Controlled or uncontrolled active view
  const [internalView, setInternalView] = React.useState<CalendarView>(defaultView)
  const activeView = controlledView ?? internalView

  const setView = React.useCallback(
    (newView: CalendarView) => {
      setInternalView(newView)
      onViewChange?.(newView)
    },
    [onViewChange],
  )

  // Normalized categories
  const normalizedCategories = React.useMemo<CalendarCategory[]>(() => {
    return categories.map((c, idx) => {
      if (typeof c === 'string') {
        return { id: c, name: c }
      }
      return { id: c.id || `cat-${idx}`, name: c.name || `Category ${idx + 1}`, color: c.color }
    })
  }, [categories])

  // Current time position
  const [nowPosition, setNowPosition] = React.useState<number | null>(null)

  React.useEffect(() => {
    if (!showNowIndicator) {
      setNowPosition(null)
      return
    }
    const update = () => {
      setNowPosition(getCurrentTimePosition(firstInterval, intervalCount, intervalMinutes))
    }
    update()
    const timer = setInterval(update, 30000)
    return () => clearInterval(timer)
  }, [showNowIndicator, firstInterval, intervalCount, intervalMinutes])

  // Navigation handlers
  const handlePrev = React.useCallback(() => {
    const d = new Date(activeDate)
    if (activeView === 'month') {
      d.setMonth(d.getMonth() - 1)
    } else if (activeView === 'week' || activeView === 'work-week') {
      d.setDate(d.getDate() - 7)
    } else if (activeView === 'day' || activeView === 'category') {
      d.setDate(d.getDate() - 1)
    }
    setDate(d)
  }, [activeDate, activeView, setDate])

  const handleNext = React.useCallback(() => {
    const d = new Date(activeDate)
    if (activeView === 'month') {
      d.setMonth(d.getMonth() + 1)
    } else if (activeView === 'week' || activeView === 'work-week') {
      d.setDate(d.getDate() + 7)
    } else if (activeView === 'day' || activeView === 'category') {
      d.setDate(d.getDate() + 1)
    }
    setDate(d)
  }, [activeDate, activeView, setDate])

  const handleToday = React.useCallback(() => {
    setDate(new Date())
  }, [setDate])

  // Formatted Title
  const formattedTitle = React.useMemo(() => {
    const d = activeDate
    if (activeView === 'month') {
      return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    }
    if (activeView === 'week') {
      const days = getWeekDays(d, weekStartsOn)
      const first = days[0]
      const last = days[6]
      if (first.getMonth() === last.getMonth()) {
        return `${first.toLocaleDateString('en-US', { month: 'short' })} ${first.getDate()} – ${last.getDate()}, ${first.getFullYear()}`
      }
      return `${first.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${last.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
    }
    if (activeView === 'work-week') {
      const days = getWorkWeekDays(d)
      const first = days[0]
      const last = days[4]
      return `${first.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${last.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
    }
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  }, [activeDate, activeView, weekStartsOn])

  // Month View Days
  const monthDays = React.useMemo(() => getMonthDays(activeDate, weekStartsOn), [activeDate, weekStartsOn])

  const getEventsForDay = React.useCallback(
    (dateKey: string): CalendarEvent[] => {
      return events.filter((e) => {
        const startStr =
          typeof e.start === 'string' && /^\d{4}-\d{2}-\d{2}/.test(e.start)
            ? e.start.slice(0, 10)
            : formatDateKey(parseDate(e.start))
        return startStr === dateKey
      })
    },
    [events],
  )

  // Intervals for time grid
  const intervals = React.useMemo(() => {
    const list: { hour: number; label: string; time: string }[] = []
    for (let i = 0; i < intervalCount; i++) {
      const hour = (firstInterval + Math.floor((i * intervalMinutes) / 60)) % 24
      const min = (i * intervalMinutes) % 60
      const time = `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`
      const label = min === 0 ? formatHourLabel(hour, timeFormat) : ''
      list.push({ hour, label, time })
    }
    return list
  }, [firstInterval, intervalCount, intervalMinutes, timeFormat])

  const weekDays = React.useMemo(() => getWeekDays(activeDate, weekStartsOn), [activeDate, weekStartsOn])
  const workWeekDays = React.useMemo(() => getWorkWeekDays(activeDate), [activeDate])

  const getAllDayEventsForDay = React.useCallback(
    (dayDate: Date): CalendarEvent[] => {
      const dayKey = formatDateKey(dayDate)
      return events.filter((e) => {
        if (!e.allDay) return false
        const sKey =
          typeof e.start === 'string' && /^\d{4}-\d{2}-\d{2}/.test(e.start)
            ? e.start.slice(0, 10)
            : formatDateKey(parseDate(e.start))
        return sKey === dayKey
      })
    },
    [events],
  )

  const weekdayHeaderLabels = React.useMemo(() => {
    if (weekStartsOn === 1) {
      return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    }
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  }, [weekStartsOn])

  const getEventVariant = (event: CalendarEvent): any => {
    if (
      event.color === 'primary' ||
      event.color === 'secondary' ||
      event.color === 'success' ||
      event.color === 'warning' ||
      event.color === 'destructive' ||
      event.color === 'info' ||
      event.color === 'purple' ||
      event.color === 'rose'
    ) {
      return event.color
    }
    return 'default'
  }

  const handleEventCardClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation()
    onEventClick?.(event)
  }

  const handleTimeSlotClick = (dayDate: Date, hour: number, minute: number, category?: string) => {
    const dateStr = formatDateKey(dayDate)
    const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
    onTimeClick?.({
      date: dateStr,
      time: timeStr,
      hour,
      minute,
      category,
    })
  }

  return (
    <div
      data-slot="event-calendar"
      className={cn(
        'border-border bg-card text-foreground flex w-full flex-col overflow-hidden rounded-xl border shadow-xs',
        className,
      )}
    >
      {/* Built-in Header Toolbar */}
      {showHeader &&
        (renderHeader ? (
          renderHeader({
            currentDate: activeDate,
            view: activeView,
            title: formattedTitle,
            prev: handlePrev,
            next: handleNext,
            today: handleToday,
            setView,
          })
        ) : (
          <header className="border-border bg-card/60 flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3 backdrop-blur-xs">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 px-2.5 text-xs font-medium" onClick={handleToday}>
                Today
              </Button>
              <div className="flex items-center gap-0.5">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  aria-label="Previous period"
                  onClick={handlePrev}
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" className="size-8" aria-label="Next period" onClick={handleNext}>
                  <ChevronRight className="size-4" />
                </Button>
              </div>
              <h2 className="text-foreground ml-1 text-base font-semibold tracking-tight sm:text-lg">
                {{ formattedTitle }.formattedTitle}
              </h2>
            </div>

            <div className="flex items-center gap-1.5">
              {headerActions}
              <div className="border-border bg-muted/40 flex items-center rounded-lg border p-0.5">
                <button
                  type="button"
                  className={cn(
                    'rounded-md px-2.5 py-1 text-xs font-medium transition-all',
                    activeView === 'month'
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                  onClick={() => setView('month')}
                >
                  Month
                </button>
                <button
                  type="button"
                  className={cn(
                    'rounded-md px-2.5 py-1 text-xs font-medium transition-all',
                    activeView === 'week'
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                  onClick={() => setView('week')}
                >
                  Week
                </button>
                <button
                  type="button"
                  className={cn(
                    'rounded-md px-2.5 py-1 text-xs font-medium transition-all',
                    activeView === 'work-week'
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                  onClick={() => setView('work-week')}
                >
                  Work
                </button>
                <button
                  type="button"
                  className={cn(
                    'rounded-md px-2.5 py-1 text-xs font-medium transition-all',
                    activeView === 'day'
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                  onClick={() => setView('day')}
                >
                  Day
                </button>
                {normalizedCategories.length > 0 && (
                  <button
                    type="button"
                    className={cn(
                      'rounded-md px-2.5 py-1 text-xs font-medium transition-all',
                      activeView === 'category'
                        ? 'bg-background text-foreground shadow-xs'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                    onClick={() => setView('category')}
                  >
                    Category
                  </button>
                )}
              </div>
            </div>
          </header>
        ))}

      {/* VIEW 1: MONTH VIEW */}
      {activeView === 'month' && (
        <div className="flex flex-1 flex-col">
          {/* Weekday headers */}
          <div className="border-border bg-muted/20 text-muted-foreground grid grid-cols-7 border-b text-center text-xs font-medium">
            {weekdayHeaderLabels.map((dayName, idx) => (
              <div key={idx} className="border-border/40 border-r py-2 last:border-r-0">
                {dayName}
              </div>
            ))}
          </div>

          {/* 6-week month grid */}
          <div className="divide-border/40 grid min-h-[580px] flex-1 grid-cols-7 grid-rows-6 divide-x divide-y">
            {monthDays.map((cell) => {
              const dayEvents = getEventsForDay(cell.dateKey)
              return (
                <div
                  key={cell.dateKey}
                  className={cn(
                    'group relative flex min-h-[96px] cursor-pointer flex-col p-1.5 transition-colors',
                    cell.inMonth
                      ? 'bg-card hover:bg-muted/15'
                      : 'bg-muted/10 text-muted-foreground/50 hover:bg-muted/20',
                  )}
                  onClick={() => onDateClick?.(cell.dateKey)}
                >
                  {/* Cell Header: Day Number */}
                  <div className="mb-1 flex items-center justify-between">
                    <span
                      className={cn(
                        'inline-flex min-w-[20px] items-center justify-center rounded-full px-1.5 py-0.5 text-xs font-medium transition-colors',
                        cell.isToday
                          ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                          : cell.inMonth
                            ? 'text-foreground/90'
                            : 'text-muted-foreground/60',
                      )}
                    >
                      {cell.date.getDate()}
                    </span>
                  </div>

                  {/* Events in Day Cell */}
                  <div className="flex flex-1 flex-col gap-1 overflow-hidden">
                    {dayEvents.map((evt, idx) => {
                      if (dayEvents.length <= maxEventsPerDay || idx < maxEventsPerDay - 1) {
                        return renderEvent ? (
                          <React.Fragment key={evt.id || idx}>
                            {renderEvent({ event: evt, view: 'month', isAllDay: Boolean(evt.allDay) })}
                          </React.Fragment>
                        ) : (
                          <div
                            key={evt.id || idx}
                            data-slot="event-card"
                            className={cn(
                              calendarEventVariants({ variant: getEventVariant(evt), size: 'sm' }),
                              'w-full truncate',
                            )}
                            onClick={(e) => handleEventCardClick(evt, e)}
                          >
                            <div className="flex items-center gap-1 truncate font-medium">
                              {!evt.allDay && (
                                <span className="shrink-0 font-mono text-[10px] opacity-75">
                                  {formatTime(getEventMinutes(evt.start, 540), timeFormat)}
                                </span>
                              )}
                              <span className="truncate">{evt.title}</span>
                            </div>
                          </div>
                        )
                      }
                      return null
                    })}

                    {/* +N more button with popover */}
                    {dayEvents.length > maxEventsPerDay && (
                      <div className="mt-auto pt-0.5">
                        <Popover>
                          <PopoverTrigger asChild>
                            <button
                              type="button"
                              className="text-primary hover:text-primary/80 hover:bg-primary/10 flex items-center gap-0.5 rounded-sm px-1 py-0.5 text-[11px] font-semibold transition-colors hover:underline"
                              onClick={(e) => {
                                e.stopPropagation()
                                onMoreClick?.({ date: cell.dateKey, events: dayEvents })
                              }}
                            >
                              +{dayEvents.length - (maxEventsPerDay - 1)} more
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-64 p-2 shadow-lg" align="start">
                            <div className="border-border mb-1.5 flex items-center justify-between border-b pb-1.5 text-xs font-semibold">
                              <span>
                                {cell.date.toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  weekday: 'short',
                                })}
                              </span>
                              <span className="text-muted-foreground text-[11px] font-normal">
                                {dayEvents.length} events
                              </span>
                            </div>
                            <div className="flex max-h-48 flex-col gap-1 overflow-y-auto">
                              {dayEvents.map((evt, idx) => (
                                <div
                                  key={evt.id || idx}
                                  data-slot="event-card"
                                  className={cn(
                                    calendarEventVariants({ variant: getEventVariant(evt), size: 'sm' }),
                                    'w-full',
                                  )}
                                  onClick={(e) => handleEventCardClick(evt, e)}
                                >
                                  <div className="flex items-center gap-1 truncate font-medium">
                                    {!evt.allDay && (
                                      <span className="shrink-0 font-mono text-[10px] opacity-75">
                                        {formatTime(getEventMinutes(evt.start, 540), timeFormat)}
                                      </span>
                                    )}
                                    <span className="truncate">{evt.title}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* VIEW 2 & 3 & 4: WEEK, WORK-WEEK, DAY VIEWS */}
      {(activeView === 'week' || activeView === 'work-week' || activeView === 'day') && (
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Top Columns Header (Sticky) */}
          <div className="border-border bg-muted/20 flex border-b select-none">
            <div className="border-border/50 text-muted-foreground w-16 shrink-0 border-r py-2.5 text-center text-xs font-medium">
              <Clock className="mx-auto size-3.5 opacity-60" />
            </div>

            <div
              className={cn(
                'divide-border/50 grid flex-1 divide-x',
                activeView === 'week' ? 'grid-cols-7' : activeView === 'work-week' ? 'grid-cols-5' : 'grid-cols-1',
              )}
            >
              {(activeView === 'week' ? weekDays : activeView === 'work-week' ? workWeekDays : [activeDate]).map(
                (d) => (
                  <div
                    key={formatDateKey(d)}
                    className={cn(
                      'hover:bg-muted/30 flex cursor-pointer flex-col items-center justify-center py-2 transition-colors',
                      isToday(d) && 'bg-primary/5',
                    )}
                    onClick={() => onDateClick?.(formatDateKey(d))}
                  >
                    {renderDayHeader ? (
                      renderDayHeader({
                        date: d,
                        dateKey: formatDateKey(d),
                        isToday: isToday(d),
                        view: activeView,
                      })
                    ) : (
                      <>
                        <span className="text-muted-foreground text-[11px] font-medium tracking-wider uppercase">
                          {d.toLocaleDateString('en-US', { weekday: activeView === 'day' ? 'long' : 'short' })}
                        </span>
                        <span
                          className={cn(
                            'mt-0.5 inline-flex size-7 items-center justify-center rounded-full text-xs font-semibold transition-all',
                            isToday(d) ? 'bg-primary text-primary-foreground shadow-xs' : 'text-foreground',
                          )}
                        >
                          {d.getDate()}
                        </span>
                      </>
                    )}
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Pinned All-Day Section */}
          <div className="border-border bg-muted/10 flex border-b text-xs">
            <div className="border-border/50 text-muted-foreground w-16 shrink-0 border-r p-2 text-right text-[10px] font-semibold tracking-wider uppercase">
              All-day
            </div>
            <div
              className={cn(
                'divide-border/50 grid flex-1 divide-x',
                activeView === 'week' ? 'grid-cols-7' : activeView === 'work-week' ? 'grid-cols-5' : 'grid-cols-1',
              )}
            >
              {(activeView === 'week' ? weekDays : activeView === 'work-week' ? workWeekDays : [activeDate]).map(
                (d) => {
                  const dayAllDay = getAllDayEventsForDay(d)
                  return (
                    <div key={formatDateKey(d)} className="flex min-h-[32px] flex-col gap-1 p-1">
                      {renderAllDay
                        ? renderAllDay({ date: d, dateKey: formatDateKey(d), events: dayAllDay })
                        : dayAllDay.map((evt) => (
                            <div
                              key={evt.id || evt.title}
                              data-slot="event-card"
                              className={cn(
                                calendarEventVariants({ variant: getEventVariant(evt), size: 'sm' }),
                                'w-full truncate py-0.5',
                              )}
                              onClick={(e) => handleEventCardClick(evt, e)}
                            >
                              <span className="truncate font-medium">{evt.title}</span>
                            </div>
                          ))}
                    </div>
                  )
                },
              )}
            </div>
          </div>

          {/* Scrollable Time Intervals Grid */}
          <div className="relative flex max-h-[640px] min-h-[480px] flex-1 overflow-y-auto">
            {/* Time Gutter */}
            <div className="border-border/50 bg-card w-16 shrink-0 border-r select-none">
              {intervals.map((interval) => (
                <div
                  key={interval.time}
                  style={{ height: `${intervalHeight}px` }}
                  className="border-border/30 text-muted-foreground relative border-b pr-2.5 text-right text-[11px] font-medium"
                >
                  {renderInterval
                    ? renderInterval({ hour: interval.hour, time: interval.time, label: interval.label })
                    : interval.label && <span className="relative -top-2 block">{interval.label}</span>}
                </div>
              ))}
            </div>

            {/* Day Columns Grid */}
            <div
              className={cn(
                'divide-border/50 relative grid flex-1 divide-x',
                activeView === 'week' ? 'grid-cols-7' : activeView === 'work-week' ? 'grid-cols-5' : 'grid-cols-1',
              )}
            >
              {(activeView === 'week' ? weekDays : activeView === 'work-week' ? workWeekDays : [activeDate]).map(
                (d) => {
                  const positionedEvents = calculateTimedEventPositions(
                    events,
                    d,
                    firstInterval,
                    intervalCount,
                    intervalMinutes,
                  )
                  return (
                    <div key={formatDateKey(d)} className="relative flex flex-col">
                      {/* Interval Rows */}
                      {intervals.map((interval) => (
                        <div
                          key={interval.time}
                          style={{ height: `${intervalHeight}px` }}
                          className="border-border/30 hover:bg-muted/20 cursor-pointer border-b transition-colors"
                          onClick={() => handleTimeSlotClick(d, interval.hour, 0)}
                        />
                      ))}

                      {/* Timed Events Container */}
                      <div className="pointer-events-none absolute inset-0 p-0.5">
                        {positionedEvents.map((item) => (
                          <div
                            key={item.event.id || item.event.title}
                            style={{
                              top: `${item.top}%`,
                              height: `${item.height}%`,
                              left: `calc(${item.left}% + 2px)`,
                              width: `calc(${item.width}% - 4px)`,
                            }}
                            className="pointer-events-auto absolute z-10"
                          >
                            {renderEvent ? (
                              renderEvent({
                                event: item.event,
                                view: activeView,
                                isAllDay: false,
                              })
                            ) : (
                              <div
                                data-slot="event-card"
                                className={cn(
                                  calendarEventVariants({ variant: getEventVariant(item.event) }),
                                  'flex h-full w-full flex-col justify-start overflow-hidden rounded-md p-1.5 leading-tight shadow-xs',
                                )}
                                onClick={(e) => handleEventCardClick(item.event, e)}
                              >
                                <span className="truncate text-xs font-semibold">{item.event.title}</span>
                                <span className="truncate font-mono text-[10px] opacity-80">
                                  {formatTime(item.startMinutes, timeFormat)} –{' '}
                                  {formatTime(item.endMinutes, timeFormat)}
                                </span>
                                {item.event.location && (
                                  <span className="mt-auto truncate text-[10px] opacity-70">
                                    📍 {item.event.location}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        ))}

                        {/* Live Current Time Indicator */}
                        {isToday(d) && nowPosition !== null && (
                          <div
                            style={{ top: `${nowPosition}%` }}
                            className="pointer-events-none absolute right-0 left-0 z-20"
                          >
                            <div className="relative w-full border-t-2 border-red-500 dark:border-red-400">
                              <div className="ring-background absolute -top-1 -left-1 size-2 rounded-full bg-red-500 ring-2 dark:bg-red-400" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                },
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 5: CATEGORY / RESOURCE VIEW */}
      {activeView === 'category' && (
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Category Columns Header */}
          <div className="border-border bg-muted/20 flex border-b select-none">
            <div className="border-border/50 text-muted-foreground w-16 shrink-0 border-r py-2.5 text-center text-xs font-medium">
              <Clock className="mx-auto size-3.5 opacity-60" />
            </div>

            <div
              className="divide-border/50 grid flex-1 divide-x"
              style={{
                gridTemplateColumns: `repeat(${Math.max(1, normalizedCategories.length)}, minmax(0, 1fr))`,
              }}
            >
              {normalizedCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="text-foreground flex items-center justify-center gap-1.5 px-2 py-2.5 text-center text-xs font-semibold"
                >
                  {cat.color && (
                    <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: cat.color }} />
                  )}
                  <span className="truncate">{cat.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Category Intervals Grid */}
          <div className="relative flex max-h-[640px] min-h-[480px] flex-1 overflow-y-auto">
            {/* Time Gutter */}
            <div className="border-border/50 bg-card w-16 shrink-0 border-r select-none">
              {intervals.map((interval) => (
                <div
                  key={interval.time}
                  style={{ height: `${intervalHeight}px` }}
                  className="border-border/30 text-muted-foreground relative border-b pr-2.5 text-right text-[11px] font-medium"
                >
                  {interval.label && <span className="relative -top-2 block">{interval.label}</span>}
                </div>
              ))}
            </div>

            {/* Category Columns */}
            <div
              className="divide-border/50 relative grid flex-1 divide-x"
              style={{
                gridTemplateColumns: `repeat(${Math.max(1, normalizedCategories.length)}, minmax(0, 1fr))`,
              }}
            >
              {normalizedCategories.map((cat) => {
                const catEvents = events.filter((e) => e.category === cat.id || e.category === cat.name)
                const positioned = calculateTimedEventPositions(
                  catEvents,
                  activeDate,
                  firstInterval,
                  intervalCount,
                  intervalMinutes,
                )
                return (
                  <div key={cat.id} className="relative flex flex-col">
                    {/* Interval Rows */}
                    {intervals.map((interval) => (
                      <div
                        key={interval.time}
                        style={{ height: `${intervalHeight}px` }}
                        className="border-border/30 hover:bg-muted/20 cursor-pointer border-b transition-colors"
                        onClick={() => handleTimeSlotClick(activeDate, interval.hour, 0, cat.id)}
                      />
                    ))}

                    {/* Category Timed Events Container */}
                    <div className="pointer-events-none absolute inset-0 p-0.5">
                      {positioned.map((item) => (
                        <div
                          key={item.event.id || item.event.title}
                          style={{
                            top: `${item.top}%`,
                            height: `${item.height}%`,
                            left: `calc(${item.left}% + 2px)`,
                            width: `calc(${item.width}% - 4px)`,
                          }}
                          className="pointer-events-auto absolute z-10"
                        >
                          {renderEvent ? (
                            renderEvent({ event: item.event, view: 'category', isAllDay: false })
                          ) : (
                            <div
                              data-slot="event-card"
                              className={cn(
                                calendarEventVariants({ variant: getEventVariant(item.event) }),
                                'flex h-full w-full flex-col justify-start overflow-hidden rounded-md p-1.5 leading-tight shadow-xs',
                              )}
                              onClick={(e) => handleEventCardClick(item.event, e)}
                            >
                              <span className="truncate text-xs font-semibold">{item.event.title}</span>
                              <span className="truncate font-mono text-[10px] opacity-80">
                                {formatTime(item.startMinutes, timeFormat)} – {formatTime(item.endMinutes, timeFormat)}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Live Current Time Indicator */}
                      {isToday(activeDate) && nowPosition !== null && (
                        <div
                          style={{ top: `${nowPosition}%` }}
                          className="pointer-events-none absolute right-0 left-0 z-20"
                        >
                          <div className="relative w-full border-t-2 border-red-500 dark:border-red-400">
                            <div className="ring-background absolute -top-1 -left-1 size-2 rounded-full bg-red-500 ring-2 dark:bg-red-400" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
