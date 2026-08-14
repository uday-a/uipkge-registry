'use client'

// Headless month-grid + drag/shift range-select primitives.
// Domain-agnostic: knows nothing about events -- just dates, the 42-cell grid,
// and a normalized [start, end] range driven by mouse / shift-click. Pair with
// EventCalendar (or any month-shaped UI) by reading the returned values.

import * as React from 'react'

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

  // "today" is frozen to the moment the hook is first created -- predictable
  // for tests / SSR. Same for the initial cursor month.
  const { today, todayKey, initialCursor } = React.useMemo(() => {
    const init = options.initialDate
      ? typeof options.initialDate === 'string'
        ? dateFromKey(options.initialDate)
        : options.initialDate
      : new Date()
    const t = new Date(init.getFullYear(), init.getMonth(), init.getDate())
    return {
      today: t,
      todayKey: isoDate(t),
      initialCursor: new Date(init.getFullYear(), init.getMonth(), 1),
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [cursor, setCursor] = React.useState<Date>(initialCursor)

  const [rangeAnchor, setRangeAnchor] = React.useState<DateKey>(todayKey)
  const [rangeStart, setRangeStart] = React.useState<DateKey>(todayKey)
  const [rangeEnd, setRangeEnd] = React.useState<DateKey>(todayKey)
  const [isDragging, setIsDragging] = React.useState(false)

  // Mirror into refs so the window mouseup/mouseleave listeners and the
  // anchor read inside onCellMouseEnter always see the latest values.
  const isDraggingRef = React.useRef(false)
  isDraggingRef.current = isDragging
  const rangeAnchorRef = React.useRef(rangeAnchor)
  rangeAnchorRef.current = rangeAnchor

  const monthLabel = React.useMemo(
    () => cursor.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    [cursor],
  )

  const gridDays = React.useMemo(() => {
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
  }, [cursor, weekStartsOn])

  const weekdays = React.useMemo(() => {
    const base = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return [...base.slice(weekStartsOn), ...base.slice(0, weekStartsOn)]
  }, [weekStartsOn])

  const rangeBounds = React.useMemo(() => {
    const a = rangeStart
    const b = rangeEnd
    return a <= b ? { lo: a, hi: b } : { lo: b, hi: a }
  }, [rangeStart, rangeEnd])

  const rangeDayCount = React.useMemo(() => dayDiff(rangeBounds.lo, rangeBounds.hi) + 1, [rangeBounds])
  const isRange = React.useMemo(() => rangeBounds.lo !== rangeBounds.hi, [rangeBounds])

  const inRange = React.useCallback(
    (key: DateKey) => {
      const { lo, hi } = rangeBounds
      return key >= lo && key <= hi
    },
    [rangeBounds],
  )

  const prevMonth = React.useCallback(() => {
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() - 1, 1))
  }, [])
  const nextMonth = React.useCallback(() => {
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() + 1, 1))
  }, [])
  const goToToday = React.useCallback(() => {
    setCursor(new Date(today.getFullYear(), today.getMonth(), 1))
    setRangeAnchor(todayKey)
    setRangeStart(todayKey)
    setRangeEnd(todayKey)
  }, [today, todayKey])
  const selectDay = React.useCallback((key: DateKey) => {
    setRangeAnchor(key)
    setRangeStart(key)
    setRangeEnd(key)
  }, [])
  const selectWeekOf = React.useCallback(
    (key: DateKey) => {
      const d = dateFromKey(key)
      const dow = (d.getDay() - weekStartsOn + 7) % 7
      const wkStart = new Date(d)
      wkStart.setDate(d.getDate() - dow)
      const wkEnd = new Date(wkStart)
      wkEnd.setDate(wkStart.getDate() + 6)
      setRangeAnchor(isoDate(wkStart))
      setRangeStart(isoDate(wkStart))
      setRangeEnd(isoDate(wkEnd))
    },
    [weekStartsOn],
  )
  const clearRange = React.useCallback(() => {
    setRangeAnchor(todayKey)
    setRangeStart(todayKey)
    setRangeEnd(todayKey)
  }, [todayKey])

  const onCellMouseDown = React.useCallback((key: DateKey, ev: React.MouseEvent) => {
    if (ev.button !== 0) return // ignore right-click -- context menus handle it
    if (ev.shiftKey) {
      setRangeEnd(key)
      return
    }
    setRangeAnchor(key)
    setRangeStart(key)
    setRangeEnd(key)
    setIsDragging(true)
  }, [])
  const onCellMouseEnter = React.useCallback((key: DateKey) => {
    if (!isDraggingRef.current) return
    setRangeEnd(key)
    setRangeStart(rangeAnchorRef.current)
  }, [])
  const endDrag = React.useCallback(() => {
    setIsDragging((cur) => (cur ? false : cur))
  }, [])

  // Window listeners are needed because mouseup can fire outside any cell.
  // useEffect only runs on the client, so this is SSR-safe.
  React.useEffect(() => {
    window.addEventListener('mouseup', endDrag)
    window.addEventListener('mouseleave', endDrag)
    return () => {
      window.removeEventListener('mouseup', endDrag)
      window.removeEventListener('mouseleave', endDrag)
    }
  }, [endDrag])

  return {
    today,
    todayKey,
    cursor,
    monthLabel,
    gridDays,
    weekdays,
    rangeAnchor,
    rangeStart,
    rangeEnd,
    rangeBounds,
    rangeDayCount,
    isRange,
    isDragging,
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
