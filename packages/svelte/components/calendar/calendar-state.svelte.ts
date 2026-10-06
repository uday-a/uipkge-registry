/**
 * Calendar state shared between `Calendar.svelte` (root) and its parts via
 * Svelte context. Replaces what reka-ui's `CalendarRoot` provided in the Vue
 * twin: grid computation, selection, min/max + disabled/unavailable gating,
 * month navigation, and roving-focus keyboard navigation — all hand-rolled
 * with runes on top of `@internationalized/date`.
 */
import { tick } from 'svelte'
import {
  CalendarDate,
  endOfMonth,
  endOfWeek,
  getLocalTimeZone,
  startOfWeek,
  today,
  type DateValue,
  type DayOfWeek,
} from '@internationalized/date'

export const CALENDAR_CONTEXT_KEY = 'calendar'

export type CalendarSelectionType = 'single' | 'multiple' | 'range'

/**
 * Range value for `type="range"` (two-click start/end selection).
 *
 * INTENTIONAL DIVERGENCE from React: React's DayPicker-based Calendar uses
 * native `Date` objects (`{ from: Date, to: Date }`). This Svelte calendar
 * keeps `@internationalized/date` `DateValue` (CalendarDate) to match the
 * Vue/reka-ui twin and preserve timezone-safe arithmetic. Convert at the
 * boundary with `new CalendarDate(d.getFullYear(), d.getMonth() + 1, d.getDate())`.
 */
export interface CalendarRange {
  start: DateValue | undefined
  end: DateValue | undefined
}

const DAY_OF_WEEK_BY_INDEX: DayOfWeek[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']

export interface CalendarGridData {
  /** First day of the rendered month. */
  value: CalendarDate
  rows: CalendarDate[][]
}

export interface CalendarStateOptions {
  onValueChange?: (value: DateValue | DateValue[] | CalendarRange | undefined) => void
  onPlaceholderChange?: (placeholder: DateValue) => void
}

function toCalendarDate(date: DateValue): CalendarDate {
  return new CalendarDate(date.year, date.month, date.day)
}

function sameDate(a: DateValue | undefined, b: DateValue | undefined): boolean {
  if (a == null || b == null) return a == null && b == null
  return a.compare(b) === 0
}

function sameDateArray(a: DateValue[], b: DateValue[]): boolean {
  return a.length === b.length && a.every((d, i) => d.compare(b[i]!) === 0)
}

function isCalendarRange(v: unknown): v is CalendarRange {
  return typeof v === 'object' && v !== null && ('start' in v || 'end' in v)
}

function sameRange(a: CalendarRange | undefined, b: CalendarRange | undefined): boolean {
  if (a == null || b == null) return a == null && b == null
  return sameDate(a.start, b.start) && sameDate(a.end, b.end)
}

export class CalendarState {
  type = $state<CalendarSelectionType>('single')
  locale = $state('en')
  weekStartsOn = $state<number | undefined>(undefined)
  fixedWeeks = $state(false)
  numberOfMonths = $state(1)
  pagedNavigation = $state(false)
  disabled = $state(false)
  readonly = $state(false)
  weekdayFormat = $state<'narrow' | 'short' | 'long'>('narrow')
  minValue = $state<DateValue | undefined>(undefined)
  maxValue = $state<DateValue | undefined>(undefined)
  isDateDisabled = $state<((date: DateValue) => boolean) | undefined>(undefined)
  isDateUnavailable = $state<((date: DateValue) => boolean) | undefined>(undefined)

  showOutsideDays = $state(true)

  placeholder = $state<CalendarDate>(today(getLocalTimeZone()))
  singleValue = $state<DateValue | undefined>(undefined)
  multipleValue = $state<DateValue[]>([])
  rangeValue = $state<CalendarRange | undefined>(undefined)
  hoverDate = $state<CalendarDate | undefined>(undefined)
  focusedDate = $state<CalendarDate>(today(getLocalTimeZone()))
  rootEl = $state<HTMLElement | null>(null)

  #options: CalendarStateOptions

  constructor(initial?: {
    type?: CalendarSelectionType
    locale?: string
    weekStartsOn?: number
    fixedWeeks?: boolean
    numberOfMonths?: number
    pagedNavigation?: boolean
    disabled?: boolean
    readonly?: boolean
    weekdayFormat?: 'narrow' | 'short' | 'long'
    minValue?: DateValue
    maxValue?: DateValue
    isDateDisabled?: (date: DateValue) => boolean
    isDateUnavailable?: (date: DateValue) => boolean
    showOutsideDays?: boolean
    value?: DateValue | DateValue[] | CalendarRange
    placeholder?: DateValue
  }, options: CalendarStateOptions = {}) {
    this.#options = options
    if (initial) this.syncFromProps(initial)
    // First tab stop: the selected day when visible, else the viewed month.
    this.focusedDate = this.initialFocusedDate()
  }

  get firstDayOfWeek(): DayOfWeek | undefined {
    return this.weekStartsOn != null ? (DAY_OF_WEEK_BY_INDEX[this.weekStartsOn] ?? undefined) : undefined
  }

  get grids(): CalendarGridData[] {
    const firstDay = this.firstDayOfWeek
    const out: CalendarGridData[] = []
    const base = new CalendarDate(this.placeholder.year, this.placeholder.month, 1)
    for (let i = 0; i < Math.max(1, this.numberOfMonths); i++) {
      const monthStart = base.add({ months: i })
      const monthEnd = endOfMonth(monthStart)
      const start = startOfWeek(monthStart, this.locale, firstDay)
      const end = endOfWeek(monthEnd, this.locale, firstDay)
      const rows: CalendarDate[][] = []
      let cursor = start
      let guard = 0
      while (cursor.compare(end) <= 0 && guard++ < 64) {
        const week: CalendarDate[] = []
        for (let d = 0; d < 7; d++) {
          week.push(cursor)
          cursor = cursor.add({ days: 1 })
        }
        rows.push(week)
      }
      if (this.fixedWeeks) {
        while (rows.length < 6) {
          const week: CalendarDate[] = []
          for (let d = 0; d < 7; d++) {
            week.push(cursor)
            cursor = cursor.add({ days: 1 })
          }
          rows.push(week)
        }
      }
      out.push({ value: monthStart, rows })
    }
    return out
  }

  get weekDays(): string[] {
    const start = startOfWeek(
      new CalendarDate(this.placeholder.year, this.placeholder.month, 1),
      this.locale,
      this.firstDayOfWeek,
    )
    const fmt = new Intl.DateTimeFormat(this.locale, { weekday: this.weekdayFormat })
    return Array.from({ length: 7 }, (_, i) => fmt.format(new Date(start.year, start.month - 1, start.day + i)))
  }

  get headingValue(): string {
    const first = new CalendarDate(this.placeholder.year, this.placeholder.month, 1)
    const monthYear = new Intl.DateTimeFormat(this.locale, { month: 'long', year: 'numeric' })
    if (this.numberOfMonths <= 1) {
      return monthYear.format(new Date(first.year, first.month - 1, 1))
    }
    const last = first.add({ months: this.numberOfMonths - 1 })
    const firstLabel = monthYear.format(new Date(first.year, first.month - 1, 1))
    const lastLabel = monthYear.format(new Date(last.year, last.month - 1, 1))
    if (first.year === last.year) {
      const monthOnly = new Intl.DateTimeFormat(this.locale, { month: 'long' })
      return `${monthOnly.format(new Date(first.year, first.month - 1, 1))} – ${lastLabel}`
    }
    return `${firstLabel} – ${lastLabel}`
  }

  /** Value in the shape the parent binds (`bind:value`). */
  get currentValue(): DateValue | DateValue[] | CalendarRange | undefined {
    if (this.type === 'multiple') return [...this.multipleValue]
    if (this.type === 'range') return this.rangeValue ? { ...this.rangeValue } : undefined
    return this.singleValue
  }

  isSelected(date: DateValue): boolean {
    if (this.type === 'multiple') return this.multipleValue.some((v) => v.compare(date) === 0)
    if (this.type === 'range') {
      const r = this.rangeValue
      if (!r?.start) return false
      if (!r.end) return r.start.compare(date) === 0
      return date.compare(r.start) >= 0 && date.compare(r.end) <= 0
    }
    return this.singleValue != null && this.singleValue.compare(date) === 0
  }

  isSelectionStart(date: DateValue): boolean {
    if (this.type !== 'range') return false
    const s = this.rangeValue?.start
    return s != null && s.compare(date) === 0
  }

  isSelectionEnd(date: DateValue): boolean {
    if (this.type !== 'range') return false
    const e = this.rangeValue?.end
    return e != null && e.compare(date) === 0
  }

  /** Hover-preview middle days while a range start is picked but no end yet. */
  isHighlighted(date: DateValue): boolean {
    if (this.type !== 'range') return false
    const start = this.rangeValue?.start
    const end = this.rangeValue?.end
    if (!start || end) return false
    const hover = this.hoverDate
    if (!hover || hover.compare(start) === 0) return false
    const lo = start.compare(hover) <= 0 ? start : hover
    const hi = lo === start ? hover : start
    return date.compare(lo) > 0 && date.compare(hi) < 0
  }

  hover(date: CalendarDate | null): void {
    this.hoverDate = date ?? undefined
  }

  isDisabledDate(date: DateValue): boolean {
    if (this.disabled) return true
    if (this.minValue && date.compare(this.minValue) < 0) return true
    if (this.maxValue && date.compare(this.maxValue) > 0) return true
    return this.isDateDisabled?.(date) ?? false
  }

  isUnavailableDate(date: DateValue): boolean {
    return this.isDateUnavailable?.(date) ?? false
  }

  isTodayDate(date: DateValue): boolean {
    return date.compare(today(getLocalTimeZone())) === 0
  }

  isOutsideView(date: CalendarDate, month: CalendarDate): boolean {
    return date.year !== month.year || date.month !== month.month
  }

  /** The one tabbable day in the roving-tabindex grid. */
  isTabbableDate(day: CalendarDate): boolean {
    return day.compare(this.focusedDate) === 0
  }

  isDateVisible(date: DateValue): boolean {
    return this.grids.some((g) => g.value.year === date.year && g.value.month === date.month)
  }

  get canGoPrev(): boolean {
    if (!this.minValue) return true
    const step = this.pagedNavigation ? Math.max(1, this.numberOfMonths) : 1
    const target = new CalendarDate(this.placeholder.year, this.placeholder.month, 1).subtract({ months: step })
    return target.compare(new CalendarDate(this.minValue.year, this.minValue.month, 1)) >= 0
  }

  get canGoNext(): boolean {
    if (!this.maxValue) return true
    const step = this.pagedNavigation ? Math.max(1, this.numberOfMonths) : 1
    const target = new CalendarDate(this.placeholder.year, this.placeholder.month, 1).add({ months: step })
    return target.compare(new CalendarDate(this.maxValue.year, this.maxValue.month, 1)) <= 0
  }

  select(date: DateValue): void {
    if (this.disabled || this.readonly) return
    if (this.isDisabledDate(date) || this.isUnavailableDate(date)) return
    if (this.type === 'multiple') {
      const exists = this.multipleValue.some((v) => v.compare(date) === 0)
      const next = exists ? this.multipleValue.filter((v) => v.compare(date) !== 0) : [...this.multipleValue, date]
      this.multipleValue = next
      this.#options.onValueChange?.(next)
    } else if (this.type === 'range') {
      const r = this.rangeValue
      if (!r?.start || (r.start && r.end)) {
        const next: CalendarRange = { start: date, end: undefined }
        this.rangeValue = next
        this.#options.onValueChange?.(next)
      } else if (date.compare(r.start) < 0) {
        const next: CalendarRange = { start: date, end: r.start }
        this.rangeValue = next
        this.#options.onValueChange?.(next)
      } else {
        const next: CalendarRange = { start: r.start, end: date }
        this.rangeValue = next
        this.#options.onValueChange?.(next)
      }
      this.hoverDate = undefined
    } else {
      this.singleValue = date
      this.#options.onValueChange?.(date)
    }
    this.focusedDate = toCalendarDate(date)
  }

  setPlaceholder(date: DateValue, opts?: { focus?: CalendarDate }): void {
    const next = toCalendarDate(date)
    this.placeholder = next
    this.focusedDate = opts?.focus ?? next
    this.#options.onPlaceholderChange?.(next)
  }

  goPrev(): void {
    if (!this.canGoPrev) return
    const step = this.pagedNavigation ? Math.max(1, this.numberOfMonths) : 1
    this.setPlaceholder(this.placeholder.subtract({ months: step }))
  }

  goNext(): void {
    if (!this.canGoNext) return
    const step = this.pagedNavigation ? Math.max(1, this.numberOfMonths) : 1
    this.setPlaceholder(this.placeholder.add({ months: step }))
  }

  formatDay(date: DateValue): string {
    return new Intl.DateTimeFormat(this.locale, { dateStyle: 'full' }).format(
      new Date(date.year, date.month - 1, date.day),
    )
  }

  focusDay(date: CalendarDate): void {
    this.focusedDate = date
    this.rootEl
      ?.querySelector<HTMLButtonElement>(`[data-day="${date.toString()}"]`)
      ?.focus({ preventScroll: true })
  }

  handleDayKeydown(e: KeyboardEvent, day: CalendarDate): void {
    const firstDay = this.firstDayOfWeek
    let target: CalendarDate | null = null
    switch (e.key) {
      case 'ArrowRight':
        target = day.add({ days: 1 })
        break
      case 'ArrowLeft':
        target = day.subtract({ days: 1 })
        break
      case 'ArrowUp':
        target = day.subtract({ days: 7 })
        break
      case 'ArrowDown':
        target = day.add({ days: 7 })
        break
      case 'Home':
        target = startOfWeek(day, this.locale, firstDay)
        break
      case 'End':
        target = endOfWeek(day, this.locale, firstDay)
        break
      case 'PageUp':
        target = e.shiftKey ? day.subtract({ years: 1 }) : day.subtract({ months: 1 })
        break
      case 'PageDown':
        target = e.shiftKey ? day.add({ years: 1 }) : day.add({ months: 1 })
        break
      default:
        return
    }
    e.preventDefault()
    if (this.isDateVisible(target)) {
      this.focusDay(target)
    } else {
      // Move the view first, then focus once the new month renders.
      this.setPlaceholder(new CalendarDate(target.year, target.month, 1), { focus: target })
      void tick().then(() => this.focusDay(target as CalendarDate))
    }
  }

  /**
   * Inward sync: parent props → state. Every assignment is equality-guarded
   * so the parent's `$effect` calling this never loops with the outward
   * `onValueChange` / `onPlaceholderChange` callbacks.
   */
  syncFromProps(p: {
    type?: CalendarSelectionType
    locale?: string
    weekStartsOn?: number
    fixedWeeks?: boolean
    numberOfMonths?: number
    pagedNavigation?: boolean
    disabled?: boolean
    readonly?: boolean
    weekdayFormat?: 'narrow' | 'short' | 'long'
    minValue?: DateValue
    maxValue?: DateValue
    isDateDisabled?: (date: DateValue) => boolean
    isDateUnavailable?: (date: DateValue) => boolean
    showOutsideDays?: boolean
    value?: DateValue | DateValue[] | CalendarRange
    placeholder?: DateValue
  }): void {
    this.type = p.type ?? 'single'
    this.locale = p.locale ?? 'en'
    this.weekStartsOn = p.weekStartsOn
    this.fixedWeeks = p.fixedWeeks ?? false
    this.numberOfMonths = p.numberOfMonths ?? 1
    this.pagedNavigation = p.pagedNavigation ?? false
    this.disabled = p.disabled ?? false
    this.readonly = p.readonly ?? false
    this.weekdayFormat = p.weekdayFormat ?? 'narrow'
    this.minValue = p.minValue
    this.maxValue = p.maxValue
    this.isDateDisabled = p.isDateDisabled
    this.isDateUnavailable = p.isDateUnavailable
    this.showOutsideDays = p.showOutsideDays ?? true

    if (this.type === 'range') {
      const r = isCalendarRange(p.value) ? p.value : undefined
      if (!sameRange(this.rangeValue, r)) this.rangeValue = r ? { start: r.start, end: r.end } : undefined
    } else if (this.type === 'multiple') {
      const arr = isCalendarRange(p.value) ? [] : Array.isArray(p.value) ? p.value : p.value ? [p.value] : []
      if (!sameDateArray(this.multipleValue, arr)) this.multipleValue = [...arr]
    } else {
      const v = isCalendarRange(p.value) ? undefined : Array.isArray(p.value) ? p.value[0] : p.value
      if (!sameDate(this.singleValue, v)) this.singleValue = v
    }

    const ph = p.placeholder ? toCalendarDate(p.placeholder) : today(getLocalTimeZone())
    if (this.placeholder.compare(ph) !== 0) {
      this.placeholder = ph
      this.focusedDate = this.initialFocusedDate()
    }
  }

  private initialFocusedDate(): CalendarDate {
    const single =
      this.type === 'single'
        ? this.singleValue
        : this.type === 'range'
          ? this.rangeValue?.start
          : this.multipleValue[0]
    if (single) {
      const asDate = toCalendarDate(single)
      if (this.isDateVisible(asDate)) return asDate
    }
    const now = today(getLocalTimeZone())
    if (this.isDateVisible(now)) return now
    return toCalendarDate(this.placeholder)
  }
}
