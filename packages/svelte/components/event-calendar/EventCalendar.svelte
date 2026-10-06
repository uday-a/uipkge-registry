<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import type { CalendarCategory, CalendarEvent, CalendarView, TimeClickPayload } from './types'

  export interface EventCalendarProps extends HTMLAttributes<HTMLDivElement> {
    /** Active date cursor. Use `bind:value` for two-way binding. */
    value?: string | Date
    /** Active view. Use `bind:view` for two-way binding. */
    view?: CalendarView
    events?: CalendarEvent[]
    categories?: (string | CalendarCategory)[]
    weekStartsOn?: 0 | 1
    firstInterval?: number
    intervalCount?: number
    intervalMinutes?: number
    intervalHeight?: number
    timeFormat?: '12h' | '24h'
    maxEventsPerDay?: number
    showNowIndicator?: boolean
    showHeader?: boolean
    /** Fired with the new cursor date whenever navigation changes it (React parity — `bind:value` still works). */
    onDateChange?: (date: Date) => void
    /** Fired with the new view whenever the view changes (React parity — `bind:view` still works). */
    onViewChange?: (view: CalendarView) => void
    onEventClick?: (event: CalendarEvent) => void
    onDateClick?: (date: string) => void
    onTimeClick?: (payload: TimeClickPayload) => void
    onMoreClick?: (payload: { date: string; events: CalendarEvent[] }) => void
    /** Custom header toolbar. Receives the cursor, view, title, and navigation actions. */
    header?: Snippet<
      [
        {
          currentDate: Date
          view: CalendarView
          title: string
          prev: () => void
          next: () => void
          today: () => void
          setView: (view: CalendarView) => void
        },
      ]
    >
    /** Extra actions rendered inside the default header, before the view switcher. */
    headerActions?: Snippet
    /** Custom event card. */
    event?: Snippet<[{ event: CalendarEvent; view: CalendarView; isAllDay: boolean }]>
    /** Custom week/day column header. */
    dayHeader?: Snippet<[{ date: Date; dateKey: string; isToday: boolean; view: CalendarView }]>
    /** Custom all-day row content. */
    allDay?: Snippet<[{ date: Date; dateKey: string; events: CalendarEvent[] }]>
    /** Custom time-gutter label. */
    interval?: Snippet<[{ hour: number; time: string; label: string }]>
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { ChevronLeft, ChevronRight, Clock } from '@lucide/svelte'
  import { Button } from '$lib/components/ui/button'
  import { cn } from '$lib/utils'
  import {
    calculateTimedEventPositions,
    formatDateKey,
    formatHourLabel,
    formatTime,
    getCurrentTimePosition,
    getEventMinutes,
    getMonthDays,
    getWeekDays,
    getWorkWeekDays,
    isToday,
    parseDate,
  } from './date-utils'
  import { calendarEventVariants, type CalendarEventVariants } from './event-calendar.variants'

  let {
    class: className,
    value = $bindable(new Date()),
    view = $bindable<CalendarView>('month'),
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
    onDateChange,
    onViewChange,
    onEventClick,
    onDateClick,
    onTimeClick,
    onMoreClick,
    header,
    headerActions,
    event: eventSnippet,
    dayHeader,
    allDay,
    interval: intervalSnippet,
    ref = $bindable(null),
    ...restProps
  }: EventCalendarProps = $props()

  // Active date cursor
  const activeDate = $derived(parseDate(value))

  function setDate(d: Date) {
    value = d
    onDateChange?.(d)
  }

  function setView(v: CalendarView) {
    view = v
    onViewChange?.(v)
  }

  // Normalized categories
  const normalizedCategories = $derived(
    categories.map((c, idx) => {
      if (typeof c === 'string') return { id: c, name: c }
      return { id: c.id || `cat-${idx}`, name: c.name || `Category ${idx + 1}`, color: c.color }
    }),
  )

  // Current time line update timer
  let nowPosition = $state<number | null>(null)

  $effect(() => {
    const update = () => {
      nowPosition = showNowIndicator ? getCurrentTimePosition(firstInterval, intervalCount, intervalMinutes) : null
    }
    update()
    const timer = setInterval(update, 30000)
    return () => clearInterval(timer)
  })

  // "+N more" overflow panel (hand-rolled inline panel; the Vue twin uses Popover).
  let moreOpenKey = $state<string | null>(null)

  $effect(() => {
    if (moreOpenKey === null) return
    function onPointerDown(e: PointerEvent) {
      if ((e.target as Element).closest?.('[data-slot="more-popover"]')) return
      moreOpenKey = null
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') moreOpenKey = null
    }
    document.addEventListener('pointerdown', onPointerDown, true)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true)
      document.removeEventListener('keydown', onKeyDown)
    }
  })

  // Navigation controls
  function handlePrev() {
    const d = new Date(activeDate)
    if (view === 'month') {
      d.setMonth(d.getMonth() - 1)
    } else if (view === 'week' || view === 'work-week') {
      d.setDate(d.getDate() - 7)
    } else if (view === 'day' || view === 'category') {
      d.setDate(d.getDate() - 1)
    }
    setDate(d)
  }

  function handleNext() {
    const d = new Date(activeDate)
    if (view === 'month') {
      d.setMonth(d.getMonth() + 1)
    } else if (view === 'week' || view === 'work-week') {
      d.setDate(d.getDate() + 7)
    } else if (view === 'day' || view === 'category') {
      d.setDate(d.getDate() + 1)
    }
    setDate(d)
  }

  function handleToday() {
    setDate(new Date())
  }

  // Header title calculation
  const formattedTitle = $derived.by(() => {
    const d = activeDate
    if (view === 'month') {
      return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    }
    if (view === 'week') {
      const days = getWeekDays(d, weekStartsOn)
      const first = days[0]!
      const last = days[6]!
      if (first.getMonth() === last.getMonth()) {
        return `${first.toLocaleDateString('en-US', { month: 'short' })} ${first.getDate()} – ${last.getDate()}, ${first.getFullYear()}`
      }
      return `${first.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${last.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
    }
    if (view === 'work-week') {
      const days = getWorkWeekDays(d)
      const first = days[0]!
      const last = days[4]!
      return `${first.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${last.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
    }
    // day / category
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  })

  // Month View Data
  const monthDays = $derived(getMonthDays(activeDate, weekStartsOn))

  // Events grouped by start-day key, built once per `events` change (preserves input order per day).
  const eventsByDay = $derived.by(() => {
    const map = new Map<string, CalendarEvent[]>()
    for (const e of events) {
      const startStr =
        typeof e.start === 'string' && /^\d{4}-\d{2}-\d{2}/.test(e.start)
          ? e.start.slice(0, 10)
          : formatDateKey(parseDate(e.start))
      const list = map.get(startStr)
      if (list) list.push(e)
      else map.set(startStr, [e])
    }
    return map
  })

  function getEventsForDay(dateKey: string): CalendarEvent[] {
    return eventsByDay.get(dateKey) ?? []
  }

  // Interval array for time grid
  const intervals = $derived.by(() => {
    const list: { hour: number; label: string; time: string }[] = []
    for (let i = 0; i < intervalCount; i++) {
      const hour = (firstInterval + Math.floor((i * intervalMinutes) / 60)) % 24
      const min = (i * intervalMinutes) % 60
      const time = `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`
      const label = min === 0 ? formatHourLabel(hour, timeFormat) : ''
      list.push({ hour, label, time })
    }
    return list
  })

  // Week Days
  const weekDays = $derived(getWeekDays(activeDate, weekStartsOn))
  // Work Week Days
  const workWeekDays = $derived(getWorkWeekDays(activeDate))

  // Columns for the week / work-week / day time grid.
  const timeGridDays = $derived(view === 'week' ? weekDays : view === 'work-week' ? workWeekDays : [activeDate])
  const timeGridCols = $derived(view === 'week' ? 'grid-cols-7' : view === 'work-week' ? 'grid-cols-5' : 'grid-cols-1')

  // All day events for a day
  function getAllDayEventsForDay(dayDate: Date): CalendarEvent[] {
    const dayKey = formatDateKey(dayDate)
    return events.filter((e) => {
      if (!e.allDay) return false
      const sKey =
        typeof e.start === 'string' && /^\d{4}-\d{2}-\d{2}/.test(e.start)
          ? e.start.slice(0, 10)
          : formatDateKey(parseDate(e.start))
      return sKey === dayKey
    })
  }

  // Day header formatters
  const weekdayHeaderLabels = $derived(
    weekStartsOn === 1 ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  )

  const viewTabs: { id: CalendarView; label: string }[] = [
    { id: 'month', label: 'Month' },
    { id: 'week', label: 'Week' },
    { id: 'work-week', label: 'Work' },
    { id: 'day', label: 'Day' },
    { id: 'category', label: 'Category' },
  ]

  function getEventVariant(event: CalendarEvent): NonNullable<CalendarEventVariants['variant']> {
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

  function handleEventClick(event: CalendarEvent, e: MouseEvent) {
    e.stopPropagation()
    onEventClick?.(event)
  }

  function handleTimeClick(dayDate: Date, hour: number, minute: number, category?: string) {
    const dateStr = formatDateKey(dayDate)
    const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
    onTimeClick?.({ date: dateStr, time: timeStr, hour, minute, category })
  }

  function handleMoreClick(dateKey: string, dayEvents: CalendarEvent[], e: MouseEvent) {
    e.stopPropagation()
    onMoreClick?.({ date: dateKey, events: dayEvents })
    moreOpenKey = moreOpenKey === dateKey ? null : dateKey
  }
</script>

<div
  bind:this={ref}
  data-slot="event-calendar"
  class={cn(
    'border-border bg-card text-foreground flex w-full flex-col overflow-hidden rounded-xl border shadow-xs',
    className,
  )}
  {...restProps}
>
  <!-- Built-in Header Toolbar -->
  {#if showHeader}
    {#if header}
      {@render header({
        currentDate: activeDate,
        view,
        title: formattedTitle,
        prev: handlePrev,
        next: handleNext,
        today: handleToday,
        setView,
      })}
    {:else}
      <header
        class="border-border bg-card/60 flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3 backdrop-blur-xs"
      >
        <div class="flex items-center gap-2">
          <Button variant="outline" size="sm" class="h-8 px-2.5 text-xs font-medium" onclick={handleToday}>
            Today
          </Button>
          <div class="flex items-center gap-0.5">
            <Button variant="ghost" size="icon" class="size-8" aria-label="Previous period" onclick={handlePrev}>
              <ChevronLeft class="size-4" />
            </Button>
            <Button variant="ghost" size="icon" class="size-8" aria-label="Next period" onclick={handleNext}>
              <ChevronRight class="size-4" />
            </Button>
          </div>
          <h2 class="text-foreground ml-1 text-base font-semibold tracking-tight sm:text-lg">
            {formattedTitle}
          </h2>
        </div>

        <div class="flex items-center gap-1.5">
          {@render headerActions?.()}
          <div class="border-border bg-muted/40 flex items-center rounded-lg border p-0.5">
            {#each viewTabs as tab (tab.id)}
              {#if tab.id !== 'category' || normalizedCategories.length > 0}
                <button
                  type="button"
                  class={cn(
                    'rounded-md px-2.5 py-1 text-xs font-medium transition-[color,background-color,box-shadow]',
                    view === tab.id
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                  onclick={() => setView(tab.id)}
                >
                  {tab.label}
                </button>
              {/if}
            {/each}
          </div>
        </div>
      </header>
    {/if}
  {/if}

  <!-- VIEW 1: MONTH VIEW -->
  {#if view === 'month'}
    <div class="flex flex-1 flex-col">
      <!-- Weekday headers -->
      <div
        class="border-border bg-muted/20 text-muted-foreground grid grid-cols-7 border-b text-center text-xs font-medium"
      >
        {#each weekdayHeaderLabels as dayName, idx (idx)}
          <div class="border-border/40 border-r py-2 last:border-r-0">
            {dayName}
          </div>
        {/each}
      </div>

      <!-- 6-week month grid -->
      <div class="divide-border/40 grid min-h-[580px] flex-1 grid-cols-7 grid-rows-6 divide-x divide-y">
        {#each monthDays as cell, cellIndex (cell.dateKey)}
          {@const dayEvents = getEventsForDay(cell.dateKey)}
          {@const visibleEvents = dayEvents.length <= maxEventsPerDay ? dayEvents : dayEvents.slice(0, maxEventsPerDay - 1)}
          {@const hiddenCount = dayEvents.length - visibleEvents.length}
          <div
            class={cn(
              'group relative flex min-h-[96px] cursor-pointer flex-col p-1.5 transition-colors',
              cell.inMonth ? 'bg-card hover:bg-muted/15' : 'bg-muted/10 text-muted-foreground/50 hover:bg-muted/20',
            )}
            onclick={() => onDateClick?.(cell.dateKey)}
          >
            <!-- Cell Header: Day Number -->
            <div class="mb-1 flex items-center justify-between">
              <span
                class={cn(
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

            <!-- Events in Day Cell -->
            <div class="flex flex-1 flex-col gap-1 overflow-hidden">
              {#each visibleEvents as evt, idx (evt.id || idx)}
                {#if eventSnippet}
                  {@render eventSnippet({ event: evt, view: 'month', isAllDay: Boolean(evt.allDay) })}
                {:else}
                  <div
                    data-slot="event-card"
                    class={cn(calendarEventVariants({ variant: getEventVariant(evt), size: 'sm' }), 'w-full truncate')}
                    onclick={(e) => handleEventClick(evt, e)}
                  >
                    <div class="flex items-center gap-1 truncate font-medium">
                      {#if !evt.allDay}
                        <span class="shrink-0 font-mono text-[10px] opacity-75">
                          {formatTime(getEventMinutes(evt.start, 540), timeFormat)}
                        </span>
                      {/if}
                      <span class="truncate">{evt.title}</span>
                    </div>
                  </div>
                {/if}
              {/each}
            </div>

            <!-- +N more button with panel -->
            {#if hiddenCount > 0}
              <div class="mt-auto pt-0.5" data-slot="more-popover">
                <button
                  type="button"
                  class="text-primary hover:text-primary/80 hover:bg-primary/10 flex items-center gap-0.5 rounded-sm px-1 py-0.5 text-[11px] font-semibold transition-colors hover:underline"
                  onclick={(e) => handleMoreClick(cell.dateKey, dayEvents, e)}
                  aria-expanded={moreOpenKey === cell.dateKey}
                >
                  +{hiddenCount} more
                </button>
                {#if moreOpenKey === cell.dateKey}
                  <div
                    class={cn(
                      'border-border bg-popover absolute z-30 w-64 rounded-md border p-2 shadow-lg',
                      cellIndex >= 28 ? 'bottom-full mb-1' : 'top-full mt-1',
                      cellIndex % 7 >= 5 ? 'right-0' : 'left-0',
                    )}
                    onclick={(e) => e.stopPropagation()}
                  >
                    <div
                      class="border-border mb-1.5 flex items-center justify-between border-b pb-1.5 text-xs font-semibold"
                    >
                      <span>
                        {cell.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' })}
                      </span>
                      <span class="text-muted-foreground text-[11px] font-normal">
                        {dayEvents.length} events
                      </span>
                    </div>
                    <div class="flex max-h-48 flex-col gap-1 overflow-y-auto">
                      {#each dayEvents as evt, idx (evt.id || idx)}
                        <div
                          class={cn(
                            calendarEventVariants({ variant: getEventVariant(evt), size: 'sm' }),
                            'w-full',
                          )}
                          onclick={(e) => handleEventClick(evt, e)}
                        >
                          <div class="flex items-center gap-1 truncate font-medium">
                            {#if !evt.allDay}
                              <span class="shrink-0 font-mono text-[10px] opacity-75">
                                {formatTime(getEventMinutes(evt.start, 540), timeFormat)}
                              </span>
                            {/if}
                            <span class="truncate">{evt.title}</span>
                          </div>
                        </div>
                      {/each}
                    </div>
                  </div>
                {/if}
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  {:else if view === 'week' || view === 'work-week' || view === 'day'}
    <!-- VIEW 2 & 3 & 4: WEEK, WORK-WEEK, DAY VIEWS -->
    <div class="flex flex-1 flex-col overflow-hidden">
      <!-- Top Columns Header (Sticky) -->
      <div class="border-border bg-muted/20 flex border-b select-none">
        <!-- Time gutter header spacer -->
        <div
          class="border-border/50 text-muted-foreground w-16 shrink-0 border-r py-2.5 text-center text-xs font-medium"
        >
          <Clock class="mx-auto size-3.5 opacity-60" />
        </div>

        <!-- Columns (7 for week, 5 for work-week, 1 for day) -->
        <div class={cn('divide-border/50 grid flex-1 divide-x', timeGridCols)}>
          {#each timeGridDays as d (formatDateKey(d))}
            <div
              class={cn(
                'hover:bg-muted/30 flex cursor-pointer flex-col items-center justify-center py-2 transition-colors',
                isToday(d) && 'bg-primary/5',
              )}
              onclick={() => onDateClick?.(formatDateKey(d))}
            >
              {#if dayHeader}
                {@render dayHeader({ date: d, dateKey: formatDateKey(d), isToday: isToday(d), view })}
              {:else}
                <span class="text-muted-foreground text-[11px] font-medium tracking-wider uppercase">
                  {d.toLocaleDateString('en-US', { weekday: view === 'day' ? 'long' : 'short' })}
                </span>
                <span
                  class={cn(
                    'mt-0.5 inline-flex size-7 items-center justify-center rounded-full text-xs font-semibold transition-[color,background-color,box-shadow]',
                    isToday(d) ? 'bg-primary text-primary-foreground shadow-xs' : 'text-foreground',
                  )}
                >
                  {d.getDate()}
                </span>
              {/if}
            </div>
          {/each}
        </div>
      </div>

      <!-- Pinned All-Day Section (if all-day events exist) -->
      <div class="border-border bg-muted/10 flex border-b text-xs">
        <div
          class="border-border/50 text-muted-foreground w-16 shrink-0 border-r p-2 text-right text-[10px] font-semibold tracking-wider uppercase"
        >
          All-day
        </div>
        <div class={cn('divide-border/50 grid flex-1 divide-x', timeGridCols)}>
          {#each timeGridDays as d (formatDateKey(d))}
            <div class="flex min-h-[32px] flex-col gap-1 p-1">
              {#if allDay}
                {@render allDay({ date: d, dateKey: formatDateKey(d), events: getAllDayEventsForDay(d) })}
              {:else}
                {#each getAllDayEventsForDay(d) as evt (evt.id || evt.title)}
                  <div
                    data-slot="event-card"
                    class={cn(
                      calendarEventVariants({ variant: getEventVariant(evt), size: 'sm' }),
                      'w-full truncate py-0.5',
                    )}
                    onclick={(e) => handleEventClick(evt, e)}
                  >
                    <span class="truncate font-medium">{evt.title}</span>
                  </div>
                {/each}
              {/if}
            </div>
          {/each}
        </div>
      </div>

      <!-- Scrollable Time Intervals Grid -->
      <div class="relative flex max-h-[640px] min-h-[480px] flex-1 overflow-y-auto">
        <!-- Time Gutter -->
        <div class="border-border/50 bg-card w-16 shrink-0 border-r select-none">
          {#each intervals as interval (interval.time)}
            <div
              style="height: {intervalHeight}px"
              class="border-border/30 text-muted-foreground relative border-b pr-2.5 text-right text-[11px] font-medium"
            >
              {#if intervalSnippet}
                {@render intervalSnippet({ hour: interval.hour, time: interval.time, label: interval.label })}
              {:else if interval.label}
                <span class="relative -top-2 block">
                  {interval.label}
                </span>
              {/if}
            </div>
          {/each}
        </div>

        <!-- Day Columns Grid -->
        <div class={cn('divide-border/50 relative grid flex-1 divide-x', timeGridCols)}>
          {#each timeGridDays as d (formatDateKey(d))}
            <div class="relative flex flex-col">
              <!-- Interval Rows (Clickable for time click) -->
              {#each intervals as interval (interval.time)}
                <div
                  style="height: {intervalHeight}px"
                  class="border-border/30 hover:bg-muted/20 cursor-pointer border-b transition-colors"
                  onclick={() => handleTimeClick(d, interval.hour, 0)}
                ></div>
              {/each}

              <!-- Timed Events Container (Absolute Overlay) -->
              <div class="pointer-events-none absolute inset-0 p-0.5">
                {#each calculateTimedEventPositions(events, d, firstInterval, intervalCount, intervalMinutes) as item (item.event.id || item.event.title)}
                  <div
                    style="top: {item.top}%; height: {item.height}%; left: calc({item.left}% + 2px); width: calc({item.width}% - 4px);"
                    class="pointer-events-auto absolute z-10"
                  >
                    {#if eventSnippet}
                      {@render eventSnippet({ event: item.event, view, isAllDay: false })}
                    {:else}
                      <div
                        data-slot="event-card"
                        class={cn(
                          calendarEventVariants({ variant: getEventVariant(item.event) }),
                          'flex h-full w-full flex-col justify-start overflow-hidden rounded-md p-1.5 leading-tight shadow-xs',
                        )}
                        onclick={(e) => handleEventClick(item.event, e)}
                      >
                        <span class="truncate text-xs font-semibold">{item.event.title}</span>
                        <span class="truncate font-mono text-[10px] opacity-80">
                          {formatTime(item.startMinutes, timeFormat)} – {formatTime(item.endMinutes, timeFormat)}
                        </span>
                        {#if item.event.location}
                          <span class="mt-auto truncate text-[10px] opacity-70">
                            📍 {item.event.location}
                          </span>
                        {/if}
                      </div>
                    {/if}
                  </div>
                {/each}

                <!-- Live Current Time Indicator -->
                {#if isToday(d) && nowPosition !== null}
                  <div style="top: {nowPosition}%" class="pointer-events-none absolute right-0 left-0 z-20">
                    <div class="relative w-full border-t-2 border-red-500 dark:border-red-400">
                      <div
                        class="ring-background absolute -top-1 -left-1 size-2 rounded-full bg-red-500 ring-2 dark:bg-red-400"
                      ></div>
                    </div>
                  </div>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  {:else if view === 'category'}
    <!-- VIEW 5: CATEGORY / RESOURCE VIEW -->
    <div class="flex flex-1 flex-col overflow-hidden">
      <!-- Category Columns Header -->
      <div class="border-border bg-muted/20 flex border-b select-none">
        <div
          class="border-border/50 text-muted-foreground w-16 shrink-0 border-r py-2.5 text-center text-xs font-medium"
        >
          <Clock class="mx-auto size-3.5 opacity-60" />
        </div>

        <div
          class="divide-border/50 grid flex-1 divide-x"
          style="grid-template-columns: repeat({Math.max(1, normalizedCategories.length)}, minmax(0, 1fr));"
        >
          {#each normalizedCategories as cat (cat.id)}
            <div
              class="text-foreground flex items-center justify-center gap-1.5 px-2 py-2.5 text-center text-xs font-semibold"
            >
              {#if cat.color}
                <span class="size-2 shrink-0 rounded-full" style="background-color: {cat.color};"></span>
              {/if}
              <span class="truncate">{cat.name}</span>
            </div>
          {/each}
        </div>
      </div>

      <!-- Category Intervals Grid -->
      <div class="relative flex max-h-[640px] min-h-[480px] flex-1 overflow-y-auto">
        <!-- Time Gutter -->
        <div class="border-border/50 bg-card w-16 shrink-0 border-r select-none">
          {#each intervals as interval (interval.time)}
            <div
              style="height: {intervalHeight}px"
              class="border-border/30 text-muted-foreground relative border-b pr-2.5 text-right text-[11px] font-medium"
            >
              {#if interval.label}
                <span class="relative -top-2 block">
                  {interval.label}
                </span>
              {/if}
            </div>
          {/each}
        </div>

        <!-- Category Columns -->
        <div
          class="divide-border/50 relative grid flex-1 divide-x"
          style="grid-template-columns: repeat({Math.max(1, normalizedCategories.length)}, minmax(0, 1fr));"
        >
          {#each normalizedCategories as cat (cat.id)}
            <div class="relative flex flex-col">
              <!-- Interval Rows -->
              {#each intervals as interval (interval.time)}
                <div
                  style="height: {intervalHeight}px"
                  class="border-border/30 hover:bg-muted/20 cursor-pointer border-b transition-colors"
                  onclick={() => handleTimeClick(activeDate, interval.hour, 0, cat.id)}
                ></div>
              {/each}

              <!-- Category Timed Events Container -->
              <div class="pointer-events-none absolute inset-0 p-0.5">
                {#each calculateTimedEventPositions(events.filter((e) => e.category === cat.id || e.category === cat.name), activeDate, firstInterval, intervalCount, intervalMinutes) as item (item.event.id || item.event.title)}
                  <div
                    style="top: {item.top}%; height: {item.height}%; left: calc({item.left}% + 2px); width: calc({item.width}% - 4px);"
                    class="pointer-events-auto absolute z-10"
                  >
                    {#if eventSnippet}
                      {@render eventSnippet({ event: item.event, view: 'category', isAllDay: false })}
                    {:else}
                      <div
                        data-slot="event-card"
                        class={cn(
                          calendarEventVariants({ variant: getEventVariant(item.event) }),
                          'flex h-full w-full flex-col justify-start overflow-hidden rounded-md p-1.5 leading-tight shadow-xs',
                        )}
                        onclick={(e) => handleEventClick(item.event, e)}
                      >
                        <span class="truncate text-xs font-semibold">{item.event.title}</span>
                        <span class="truncate font-mono text-[10px] opacity-80">
                          {formatTime(item.startMinutes, timeFormat)} – {formatTime(item.endMinutes, timeFormat)}
                        </span>
                      </div>
                    {/if}
                  </div>
                {/each}

                <!-- Live Current Time Indicator -->
                {#if isToday(activeDate) && nowPosition !== null}
                  <div style="top: {nowPosition}%" class="pointer-events-none absolute right-0 left-0 z-20">
                    <div class="relative w-full border-t-2 border-red-500 dark:border-red-400">
                      <div
                        class="ring-background absolute -top-1 -left-1 size-2 rounded-full bg-red-500 ring-2 dark:bg-red-400"
                      ></div>
                    </div>
                  </div>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  {/if}
</div>
