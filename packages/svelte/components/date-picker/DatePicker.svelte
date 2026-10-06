<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type {
    DatePickerLayout,
    DatePickerPicker,
    DatePickerPlacement,
    DatePickerPreset,
    DatePickerSize,
    DatePickerStatus,
    DatePickerType,
    DisabledTimeResult,
    FormatValue,
    MultipleValue,
    RangeValue,
    SingleValue,
  } from './date-picker-utils'

  export type {
    DatePickerType,
    DatePickerLayout,
    DatePickerPicker,
    DatePickerStatus,
    DatePickerSize,
    DatePickerPlacement,
    FormatValue,
    SingleValue,
    MultipleValue,
    RangeValue,
    DatePickerPreset,
    DisabledTimeResult,
  } from './date-picker-utils'

  export interface DatePickerProps {
    /** Controlled value (`bind:value`). Shape depends on `type`. ISO `YYYY-MM-DD` (or `YYYY-MM-DDTHH:mm` when `showTime`). */
    value?: SingleValue | MultipleValue | RangeValue
    /** Uncontrolled initial value. */
    defaultValue?: SingleValue | MultipleValue | RangeValue
    onValueChange?: (value: SingleValue | MultipleValue | RangeValue) => void
    type?: DatePickerType
    placeholder?: string
    disabled?: boolean
    readOnly?: boolean
    clearable?: boolean
    /** Format for the trigger label. String presets or Intl.DateTimeFormatOptions. Ignored when `showTime`. */
    format?: FormatValue
    /** Backward-compat alias for `format`. */
    dateFormat?: FormatValue
    locale?: string
    numberOfMonths?: number
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
    fixedWeeks?: boolean
    minValue?: string | Date
    maxValue?: string | Date
    /** Header layout: control which parts (month/year) become dropdowns. */
    layout?: DatePickerLayout
    /**
     * Granularity of selection (single type only).
     * - `day`: pick a day from the calendar grid.
     * - `week`: pick a full week — value is the week's start date.
     * - `month`: pick a whole month — value snaps to the 1st.
     * - `quarter`: pick a quarter — value snaps to quarter start.
     * - `year`: pick a whole year — value snaps to Jan 1.
     */
    picker?: DatePickerPicker
    /** Show "Today" shortcut at popover top (single + day picker only). */
    showCurrentDate?: boolean
    /** Require clicking OK before applying the selected value. */
    needConfirm?: boolean
    /** Validation status — applies colored border to the trigger. */
    status?: DatePickerStatus
    /** Size variant of the trigger input. */
    size?: DatePickerSize
    /** Placement of the popover relative to the trigger. */
    placement?: DatePickerPlacement
    /** Pair the calendar with a time selector. Value becomes `YYYY-MM-DDTHH:mm`. */
    showTime?: boolean
    /** Show seconds column in time picker. Only used when `showTime`. */
    showSeconds?: boolean
    /** 24h vs AM/PM column. Only used when `showTime`. */
    use24Hour?: boolean
    /** Minute step for the time column. Only used when `showTime`. */
    minuteStep?: number
    /** Second step for the time column. Only used when `showTime` and `showSeconds`. */
    secondStep?: number
    /** Default time for newly picked dates when `showTime` and no prior selection. `HH:mm` or `HH:mm:ss`. */
    defaultTime?: string
    /** Preset shortcuts for quick selection. */
    presets?: DatePickerPreset[]
    /** Custom separator between range start and end dates. */
    separator?: string
    /** Function to determine if a specific date should be disabled. */
    disabledDate?: (current: Date) => boolean
    /** Function to determine if specific times should be disabled. Only used when `showTime`. */
    disabledTime?: (current?: Date) => DisabledTimeResult
    /** Custom cell renderer for day calendar cells. Receives the cell's date. */
    renderCell?: Snippet<[Date]>
    triggerClassName?: string
    className?: string
    /** Svelte-idiomatic alias of `className` (merged after it). */
    class?: string
    /** The trigger <button>, via `bind:ref` (React's forwarded ref). */
    ref?: HTMLButtonElement | null
  }
</script>

<script lang="ts">
  import { CalendarDate, type DateValue } from '@internationalized/date'
  import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from '@lucide/svelte'
  import { Button } from '$lib/components/ui/button'
  import { Calendar, type CalendarRange } from '$lib/components/ui/calendar'
  import { RangeCalendar, type DateRange } from '$lib/components/ui/range-calendar'
  import { Popover, PopoverContent, PopoverTrigger } from '$lib/components/ui/popover'
  import { TimeColumns } from '$lib/components/ui/time-picker'
  import { cn } from '$lib/utils'
  import {
    coerceDate,
    coerceShape,
    defaultRangePresets,
    fmtDate,
    fmtMonth,
    fmtTime,
    stripTime,
    toISODate,
    toISODateTime,
    parseTimeShape,
    weekNumber,
    weekStart,
    withTime,
    type InternalMultiple,
    type InternalRange,
    type InternalSingle,
    type TimeShape,
  } from './date-picker-utils'

  type InternalValue = InternalSingle | InternalMultiple | InternalRange | undefined

  let {
    value = $bindable(),
    defaultValue = null,
    onValueChange,
    type = 'single',
    placeholder = 'Pick a date',
    disabled = false,
    readOnly = false,
    clearable = true,
    format = 'medium',
    dateFormat,
    locale = 'en-US',
    numberOfMonths,
    weekStartsOn = 0,
    fixedWeeks = false,
    minValue,
    maxValue,
    layout = 'default',
    picker = 'day',
    showCurrentDate = false,
    needConfirm = false,
    status,
    size = 'middle',
    placement = 'bottomLeft',
    showTime = false,
    showSeconds = false,
    use24Hour = false,
    minuteStep = 5,
    secondStep = 1,
    defaultTime = '12:00',
    presets,
    separator = '~',
    disabledDate,
    disabledTime,
    renderCell,
    triggerClassName,
    className,
    class: classProp,
    ref = $bindable(null),
  }: DatePickerProps = $props()

  const QUARTER_LABELS = ['Q1', 'Q2', 'Q3', 'Q4']
  const QUARTER_MONTHS = [1, 4, 7, 10] as const

  function compareDates(a: Date, b: Date): number {
    return stripTime(a).getTime() - stripTime(b).getTime()
  }

  function fmtDateTime(d: Date, loc: string, fmt: FormatValue, secs: boolean, h24: boolean) {
    return `${fmtDate(d, loc, fmt)} ${fmtTime(d, secs, h24)}`.trim()
  }

  function quarterStart(year: number, quarterIdx: number): Date {
    return new Date(year, QUARTER_MONTHS[quarterIdx]! - 1, 1)
  }

  function weekAnchorForMonth(year: number, month: number, wso: number): Date {
    return weekStart(new Date(year, month - 1, 1), wso)
  }

  /** React maps `layout` to react-day-picker's captionLayout; the Svelte Calendar takes the layout name directly. */
  function layoutToCalendarLayout(l: DatePickerLayout): 'month-and-year' | 'month-only' | 'year-only' | undefined {
    return l === 'default' ? undefined : l
  }

  function rangeFromCalendar(r: DateRange | undefined): InternalRange | undefined {
    if (!r?.start) return undefined
    return r.end ? { start: r.start, end: r.end } : { start: r.start }
  }

  function rangeToCalendar(r: InternalRange | undefined): DateRange | undefined {
    if (!r?.start) return undefined
    return { start: stripTime(r.start), end: r.end ? stripTime(r.end) : undefined }
  }

  // The Svelte Calendar speaks @internationalized/date; the public API stays on JS Dates (React parity).
  function toCalendarDate(d: Date): CalendarDate {
    return new CalendarDate(d.getFullYear(), d.getMonth() + 1, d.getDate())
  }

  function fromDateValue(d: DateValue): Date {
    return new Date(d.year, d.month - 1, d.day)
  }

  function getLastTime(v: InternalValue, t: DatePickerType, dt: string): TimeShape {
    if (t === 'single' && v instanceof Date) {
      if (v.getHours() || v.getMinutes() || v.getSeconds()) {
        return { h: v.getHours(), m: v.getMinutes(), s: v.getSeconds() }
      }
    }
    if (t === 'range') {
      const r = v as InternalRange
      if (r?.start && (r.start.getHours() || r.start.getMinutes() || r.start.getSeconds())) {
        return { h: r.start.getHours(), m: r.start.getMinutes(), s: r.start.getSeconds() }
      }
    }
    return parseTimeShape(dt, { h: 12, m: 0, s: 0 })
  }

  let open = $state(false)
  let previewValue = $state<InternalValue>(undefined)
  const isControlled = $derived(value !== undefined)
  // Uncontrolled seed: intentionally the initial `type` / `defaultValue` only (React useState parity).
  // svelte-ignore state_referenced_locally
  let internalState = $state<InternalValue>(coerceShape(type, defaultValue ?? null))

  const internal = $derived<InternalValue>(isControlled ? coerceShape(type, value) : internalState)
  const activeValue = $derived<InternalValue>(needConfirm ? (previewValue ?? internal) : internal)

  const effectiveFormat = $derived(dateFormat ?? format)
  const effectiveNumberOfMonths = $derived(numberOfMonths ?? (type === 'range' ? 2 : 1))
  const effectivePresets = $derived(presets ?? (type === 'range' ? defaultRangePresets() : undefined))

  const presetGroups = $derived.by(() => {
    const groups = new Map<string | undefined, DatePickerPreset[]>()
    for (const p of effectivePresets ?? []) {
      const cat = p.category
      if (!groups.has(cat)) groups.set(cat, [])
      groups.get(cat)!.push(p)
    }
    return Array.from(groups.entries()).map(([category, presetList]) => ({
      category,
      presets: presetList,
    }))
  })

  const minDate = $derived(coerceDate(minValue) ?? undefined)
  const maxDate = $derived(coerceDate(maxValue) ?? undefined)

  // svelte-ignore state_referenced_locally
  let monthYearAnchor = $state<Date>(
    (() => {
      const v = coerceShape(type, defaultValue ?? null)
      if (v instanceof Date) return v
      return stripTime(new Date())
    })(),
  )

  $effect(() => {
    if (!open) previewValue = undefined
  })

  $effect(() => {
    if (open) {
      const v = internal
      if (v instanceof Date) monthYearAnchor = v
      else monthYearAnchor = stripTime(new Date())
    }
  })

  function serializeDate(d: Date) {
    return showTime ? toISODateTime(d, showSeconds) : toISODate(d)
  }

  function emit(out: SingleValue | MultipleValue | RangeValue) {
    value = out
    onValueChange?.(out)
  }

  function emitOut(v: InternalValue) {
    if (type === 'multiple') {
      const arr = (v as InternalMultiple) ?? []
      emit(arr.map(serializeDate))
      return
    }
    if (type === 'range') {
      // Clear must emit null. Incomplete ranges (start only) stay local until both ends exist.
      if (!v) {
        emit(null)
        return
      }
      const r = v as InternalRange
      if (!r.start || !r.end) return
      emit({ start: serializeDate(r.start), end: serializeDate(r.end) })
      return
    }
    const single = v as InternalSingle
    emit(single ? serializeDate(single) : null)
  }

  function handleUpdate(v: InternalValue) {
    if (!isControlled) internalState = v
    emitOut(v)
    if (needConfirm) return
    if (type === 'single' && v && !showTime) open = false
    if (type === 'range') {
      const r = v as InternalRange | undefined
      if (r?.start && r?.end && !showTime) open = false
    }
  }

  function clear(event: Event) {
    event.stopPropagation()
    if (disabled || readOnly) return
    if (type === 'multiple') handleUpdate([])
    else handleUpdate(undefined)
  }

  function applyPreset(preset: DatePickerPreset) {
    if (disabled || readOnly) return
    const v = preset.value
    if (!v) {
      handleUpdate(undefined)
      open = false
      return
    }
    if (type === 'multiple') {
      const arr = (v as MultipleValue) ?? []
      handleUpdate(arr.map(coerceDate).filter((x): x is Date => x != null))
      open = false
      return
    }
    if (type === 'range') {
      const r = v as RangeValue
      if (!r?.start) {
        handleUpdate(undefined)
        open = false
        return
      }
      const start = coerceDate(r.start)
      const end = r.end ? coerceDate(r.end) : undefined
      if (!start) {
        handleUpdate(undefined)
        open = false
        return
      }
      handleUpdate(end ? { start, end } : { start })
      open = false
      return
    }
    handleUpdate(coerceDate(v as SingleValue) ?? undefined)
    open = false
  }

  function commitPreview() {
    if (needConfirm && previewValue !== undefined) {
      handleUpdate(previewValue)
      previewValue = undefined
    }
    open = false
  }

  function cancelPreview() {
    previewValue = undefined
    open = false
  }

  const display = $derived.by(() => {
    const v = internal
    if (!v) return ''
    if (type === 'multiple') {
      const arr = v as InternalMultiple
      if (!arr.length) return ''
      if (arr.length === 1) return fmtDate(arr[0]!, locale, effectiveFormat)
      if (arr.length <= 3) return arr.map((d) => fmtDate(d, locale, effectiveFormat)).join(', ')
      return `${arr.length} dates selected`
    }
    if (type === 'range') {
      const r = v as InternalRange
      const fmt = showTime
        ? (d: Date) => fmtDateTime(d, locale, effectiveFormat, showSeconds, use24Hour)
        : (d: Date) => fmtDate(d, locale, effectiveFormat)
      if (r.start && r.end) return `${fmt(r.start)} ${separator} ${fmt(r.end)}`
      if (r.start) return `${fmt(r.start)} ${separator} …`
      return ''
    }
    if (picker === 'week') {
      const ws = weekStart(v as Date, weekStartsOn)
      return `Week ${weekNumber(ws)}, ${ws.getFullYear()}`
    }
    if (picker === 'month') return fmtMonth(v as Date, locale)
    if (picker === 'quarter') {
      const d = v as Date
      const q = Math.ceil((d.getMonth() + 1) / 3)
      return `Q${q} ${d.getFullYear()}`
    }
    if (picker === 'year') return String((v as Date).getFullYear())
    return showTime
      ? fmtDateTime(v as Date, locale, effectiveFormat, showSeconds, use24Hour)
      : fmtDate(v as Date, locale, effectiveFormat)
  })

  const hasValue = $derived.by(() => {
    const v = internal
    if (!v) return false
    if (type === 'multiple') return (v as InternalMultiple).length > 0
    if (type === 'range') return Boolean((v as InternalRange).start)
    return true
  })

  // Prefer preview (confirm mode) so time columns track the uncommitted selection.
  const lastTime = $derived(getLastTime(activeValue, type, defaultTime))

  function handleCalendarUpdate(v: unknown) {
    if (readOnly) return
    if (needConfirm) {
      if (type === 'multiple') {
        const arr = (v as Date[]) ?? []
        previewValue = arr.map((d) => (showTime ? withTime(d, lastTime) : d))
      } else if (type === 'range') {
        const r = rangeFromCalendar(v as DateRange | undefined)
        if (!r?.start) previewValue = undefined
        else {
          const start = showTime ? withTime(r.start, lastTime) : r.start
          const end = r.end ? (showTime ? withTime(r.end, lastTime) : r.end) : undefined
          previewValue = end ? { start, end } : { start }
        }
      } else {
        const d = v as Date | undefined
        previewValue = d ? (showTime ? withTime(d, lastTime) : d) : undefined
      }
      return
    }
    if (!showTime) {
      if (type === 'range') handleUpdate(rangeFromCalendar(v as DateRange | undefined))
      else if (type === 'multiple') handleUpdate((v as Date[]) ?? [])
      else handleUpdate(v as InternalSingle)
      return
    }
    if (type === 'multiple') {
      const arr = (v as Date[]) ?? []
      handleUpdate(arr.map((d) => withTime(d, lastTime)))
      return
    }
    if (type === 'range') {
      const r = rangeFromCalendar(v as DateRange | undefined)
      if (!r?.start) return handleUpdate(undefined)
      const start = withTime(r.start, lastTime)
      const end = r.end ? withTime(r.end, lastTime) : undefined
      handleUpdate(end ? { start, end } : { start })
      return
    }
    const d = v as Date | undefined
    if (d) handleUpdate(withTime(d, lastTime))
  }

  /** Svelte Calendar emits DateValue(s); convert to JS Dates before the shared React logic. */
  function handleDayCalendarUpdate(v: DateValue | DateValue[] | CalendarRange | undefined) {
    if (v != null && typeof v === 'object' && 'start' in v) return // range never occurs here (single/multiple only)
    if (Array.isArray(v)) handleCalendarUpdate(v.map(fromDateValue))
    else handleCalendarUpdate(v ? fromDateValue(v) : undefined)
  }

  function handleTimeUpdate(timeValue: string) {
    const base = needConfirm ? (previewValue ?? internal) : internal
    if (!base) return
    const t = parseTimeShape(timeValue, lastTime)
    if (type === 'single') {
      const next = withTime(base as Date, t)
      if (needConfirm) {
        previewValue = next
        return
      }
      handleUpdate(next)
      return
    }
    if (type === 'range') {
      const r = base as InternalRange
      if (!r.start) return
      const start = withTime(r.start, t)
      const end = r.end ? withTime(r.end, t) : undefined
      const next = end ? { start, end } : { start }
      if (needConfirm) {
        previewValue = next
        return
      }
      handleUpdate(next)
    }
  }

  const timeForColumns = $derived(
    showSeconds
      ? `${String(lastTime.h).padStart(2, '0')}:${String(lastTime.m).padStart(2, '0')}:${String(lastTime.s).padStart(2, '0')}`
      : `${String(lastTime.h).padStart(2, '0')}:${String(lastTime.m).padStart(2, '0')}`,
  )

  const timeFormat = $derived(showSeconds ? 'HH:mm:ss' : 'HH:mm')

  const disabledTimeConfig = $derived.by(() => {
    if (!disabledTime) return undefined
    let current: Date | undefined
    if (type === 'range') {
      const r = activeValue as InternalRange | undefined
      current = r?.start
    } else if (activeValue instanceof Date) {
      current = activeValue
    } else if (Array.isArray(activeValue)) {
      current = activeValue[0]
    }
    return disabledTime(current)
  })

  // React feeds react-day-picker `disabled` matchers (before min / after max / disabledDate);
  // the Svelte Calendar takes one predicate over DateValue.
  const calendarDisabled = $derived.by(() => {
    if (!minDate && !maxDate && !disabledDate) return undefined
    const min = minDate ? stripTime(minDate) : undefined
    const max = maxDate ? stripTime(maxDate) : undefined
    return (dv: DateValue) => {
      const d = fromDateValue(dv)
      if (min && d < min) return true
      if (max && d > max) return true
      return disabledDate?.(d) ?? false
    }
  })

  const calendarValue = $derived.by(() => {
    // Use activeValue so needConfirm preview highlights on the grid (not only internal).
    const v = activeValue
    if (type === 'multiple') return (v as InternalMultiple | undefined)?.map(stripTime)
    if (type === 'range') return rangeToCalendar(v as InternalRange | undefined)
    if (v instanceof Date) return stripTime(v)
    return undefined
  })

  const dayCalendarValue = $derived.by((): DateValue | DateValue[] | undefined => {
    const v = calendarValue
    if (Array.isArray(v)) return v.map(toCalendarDate)
    if (v instanceof Date) return toCalendarDate(v)
    return undefined
  })

  const calendarLayout = $derived(layoutToCalendarLayout(layout))

  const placementMap: Record<
    DatePickerPlacement,
    { side: 'top' | 'bottom' | 'left' | 'right'; align: 'start' | 'center' | 'end' }
  > = {
    top: { side: 'top', align: 'center' },
    bottom: { side: 'bottom', align: 'center' },
    left: { side: 'left', align: 'center' },
    right: { side: 'right', align: 'center' },
    topLeft: { side: 'top', align: 'start' },
    topRight: { side: 'top', align: 'end' },
    bottomLeft: { side: 'bottom', align: 'start' },
    bottomRight: { side: 'bottom', align: 'end' },
  }
  const popoverPlacement = $derived(placementMap[placement] ?? { side: 'bottom', align: 'start' })

  const buttonSize = $derived(size === 'small' ? 'sm' : size === 'large' ? 'lg' : 'default')

  const triggerClasses = $derived(
    cn(
      showTime ? 'min-w-[280px]' : 'min-w-[240px]',
      'justify-start gap-2 text-left font-normal',
      !hasValue && 'text-muted-foreground',
      status === 'error' && 'border-destructive focus-visible:ring-destructive',
      status === 'warning' && 'border-warning focus-visible:ring-warning',
      triggerClassName,
      className,
      classProp,
    ),
  )

  function pickToday() {
    if (type !== 'single') return
    const t = stripTime(new Date())
    if (picker === 'week') {
      handleUpdate(weekStart(t, weekStartsOn))
      return
    }
    handleUpdate(t)
  }

  function shiftAnchor(dir: -1 | 1) {
    const y = monthYearAnchor.getFullYear()
    const m = monthYearAnchor.getMonth() + 1
    if (picker === 'month' || picker === 'week') {
      monthYearAnchor = new Date(y + dir, m - 1, 1)
    } else if (picker === 'year' || picker === 'quarter') {
      monthYearAnchor = new Date(y + dir, 0, 1)
    }
  }

  const monthLabels = $derived(
    Array.from({ length: 12 }, (_, idx) =>
      new Intl.DateTimeFormat(locale, { month: 'short' }).format(new Date(2024, idx, 1)),
    ),
  )

  const yearGrid = $derived.by(() => {
    const y = monthYearAnchor.getFullYear()
    const start = y - (y % 12)
    return Array.from({ length: 12 }, (_, i) => start + i)
  })

  const weekGrid = $derived.by(() => {
    const y = monthYearAnchor.getFullYear()
    const m = monthYearAnchor.getMonth() + 1
    const start = weekAnchorForMonth(y, m, weekStartsOn)
    return Array.from({ length: 6 }, (_, i) => {
      const weekStartDate = new Date(start)
      weekStartDate.setDate(weekStartDate.getDate() + i * 7)
      const weekEndDate = new Date(weekStartDate)
      weekEndDate.setDate(weekEndDate.getDate() + 6)
      return {
        start: weekStartDate,
        end: weekEndDate,
        weekNum: weekNumber(weekStartDate),
      }
    })
  })

  const shortMonth = $derived(new Intl.DateTimeFormat(locale, { month: 'short' }))

  function isWeekSelected(ws: Date) {
    const v = activeValue
    if (!(v instanceof Date)) return false
    return compareDates(weekStart(v, weekStartsOn), ws) === 0
  }

  function isWeekDisabled(ws: Date) {
    if (minDate && compareDates(ws, minDate) < 0) return true
    const weekEnd = new Date(ws)
    weekEnd.setDate(weekEnd.getDate() + 6)
    if (maxDate && compareDates(weekEnd, maxDate) > 0) return true
    if (disabledDate?.(ws)) return true
    return false
  }

  function pickWeek(ws: Date) {
    if (isWeekDisabled(ws) || readOnly) return
    if (needConfirm) {
      previewValue = ws
      return
    }
    handleUpdate(ws)
  }

  function isQuarterSelected(qIdx: number) {
    const v = activeValue
    if (!(v instanceof Date)) return false
    return v.getFullYear() === monthYearAnchor.getFullYear() && Math.ceil((v.getMonth() + 1) / 3) === qIdx + 1
  }

  function isQuarterDisabled(qIdx: number) {
    const d = quarterStart(monthYearAnchor.getFullYear(), qIdx)
    if (minDate && compareDates(d, minDate) < 0) return true
    const lastDay = new Date(d.getFullYear(), d.getMonth() + 3, 0)
    if (maxDate && compareDates(lastDay, maxDate) > 0) return true
    if (disabledDate?.(d)) return true
    return false
  }

  function pickQuarter(qIdx: number) {
    const d = quarterStart(monthYearAnchor.getFullYear(), qIdx)
    if (isQuarterDisabled(qIdx) || readOnly) return
    if (needConfirm) {
      previewValue = d
      return
    }
    handleUpdate(d)
  }

  function isMonthSelected(monthIdx: number) {
    const v = activeValue
    if (!(v instanceof Date)) return false
    return v.getFullYear() === monthYearAnchor.getFullYear() && v.getMonth() === monthIdx
  }

  function isMonthDisabled(monthIdx: number) {
    const d = new Date(monthYearAnchor.getFullYear(), monthIdx, 1)
    if (minDate && compareDates(d, minDate) < 0) return true
    if (maxDate && compareDates(d, maxDate) > 0) return true
    if (disabledDate?.(d)) return true
    return false
  }

  function pickMonth(monthIdx: number) {
    const d = new Date(monthYearAnchor.getFullYear(), monthIdx, 1)
    if (isMonthDisabled(monthIdx) || readOnly) return
    if (needConfirm) {
      previewValue = d
      return
    }
    handleUpdate(d)
  }

  function isYearSelected(year: number) {
    const v = activeValue
    return v instanceof Date && v.getFullYear() === year
  }

  function isYearDisabled(year: number) {
    const d = new Date(year, 0, 1)
    const lastDay = new Date(year, 11, 31)
    if (minDate && compareDates(lastDay, minDate) < 0) return true
    if (maxDate && compareDates(d, maxDate) > 0) return true
    if (disabledDate?.(d)) return true
    return false
  }

  function pickYear(year: number) {
    const d = new Date(year, 0, 1)
    if (isYearDisabled(year) || readOnly) return
    if (picker === 'year') {
      if (needConfirm) {
        previewValue = d
        return
      }
      handleUpdate(d)
    } else {
      monthYearAnchor = d
    }
  }

  const monthYearLabel = $derived(
    picker === 'week'
      ? new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric' }).format(monthYearAnchor)
      : picker === 'quarter' || picker === 'month'
        ? String(monthYearAnchor.getFullYear())
        : `${yearGrid[0]} – ${yearGrid[yearGrid.length - 1]}`,
  )

  const showAlternatePicker = $derived(picker !== 'day' && type === 'single')

  function onClearClick(e: MouseEvent) {
    e.stopPropagation()
    // Also mark handled: PopoverTrigger skips its toggle on defaultPrevented clicks.
    e.preventDefault()
    clear(e)
  }

  function onClearKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      e.stopPropagation()
      clear(e)
    }
  }

  function onDone() {
    // In confirm mode, Done must commit preview — closing alone discards it.
    if (needConfirm) commitPreview()
    else open = false
  }
</script>

{#snippet dayCell({ day }: { day: CalendarDate; month: CalendarDate })}
  {@render renderCell?.(fromDateValue(day))}
{/snippet}

<Popover bind:open>
  <PopoverTrigger>
    {#snippet child({ props })}
      <Button
        {...props}
        bind:ref
        type="button"
        variant="outline"
        size={buttonSize}
        {disabled}
        class={triggerClasses}
        data-uipkge=""
        data-slot="date-picker"
      >
        <CalendarIcon class="size-4" aria-hidden="true" />
        <span class="flex-1 truncate">{display || placeholder}</span>
        {#if clearable && hasValue && !disabled && !readOnly}
          <!-- span + role=button: a nested <button> inside the trigger Button is invalid HTML -->
          <span
            role="button"
            tabindex={0}
            class="text-muted-foreground hover:text-foreground focus-visible:ring-ring -mr-1 inline-flex size-9 cursor-pointer items-center justify-center rounded transition-colors focus-visible:ring-2 focus-visible:outline-none"
            aria-label="Clear date"
            onclick={onClearClick}
            onkeydown={onClearKeydown}
          >
            <X class="size-3.5" aria-hidden="true" />
          </span>
        {/if}
      </Button>
    {/snippet}
  </PopoverTrigger>
  <PopoverContent class="w-auto p-0" side={popoverPlacement.side} align={popoverPlacement.align}>
    {#if showCurrentDate && type === 'single' && (picker === 'day' || picker === 'week')}
      <div class="flex justify-end border-b px-3 py-2">
        <button
          type="button"
          class="text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded px-2 py-1.5 text-xs focus-visible:ring-2 focus-visible:outline-none"
          onclick={pickToday}
        >
          Today
        </button>
      </div>
    {/if}

    {#if showAlternatePicker}
      <div class="w-[260px] p-3" data-uipkge="" data-slot="month-year-picker">
        <div class="mb-3 flex items-center justify-between">
          <button
            type="button"
            class="border-input hover:bg-accent focus-visible:ring-ring inline-flex size-7 items-center justify-center rounded-md border bg-transparent transition-colors focus-visible:ring-1 focus-visible:outline-none"
            aria-label="Previous"
            onclick={() => shiftAnchor(-1)}
          >
            <ChevronLeft class="text-muted-foreground size-4" aria-hidden="true" />
          </button>
          <span class="text-sm font-medium">{monthYearLabel}</span>
          <button
            type="button"
            class="border-input hover:bg-accent focus-visible:ring-ring inline-flex size-7 items-center justify-center rounded-md border bg-transparent transition-colors focus-visible:ring-1 focus-visible:outline-none"
            aria-label="Next"
            onclick={() => shiftAnchor(1)}
          >
            <ChevronRight class="text-muted-foreground size-4" aria-hidden="true" />
          </button>
        </div>

        {#if picker === 'week'}
          <div class="flex flex-col gap-1">
            {#each weekGrid as week, i (i)}
              <button
                type="button"
                data-uipkge=""
                data-slot="week-picker-cell"
                data-active={isWeekSelected(week.start) || undefined}
                disabled={isWeekDisabled(week.start)}
                aria-pressed={isWeekSelected(week.start)}
                aria-disabled={isWeekDisabled(week.start) || undefined}
                class={cn(
                  'hover:bg-accent focus-visible:ring-ring flex items-center justify-between rounded px-3 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-30 disabled:hover:bg-transparent',
                  isWeekSelected(week.start) && 'bg-primary text-primary-foreground hover:bg-primary',
                )}
                onclick={() => pickWeek(week.start)}
              >
                <span class="font-medium">Week {week.weekNum}</span>
                <span class={cn('text-muted-foreground text-xs', isWeekSelected(week.start) && 'text-primary-foreground')}>
                  {week.start.getDate()}
                  {shortMonth.format(week.start)} – {week.end.getDate()}
                  {shortMonth.format(week.end)}
                </span>
              </button>
            {/each}
          </div>
        {/if}

        {#if picker === 'quarter'}
          <div class="grid grid-cols-2 gap-2">
            {#each QUARTER_LABELS as label, q (q)}
              <button
                type="button"
                data-uipkge=""
                data-slot="quarter-picker-cell"
                data-active={isQuarterSelected(q) || undefined}
                disabled={isQuarterDisabled(q)}
                aria-pressed={isQuarterSelected(q)}
                aria-disabled={isQuarterDisabled(q) || undefined}
                class={cn(
                  'hover:bg-accent focus-visible:ring-ring rounded px-4 py-6 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-30 disabled:hover:bg-transparent',
                  isQuarterSelected(q) && 'bg-primary text-primary-foreground hover:bg-primary',
                )}
                onclick={() => pickQuarter(q)}
              >
                {label}
              </button>
            {/each}
          </div>
        {/if}

        {#if picker === 'month'}
          <div class="grid grid-cols-3 gap-2">
            {#each monthLabels as label, m (m)}
              <button
                type="button"
                data-uipkge=""
                data-slot="month-picker-cell"
                data-active={isMonthSelected(m) || undefined}
                disabled={isMonthDisabled(m)}
                aria-pressed={isMonthSelected(m)}
                aria-disabled={isMonthDisabled(m) || undefined}
                class={cn(
                  'hover:bg-accent focus-visible:ring-ring rounded px-2 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-30 disabled:hover:bg-transparent',
                  isMonthSelected(m) && 'bg-primary text-primary-foreground hover:bg-primary',
                )}
                onclick={() => pickMonth(m)}
              >
                {label}
              </button>
            {/each}
          </div>
        {/if}

        {#if picker === 'year'}
          <div class="grid grid-cols-3 gap-2">
            {#each yearGrid as y (y)}
              <button
                type="button"
                data-uipkge=""
                data-slot="year-picker-cell"
                data-active={isYearSelected(y) || undefined}
                disabled={isYearDisabled(y)}
                aria-pressed={isYearSelected(y)}
                aria-disabled={isYearDisabled(y) || undefined}
                class={cn(
                  'hover:bg-accent focus-visible:ring-ring rounded px-2 py-2 text-sm tabular-nums transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-30 disabled:hover:bg-transparent',
                  isYearSelected(y) && 'bg-primary text-primary-foreground hover:bg-primary',
                )}
                onclick={() => pickYear(y)}
              >
                {y}
              </button>
            {/each}
          </div>
        {/if}
      </div>
    {:else}
      <div class="flex">
        {#if presetGroups.length > 0}
          <aside class="flex w-40 flex-col gap-1 border-r p-2">
            {#each presetGroups as group, gIdx (gIdx)}
              {#if group.category}
                <div class="text-muted-foreground px-2 pt-1 text-xs font-semibold tracking-wider uppercase">
                  {group.category}
                </div>
              {/if}
              {#each group.presets as p (p.label)}
                <button
                  type="button"
                  class="hover:bg-accent focus-visible:ring-ring rounded-md px-2 py-1.5 text-left text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
                  onclick={() => applyPreset(p)}
                >
                  {p.label}
                </button>
              {/each}
            {/each}
          </aside>
        {/if}

        {#if type === 'range'}
          <!-- defaultValue seeds the calendar's own state: its `value ?? internal` fallback can't be cleared through `value`. -->
          <RangeCalendar
            value={calendarValue as DateRange | undefined}
            defaultValue={calendarValue as DateRange | undefined}
            numberOfMonths={effectiveNumberOfMonths}
            {weekStartsOn}
            {fixedWeeks}
            minValue={minDate ? stripTime(minDate) : undefined}
            maxValue={maxDate ? stripTime(maxDate) : undefined}
            isDateDisabled={disabledDate}
            readonly={readOnly}
            onValueChange={handleCalendarUpdate}
          />
        {:else}
          <Calendar
            type={type === 'multiple' ? 'multiple' : 'single'}
            value={dayCalendarValue}
            numberOfMonths={effectiveNumberOfMonths}
            {weekStartsOn}
            {fixedWeeks}
            isDateDisabled={calendarDisabled}
            layout={calendarLayout}
            minValue={calendarLayout && minDate ? toCalendarDate(minDate) : undefined}
            maxValue={calendarLayout && maxDate ? toCalendarDate(maxDate) : undefined}
            cell={renderCell ? dayCell : undefined}
            readonly={readOnly}
            onValueChange={handleDayCalendarUpdate}
          />
        {/if}

        {#if showTime}
          <div class="flex flex-col border-l">
            <div class="flex items-center justify-between border-b px-3 py-2">
              <span class="text-muted-foreground text-xs tracking-widest uppercase">Time</span>
              <button
                type="button"
                class="text-primary focus-visible:ring-ring rounded px-2 py-1.5 text-xs font-medium focus-visible:ring-2 focus-visible:outline-none"
                onclick={onDone}
              >
                Done
              </button>
            </div>
            <TimeColumns
              value={timeForColumns}
              format={timeFormat}
              {use24Hour}
              {minuteStep}
              {secondStep}
              visible={open}
              disabledHours={disabledTimeConfig?.disabledHours}
              disabledMinutes={disabledTimeConfig?.disabledMinutes}
              disabledSeconds={disabledTimeConfig?.disabledSeconds}
              onValueChange={handleTimeUpdate}
            />
          </div>
        {/if}
      </div>
    {/if}

    {#if needConfirm}
      <div class="flex items-center justify-end gap-2 border-t px-3 py-2">
        <button
          type="button"
          class="hover:bg-accent focus-visible:ring-ring rounded px-3 py-1.5 text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
          onclick={cancelPreview}
        >
          Cancel
        </button>
        <button
          type="button"
          class="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring rounded px-3 py-1.5 text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
          onclick={commitPreview}
        >
          OK
        </button>
      </div>
    {/if}
  </PopoverContent>
</Popover>
