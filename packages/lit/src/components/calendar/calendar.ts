import { LitElement, css, html, isServer, nothing, type PropertyValues } from 'lit'
import { ChevronLeft, ChevronRight } from 'lucide'
import { cn } from '../../lib/utils'
import { icon } from '../../lib/icon'
import { tailwind } from '../../lib/styles'
import { ThemeController } from '../../lib/theme'
import { buttonVariants } from '../button/button.variants'
import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  differenceInCalendarMonths,
  endOfMonth,
  endOfWeek,
  endOfYear,
  formatFull,
  formatMonthYear,
  getWeekNumber,
  isSameDay,
  isSameMonth,
  isYearFirst,
  isoDate,
  isoMonth,
  localeWeekStart,
  matches,
  parseMatcher,
  parseModifiersMap,
  rangeIncludesDate,
  startOfMonth,
  startOfWeek,
  startOfYear,
  toDate,
  type DateRange,
  type Matcher,
} from './calendar-date'

export type { DateRange, Matcher } from './calendar-date'
export type CalendarMode = 'single' | 'multiple' | 'range'
export type CalendarSelected = Date | Date[] | DateRange | string | string[] | undefined
/** react-day-picker's `modifiers` prop: custom name → matcher(s). Falsy values are ignored. */
export type CalendarModifiers = Record<string, Matcher | Matcher[] | undefined>
/** react-day-picker's `modifiersClassNames` prop: modifier name → class string. */
export type CalendarModifiersClassNames = Record<string, string>
/**
 * react-day-picker's `formatters`, as closely as fits a web component: the
 * same names, but the third `dateLib` argument is replaced by
 * `{ locale }` (there is no date-fns here). Property only — functions can't
 * be attributes. `formatMonthDropdown` / `formatYearDropdown` are not
 * supported (the dropdowns render locale month/year names).
 */
export interface CalendarFormatters {
  formatCaption?: (month: Date, options?: { locale?: string }) => string
  formatDay?: (date: Date, options?: { locale?: string }) => string
  formatWeekdayName?: (weekday: Date, options?: { locale?: string }) => string
  formatWeekNumber?: (weekNumber: number, options?: { locale?: string }) => string
  formatWeekNumberHeader?: () => string
}

/** react-day-picker's computed `Modifiers` (`Record<string, boolean>`): the built-in flags plus custom names. */
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
  [custom: string]: boolean
}

/** Built-in modifier names (a custom modifier of the same name replaces the flag, like RDP). */
const builtinModifierNames = [
  'focused',
  'disabled',
  'hidden',
  'outside',
  'today',
  'selected',
  'range_start',
  'range_end',
  'range_middle',
] as const

interface Day {
  date: Date
  displayMonth: Date
  outside: boolean
}

// ---------------------------------------------------------------------------
// React's `classNames` map, verbatim (packages/registry-react/components/calendar/Calendar.tsx).
// Keys react-day-picker keeps at its defaults render as `rdp-<key>`.
const classNames = {
  root: 'rdp-root',
  months: 'relative flex flex-col gap-y-4 sm:flex-row sm:gap-x-4 sm:gap-y-0',
  month: cn(
    'flex flex-1 flex-col gap-4 motion-safe:animate-[calendar-month-in_220ms_cubic-bezier(0.22,1,0.36,1)_both]',
  ),
  month_caption: 'flex items-center justify-center',
  caption_label: 'text-sm font-medium',
  dropdowns: 'rdp-dropdowns',
  dropdown_root: 'rdp-dropdown_root',
  dropdown: 'rdp-dropdown',
  months_dropdown: 'rdp-months_dropdown',
  years_dropdown: 'rdp-years_dropdown',
  chevron: 'rdp-chevron',
  nav: 'absolute inset-x-0 top-0 flex items-center justify-between gap-1',
  button_previous: cn(
    buttonVariants({ variant: 'outline' }),
    'size-9 bg-transparent p-0 opacity-70 hover:opacity-100 focus-visible:opacity-100',
  ),
  button_next: cn(
    buttonVariants({ variant: 'outline' }),
    'size-9 bg-transparent p-0 opacity-70 hover:opacity-100 focus-visible:opacity-100',
  ),
  month_grid: 'w-full border-collapse space-y-1',
  weekdays: 'flex',
  weekday: 'text-muted-foreground flex-1 rounded-md text-xs font-normal',
  weeks: 'rdp-weeks',
  week: 'mt-2 flex w-full',
  day: cn(
    'relative flex-1 p-0 text-center text-sm focus-within:relative focus-within:z-20',
    '[&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-md',
    '[&:has([aria-selected].day-outside)]:bg-accent/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md',
  ),
  day_button: cn(
    buttonVariants({ variant: 'ghost' }),
    'size-9 cursor-pointer p-0 font-normal transition-[color,background-color,transform,box-shadow] duration-150 aria-selected:opacity-100',
  ),
  selected:
    'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground shadow-sm motion-safe:animate-[calendar-day-pop_220ms_cubic-bezier(0.22,1.4,0.36,1)_both] [&>button]:bg-primary [&>button]:text-primary-foreground [&>button:hover]:bg-primary [&>button:hover]:text-primary-foreground',
  today: '[&:not([aria-selected])]:bg-accent [&:not([aria-selected])]:text-accent-foreground',
  outside: 'day-outside text-muted-foreground aria-selected:text-muted-foreground',
  disabled: 'text-muted-foreground opacity-50',
  focused: 'rdp-focused',
  range_start:
    'day-range-start rounded-l-md motion-safe:animate-[calendar-day-pop_220ms_cubic-bezier(0.22,1.4,0.36,1)_both]',
  range_end:
    'day-range-end rounded-r-md motion-safe:animate-[calendar-day-pop_220ms_cubic-bezier(0.22,1.4,0.36,1)_both]',
  range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground transition-colors duration-200',
  hidden: 'invisible',
  // React's classNames map leaves these at RDP's `rdp-*` defaults (unstyled
  // hooks). The footer stays exactly that; the week-number column gets minimal
  // Lit styling so the numbers align with the day cells (h-9, muted, tabular).
  footer: 'rdp-footer',
  week_number: 'rdp-week_number text-muted-foreground flex h-9 w-9 shrink-0 items-center justify-center text-xs font-normal tabular-nums',
  week_number_header: 'rdp-week_number_header w-9 shrink-0 text-xs font-normal',
} as const

// React injects these keyframes into <head> once (same id + content, so a page
// running both the React and the Lit calendar shares one tag). Keyframes can't
// be a utility; document-scope @keyframes resolve for shadow-tree animations.
const CAL_STYLE_ID = 'calendar-motion-styles'
const CAL_STYLE_CONTENT = `
@keyframes calendar-day-pop {
  0% { transform: scale(0.86); }
  70% { transform: scale(1.06); }
  100% { transform: scale(1); }
}
@keyframes calendar-month-in {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
@media (prefers-reduced-motion: reduce) {
  [data-slot='calendar'] [class*='animate-\\[calendar-'] {
    animation: none !important;
  }
}
`
function injectMotionStyles() {
  if (isServer) return
  let el = document.getElementById(CAL_STYLE_ID) as HTMLStyleElement | null
  if (!el) {
    el = document.createElement('style')
    el.id = CAL_STYLE_ID
    document.head.appendChild(el)
  }
  if (el.textContent !== CAL_STYLE_CONTENT) el.textContent = CAL_STYLE_CONTENT
}

const matcherConverter = {
  fromAttribute: parseMatcher,
  toAttribute: () => null,
}
const dateConverter = { fromAttribute: (v: string | null) => toDate(v), toAttribute: () => null }
// Boolean props whose React default is `true`: `attr="false"` turns them off.
const trueByDefault = { fromAttribute: (v: string | null) => v !== 'false', toAttribute: () => null }

type MoveBy = 'day' | 'week' | 'month' | 'year' | 'startOfWeek' | 'endOfWeek'

/**
 * <uip-calendar> — the registry Calendar (react-day-picker v10 in React) as ONE
 * web component with its own month-grid logic.
 *
 * Markup, classes, ARIA and data attributes follow what react-day-picker renders
 * with React's `classNames` map: root div > months > nav + month > caption +
 * `table[role=grid]` > `td[role=gridcell]` > day `<button>`. The whole grid lives
 * in one shadow root, so the roving tabindex and focus management work like
 * react-day-picker's: Arrow keys move by day/week (Shift: month/year), PageUp /
 * PageDown by month (Shift: year), Home / End to the week's start / end,
 * Enter / Space select (native button).
 *
 * Properties / attributes (react-day-picker prop names):
 *  - `mode`: 'single' | 'multiple' | 'range' (unset = display only, like React).
 *  - `selected`: Date | Date[] | { from, to } — or ISO `yyyy-MM-dd` strings; the
 *    attribute is one date, or a comma-separated list (multiple; range = from,to).
 *  - `disabled`: a react-day-picker Matcher (Date, Date[], { before }, { after },
 *    { from, to }, { dayOfWeek }, a function, `true`) or an array of them. The
 *    attribute takes JSON with ISO dates (`{"dayOfWeek":[0,6]}`) or a date list.
 *  - `modifiers`: custom name → matcher(s), e.g. `{ booked: [dates] }` (RDP's
 *    `modifiers`; the attribute takes the same JSON shape with ISO dates).
 *    Custom flags join the built-ins in the `select` detail; a custom name
 *    matching a built-in (e.g. `disabled`) replaces that flag, like RDP.
 *  - `modifiers-class-names`: modifier name → class string (RDP's
 *    `modifiersClassNames`; JSON attribute). Applied to the day cell — and
 *    like RDP it can also override a built-in state's class (e.g. `{ today:
 *    '…' }`). Values must be utilities the shadow Tailwind sheet provides
 *    (colours, rings, font weight); fully custom day visuals (event dots)
 *    need RDP's `DayButton` override, which has no web-component equivalent
 *    (see below) — mark days with utilities instead.
 *  - `month` / `default-month`, `start-month` / `end-month` (ISO or Date).
 *  - `number-of-months`, `show-outside-days` (default true; `="false"` to hide),
 *    `caption-layout` ('label' | 'dropdown' | 'dropdown-months' | 'dropdown-years'),
 *    `locale` (BCP-47 string, default 'en-US'), `week-starts-on` (0–6),
 *    `required`, `min` / `max` (multiple: count; range: nights), `disable-navigation`,
 *    `today` (Date/ISO).
 *  - `fixed-weeks`: always render 6 weeks per month (RDP's `fixedWeeks`).
 *  - `show-week-number`: a leading week-number column (RDP's `showWeekNumber`;
 *    numbers follow date-fns `getWeek` with the calendar's week start).
 *  - `formatters`: RDP's `formatters` (property only): `formatCaption`,
 *    `formatDay`, `formatWeekdayName`, `formatWeekNumber`,
 *    `formatWeekNumberHeader`.
 *  - `footer` / `slot="footer"`: RDP's `footer` node, rendered below the grid
 *    (`role="status"`, `part="footer"`).
 *
 * Not supported (genuinely infeasible as web-component API, documented here
 * instead of silently dropped): `components` overrides (DayButton, Chevron,
 * … — injected light DOM would break the shadow grid's roving tabindex,
 * focus and ARIA contracts; style the container via `part="root"` and mark
 * days via `modifiers` + `modifiersClassNames`), `styles` /
 * `modifiersStyles` (inline-style objects; use classes), the `hidden` prop,
 * `ISOWeek` / `broadcastCalendar`, and week-number localisation beyond
 * `week-starts-on`.
 *
 * Events (bubble, composed):
 *  - `select` — React's `onSelect`. detail: { selected, day, modifiers }. The
 *    element updates `selected` itself unless the event is canceled
 *    (`preventDefault()` = controlled).
 *  - `month-change` — React's `onMonthChange`. detail: { month }.
 */
export class UipCalendar extends LitElement {
  // React's root is a block <div>.
  static styles = [tailwind, css`:host { display: block; }`]

  static properties = {
    mode: { reflect: true },
    selected: {
      converter: { fromAttribute: (v: string | null) => (v ? v.split(/\s*,\s*/) : undefined), toAttribute: () => null },
    },
    disabled: { converter: matcherConverter },
    modifiers: { converter: { fromAttribute: parseModifiersMap, toAttribute: () => null } },
    modifiersClassNames: {
      attribute: 'modifiers-class-names',
      converter: {
        fromAttribute: (v: string | null) => {
          if (v === null) return undefined
          try {
            const obj = JSON.parse(v)
            if (obj && typeof obj === 'object' && !Array.isArray(obj)) return obj
          } catch {
            /* not JSON */
          }
          return undefined
        },
        toAttribute: () => null,
      },
    },
    month: { converter: dateConverter },
    defaultMonth: { attribute: 'default-month', converter: dateConverter },
    startMonth: { attribute: 'start-month', converter: dateConverter },
    endMonth: { attribute: 'end-month', converter: dateConverter },
    today: { converter: dateConverter },
    numberOfMonths: { attribute: 'number-of-months', type: Number },
    showOutsideDays: { attribute: 'show-outside-days', converter: trueByDefault },
    captionLayout: { attribute: 'caption-layout' },
    locale: {},
    weekStartsOn: { attribute: 'week-starts-on', type: Number },
    required: { type: Boolean, reflect: true },
    min: { type: Number },
    max: { type: Number },
    disableNavigation: { attribute: 'disable-navigation', type: Boolean },
    fixedWeeks: { attribute: 'fixed-weeks', type: Boolean },
    showWeekNumber: { attribute: 'show-week-number', type: Boolean },
    formatters: { attribute: false },
    footer: {},
    accessibleLabel: { attribute: 'aria-label' },
    firstMonth: { state: true },
    focusedDay: { state: true },
    hasFooter: { state: true },
  }

  mode?: CalendarMode
  selected: CalendarSelected = undefined
  disabled?: Matcher | Matcher[]
  modifiers?: CalendarModifiers
  modifiersClassNames?: CalendarModifiersClassNames
  month?: Date
  defaultMonth?: Date
  startMonth?: Date
  endMonth?: Date
  today?: Date
  numberOfMonths = 1
  showOutsideDays = true
  captionLayout: 'label' | 'dropdown' | 'dropdown-months' | 'dropdown-years' = 'label'
  locale = 'en-US'
  weekStartsOn?: number
  required = false
  min?: number
  max?: number
  disableNavigation = false
  fixedWeeks = false
  showWeekNumber = false
  formatters?: CalendarFormatters
  footer?: string
  accessibleLabel?: string
  private firstMonth?: Date
  private focusedDay?: Date
  private hasFooter = false
  private childObserver?: MutationObserver
  private lastFocused?: Date
  private pendingFocus = false

  constructor() {
    super()
    new ThemeController(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('data-uipkge', '')
    this.setAttribute('data-slot', 'calendar')
    injectMotionStyles()
    // Frameworks may slot the footer after the host connects — re-render so it appears.
    this.childObserver = new MutationObserver(() => this.requestUpdate())
    this.childObserver.observe(this, { childList: true })
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.childObserver?.disconnect()
  }

  // --- derived --------------------------------------------------------------
  private get todayDate() {
    return toDate(this.today) ?? toDate(new Date())!
  }
  private get weekStart() {
    return this.weekStartsOn ?? localeWeekStart(this.locale)
  }
  private get hasYearDropdown() {
    return this.captionLayout === 'dropdown' || this.captionLayout === 'dropdown-years'
  }
  /** react-day-picker's getNavMonths. */
  private get navRange(): [Date | undefined, Date | undefined] {
    const s = toDate(this.startMonth)
    const e = toDate(this.endMonth)
    return [
      s ? startOfMonth(s) : this.hasYearDropdown ? startOfYear(addYears(this.todayDate, -100)) : undefined,
      e ? endOfMonth(e) : this.hasYearDropdown ? endOfYear(this.todayDate) : undefined,
    ]
  }

  private get selectedDates(): Date[] {
    const v = this.selected
    if (v == null || v === '') return []
    if (Array.isArray(v)) return v.map(toDate).filter((d): d is Date => !!d)
    if (v instanceof Date || typeof v === 'string') {
      const d = toDate(v)
      return d ? [d] : []
    }
    return [v.from, v.to].map(toDate).filter((d): d is Date => !!d)
  }
  private get selectedSingle() {
    return this.selectedDates[0]
  }
  private get selectedRange(): DateRange | undefined {
    const v = this.selected
    if (v == null || v === '') return undefined
    if (Array.isArray(v)) return { from: toDate(v[0]), to: toDate(v[1]) }
    if (v instanceof Date || typeof v === 'string') return { from: toDate(v), to: undefined }
    return { from: toDate(v.from), to: toDate(v.to) }
  }
  private isSelected(date: Date) {
    if (this.mode === 'range') {
      const r = this.selectedRange
      return !!r && rangeIncludesDate(r, date)
    }
    if (this.mode === 'single') return !!this.selectedSingle && isSameDay(this.selectedSingle, date)
    if (this.mode === 'multiple') return this.selectedDates.some((d) => isSameDay(d, date))
    return false
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
    const ws = this.weekStart
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
    // RDP `fixedWeeks`: always 6 weeks, padding with outside days (even across
    // endMonth, like RDP filling 42 days).
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
    const selected = this.isSelected(date)
    const mods: Modifiers = {
      focused: !hidden && !!this.focusedDay && isSameDay(this.focusedDay, date) && !outside,
      disabled: matches(date, this.disabled),
      hidden,
      outside,
      today: isSameDay(date, this.todayDate),
      selected,
      range_start: false,
      range_end: false,
      range_middle: false,
    }
    if (this.mode === 'range') {
      const r = this.selectedRange
      if (r) {
        mods.range_start = !!(r.from && r.to && isSameDay(date, r.from))
        mods.range_end = !!(r.from && r.to && isSameDay(date, r.to))
        mods.range_middle = rangeIncludesDate(r, date, true)
      }
    }
    // Custom modifiers (RDP `modifiers`): a truthy matcher overrides the flag
    // of the same name — including built-ins — falsy values are ignored.
    if (this.modifiers) {
      for (const [name, matcher] of Object.entries(this.modifiers)) {
        if (!matcher) continue
        mods[name] = matches(date, matcher)
      }
    }
    return mods
  }

  /** RDP `getClassNamesForModifiers`: modifiersClassNames wins over the built-in class for the same key. */
  private dayClasses(mods: Modifiers): string {
    const cls = [classNames.day]
    for (const k of builtinModifierNames) {
      if (!mods[k]) continue
      cls.push(this.modifiersClassNames?.[k] ?? classNames[k])
    }
    if (this.modifiersClassNames) {
      for (const [name, active] of Object.entries(mods)) {
        if (!active || (builtinModifierNames as readonly string[]).includes(name)) continue
        const custom = this.modifiersClassNames[name]
        if (custom) cls.push(custom)
      }
    }
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
    return target ?? days.find((d) => {
      const m = this.modifiersOf(d)
      return !m.disabled && !m.hidden && !m.outside
    })
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
        startOfWeek: (d) => startOfWeek(d, this.weekStart),
        endOfWeek: (d) => endOfWeek(d, this.weekStart),
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
    let next: Date | Date[] | DateRange | undefined
    if (this.mode === 'single') {
      const cur = this.selectedSingle
      next = !this.required && cur && isSameDay(cur, date) ? undefined : date
    } else if (this.mode === 'multiple') {
      const cur = this.selectedDates
      if (this.isSelected(date)) {
        if (cur.length === this.min) return
        if (this.required && cur.length === 1) return
        next = cur.filter((d) => !isSameDay(d, date))
      } else {
        next = cur.length === this.max ? [date] : [...cur, date]
      }
    } else if (this.mode === 'range') {
      next = this.addToRange(date, this.selectedRange)
    } else {
      return
    }
    const ev = new CustomEvent('select', {
      detail: { selected: next, day: date, modifiers: mods },
      bubbles: true,
      composed: true,
      cancelable: true,
    })
    if (this.dispatchEvent(ev)) this.selected = next
  }

  /** react-day-picker's addToRange. */
  private addToRange(date: Date, range: DateRange | undefined): DateRange | undefined {
    const min = this.min ?? 0
    const max = this.max ?? 0
    const { from, to } = range ?? {}
    let r: DateRange | undefined
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
  private chevron(orientation: 'left' | 'right' | 'down') {
    // React's custom Chevron: ChevronLeft for "left", ChevronRight otherwise
    // (so the dropdown's "down" chevron is a right chevron in React too).
    return orientation === 'left'
      ? icon(ChevronLeft, 'chevron-left', cn('size-4', classNames.chevron))
      : icon(ChevronRight, 'chevron-right', cn('size-4', classNames.chevron))
  }

  private formatCaption(month: Date) {
    return this.formatters?.formatCaption?.(month, { locale: this.locale }) ?? formatMonthYear(month, this.locale)
  }

  private formatDay(date: Date) {
    return this.formatters?.formatDay?.(date, { locale: this.locale }) ?? String(date.getDate())
  }

  private formatWeekdayName(weekday: Date) {
    return (
      this.formatters?.formatWeekdayName?.(weekday, { locale: this.locale }) ??
      weekday.toLocaleDateString(this.locale, { weekday: 'narrow' })
    )
  }

  private formatWeekNumber(weekNumber: number) {
    return (
      this.formatters?.formatWeekNumber?.(weekNumber, { locale: this.locale }) ?? String(weekNumber).padStart(2, '0')
    )
  }

  private renderCaption(month: Date, monthOffset: number) {
    const caption = this.formatCaption(month)
    if (!this.captionLayout.startsWith('dropdown')) {
      return html`<span class=${classNames.caption_label} role="status" aria-live="polite">${caption}</span>`
    }
    const [navStart, navEnd] = this.navRange
    const showMonths = this.captionLayout === 'dropdown' || this.captionLayout === 'dropdown-months'
    const showYears = this.hasYearDropdown
    const monthLabel = (d: Date) => new Intl.DateTimeFormat(this.locale, { month: 'long' }).format(d)
    const monthOptions = Array.from({ length: 12 }, (_, i) => {
      const m = new Date(month.getFullYear(), i, 1)
      return {
        value: i,
        label: monthLabel(m),
        disabled: (!!navStart && m < startOfMonth(navStart)) || (!!navEnd && m > startOfMonth(navEnd)),
      }
    })
    const yearOptions =
      navStart && navEnd
        ? Array.from({ length: navEnd.getFullYear() - navStart.getFullYear() + 1 }, (_, i) => {
            const y = navStart.getFullYear() + i
            return { value: y, label: String(y), disabled: false }
          })
        : []
    const dropdown = (
      kind: 'months_dropdown' | 'years_dropdown',
      label: string,
      options: { value: number; label: string; disabled: boolean }[],
      value: number,
      onChange: (v: number) => void,
    ) => {
      const current = options.find((o) => o.value === value)
      return html`<span data-disabled=${String(this.disableNavigation)} class=${classNames.dropdown_root}>
        <select
          class=${[classNames.dropdown, classNames[kind]].join(' ')}
          aria-label=${label}
          ?disabled=${this.disableNavigation}
          .value=${String(value)}
          @change=${(e: Event) => onChange(Number((e.target as HTMLSelectElement).value))}
        >
          ${options.map(
            (o) => html`<option value=${o.value} ?disabled=${o.disabled} ?selected=${o.value === value}>${o.label}</option>`,
          )}
        </select>
        <span class=${classNames.caption_label} aria-hidden="true">${current?.label}${this.chevron('down')}</span>
      </span>`
    }
    const monthCtl = showMonths
      ? dropdown('months_dropdown', 'Choose the Month', monthOptions, month.getMonth(), (v) =>
          this.goToMonth(addMonths(new Date(month.getFullYear(), v, 1), -monthOffset)),
        )
      : html`<span>${monthLabel(month)}</span>`
    const yearCtl = showYears
      ? dropdown('years_dropdown', 'Choose the Year', yearOptions, month.getFullYear(), (v) =>
          this.goToMonth(addMonths(new Date(v, month.getMonth(), 1), -monthOffset)),
        )
      : html`<span>${month.getFullYear()}</span>`
    return html`<div class=${classNames.dropdowns}>
      ${isYearFirst(this.locale) ? [yearCtl, monthCtl] : [monthCtl, yearCtl]}
      <span role="status" aria-live="polite" class="sr-only">${caption}</span>
    </div>`
  }

  private renderDay(day: Day, target: Day | undefined) {
    const mods = this.modifiersOf(day)
    const interactive = this.mode !== undefined
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
      aria-label=${!interactive && !mods.hidden
        ? `${mods.today ? 'Today, ' : ''}${formatFull(day.date, this.locale)}`
        : nothing}
      data-day=${isoDate(day.date)}
      data-month=${day.outside ? isoMonth(day.date) : nothing}
      data-selected=${mods.selected ? 'true' : nothing}
      data-disabled=${mods.disabled ? 'true' : nothing}
      data-hidden=${mods.hidden ? 'true' : nothing}
      data-outside=${day.outside ? 'true' : nothing}
      data-focused=${mods.focused ? 'true' : nothing}
      data-today=${mods.today ? 'true' : nothing}
    >${mods.hidden
      ? nothing
      : interactive
        ? html`<button
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
          >${this.formatDay(day.date)}</button>`
        : this.formatDay(day.date)}</td>`
  }

  render() {
    const months = this.displayMonths
    const monthsWeeks = months.map((m) => this.weeksOf(m))
    const allDays = monthsWeeks.flat(2)
    const target = this.focusTarget(allDays)
    const prev = this.previousMonth
    const next = this.nextMonth
    const n = this.numberOfMonths || 1
    const ws = this.weekStart
    const weekdays = Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(this.todayDate, ws), i))

    return html`<div
      part="root"
      class=${cn(classNames.root, 'p-3')}
      lang=${this.locale}
      aria-label=${this.accessibleLabel ?? nothing}
      data-mode=${this.mode ?? nothing}
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
          >${this.chevron('left')}</button>
          <button
            type="button"
            class=${classNames.button_next}
            tabindex=${next ? nothing : -1}
            aria-disabled=${next ? nothing : 'true'}
            aria-label="Go to the Next Month"
            @click=${() => next && this.goToMonth(next)}
          >${this.chevron('right')}</button>
        </nav>
        ${months.map(
          (month, i) => html`<div class=${classNames.month}>
            <div class=${classNames.month_caption}>${this.renderCaption(month, i)}</div>
            <table
              role="grid"
              aria-multiselectable=${this.mode === 'multiple' || this.mode === 'range' ? 'true' : 'false'}
              aria-label=${this.formatCaption(month)}
              class=${classNames.month_grid}
            >
              <thead aria-hidden="true">
                <tr class=${classNames.weekdays}>
                  ${this.showWeekNumber
                    ? html`<th aria-label="Week Number" class=${classNames.week_number_header} scope="col">
                        ${this.formatters?.formatWeekNumberHeader?.() ?? ''}
                      </th>`
                    : nothing}
                  ${weekdays.map(
                    (w) => html`<th
                      aria-label=${w.toLocaleDateString(this.locale, { weekday: 'long' })}
                      class=${classNames.weekday}
                      scope="col"
                    >${this.formatWeekdayName(w)}</th>`,
                  )}
                </tr>
              </thead>
              <tbody class=${classNames.weeks}>
                ${monthsWeeks[i].map((week) => {
                  // RDP groups days into rows by week number; rows here are fixed
                  // 7-day chunks, so the number comes from the first day (identical
                  // unless week-starts-on differs from the locale default at a
                  // year boundary, where RDP would split the row).
                  const weekNumber = getWeekNumber(week[0]!.date, ws)
                  return html`<tr class=${classNames.week}>
                    ${this.showWeekNumber
                      ? html`<th scope="row" role="rowheader" aria-label=${`Week ${weekNumber}`} class=${classNames.week_number}
                          >${this.formatWeekNumber(weekNumber)}</th
                        >`
                      : nothing}
                    ${week.map((d) => this.renderDay(d, target))}
                  </tr>`
                })}
              </tbody>
            </table>
          </div>`,
        )}
      </div>
      ${this.footer != null || this.hasFooter || this.hasSlottedFooter
        ? html`<div
            part="footer"
            role="status"
            aria-live="polite"
            data-slot="calendar-footer"
            class=${classNames.footer}
          >
            <slot name="footer" @slotchange=${this.onFooterSlotChange}>${this.footer}</slot>
          </div>`
        : nothing}
    </div>`
  }

  private get hasSlottedFooter() {
    return [...this.children].some((c) => c.getAttribute('slot') === 'footer')
  }

  private onFooterSlotChange(e: Event) {
    this.hasFooter = (e.target as HTMLSlotElement)
      .assignedNodes()
      .some((n) => n.nodeType === 1 || n.textContent?.trim())
  }
}

customElements.get('uip-calendar') || customElements.define('uip-calendar', UipCalendar)

declare global {
  interface HTMLElementTagNameMap {
    'uip-calendar': UipCalendar
  }
}
