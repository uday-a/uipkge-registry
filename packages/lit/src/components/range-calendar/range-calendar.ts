import { LitElement, css, html, nothing, type PropertyValues } from 'lit'
import { ChevronLeft, ChevronRight } from 'lucide'
import { cn } from '../../lib/utils'
import { icon } from '../../lib/icon'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { buttonVariants } from '../button/button.variants'

// ---------------------------------------------------------------------------
// Local-date helpers (the subset of ../calendar/calendar-date <uip-calendar>
// uses that a range-only grid needs — duplicated so the item stays standalone
// instead of depending on the `calendar` item).
// ---------------------------------------------------------------------------

export interface RangeCalendarRange {
  from?: Date | string
  to?: Date | string
}

export type RangeCalendarMatcher =
  | boolean
  | Date
  | Date[]
  | RangeCalendarRange
  | { dayOfWeek: number | number[] }
  | { before: Date; after: Date }
  | { before: Date }
  | { after: Date }
  | ((date: Date) => boolean)

export type RangeCalendarSelected = RangeCalendarRange | string | undefined

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1)
const endOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0)
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
const addWeeks = (d: Date, n: number) => addDays(d, n * 7)
function addMonths(d: Date, n: number) {
  const target = new Date(d.getFullYear(), d.getMonth() + n, 1)
  const last = endOfMonth(target).getDate()
  return new Date(target.getFullYear(), target.getMonth(), Math.min(d.getDate(), last))
}
const addYears = (d: Date, n: number) => addMonths(d, n * 12)
const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
const isSameMonth = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
const differenceInCalendarDays = (a: Date, b: Date) =>
  Math.round((startOfDay(a).getTime() - startOfDay(b).getTime()) / 86_400_000)
const differenceInCalendarMonths = (a: Date, b: Date) =>
  (a.getFullYear() - b.getFullYear()) * 12 + (a.getMonth() - b.getMonth())
function startOfWeek(d: Date, weekStartsOn: number) {
  const diff = (d.getDay() - weekStartsOn + 7) % 7
  return addDays(d, -diff)
}
const endOfWeek = (d: Date, weekStartsOn: number) => addDays(startOfWeek(d, weekStartsOn), 6)
const pad = (n: number) => String(n).padStart(2, '0')
const isoDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const isoMonth = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}`

type DayInput = Date | string | number | null | undefined

/** Date, `yyyy-MM-dd` (read as a LOCAL date, not UTC midnight) or any Date-parsable string. */
function toDate(v: unknown): Date | undefined {
  if (v == null || v === '') return undefined
  if (v instanceof Date) return isNaN(v.getTime()) ? undefined : startOfDay(v)
  if (typeof v === 'number') return startOfDay(new Date(v))
  if (typeof v === 'string') {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v.trim())
    if (m) return new Date(+m[1], +m[2] - 1, +m[3])
    const d = new Date(v)
    return isNaN(d.getTime()) ? undefined : startOfDay(d)
  }
  return undefined
}

function rangeIncludesDate(range: { from?: Date; to?: Date }, date: Date, excludeEnds = false) {
  let { from, to } = range
  if (from && to) {
    if (differenceInCalendarDays(to, from) < 0) [from, to] = [to, from]
    const e = excludeEnds ? 1 : 0
    return differenceInCalendarDays(date, from) >= e && differenceInCalendarDays(to, date) >= e
  }
  if (!excludeEnds && to) return isSameDay(to, date)
  if (!excludeEnds && from) return isSameDay(from, date)
  return false
}

/** react-day-picker's `dateMatchModifiers`. */
function matches(date: Date, matchers: RangeCalendarMatcher | RangeCalendarMatcher[] | undefined): boolean {
  if (matchers === undefined) return false
  const list =
    Array.isArray(matchers) && !matchers.every((m) => m instanceof Date) ? matchers : [matchers as RangeCalendarMatcher]
  return list.some((m) => {
    if (typeof m === 'boolean') return m
    if (m instanceof Date) return isSameDay(date, m)
    if (Array.isArray(m)) return m.some((d) => isSameDay(date, d))
    if (typeof m === 'function') return (m as (date: Date) => boolean)(date)
    if (!m || typeof m !== 'object') return false
    if ('from' in m || 'to' in m) {
      const r = m as RangeCalendarRange
      return rangeIncludesDate({ from: toDate(r.from), to: toDate(r.to) }, date)
    }
    if ('dayOfWeek' in m) {
      const dow = (m as { dayOfWeek: number | number[] }).dayOfWeek
      return Array.isArray(dow) ? dow.includes(date.getDay()) : dow === date.getDay()
    }
    const before = 'before' in m ? toDate((m as { before: unknown }).before) : undefined
    const after = 'after' in m ? toDate((m as { after: unknown }).after) : undefined
    if (before && after) {
      const isDayBefore = differenceInCalendarDays(before, date) > 0
      const isDayAfter = differenceInCalendarDays(after, date) < 0
      return differenceInCalendarDays(before, after) > 0 ? isDayAfter && isDayBefore : isDayBefore || isDayAfter
    }
    if (after) return differenceInCalendarDays(date, after) > 0
    if (before) return differenceInCalendarDays(before, date) > 0
    return false
  })
}

const isoRe = /^\d{4}-\d{2}-\d{2}/
function revive(v: unknown): unknown {
  if (typeof v === 'string' && isoRe.test(v)) return toDate(v)
  if (Array.isArray(v)) return v.map(revive)
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, revive(x)]))
  return v
}

/**
 * Attribute form of a Matcher: empty/`true` → every day; JSON with ISO date
 * strings (`{"dayOfWeek":[0,6]}`, `[{"before":"2026-09-21"}]`); or a
 * comma/space-separated list of `yyyy-MM-dd` dates.
 */
function parseMatcher(value: string | null): RangeCalendarMatcher | RangeCalendarMatcher[] | undefined {
  if (value === null) return undefined
  const v = value.trim()
  if (v === '' || v === 'true') return true
  if (v === 'false') return undefined
  if (v.startsWith('{') || v.startsWith('[')) {
    try {
      return revive(JSON.parse(v)) as RangeCalendarMatcher | RangeCalendarMatcher[]
    } catch {
      return undefined
    }
  }
  return v
    .split(/[\s,]+/)
    .map(toDate)
    .filter((d): d is Date => !!d)
}

/** date-fns `PPPP` (react-day-picker's day/gridcell label). */
function formatFull(d: Date, locale: string) {
  if (locale.startsWith('en')) {
    const ordinal = (n: number) => {
      const s = ['th', 'st', 'nd', 'rd']
      const x = n % 100
      return n + (s[(x - 20) % 10] || s[x] || s[0])
    }
    const weekday = d.toLocaleDateString(locale, { weekday: 'long' })
    const month = d.toLocaleDateString(locale, { month: 'long' })
    return `${weekday}, ${month} ${ordinal(d.getDate())}, ${d.getFullYear()}`
  }
  return new Intl.DateTimeFormat(locale, { dateStyle: 'full' }).format(d)
}

/** `LLLL y` (react-day-picker's caption + grid label). */
const formatMonthYear = (d: Date, locale: string) =>
  new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(d)

// ---------------------------------------------------------------------------

interface Modifiers {
  focused: boolean
  disabled: boolean
  hidden: boolean
  outside: boolean
  today: boolean
  selected: boolean
  range_start: boolean
  range_end: boolean
  range_middle: boolean
}

interface Day {
  date: Date
  displayMonth: Date
  outside: boolean
}

// React's `classNames` map, verbatim (RangeCalendar.tsx). `root`/`weeks` keep
// react-day-picker's `rdp-*` defaults (unstyled hooks), like <uip-calendar>.
const classNames = {
  months: 'relative flex flex-col gap-y-4 sm:flex-row sm:gap-x-4 sm:gap-y-0',
  month: 'flex flex-1 flex-col gap-4',
  month_caption: 'flex items-center justify-center',
  caption_label: 'text-sm font-medium',
  nav: 'absolute inset-x-1 top-0 flex items-center justify-between',
  button_previous: cn(buttonVariants({ variant: 'outline' }), 'size-7 bg-transparent p-0 opacity-50 hover:opacity-100'),
  button_next: cn(buttonVariants({ variant: 'outline' }), 'size-7 bg-transparent p-0 opacity-50 hover:opacity-100'),
  month_grid: 'w-full border-collapse space-y-1',
  weekdays: 'flex',
  weekday: 'text-muted-foreground flex-1 rounded-md text-xs font-normal',
  week: 'mt-2 flex w-full',
  day: cn(
    'relative flex-1 p-0 text-center text-sm focus-within:relative focus-within:z-20',
    '[&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-md',
    '[&:has([aria-selected].day-outside)]:bg-accent/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md',
  ),
  day_button: cn(buttonVariants({ variant: 'ghost' }), 'size-9 cursor-pointer p-0 font-normal aria-selected:opacity-100'),
  today: '[&:not([aria-selected])]:bg-accent [&:not([aria-selected])]:text-accent-foreground',
  outside: 'day-outside text-muted-foreground aria-selected:text-muted-foreground',
  disabled: 'text-muted-foreground opacity-50',
  range_start:
    'day-range-start rounded-l-md [&>button]:bg-primary [&>button]:text-primary-foreground [&>button:hover]:bg-primary [&>button:hover]:text-primary-foreground [&>button:focus]:bg-primary [&>button:focus]:text-primary-foreground',
  range_end:
    'day-range-end rounded-r-md [&>button]:bg-primary [&>button]:text-primary-foreground [&>button:hover]:bg-primary [&>button:hover]:text-primary-foreground [&>button:focus]:bg-primary [&>button:focus]:text-primary-foreground',
  range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground [&>button]:hover:bg-accent',
  hidden: 'invisible',
} as const

const matcherConverter = { fromAttribute: parseMatcher, toAttribute: () => null }
const dateConverter = { fromAttribute: (v: string | null) => toDate(v), toAttribute: () => null }
// Boolean props whose React default is `true`: `attr="false"` turns them off.
const trueByDefault = { fromAttribute: (v: string | null) => v !== 'false', toAttribute: () => null }

type MoveBy = 'day' | 'week' | 'month' | 'year' | 'startOfWeek' | 'endOfWeek'

/**
 * <uip-range-calendar> — the registry RangeCalendar (react-day-picker in
 * `mode="range"` in React) as a web component with its own month-grid logic.
 *
 * Markup, classes, ARIA and data attributes follow what react-day-picker
 * renders with React's `classNames` map: root div > months > nav + month >
 * caption + `table[role=grid]` > `td[role=gridcell]` > day `<button>`. Range
 * start/end cells get the primary fill, the middle the accent fill. Keyboard
 * matches <uip-calendar>: arrows move by day/week (Shift: month/year), PageUp/
 * PageDown by month (Shift: year), Home/End to the week's start/end, Enter/
 * Space select.
 *
 * Properties / attributes (react-day-picker prop names, range-forced):
 *  - `selected`: { from, to } (Date or ISO `yyyy-MM-dd`); the attribute is a
 *    `from,to` ISO pair.
 *  - `disabled`: a Matcher (Date, Date[], { before }, { after }, { from, to },
 *    { dayOfWeek }, a function, `true`) or an array of them. The attribute
 *    takes JSON with ISO dates or a date list.
 *  - `month` / `default-month`, `start-month` / `end-month` (ISO or Date).
 *  - `number-of-months`, `show-outside-days` (default true), `locale`
 *    (BCP-47, default 'en-US'), `week-starts-on` (0–6, default 0 like
 *    react-day-picker), `required`, `min` / `max` (nights),
 *    `disable-navigation`, `fixed-weeks`, `today` (Date/ISO).
 *
 * Out of scope (react-day-picker chrome, documented instead of silently
 * dropped): `captionLayout` dropdowns (label captions always), `modifiers` /
 * `modifiersClassNames`, `formatters` (narrow weekday labels always),
 * `footer`, and week numbers — <uip-calendar> covers those for single dates.
 *
 * Events (bubble, composed):
 *  - `select` — React's `onSelect`. detail: { selected, day, modifiers }. The
 *    element updates `selected` itself unless the event is canceled
 *    (`preventDefault()` = controlled).
 *  - `month-change` — React's `onMonthChange`. detail: { month }.
 */
export class UipRangeCalendar extends LitElement {
  // React's root is a block <div>.
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    selected: {
      converter: {
        fromAttribute: (v: string | null): RangeCalendarSelected => {
          if (v === null || v.trim() === '') return undefined
          const [from, to] = v.split(/\s*,\s*/)
          return { from, to }
        },
        toAttribute: () => null,
      },
    },
    disabled: { converter: matcherConverter },
    month: { converter: dateConverter },
    defaultMonth: { attribute: 'default-month', converter: dateConverter },
    startMonth: { attribute: 'start-month', converter: dateConverter },
    endMonth: { attribute: 'end-month', converter: dateConverter },
    today: { converter: dateConverter },
    numberOfMonths: { attribute: 'number-of-months', type: Number },
    showOutsideDays: { attribute: 'show-outside-days', converter: trueByDefault },
    locale: {},
    weekStartsOn: { attribute: 'week-starts-on', type: Number },
    required: { type: Boolean, reflect: true },
    min: { type: Number },
    max: { type: Number },
    disableNavigation: { attribute: 'disable-navigation', type: Boolean },
    fixedWeeks: { attribute: 'fixed-weeks', type: Boolean },
    accessibleLabel: { attribute: 'aria-label' },
    firstMonth: { state: true },
    focusedDay: { state: true },
  }

  selected: RangeCalendarSelected = undefined
  disabled?: RangeCalendarMatcher | RangeCalendarMatcher[]
  month?: Date
  defaultMonth?: Date
  startMonth?: Date
  endMonth?: Date
  today?: Date
  numberOfMonths = 1
  showOutsideDays = true
  locale = 'en-US'
  weekStartsOn = 0
  required = false
  min?: number
  max?: number
  disableNavigation = false
  fixedWeeks = false
  accessibleLabel?: string
  private firstMonth?: Date
  private focusedDay?: Date
  private lastFocused?: Date
  private pendingFocus = false

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'range-calendar')
  }

  // --- derived --------------------------------------------------------------
  private get todayDate() {
    return toDate(this.today) ?? toDate(new Date())!
  }

  /** react-day-picker's getNavMonths (no dropdowns: start/endMonth only). */
  private get navRange(): [Date | undefined, Date | undefined] {
    const s = toDate(this.startMonth)
    const e = toDate(this.endMonth)
    return [s ? startOfMonth(s) : undefined, e ? endOfMonth(e) : undefined]
  }

  private get selectedRange(): { from?: Date; to?: Date } {
    const v = this.selected
    if (v == null || v === '') return {}
    if (typeof v === 'string') {
      const [from, to] = v.split(/\s*,\s*/)
      return { from: toDate(from), to: toDate(to) }
    }
    return { from: toDate(v.from as DayInput), to: toDate(v.to as DayInput) }
  }

  private isSelected(date: Date) {
    const r = this.selectedRange
    return rangeIncludesDate(r, date)
  }

  private initialMonth() {
    const [navStart, navEnd] = this.navRange
    let m = toDate(this.month) ?? toDate(this.defaultMonth) ?? this.todayDate
    const n = this.numberOfMonths || 1
    if (navEnd && differenceInCalendarMonths(navEnd, m) < n - 1) m = addMonths(navEnd, -(n - 1))
    if (navStart && differenceInCalendarMonths(m, navStart) < 0) m = navStart
    return startOfMonth(m)
  }

  protected willUpdate(changed: PropertyValues<this>) {
    if (!this.firstMonth || changed.has('month')) this.firstMonth = this.initialMonth()
  }

  private get displayMonths() {
    const [, navEnd] = this.navRange
    const n = this.numberOfMonths || 1
    const out: Date[] = []
    for (let i = 0; i < n; i++) {
      const m = addMonths(this.firstMonth!, i)
      if (navEnd && m > navEnd) break
      out.push(m)
    }
    return out
  }

  private weeksOf(month: Date): Day[][] {
    const ws = this.weekStartsOn
    const first = startOfWeek(month, ws)
    let last = endOfWeek(endOfMonth(month), ws)
    const e = toDate(this.endMonth)
    if (e) {
      const limit = endOfWeek(endOfMonth(e), ws)
      if (last > limit) last = limit
    }
    const weeks: Day[][] = []
    const pushWeek = (start: Date) =>
      weeks.push(
        Array.from({ length: 7 }, (_, i) => {
          const date = addDays(start, i)
          return { date, displayMonth: month, outside: !isSameMonth(date, month) }
        }),
      )
    for (let d = first; d <= last; d = addDays(d, 7)) pushWeek(d)
    while (this.fixedWeeks && weeks.length < 6) {
      const prev = weeks[weeks.length - 1]!
      pushWeek(addDays(prev[6]!.date, 1))
    }
    return weeks
  }

  private modifiersOf(day: Day): Modifiers {
    const [navStart, navEnd] = this.navRange
    const { date, outside } = day
    const hidden =
      (!!navStart && date < startOfMonth(navStart)) ||
      (!!navEnd && date > endOfMonth(navEnd)) ||
      (!this.showOutsideDays && outside)
    const r = this.selectedRange
    const selected = rangeIncludesDate(r, date)
    return {
      focused: !hidden && !!this.focusedDay && isSameDay(this.focusedDay, date) && !outside,
      disabled: matches(date, this.disabled),
      hidden,
      outside,
      today: isSameDay(date, this.todayDate),
      selected,
      range_start: !!(r.from && r.to && isSameDay(date, r.from)),
      range_end: !!(r.from && r.to && isSameDay(date, r.to)),
      range_middle: rangeIncludesDate(r, date, true),
    }
  }

  private dayClasses(mods: Modifiers): string {
    const cls = [classNames.day]
    if (mods.selected) cls.push('rdp-selected')
    if (mods.range_start) cls.push(classNames.range_start)
    if (mods.range_end) cls.push(classNames.range_end)
    if (mods.range_middle) cls.push(classNames.range_middle)
    if (mods.today) cls.push(classNames.today)
    if (mods.outside) cls.push(classNames.outside)
    if (mods.disabled) cls.push(classNames.disabled)
    if (mods.hidden) cls.push(classNames.hidden)
    return cls.join(' ')
  }

  /** react-day-picker's calculateFocusTarget: focused > last focused > selected > today > first enabled. */
  private focusTarget(days: Day[]): Day | undefined {
    let target: Day | undefined
    let prio = -1
    for (const day of days) {
      const m = this.modifiersOf(day)
      if (m.disabled || m.hidden || m.outside) continue
      if (m.focused && prio < 3) (target = day), (prio = 3)
      else if (this.lastFocused && isSameDay(this.lastFocused, day.date) && prio < 2) (target = day), (prio = 2)
      else if (m.selected && prio < 1) (target = day), (prio = 1)
      else if (m.today && prio < 0) (target = day), (prio = 0)
    }
    return (
      target ??
      days.find((d) => {
        const m = this.modifiersOf(d)
        return !m.disabled && !m.hidden && !m.outside
      })
    )
  }

  // --- navigation -----------------------------------------------------------
  private get previousMonth() {
    if (this.disableNavigation) return undefined
    const [navStart] = this.navRange
    const m = this.firstMonth!
    if (navStart && differenceInCalendarMonths(m, navStart) <= 0) return undefined
    return addMonths(m, -1)
  }

  private get nextMonth() {
    if (this.disableNavigation) return undefined
    const [, navEnd] = this.navRange
    const m = this.firstMonth!
    if (navEnd && differenceInCalendarMonths(navEnd, m) < (this.numberOfMonths || 1)) return undefined
    return addMonths(m, 1)
  }

  private goToMonth(date: Date) {
    if (this.disableNavigation) return
    const [navStart, navEnd] = this.navRange
    let m = startOfMonth(date)
    if (navStart && m < startOfMonth(navStart)) m = startOfMonth(navStart)
    if (navEnd && m > startOfMonth(navEnd)) m = startOfMonth(navEnd)
    this.firstMonth = m
    this.dispatchEvent(new CustomEvent('month-change', { detail: { month: m }, bubbles: true, composed: true }))
  }

  private moveFocus(moveBy: MoveBy, dir: 'before' | 'after') {
    if (!this.focusedDay) return
    const [navStart, navEnd] = this.navRange
    const sign = dir === 'after' ? 1 : -1
    let date = this.focusedDay
    for (let attempt = 0; attempt <= 365; attempt++) {
      const fns: Record<MoveBy, (d: Date) => Date> = {
        day: (d) => addDays(d, sign),
        week: (d) => addWeeks(d, sign),
        month: (d) => addMonths(d, sign),
        year: (d) => addYears(d, sign),
        startOfWeek: (d) => startOfWeek(d, this.weekStartsOn),
        endOfWeek: (d) => endOfWeek(d, this.weekStartsOn),
      }
      date = fns[moveBy](date)
      if (dir === 'before' && navStart && date < navStart) date = navStart
      if (dir === 'after' && navEnd && date > navEnd) date = navEnd
      if (!matches(date, this.disabled)) break
      if (attempt === 365) return
    }
    const inView = this.displayMonths.some((m) => isSameMonth(m, date))
    if (!inView) {
      if (this.disableNavigation) return
      this.goToMonth(date)
    }
    this.focusedDay = date
    this.pendingFocus = true
  }

  private onDayKeyDown(e: KeyboardEvent) {
    const rtl = getComputedStyle(this).direction === 'rtl'
    const map: Record<string, [MoveBy, 'before' | 'after']> = {
      ArrowLeft: [e.shiftKey ? 'month' : 'day', rtl ? 'after' : 'before'],
      ArrowRight: [e.shiftKey ? 'month' : 'day', rtl ? 'before' : 'after'],
      ArrowDown: [e.shiftKey ? 'year' : 'week', 'after'],
      ArrowUp: [e.shiftKey ? 'year' : 'week', 'before'],
      PageUp: [e.shiftKey ? 'year' : 'month', 'before'],
      PageDown: [e.shiftKey ? 'year' : 'month', 'after'],
      Home: ['startOfWeek', 'before'],
      End: ['endOfWeek', 'after'],
    }
    const step = map[e.key]
    if (!step) return
    e.preventDefault()
    e.stopPropagation()
    this.moveFocus(...step)
  }

  protected updated() {
    if (!this.pendingFocus || !this.focusedDay) return
    this.pendingFocus = false
    this.renderRoot
      .querySelector<HTMLButtonElement>(`td[data-day="${isoDate(this.focusedDay)}"]:not([data-outside]) > button`)
      ?.focus()
  }

  // --- selection ------------------------------------------------------------
  private select(date: Date, mods: Modifiers) {
    const next = this.addToRange(date, this.selectedRange)
    const ev = new CustomEvent('select', {
      detail: { selected: next, day: date, modifiers: mods },
      bubbles: true,
      composed: true,
      cancelable: true,
    })
    if (this.dispatchEvent(ev)) this.selected = next
  }

  /** react-day-picker's addToRange. */
  private addToRange(date: Date, range: { from?: Date; to?: Date }): { from?: Date; to?: Date } | undefined {
    const min = this.min ?? 0
    const max = this.max ?? 0
    const { from, to } = range
    let r: { from?: Date; to?: Date } | undefined
    if (!from && !to) r = { from: date, to: min > 0 ? undefined : date }
    else if (from && !to) {
      if (isSameDay(from, date)) r = min === 0 ? { from, to: date } : this.required ? { from, to: undefined } : undefined
      else if (date < from) r = { from: date, to: from }
      else r = { from, to: date }
    } else if (from && to) {
      if (isSameDay(from, date) && isSameDay(to, date)) r = this.required ? { from, to } : undefined
      else if (isSameDay(from, date)) r = { from, to: min > 0 ? undefined : date }
      else if (isSameDay(to, date)) r = { from: date, to: min > 0 ? undefined : date }
      else if (date < from) r = { from: date, to }
      else r = { from, to: date }
    }
    if (r?.from && r.to) {
      const diff = Math.round((r.to.getTime() - r.from.getTime()) / 86_400_000)
      if (max > 0 && diff > max) r = { from: date, to: undefined }
      else if (min > 1 && diff < min) r = { from: date, to: undefined }
    }
    return r
  }

  // --- render ---------------------------------------------------------------
  private renderDay(day: Day, target: Day | undefined) {
    const mods = this.modifiersOf(day)
    const cls = this.dayClasses(mods)
    const dayLabel = () => {
      let l = formatFull(day.date, this.locale)
      if (mods.today) l = `Today, ${l}`
      if (mods.selected) l = `${l}, selected`
      return l
    }
    const isTarget = !!target && target.date === day.date
    return html`<td
      class=${cls}
      role="gridcell"
      aria-selected=${mods.selected ? 'true' : nothing}
      data-day=${isoDate(day.date)}
      data-month=${day.outside ? isoMonth(day.date) : nothing}
      data-selected=${mods.selected ? 'true' : nothing}
      data-disabled=${mods.disabled ? 'true' : nothing}
      data-hidden=${mods.hidden ? 'true' : nothing}
      data-outside=${day.outside ? 'true' : nothing}
      data-focused=${mods.focused ? 'true' : nothing}
      data-today=${mods.today ? 'true' : nothing}
    >
      ${mods.hidden
        ? nothing
        : html`<button
            class=${classNames.day_button}
            type="button"
            ?disabled=${!mods.focused && mods.disabled}
            aria-disabled=${mods.focused && mods.disabled ? 'true' : nothing}
            tabindex=${isTarget ? 0 : -1}
            aria-label=${dayLabel()}
            @click=${(e: Event) => {
              e.preventDefault()
              e.stopPropagation()
              this.focusedDay = day.date
              if (mods.disabled) return
              this.select(day.date, mods)
            }}
            @focus=${() => (this.focusedDay = day.date)}
            @blur=${() => {
              this.lastFocused = this.focusedDay
              this.focusedDay = undefined
            }}
            @keydown=${this.onDayKeyDown}
          >
            ${day.date.getDate()}
          </button>`}
    </td>`
  }

  render() {
    const months = this.displayMonths
    const monthsWeeks = months.map((m) => this.weeksOf(m))
    const allDays = monthsWeeks.flat(2)
    const target = this.focusTarget(allDays)
    const prev = this.previousMonth
    const next = this.nextMonth
    const n = this.numberOfMonths || 1
    const ws = this.weekStartsOn
    const weekdays = Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(this.todayDate, ws), i))

    return html`<div
      part="root"
      class=${cn('rdp-root', 'p-3')}
      lang=${this.locale}
      aria-label=${this.accessibleLabel ?? nothing}
      data-mode="range"
      data-required=${this.required ? 'true' : nothing}
      data-multiple-months=${n > 1 ? 'true' : nothing}
    >
      <div class=${classNames.months}>
        <nav class=${classNames.nav} aria-label="">
          <button
            type="button"
            class=${classNames.button_previous}
            tabindex=${prev ? nothing : -1}
            aria-disabled=${prev ? nothing : 'true'}
            aria-label="Go to the Previous Month"
            @click=${() => prev && this.goToMonth(prev)}
          >
            ${icon(ChevronLeft, 'chevron-left', cn('size-4', 'rdp-chevron'))}
          </button>
          <button
            type="button"
            class=${classNames.button_next}
            tabindex=${next ? nothing : -1}
            aria-disabled=${next ? nothing : 'true'}
            aria-label="Go to the Next Month"
            @click=${() => next && this.goToMonth(next)}
          >
            ${icon(ChevronRight, 'chevron-right', cn('size-4', 'rdp-chevron'))}
          </button>
        </nav>
        ${months.map(
          (month, mi) => html`<div class=${classNames.month}>
            <div class=${classNames.month_caption}>
              <span class=${classNames.caption_label} role="status" aria-live="polite">
                ${formatMonthYear(month, this.locale)}
              </span>
            </div>
            <table
              role="grid"
              aria-multiselectable="true"
              aria-label=${formatMonthYear(month, this.locale)}
              class=${classNames.month_grid}
            >
              <thead aria-hidden="true">
                <tr class=${classNames.weekdays}>
                  ${weekdays.map(
                    (w) => html`<th
                      aria-label=${w.toLocaleDateString(this.locale, { weekday: 'long' })}
                      class=${classNames.weekday}
                      scope="col"
                    >
                      ${w.toLocaleDateString(this.locale, { weekday: 'narrow' })}
                    </th>`,
                  )}
                </tr>
              </thead>
              <tbody class="rdp-weeks">
                ${monthsWeeks[mi]!.map((week) => html`<tr class=${classNames.week}>
                  ${week.map((d) => this.renderDay(d, target))}
                </tr>`)}
              </tbody>
            </table>
          </div>`,
        )}
      </div>
    </div>`
  }
}

customElements.get('uip-range-calendar') || customElements.define('uip-range-calendar', UipRangeCalendar)

declare global {
  interface HTMLElementTagNameMap {
    'uip-range-calendar': UipRangeCalendar
  }
}
