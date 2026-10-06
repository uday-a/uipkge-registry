// Headless month-grid + drag/shift range-select primitives.
// Domain-agnostic: knows nothing about events -- just dates, the 42-cell grid,
// and a normalized [start, end] range driven by mouse / shift-click. Pair with
// EventCalendar (or any month-shaped UI) by reading the returned state/getters.
//
// Svelte 5 runes port of the Vue useMonthGrid composable. Call during component
// initialization (same constraint as Vue's setup context): the returned object
// exposes reactive getters, so read `grid.cursor` directly -- no `.value`.

import { onMount } from 'svelte'

export type DateKey = string // YYYY-MM-DD

export interface UseMonthGridOptions {
  initialDate?: Date | DateKey
  weekStartsOn?: 0 | 1 // 0 = Sunday (default), 1 = Monday
}

export function isoDate(d: Date): DateKey {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function dateFromKey(k: DateKey): Date {
  return new Date(k + 'T00:00:00')
}

export function dayDiff(a: DateKey, b: DateKey): number {
  return Math.round((dateFromKey(b).getTime() - dateFromKey(a).getTime()) / 86400000)
}

export function useMonthGrid(options: UseMonthGridOptions = {}) {
  const weekStartsOn = options.weekStartsOn ?? 0
  const init = options.initialDate
    ? typeof options.initialDate === 'string'
      ? dateFromKey(options.initialDate)
      : options.initialDate
    : new Date()

  // "today" is frozen to the moment the hook is created -- predictable for tests / SSR.
  const today = new Date(init.getFullYear(), init.getMonth(), init.getDate())
  const todayKey = isoDate(today)

  let cursor = $state(new Date(init.getFullYear(), init.getMonth(), 1))

  let rangeAnchor = $state<DateKey>(todayKey)
  let rangeStart = $state<DateKey>(todayKey)
  let rangeEnd = $state<DateKey>(todayKey)
  let isDragging = $state(false)

  let monthLabel = $derived(cursor.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }))

  let gridDays = $derived.by(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1)
    const offset = (first.getDay() - weekStartsOn + 7) % 7
    const start = new Date(first)
    start.setDate(first.getDate() - offset)
    const days: { date: Date; key: DateKey; inMonth: boolean }[] = []
    for (let i = 0; i < 42; i++) {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      days.push({
        date: d,
        key: isoDate(d),
        inMonth: d.getMonth() === cursor.getMonth(),
      })
    }
    return days
  })

  let weekdays = $derived.by(() => {
    const base = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return [...base.slice(weekStartsOn), ...base.slice(0, weekStartsOn)]
  })

  let rangeBounds = $derived.by(() => {
    const a = rangeStart
    const b = rangeEnd
    return a <= b ? { lo: a, hi: b } : { lo: b, hi: a }
  })

  let rangeDayCount = $derived(dayDiff(rangeBounds.lo, rangeBounds.hi) + 1)
  let isRange = $derived(rangeBounds.lo !== rangeBounds.hi)

  function inRange(key: DateKey) {
    const { lo, hi } = rangeBounds
    return key >= lo && key <= hi
  }

  function prevMonth() {
    cursor = new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1)
  }
  function nextMonth() {
    cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1)
  }
  function goToToday() {
    cursor = new Date(today.getFullYear(), today.getMonth(), 1)
    rangeAnchor = todayKey
    rangeStart = todayKey
    rangeEnd = todayKey
  }
  function selectDay(key: DateKey) {
    rangeAnchor = key
    rangeStart = key
    rangeEnd = key
  }
  function selectWeekOf(key: DateKey) {
    const d = dateFromKey(key)
    const dow = (d.getDay() - weekStartsOn + 7) % 7
    const wkStart = new Date(d)
    wkStart.setDate(d.getDate() - dow)
    const wkEnd = new Date(wkStart)
    wkEnd.setDate(wkStart.getDate() + 6)
    rangeAnchor = isoDate(wkStart)
    rangeStart = isoDate(wkStart)
    rangeEnd = isoDate(wkEnd)
  }
  function clearRange() {
    rangeAnchor = todayKey
    rangeStart = todayKey
    rangeEnd = todayKey
  }

  function onCellMouseDown(key: DateKey, ev: MouseEvent) {
    if (ev.button !== 0) return // ignore right-click -- context menus handle it
    if (ev.shiftKey) {
      rangeEnd = key
      return
    }
    rangeAnchor = key
    rangeStart = key
    rangeEnd = key
    isDragging = true
  }
  function onCellMouseEnter(key: DateKey) {
    if (!isDragging) return
    rangeEnd = key
    rangeStart = rangeAnchor
  }
  function endDrag() {
    if (isDragging) isDragging = false
  }

  // Window listeners are needed because mouseup can fire outside any cell.
  // onMount never runs on the server, so no SSR guard is needed.
  onMount(() => {
    window.addEventListener('mouseup', endDrag)
    window.addEventListener('mouseleave', endDrag)
    return () => {
      window.removeEventListener('mouseup', endDrag)
      window.removeEventListener('mouseleave', endDrag)
    }
  })

  return {
    today,
    todayKey,
    get cursor() {
      return cursor
    },
    set cursor(v: Date) {
      cursor = v
    },
    get monthLabel() {
      return monthLabel
    },
    get gridDays() {
      return gridDays
    },
    get weekdays() {
      return weekdays
    },
    get rangeAnchor() {
      return rangeAnchor
    },
    set rangeAnchor(v: DateKey) {
      rangeAnchor = v
    },
    get rangeStart() {
      return rangeStart
    },
    set rangeStart(v: DateKey) {
      rangeStart = v
    },
    get rangeEnd() {
      return rangeEnd
    },
    set rangeEnd(v: DateKey) {
      rangeEnd = v
    },
    get rangeBounds() {
      return rangeBounds
    },
    get rangeDayCount() {
      return rangeDayCount
    },
    get isRange() {
      return isRange
    },
    get isDragging() {
      return isDragging
    },
    set isDragging(v: boolean) {
      isDragging = v
    },
    inRange,
    prevMonth,
    nextMonth,
    goToToday,
    selectDay,
    selectWeekOf,
    clearRange,
    onCellMouseDown,
    onCellMouseEnter,
    endDrag,
  }
}
