'use client'

import * as React from 'react'
import { Calendar as CalendarIcon, X } from 'lucide-react'
import { DayButton as RdpDayButton, type DateRange, type Matcher } from 'react-day-picker'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { RangeCalendar } from '@/components/ui/range-calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { TimeColumns } from '@/components/ui/time-picker'
import { cn } from '@/lib/utils'
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
  type DatePickerLayout,
  type DatePickerPicker,
  type DatePickerPlacement,
  type DatePickerPreset,
  type DatePickerSize,
  type DatePickerStatus,
  type DatePickerType,
  type DisabledTimeResult,
  type FormatValue,
  type InternalMultiple,
  type InternalRange,
  type InternalSingle,
  type MultipleValue,
  type RangeValue,
  type SingleValue,
  type TimeShape,
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

type InternalValue = InternalSingle | InternalMultiple | InternalRange | undefined

export interface DatePickerProps {
  /** Controlled value. Shape depends on `type`. ISO `YYYY-MM-DD` (or `YYYY-MM-DDTHH:mm` when `showTime`). */
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
  /** Custom cell renderer for day calendar cells. */
  renderCell?: (day: Date) => React.ReactNode
  triggerClassName?: string
  className?: string
}

const QUARTER_LABELS = ['Q1', 'Q2', 'Q3', 'Q4']
const QUARTER_MONTHS = [1, 4, 7, 10] as const

function compareDates(a: Date, b: Date): number {
  return stripTime(a).getTime() - stripTime(b).getTime()
}

function fmtDateTime(d: Date, locale: string, format: FormatValue, showSeconds: boolean, use24Hour: boolean) {
  return `${fmtDate(d, locale, format)} ${fmtTime(d, showSeconds, use24Hour)}`.trim()
}

function quarterStart(year: number, quarterIdx: number): Date {
  return new Date(year, QUARTER_MONTHS[quarterIdx]! - 1, 1)
}

function weekAnchorForMonth(year: number, month: number, weekStartsOn: number): Date {
  return weekStart(new Date(year, month - 1, 1), weekStartsOn)
}

function layoutToCaptionLayout(
  layout: DatePickerLayout,
): 'dropdown' | 'dropdown-months' | 'dropdown-years' | undefined {
  if (layout === 'month-and-year') return 'dropdown'
  if (layout === 'month-only') return 'dropdown-months'
  if (layout === 'year-only') return 'dropdown-years'
  return undefined
}

function rangeFromCalendar(r: DateRange | undefined): InternalRange | undefined {
  if (!r?.from) return undefined
  return r.to ? { start: r.from, end: r.to } : { start: r.from }
}

function rangeToCalendar(r: InternalRange | undefined): DateRange | undefined {
  if (!r?.start) return undefined
  return { from: stripTime(r.start), to: r.end ? stripTime(r.end) : undefined }
}

function getLastTime(internal: InternalValue, type: DatePickerType, defaultTime: string): TimeShape {
  if (type === 'single' && internal instanceof Date) {
    if (internal.getHours() || internal.getMinutes() || internal.getSeconds()) {
      return { h: internal.getHours(), m: internal.getMinutes(), s: internal.getSeconds() }
    }
  }
  if (type === 'range') {
    const r = internal as InternalRange
    if (r?.start && (r.start.getHours() || r.start.getMinutes() || r.start.getSeconds())) {
      return { h: r.start.getHours(), m: r.start.getMinutes(), s: r.start.getSeconds() }
    }
  }
  return parseTimeShape(defaultTime, { h: 12, m: 0, s: 0 })
}

const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
  (
    {
      value,
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
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false)
    const [previewValue, setPreviewValue] = React.useState<InternalValue>(undefined)
    const isControlled = value !== undefined
    const [internalState, setInternalState] = React.useState<InternalValue>(() =>
      coerceShape(type, defaultValue ?? null),
    )

    const internal = isControlled ? coerceShape(type, value) : internalState
    const activeValue = needConfirm ? (previewValue ?? internal) : internal

    const effectiveFormat = dateFormat ?? format
    const effectiveNumberOfMonths = numberOfMonths ?? (type === 'range' ? 2 : 1)
    const effectivePresets = React.useMemo(
      () => presets ?? (type === 'range' ? defaultRangePresets() : undefined),
      [presets, type],
    )

    const presetGroups = React.useMemo(() => {
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
    }, [effectivePresets])

    const minDate = React.useMemo(() => coerceDate(minValue) ?? undefined, [minValue])
    const maxDate = React.useMemo(() => coerceDate(maxValue) ?? undefined, [maxValue])

    const [monthYearAnchor, setMonthYearAnchor] = React.useState<Date>(() => {
      const v = coerceShape(type, defaultValue ?? null)
      if (v instanceof Date) return v
      return stripTime(new Date())
    })

    React.useEffect(() => {
      if (!open) setPreviewValue(undefined)
    }, [open])

    React.useEffect(() => {
      if (open) {
        const v = internal
        if (v instanceof Date) setMonthYearAnchor(v)
        else setMonthYearAnchor(stripTime(new Date()))
      }
    }, [open, internal])

    function serializeDate(d: Date) {
      return showTime ? toISODateTime(d, showSeconds) : toISODate(d)
    }

    function emitOut(v: InternalValue) {
      if (type === 'multiple') {
        const arr = (v as InternalMultiple) ?? []
        onValueChange?.(arr.map(serializeDate))
        return
      }
      if (type === 'range') {
        // Clear must emit null. Incomplete ranges (start only) stay local until both ends exist.
        if (!v) {
          onValueChange?.(null)
          return
        }
        const r = v as InternalRange
        if (!r.start || !r.end) return
        onValueChange?.({ start: serializeDate(r.start), end: serializeDate(r.end) })
        return
      }
      const single = v as InternalSingle
      onValueChange?.(single ? serializeDate(single) : null)
    }

    function handleUpdate(v: InternalValue) {
      if (!isControlled) setInternalState(v)
      emitOut(v)
      if (needConfirm) return
      if (type === 'single' && v && !showTime) setOpen(false)
      if (type === 'range') {
        const r = v as InternalRange | undefined
        if (r?.start && r?.end && !showTime) setOpen(false)
      }
    }

    function clear(event: React.SyntheticEvent) {
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
        setOpen(false)
        return
      }
      if (type === 'multiple') {
        const arr = (v as MultipleValue) ?? []
        handleUpdate(arr.map(coerceDate).filter((x): x is Date => x != null))
        setOpen(false)
        return
      }
      if (type === 'range') {
        const r = v as RangeValue
        if (!r?.start) {
          handleUpdate(undefined)
          setOpen(false)
          return
        }
        const start = coerceDate(r.start)
        const end = r.end ? coerceDate(r.end) : undefined
        if (!start) {
          handleUpdate(undefined)
          setOpen(false)
          return
        }
        handleUpdate(end ? { start, end } : { start })
        setOpen(false)
        return
      }
      handleUpdate(coerceDate(v as SingleValue) ?? undefined)
      setOpen(false)
    }

    function commitPreview() {
      if (needConfirm && previewValue !== undefined) {
        handleUpdate(previewValue)
        setPreviewValue(undefined)
      }
      setOpen(false)
    }

    function cancelPreview() {
      setPreviewValue(undefined)
      setOpen(false)
    }

    const display = React.useMemo(() => {
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
    }, [internal, type, locale, effectiveFormat, showTime, showSeconds, use24Hour, separator, picker, weekStartsOn])

    const hasValue = React.useMemo(() => {
      const v = internal
      if (!v) return false
      if (type === 'multiple') return (v as InternalMultiple).length > 0
      if (type === 'range') return Boolean((v as InternalRange).start)
      return true
    }, [internal, type])

    // Prefer preview (confirm mode) so time columns track the uncommitted selection.
    const lastTime = React.useMemo(() => getLastTime(activeValue, type, defaultTime), [activeValue, type, defaultTime])

    function handleCalendarUpdate(v: unknown) {
      if (readOnly) return
      if (needConfirm) {
        if (type === 'multiple') {
          const arr = (v as Date[]) ?? []
          setPreviewValue(arr.map((d) => (showTime ? withTime(d, lastTime) : d)))
        } else if (type === 'range') {
          const r = rangeFromCalendar(v as DateRange | undefined)
          if (!r?.start) setPreviewValue(undefined)
          else {
            const start = showTime ? withTime(r.start, lastTime) : r.start
            const end = r.end ? (showTime ? withTime(r.end, lastTime) : r.end) : undefined
            setPreviewValue(end ? { start, end } : { start })
          }
        } else {
          const d = v as Date | undefined
          setPreviewValue(d ? (showTime ? withTime(d, lastTime) : d) : undefined)
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

    function handleTimeUpdate(timeValue: string) {
      const base = needConfirm ? (previewValue ?? internal) : internal
      if (!base) return
      const t = parseTimeShape(timeValue, lastTime)
      if (type === 'single') {
        const next = withTime(base as Date, t)
        if (needConfirm) {
          setPreviewValue(next)
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
          setPreviewValue(next)
          return
        }
        handleUpdate(next)
      }
    }

    const timeForColumns = showSeconds
      ? `${String(lastTime.h).padStart(2, '0')}:${String(lastTime.m).padStart(2, '0')}:${String(lastTime.s).padStart(2, '0')}`
      : `${String(lastTime.h).padStart(2, '0')}:${String(lastTime.m).padStart(2, '0')}`

    const timeFormat = showSeconds ? 'HH:mm:ss' : 'HH:mm'

    const disabledTimeConfig = React.useMemo(() => {
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
    }, [disabledTime, activeValue, type])

    const calendarDisabled = React.useMemo(() => {
      const matchers: Matcher[] = []
      if (minDate) matchers.push({ before: stripTime(minDate) })
      if (maxDate) matchers.push({ after: stripTime(maxDate) })
      if (disabledDate) matchers.push(disabledDate)
      return matchers.length ? matchers : undefined
    }, [minDate, maxDate, disabledDate])

    const calendarValue = React.useMemo(() => {
      // Use activeValue so needConfirm preview highlights on the grid (not only internal).
      const v = activeValue
      if (type === 'multiple') return (v as InternalMultiple | undefined)?.map(stripTime)
      if (type === 'range') return rangeToCalendar(v as InternalRange | undefined)
      if (v instanceof Date) return stripTime(v)
      return undefined
    }, [activeValue, type])

    const captionLayout = layoutToCaptionLayout(layout)

    const calendarComponents = React.useMemo(() => {
      if (!renderCell) return undefined
      return {
        DayButton: (props: React.ComponentProps<typeof RdpDayButton>) => {
          const { day, children: _children, modifiers, ...rest } = props
          return (
            <RdpDayButton day={day} modifiers={modifiers} {...rest}>
              {renderCell(day.date)}
            </RdpDayButton>
          )
        },
      }
    }, [renderCell])

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
    const popoverPlacement = placementMap[placement] ?? { side: 'bottom', align: 'start' }

    const buttonSize = size === 'small' ? 'sm' : size === 'large' ? 'lg' : 'default'

    const triggerClasses = cn(
      showTime ? 'min-w-[280px]' : 'min-w-[240px]',
      'justify-start gap-2 text-left font-normal',
      !hasValue && 'text-muted-foreground',
      status === 'error' && 'border-destructive focus-visible:ring-destructive',
      status === 'warning' && 'border-warning focus-visible:ring-warning',
      triggerClassName,
      className,
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
        setMonthYearAnchor(new Date(y + dir, m - 1, 1))
      } else if (picker === 'year' || picker === 'quarter') {
        setMonthYearAnchor(new Date(y + dir, 0, 1))
      }
    }

    const monthLabels = React.useMemo(
      () =>
        Array.from({ length: 12 }, (_, idx) =>
          new Intl.DateTimeFormat(locale, { month: 'short' }).format(new Date(2024, idx, 1)),
        ),
      [locale],
    )

    const yearGrid = React.useMemo(() => {
      const y = monthYearAnchor.getFullYear()
      const start = y - (y % 12)
      return Array.from({ length: 12 }, (_, i) => start + i)
    }, [monthYearAnchor])

    const weekGrid = React.useMemo(() => {
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
    }, [monthYearAnchor, weekStartsOn])

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
        setPreviewValue(ws)
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
        setPreviewValue(d)
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
        setPreviewValue(d)
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
          setPreviewValue(d)
          return
        }
        handleUpdate(d)
      } else {
        setMonthYearAnchor(d)
      }
    }

    const monthYearLabel =
      picker === 'week'
        ? new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric' }).format(monthYearAnchor)
        : picker === 'quarter' || picker === 'month'
          ? String(monthYearAnchor.getFullYear())
          : `${yearGrid[0]} – ${yearGrid[yearGrid.length - 1]}`

    const showAlternatePicker = picker !== 'day' && type === 'single'

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            type="button"
            variant="outline"
            size={buttonSize}
            disabled={disabled}
            className={triggerClasses}
            data-uipkge=""
            data-slot="date-picker"
          >
            <CalendarIcon className="size-4" aria-hidden="true" />
            <span className="flex-1 truncate">{display || placeholder}</span>
            {clearable && hasValue && !disabled && !readOnly && (
              <span
                role="button"
                tabIndex={0}
                className="text-muted-foreground hover:text-foreground focus-visible:ring-ring -mr-1 inline-flex size-9 cursor-pointer items-center justify-center rounded transition-colors focus-visible:ring-2 focus-visible:outline-none"
                aria-label="Clear date"
                onClick={(e) => {
                  e.stopPropagation()
                  clear(e)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    e.stopPropagation()
                    clear(e)
                  }
                }}
              >
                <X className="size-3.5" aria-hidden="true" />
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" side={popoverPlacement.side} align={popoverPlacement.align}>
          {showCurrentDate && type === 'single' && (picker === 'day' || picker === 'week') && (
            <div className="flex justify-end border-b px-3 py-2">
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded px-2 py-1.5 text-xs focus-visible:ring-2 focus-visible:outline-none"
                onClick={pickToday}
              >
                Today
              </button>
            </div>
          )}

          {showAlternatePicker ? (
            <div className="w-[260px] p-3" data-uipkge="" data-slot="month-year-picker">
              <div className="mb-3 flex items-center justify-between">
                <button
                  type="button"
                  className="hover:bg-accent focus-visible:ring-ring inline-flex size-9 items-center justify-center rounded transition-colors focus-visible:ring-2 focus-visible:outline-none"
                  aria-label="Previous"
                  onClick={() => shiftAnchor(-1)}
                >
                  <span className="text-muted-foreground text-sm">‹</span>
                </button>
                <span className="text-sm font-medium">{monthYearLabel}</span>
                <button
                  type="button"
                  className="hover:bg-accent focus-visible:ring-ring inline-flex size-9 items-center justify-center rounded transition-colors focus-visible:ring-2 focus-visible:outline-none"
                  aria-label="Next"
                  onClick={() => shiftAnchor(1)}
                >
                  <span className="text-muted-foreground text-sm">›</span>
                </button>
              </div>

              {picker === 'week' && (
                <div className="flex flex-col gap-1">
                  {weekGrid.map((week, i) => (
                    <button
                      key={i}
                      type="button"
                      data-uipkge=""
                      data-slot="week-picker-cell"
                      data-active={isWeekSelected(week.start) || undefined}
                      disabled={isWeekDisabled(week.start)}
                      aria-pressed={isWeekSelected(week.start)}
                      aria-disabled={isWeekDisabled(week.start) || undefined}
                      className={cn(
                        'hover:bg-accent focus-visible:ring-ring flex items-center justify-between rounded px-3 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-30 disabled:hover:bg-transparent',
                        isWeekSelected(week.start) && 'bg-primary text-primary-foreground hover:bg-primary',
                      )}
                      onClick={() => pickWeek(week.start)}
                    >
                      <span className="font-medium">Week {week.weekNum}</span>
                      <span
                        className={cn(
                          'text-muted-foreground text-xs',
                          isWeekSelected(week.start) && 'text-primary-foreground',
                        )}
                      >
                        {week.start.getDate()} {new Intl.DateTimeFormat(locale, { month: 'short' }).format(week.start)}{' '}
                        – {week.end.getDate()} {new Intl.DateTimeFormat(locale, { month: 'short' }).format(week.end)}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {picker === 'quarter' && (
                <div className="grid grid-cols-2 gap-2">
                  {QUARTER_LABELS.map((label, q) => (
                    <button
                      key={q}
                      type="button"
                      data-uipkge=""
                      data-slot="quarter-picker-cell"
                      data-active={isQuarterSelected(q) || undefined}
                      disabled={isQuarterDisabled(q)}
                      aria-pressed={isQuarterSelected(q)}
                      aria-disabled={isQuarterDisabled(q) || undefined}
                      className={cn(
                        'hover:bg-accent focus-visible:ring-ring rounded px-4 py-6 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-30 disabled:hover:bg-transparent',
                        isQuarterSelected(q) && 'bg-primary text-primary-foreground hover:bg-primary',
                      )}
                      onClick={() => pickQuarter(q)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}

              {picker === 'month' && (
                <div className="grid grid-cols-3 gap-2">
                  {monthLabels.map((label, m) => (
                    <button
                      key={m}
                      type="button"
                      data-uipkge=""
                      data-slot="month-picker-cell"
                      data-active={isMonthSelected(m) || undefined}
                      disabled={isMonthDisabled(m)}
                      aria-pressed={isMonthSelected(m)}
                      aria-disabled={isMonthDisabled(m) || undefined}
                      className={cn(
                        'hover:bg-accent focus-visible:ring-ring rounded px-2 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-30 disabled:hover:bg-transparent',
                        isMonthSelected(m) && 'bg-primary text-primary-foreground hover:bg-primary',
                      )}
                      onClick={() => pickMonth(m)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}

              {picker === 'year' && (
                <div className="grid grid-cols-3 gap-2">
                  {yearGrid.map((y) => (
                    <button
                      key={y}
                      type="button"
                      data-uipkge=""
                      data-slot="year-picker-cell"
                      data-active={isYearSelected(y) || undefined}
                      disabled={isYearDisabled(y)}
                      aria-pressed={isYearSelected(y)}
                      aria-disabled={isYearDisabled(y) || undefined}
                      className={cn(
                        'hover:bg-accent focus-visible:ring-ring rounded px-2 py-2 text-sm tabular-nums transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-30 disabled:hover:bg-transparent',
                        isYearSelected(y) && 'bg-primary text-primary-foreground hover:bg-primary',
                      )}
                      onClick={() => pickYear(y)}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex">
              {presetGroups.length > 0 && (
                <aside className="flex w-40 flex-col gap-1 border-r p-2">
                  {presetGroups.map((group, gIdx) => (
                    <React.Fragment key={gIdx}>
                      {group.category && (
                        <div className="text-muted-foreground px-2 pt-1 text-xs font-semibold tracking-wider uppercase">
                          {group.category}
                        </div>
                      )}
                      {group.presets.map((p) => (
                        <button
                          key={p.label}
                          type="button"
                          className="hover:bg-accent focus-visible:ring-ring rounded-md px-2 py-1.5 text-left text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
                          onClick={() => applyPreset(p)}
                        >
                          {p.label}
                        </button>
                      ))}
                    </React.Fragment>
                  ))}
                </aside>
              )}

              {type === 'range' ? (
                <RangeCalendar
                  selected={calendarValue as DateRange | undefined}
                  numberOfMonths={effectiveNumberOfMonths}
                  weekStartsOn={weekStartsOn}
                  fixedWeeks={fixedWeeks}
                  disabled={calendarDisabled}
                  startMonth={minDate ? stripTime(minDate) : undefined}
                  endMonth={maxDate ? stripTime(maxDate) : undefined}
                  onSelect={readOnly ? undefined : handleCalendarUpdate}
                />
              ) : (
                <Calendar
                  {...(type === 'multiple'
                    ? { mode: 'multiple' as const, selected: calendarValue as Date[] | undefined }
                    : { mode: 'single' as const, selected: calendarValue as Date | undefined })}
                  numberOfMonths={effectiveNumberOfMonths}
                  weekStartsOn={weekStartsOn}
                  fixedWeeks={fixedWeeks}
                  disabled={calendarDisabled}
                  captionLayout={captionLayout}
                  startMonth={captionLayout && minDate ? stripTime(minDate) : undefined}
                  endMonth={captionLayout && maxDate ? stripTime(maxDate) : undefined}
                  components={calendarComponents}
                  onSelect={readOnly ? undefined : handleCalendarUpdate}
                />
              )}

              {showTime && (
                <div className="flex flex-col border-l">
                  <div className="flex items-center justify-between border-b px-3 py-2">
                    <span className="text-muted-foreground text-xs tracking-widest uppercase">Time</span>
                    <button
                      type="button"
                      className="text-primary focus-visible:ring-ring rounded px-2 py-1.5 text-xs font-medium focus-visible:ring-2 focus-visible:outline-none"
                      onClick={() => {
                        // In confirm mode, Done must commit preview — closing alone discards it.
                        if (needConfirm) commitPreview()
                        else setOpen(false)
                      }}
                    >
                      Done
                    </button>
                  </div>
                  <TimeColumns
                    value={timeForColumns}
                    format={timeFormat}
                    use24Hour={use24Hour}
                    minuteStep={minuteStep}
                    secondStep={secondStep}
                    visible={open}
                    disabledHours={disabledTimeConfig?.disabledHours}
                    disabledMinutes={disabledTimeConfig?.disabledMinutes}
                    disabledSeconds={disabledTimeConfig?.disabledSeconds}
                    onValueChange={handleTimeUpdate}
                  />
                </div>
              )}
            </div>
          )}

          {needConfirm && (
            <div className="flex items-center justify-end gap-2 border-t px-3 py-2">
              <button
                type="button"
                className="hover:bg-accent focus-visible:ring-ring rounded px-3 py-1.5 text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
                onClick={cancelPreview}
              >
                Cancel
              </button>
              <button
                type="button"
                className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring rounded px-3 py-1.5 text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
                onClick={commitPreview}
              >
                OK
              </button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    )
  },
)
DatePicker.displayName = 'DatePicker'

export { DatePicker }
