import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  TemplateRef,
  ViewContainerRef,
  booleanAttribute,
  inject,
  type EmbeddedViewRef,
} from '@angular/core'

/**
 * Angular port of the react-day-picker v10 engine the React registry's Calendar and
 * RangeCalendar wrap. Same DOM (root > months > nav + month > caption + grid), same
 * `classNames` keys and rdp-* defaults, same modifier order on each cell, same
 * data-* / aria attributes, same selection rules (single / multiple / range with
 * min / max / required / resetOnSelect / excludeDisabled), same navigation bounds
 * (startMonth / endMonth / captionLayout dropdowns) and the same roving-focus keyboard
 * model (arrows, Shift+arrows, PageUp/Down, Home/End). Native `Date` only.
 */

export type DateRange = { from: Date | undefined; to?: Date | undefined }
export type DateBefore = { before: Date }
export type DateAfter = { after: Date }
export type DateInterval = { before: Date; after: Date }
export type DayOfWeek = { dayOfWeek: number | number[] }
/** react-day-picker Matcher: which days a modifier (disabled, hidden, custom) applies to. */
export type Matcher =
  boolean | ((date: Date) => boolean) | Date | Date[] | DateRange | DateBefore | DateAfter | DateInterval | DayOfWeek

export type DayPickerMode = 'single' | 'multiple' | 'range'
export type CaptionLayout = 'label' | 'dropdown' | 'dropdown-months' | 'dropdown-years'
export type WeekStartsOn = 0 | 1 | 2 | 3 | 4 | 5 | 6
export type DayPickerSelected = Date | Date[] | DateRange | undefined

/** Day modifiers (flags + selection states + custom `modifiers` keys). */
export type Modifiers = Record<string, boolean>

export interface DayPickerLabels {
  labelNav: () => string
  labelPrevious: (month?: Date) => string
  labelNext: (month?: Date) => string
  labelMonthDropdown: () => string
  labelYearDropdown: () => string
  labelGrid: (month: Date, locale: string) => string
  labelGridcell: (date: Date, modifiers: Modifiers, locale: string) => string
  labelDayButton: (date: Date, modifiers: Modifiers, locale: string) => string
  labelWeekday: (date: Date, locale: string) => string
}

export interface DayPickerFormatters {
  formatCaption: (month: Date, locale: string) => string
  formatDay: (date: Date, locale: string) => string
  formatWeekdayName: (weekday: Date, locale: string) => string
  formatMonthDropdown: (month: Date, locale: string) => string
  formatYearDropdown: (year: Date, locale: string) => string
}

/** `locale` accepts a BCP 47 tag or a `{ code, labels? }` object (React passes date-fns locales). */
export type DayPickerLocale = string | { code: string; labels?: Partial<DayPickerLabels> }

/** Context for the `dayContent` template (React `components.DayButton` children). */
export interface DayContentContext {
  $implicit: Date
  date: Date
  modifiers: Modifiers
  label: string
}

export interface DayEvent<E extends Event = Event> {
  date: Date
  modifiers: Modifiers
  event: E
}

export type DayPickerClassNames = Record<string, string>

const UI_KEYS = [
  'root',
  'chevron',
  'day',
  'day_button',
  'caption_label',
  'dropdowns',
  'dropdown',
  'dropdown_root',
  'footer',
  'month_grid',
  'month_caption',
  'months_dropdown',
  'month',
  'months',
  'nav',
  'button_next',
  'button_previous',
  'week',
  'weeks',
  'weekday',
  'weekdays',
  'week_number',
  'week_number_header',
  'years_dropdown',
]
const DAY_FLAGS = ['focused', 'disabled', 'hidden', 'outside', 'today']
const SELECTION_STATES = ['range_end', 'range_middle', 'range_start', 'selected']

export function defaultClassNames(): DayPickerClassNames {
  const out: DayPickerClassNames = {}
  for (const k of [...UI_KEYS, ...DAY_FLAGS, ...SELECTION_STATES]) out[k] = `rdp-${k}`
  return out
}

// ---- native Date helpers (date-fns semantics, local time) ----

export const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
export const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1)
const endOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999)
const startOfYear = (d: Date) => new Date(d.getFullYear(), 0, 1)
const endOfYear = (d: Date) => new Date(d.getFullYear(), 11, 31, 23, 59, 59, 999)
export const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
export function addMonths(d: Date, n: number): Date {
  const target = new Date(d.getFullYear(), d.getMonth() + n, 1, d.getHours(), d.getMinutes(), d.getSeconds())
  const last = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate()
  target.setDate(Math.min(d.getDate(), last))
  return target
}
const addYears = (d: Date, n: number) => addMonths(d, n * 12)
function startOfWeek(d: Date, ws: number): Date {
  const day = d.getDay()
  const diff = (day < ws ? 7 : 0) + day - ws
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() - diff)
}
function endOfWeek(d: Date, ws: number): Date {
  const day = d.getDay()
  const diff = (day < ws ? -7 : 0) + 6 - (day - ws)
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + diff, 23, 59, 59, 999)
}
export function differenceInCalendarDays(a: Date, b: Date): number {
  return Math.round(
    (Date.UTC(a.getFullYear(), a.getMonth(), a.getDate()) - Date.UTC(b.getFullYear(), b.getMonth(), b.getDate())) /
      864e5,
  )
}
const differenceInCalendarMonths = (a: Date, b: Date) =>
  (a.getFullYear() - b.getFullYear()) * 12 + a.getMonth() - b.getMonth()
export const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
const isSameMonth = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
const pad = (n: number) => String(n).padStart(2, '0')
const isoDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const monthId = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}`
const isDate = (v: unknown): v is Date => v instanceof Date && !Number.isNaN(v.getTime())

export function rangeIncludesDate(range: DateRange, date: Date, excludeEnds = false): boolean {
  let { from, to } = range
  if (from && to) {
    if (differenceInCalendarDays(to, from) < 0) [from, to] = [to, from]
    const min = excludeEnds ? 1 : 0
    return differenceInCalendarDays(date, from) >= min && differenceInCalendarDays(to, date) >= min
  }
  if (!excludeEnds && to) return isSameDay(to, date)
  if (!excludeEnds && from) return isSameDay(from, date)
  return false
}

/** react-day-picker `dateMatchModifiers`. */
export function dateMatchModifiers(date: Date, matchers: Matcher | Matcher[]): boolean {
  const list: Matcher[] = Array.isArray(matchers) ? matchers : [matchers]
  return list.some((m) => {
    if (typeof m === 'boolean') return m
    if (isDate(m)) return isSameDay(date, m)
    if (Array.isArray(m)) return m.some((d) => isSameDay(date, d))
    if (typeof m === 'function') return m(date)
    if (typeof m !== 'object' || m === null) return false
    if ('from' in m) return rangeIncludesDate(m as DateRange, date, false)
    if ('dayOfWeek' in m) {
      const dow = (m as DayOfWeek).dayOfWeek
      return Array.isArray(dow) ? dow.includes(date.getDay()) : dow === date.getDay()
    }
    const hasBefore = 'before' in m
    const hasAfter = 'after' in m
    if (hasBefore && hasAfter) {
      const i = m as DateInterval
      const isDayBefore = differenceInCalendarDays(i.before, date) > 0
      const isDayAfter = differenceInCalendarDays(i.after, date) < 0
      return i.before > i.after ? isDayAfter && isDayBefore : isDayBefore || isDayAfter
    }
    if (hasAfter) return differenceInCalendarDays(date, (m as DateAfter).after) > 0
    if (hasBefore) return differenceInCalendarDays((m as DateBefore).before, date) > 0
    return false
  })
}

/** react-day-picker `addToRange`. */
export function addToRange(date: Date, initial: DateRange | undefined, min = 0, max = 0, required = false) {
  const { from, to } = initial || ({} as DateRange)
  let range: DateRange | undefined
  if (!from && !to) range = { from: date, to: min > 0 ? undefined : date }
  else if (from && !to) {
    if (isSameDay(from, date)) {
      if (min === 0) range = { from, to: date }
      else if (required) range = { from, to: undefined }
      else range = undefined
    } else if (date < from) range = { from: date, to: from }
    else range = { from, to: date }
  } else if (from && to) {
    if (isSameDay(from, date) && isSameDay(to, date)) range = required ? { from, to } : undefined
    else if (isSameDay(from, date)) range = { from, to: min > 0 ? undefined : date }
    else if (isSameDay(to, date)) range = { from: date, to: min > 0 ? undefined : date }
    else if (date < from) range = { from: date, to }
    else range = { from, to: date }
  }
  if (range?.from && range.to) {
    const diff = differenceInCalendarDays(range.to, range.from)
    if (max > 0 && diff > max) range = { from: date, to: undefined }
    else if (min > 1 && diff < min) range = { from: date, to: undefined }
  }
  return range
}

// ---- locale formatting (date-fns patterns rdp uses, via Intl) ----

const fmtCache = new Map<string, Intl.DateTimeFormat>()
function fmt(locale: string, opts: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const key = locale + JSON.stringify(opts)
  let f = fmtCache.get(key)
  if (!f) {
    f = new Intl.DateTimeFormat(locale, opts)
    fmtCache.set(key, f)
  }
  return f
}
/** Locales whose month/year caption reads year-first (DateLib.yearFirstLocales). */
const YEAR_FIRST = new Set([
  'eu',
  'hu',
  'ja',
  'ja-Hira',
  'ja-JP',
  'ko',
  'ko-KR',
  'lt',
  'lt-LT',
  'lv',
  'lv-LV',
  'mn',
  'mn-MN',
  'zh',
  'zh-CN',
  'zh-HK',
  'zh-TW',
])
const isEnglish = (locale: string) => /^en\b/i.test(locale)
const ordinal = (n: number) => {
  const s = n % 100
  if (s >= 11 && s <= 13) return `${n}th`
  const r = n % 10
  return `${n}${r === 1 ? 'st' : r === 2 ? 'nd' : r === 3 ? 'rd' : 'th'}`
}
/** date-fns `PPPP` (en: "Wednesday, September 23rd, 2026"). */
function formatFullDate(d: Date, locale: string): string {
  if (!isEnglish(locale)) return fmt(locale, { dateStyle: 'full' }).format(d)
  const weekday = fmt(locale, { weekday: 'long' }).format(d)
  const month = fmt(locale, { month: 'long' }).format(d)
  return `${weekday}, ${month} ${ordinal(d.getDate())}, ${d.getFullYear()}`
}
function formatMonthYear(d: Date, locale: string): string {
  if (YEAR_FIRST.has(locale)) return fmt(locale, { month: 'long', year: 'numeric' }).format(d)
  return `${fmt(locale, { month: 'long' }).format(d)} ${d.getFullYear()}`
}

export const defaultFormatters: DayPickerFormatters = {
  formatCaption: formatMonthYear,
  formatDay: (d) => String(d.getDate()),
  formatWeekdayName: (d, locale) => fmt(locale, { weekday: 'short' }).format(d).slice(0, 2),
  formatMonthDropdown: (d, locale) => fmt(locale, { month: 'long' }).format(d),
  formatYearDropdown: (d) => String(d.getFullYear()),
}

const EN_LABELS: DayPickerLabels = {
  labelNav: () => 'Navigation bar',
  labelPrevious: () => 'Go to the Previous Month',
  labelNext: () => 'Go to the Next Month',
  labelMonthDropdown: () => 'Choose the Month',
  labelYearDropdown: () => 'Choose the Year',
  labelGrid: (d, locale) => formatMonthYear(d, locale),
  labelGridcell: (d, m, locale) => `${m['today'] ? 'Today, ' : ''}${formatFullDate(d, locale)}`,
  labelDayButton: (d, m, locale) =>
    `${m['today'] ? 'Today, ' : ''}${formatFullDate(d, locale)}${m['selected'] ? ', selected' : ''}`,
  labelWeekday: (d, locale) => fmt(locale, { weekday: 'long' }).format(d),
}
const JA_LABELS: Partial<DayPickerLabels> = {
  labelNav: () => 'ナビゲーションバー',
  labelPrevious: () => '前の月へ',
  labelNext: () => '次の月へ',
  labelMonthDropdown: () => '月を選択',
  labelYearDropdown: () => '年を選択',
  labelGridcell: (d, m, locale) => `${m['today'] ? '今日、' : ''}${formatFullDate(d, locale)}`,
  labelDayButton: (d, m, locale) =>
    `${m['today'] ? '今日、' : ''}${formatFullDate(d, locale)}${m['selected'] ? '、選択済み' : ''}`,
}

interface CalDay {
  date: Date
  displayMonth: Date
  outside: boolean
}
const sameCalDay = (a: CalDay | undefined, b: CalDay) =>
  !!a && isSameDay(a.date, b.date) && isSameMonth(a.displayMonth, b.displayMonth)

export interface DayVM {
  key: string
  date: Date
  iso: string
  dataMonth: string | null
  cellClass: string
  modifiers: Modifiers
  label: string
  cellLabel: string | null
  buttonLabel: string
  tabIndex: number
  buttonDisabled: boolean
  buttonAriaDisabled: boolean
  ctx: DayContentContext
  day: CalDay
}
export interface DropdownVM {
  kind: 'month' | 'year'
  select: boolean
  label: string
  ariaLabel: string
  options: { value: number; label: string; disabled: boolean }[]
  value: number
}
export interface MonthVM {
  date: Date
  offset: number
  caption: string
  gridLabel: string
  weeks: { key: number; days: DayVM[] }[]
  controls: DropdownVM[]
}
export interface DayPickerVM {
  months: MonthVM[]
  weekdays: { key: number; label: string; name: string }[]
  previousMonth?: Date
  nextMonth?: Date
  labelNav: string
  labelPrevious: string
  labelNext: string
}

/** Renders the `dayContent` template with its context inside the day button. */
@Directive({ selector: '[uiDayContent]', standalone: true })
export class UiDayContentDirective implements OnChanges, OnDestroy {
  @Input('uiDayContent') template: TemplateRef<DayContentContext> | null = null
  @Input('uiDayContentContext') context!: DayContentContext
  private readonly vcr = inject(ViewContainerRef)
  private ref?: EmbeddedViewRef<DayContentContext>
  private tpl: TemplateRef<DayContentContext> | null = null

  ngOnChanges(): void {
    if (this.tpl !== this.template) {
      this.vcr.clear()
      this.ref = this.template ? this.vcr.createEmbeddedView(this.template, this.context) : undefined
      this.tpl = this.template
    } else if (this.ref) {
      Object.assign(this.ref.context, this.context)
      this.ref.markForCheck()
    }
  }

  ngOnDestroy(): void {
    this.vcr.clear()
  }
}

const CHEVRON_LEFT = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-left size-4 rdp-chevron" aria-hidden="true" [attr.disabled]="vm.previousMonth ? null : ''"><path d="m15 18-6-6 6-6" /></svg>`
const CHEVRON_RIGHT = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right size-4 rdp-chevron" aria-hidden="true" [attr.disabled]="vm.nextMonth ? null : ''"><path d="m9 18 6-6-6-6" /></svg>`

/** Shared template (Calendar + RangeCalendar), 1:1 with react-day-picker's DayPicker render. */
export const DAY_PICKER_TEMPLATE = `
  @let vm = view;
  <div [class]="cls['months']">
    @if (!hideNavigation) {
      <nav [class]="cls['nav']" [attr.aria-label]="vm.labelNav">
        <button
          type="button"
          [class]="cls['button_previous']"
          [attr.tabindex]="vm.previousMonth ? null : -1"
          [attr.aria-disabled]="vm.previousMonth ? null : 'true'"
          [attr.aria-label]="vm.labelPrevious"
          (click)="onPrevious()"
        >${CHEVRON_LEFT}</button>
        <button
          type="button"
          [class]="cls['button_next']"
          [attr.tabindex]="vm.nextMonth ? null : -1"
          [attr.aria-disabled]="vm.nextMonth ? null : 'true'"
          [attr.aria-label]="vm.labelNext"
          (click)="onNext()"
        >${CHEVRON_RIGHT}</button>
      </nav>
    }
    @for (m of vm.months; track m.offset) {
      <div [class]="cls['month']">
        <div [class]="cls['month_caption']">
          @if (isDropdownLayout) {
            <div [class]="cls['dropdowns']">
              @for (c of m.controls; track c.kind) {
                @if (c.select) {
                  <span data-disabled="false" [class]="cls['dropdown_root']">
                    <select
                      [class]="cls['dropdown'] + ' ' + cls[c.kind === 'month' ? 'months_dropdown' : 'years_dropdown']"
                      [attr.aria-label]="c.ariaLabel"
                      [disabled]="disableNavigation"
                      (change)="onDropdown(c.kind, m, $event)"
                    >
                      @for (o of c.options; track o.value) {
                        <option [value]="o.value" [disabled]="o.disabled" [selected]="o.value === c.value">{{ o.label }}</option>
                      }
                    </select>
                    <span [class]="cls['caption_label']" aria-hidden="true">{{ c.label }}<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right size-4 rdp-chevron" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg></span>
                  </span>
                } @else {
                  <span>{{ c.label }}</span>
                }
              }
              <span role="status" aria-live="polite" class="sr-only">{{ m.caption }}</span>
            </div>
          } @else {
            <span [class]="cls['caption_label']" role="status" aria-live="polite">{{ m.caption }}</span>
          }
        </div>
        <table role="grid" [attr.aria-multiselectable]="mode === 'multiple' || mode === 'range'" [attr.aria-label]="m.gridLabel || null" [class]="cls['month_grid']">
          @if (!hideWeekdays) {
            <thead aria-hidden="true">
              <tr [class]="cls['weekdays']">
                @for (w of vm.weekdays; track w.key) {
                  <th [attr.aria-label]="w.label" [class]="cls['weekday']" scope="col">{{ w.name }}</th>
                }
              </tr>
            </thead>
          }
          <tbody [class]="cls['weeks']">
            @for (week of m.weeks; track week.key) {
              <tr [class]="cls['week']">
                @for (d of week.days; track d.key) {
                  <td
                    [class]="d.cellClass"
                    role="gridcell"
                    [attr.aria-selected]="d.modifiers['selected'] || null"
                    [attr.aria-label]="d.cellLabel"
                    [attr.data-day]="d.iso"
                    [attr.data-month]="d.dataMonth"
                    [attr.data-selected]="d.modifiers['selected'] || null"
                    [attr.data-disabled]="d.modifiers['disabled'] || null"
                    [attr.data-hidden]="d.modifiers['hidden'] || null"
                    [attr.data-outside]="d.modifiers['outside'] || null"
                    [attr.data-focused]="d.modifiers['focused'] || null"
                    [attr.data-today]="d.modifiers['today'] || null"
                  >@if (!d.modifiers['hidden'] && interactive) {<button
                        [class]="cls['day_button']"
                        type="button"
                        [attr.tabindex]="d.tabIndex"
                        [disabled]="d.buttonDisabled"
                        [attr.aria-disabled]="d.buttonAriaDisabled || null"
                        [attr.aria-label]="d.buttonLabel"
                        (click)="onDayClick(d, $event)"
                        (focus)="onDayFocus(d, $event)"
                        (blur)="onDayBlur(d, $event)"
                        (keydown)="onDayKeyDown(d, $event)"
                        (mouseenter)="onDayMouseEnter(d, $event)"
                        (mouseleave)="onDayMouseLeave(d, $event)"
                      >@if (dayContent) {<ng-container [uiDayContent]="dayContent" [uiDayContentContext]="d.ctx" />} @else {{{ d.label }}}</button>} @else if (!d.modifiers['hidden']) {{{ d.label }}}</td>
                }
              </tr>
            }
          </tbody>
        </table>
      </div>
    }
  </div>
  @if (footer) {
    <div [class]="cls['footer']" role="status" aria-live="polite">{{ footer }}</div>
  }
`

/**
 * Shared react-day-picker state machine. Calendar and RangeCalendar extend it with their
 * class maps; inputs mirror DayPicker props (React names), outputs mirror its callbacks.
 */
@Directive()
export abstract class UiDayPickerBase implements OnChanges {
  private readonly cdr = inject(ChangeDetectorRef)
  protected readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement

  @Input() mode?: DayPickerMode
  /** Selected value: Date (single), Date[] (multiple) or { from, to } (range). Controlled when `select` is bound. */
  @Input() selected?: DayPickerSelected
  @Input({ transform: booleanAttribute }) required = false
  /** Minimum days (range) or dates (multiple) to select. */
  @Input() min?: number
  /** Maximum days (range) or dates (multiple) to select. */
  @Input() max?: number
  @Input({ transform: booleanAttribute }) excludeDisabled = false
  @Input({ transform: booleanAttribute }) resetOnSelect = false
  @Input() disabled?: Matcher | Matcher[]
  @Input() hidden?: Matcher | Matcher[]
  @Input() modifiers?: Record<string, Matcher | Matcher[]>
  @Input() modifiersClassNames?: Record<string, string>
  /** Controlled first displayed month (pair with `monthChange`). */
  @Input() month?: Date
  @Input() defaultMonth?: Date
  @Input() startMonth?: Date
  @Input() endMonth?: Date
  @Input() numberOfMonths = 1
  @Input({ transform: booleanAttribute }) pagedNavigation = false
  @Input({ transform: booleanAttribute }) reverseMonths = false
  @Input({ transform: booleanAttribute }) disableNavigation = false
  @Input({ transform: booleanAttribute }) hideNavigation = false
  @Input({ transform: booleanAttribute }) hideWeekdays = false
  @Input() captionLayout: CaptionLayout = 'label'
  @Input({ transform: booleanAttribute }) reverseYears = false
  @Input({ transform: booleanAttribute }) fixedWeeks = false
  @Input({ transform: booleanAttribute }) showOutsideDays = false
  @Input() weekStartsOn?: WeekStartsOn
  @Input() locale?: DayPickerLocale
  @Input() today?: Date
  @Input({ transform: booleanAttribute }) autoFocus = false
  @Input() dir?: 'ltr' | 'rtl'
  @Input() lang?: string
  @Input() footer?: string
  @Input() classNames?: DayPickerClassNames
  @Input() formatters?: Partial<DayPickerFormatters>
  @Input() labels?: Partial<DayPickerLabels>
  /** Day button content (React `components.DayButton` children). Context: `$implicit` = the date. */
  @Input() dayContent?: TemplateRef<DayContentContext> | null
  @Input('class') className?: string

  /** React `onSelect`: the new selection (the value React passes first). */
  @Output() readonly select = new EventEmitter<DayPickerSelected>()
  @Output() readonly monthChange = new EventEmitter<Date>()
  @Output() readonly prevClick = new EventEmitter<Date>()
  @Output() readonly nextClick = new EventEmitter<Date>()
  @Output() readonly dayClick = new EventEmitter<DayEvent<MouseEvent>>()
  @Output() readonly dayFocus = new EventEmitter<DayEvent<FocusEvent>>()
  @Output() readonly dayBlur = new EventEmitter<DayEvent<FocusEvent>>()
  @Output() readonly dayKeyDown = new EventEmitter<DayEvent<KeyboardEvent>>()
  @Output() readonly dayMouseEnter = new EventEmitter<DayEvent<MouseEvent>>()
  @Output() readonly dayMouseLeave = new EventEmitter<DayEvent<MouseEvent>>()

  /** Uncontrolled first month (null until first render). */
  private internalMonth: Date | null = null
  private internalSelected: DayPickerSelected = undefined
  private initialized = false
  private focusedDay?: CalDay
  private lastFocused?: CalDay
  private cache?: DayPickerVM
  private days: CalDay[] = []

  /** Component-level class map (Calendar / RangeCalendar), merged under `classNames`. */
  protected abstract componentClassNames(): DayPickerClassNames
  /** Component-level formatter overrides (both wrappers emit narrow weekday names). */
  protected componentFormatters(): Partial<DayPickerFormatters> {
    return {}
  }
  protected abstract readonly slot: string

  private clsCache?: DayPickerClassNames

  get cls(): DayPickerClassNames {
    return (this.clsCache ??= { ...defaultClassNames(), ...this.componentClassNames() })
  }

  get localeCode(): string {
    const l = this.locale
    if (!l) return 'en-US'
    return typeof l === 'string' ? l : l.code
  }

  get ws(): number {
    return this.weekStartsOn ?? 0
  }

  get isDropdownLayout(): boolean {
    return this.captionLayout.startsWith('dropdown')
  }

  get interactive(): boolean {
    return this.mode !== undefined || this.dayClick.observed
  }

  get isControlled(): boolean {
    return this.select.observed
  }

  get currentSelected(): DayPickerSelected {
    return this.isControlled ? this.selected : this.internalSelected
  }

  get todayDate(): Date {
    return this.today ?? new Date()
  }

  get fmts(): DayPickerFormatters {
    return { ...defaultFormatters, ...this.componentFormatters(), ...this.formatters }
  }

  get lbls(): DayPickerLabels {
    const l = this.locale
    const localeLabels = typeof l === 'object' ? l.labels : /^ja\b/.test(this.localeCode) ? JA_LABELS : undefined
    return { ...EN_LABELS, ...localeLabels, ...this.labels }
  }

  ngOnChanges(): void {
    if (!this.initialized) {
      this.initialized = true
      this.internalSelected = this.selected
      if (this.autoFocus) queueMicrotask(() => this.focusTarget())
    }
    this.invalidate()
  }

  /** Nav bounds: startMonth / endMonth, or ±100 years when a year dropdown is shown. */
  get navMonths(): [Date | undefined, Date | undefined] {
    const hasYearDropdown = this.captionLayout === 'dropdown' || this.captionLayout === 'dropdown-years'
    let start = this.startMonth ? startOfMonth(this.startMonth) : undefined
    let end = this.endMonth ? endOfMonth(this.endMonth) : undefined
    if (!start && hasYearDropdown) start = startOfYear(addYears(this.todayDate, -100))
    if (!end && hasYearDropdown) end = endOfYear(this.todayDate)
    return [start && startOfDay(start), end && startOfDay(end)]
  }

  private initialMonth(navStart?: Date, navEnd?: Date): Date {
    let initial = this.month || this.defaultMonth || this.todayDate
    const n = this.numberOfMonths || 1
    if (navEnd && differenceInCalendarMonths(navEnd, initial) < n - 1) initial = addMonths(navEnd, -1 * (n - 1))
    if (navStart && differenceInCalendarMonths(initial, navStart) < 0) initial = navStart
    return startOfMonth(initial)
  }

  get firstMonth(): Date {
    const [navStart, navEnd] = this.navMonths
    if (this.month) return this.initialMonth(navStart, navEnd)
    this.internalMonth ??= this.initialMonth(navStart, navEnd)
    return this.internalMonth
  }

  protected invalidate(): void {
    this.cache = undefined
    this.clsCache = undefined
    this.cdr.markForCheck()
  }

  get view(): DayPickerVM {
    return (this.cache ??= this.build())
  }

  // ---- selection ----

  isSelected(date: Date): boolean {
    const sel = this.currentSelected
    if (!sel) return false
    if (this.mode === 'single') return sel instanceof Date && isSameDay(sel, date)
    if (this.mode === 'multiple') return Array.isArray(sel) && sel.some((d) => isSameDay(d, date))
    if (this.mode === 'range')
      return !(sel instanceof Date) && !Array.isArray(sel) && rangeIncludesDate(sel, date, false)
    return false
  }

  private selectDate(date: Date): DayPickerSelected {
    const sel = this.currentSelected
    let next: DayPickerSelected
    if (this.mode === 'single') {
      const cur = sel instanceof Date ? sel : undefined
      next = !this.required && cur && isSameDay(date, cur) ? undefined : date
    } else if (this.mode === 'multiple') {
      const cur = Array.isArray(sel) ? sel : undefined
      if (this.isSelected(date)) {
        if (cur?.length === this.min) return sel
        if (this.required && cur?.length === 1) return sel
        next = cur?.filter((d) => !isSameDay(d, date))
      } else {
        next = cur?.length === this.max ? [date] : [...(cur ?? []), date]
      }
    } else if (this.mode === 'range') {
      const cur = sel && !(sel instanceof Date) && !Array.isArray(sel) ? sel : undefined
      const full = !!cur?.from && !!cur?.to
      const singleDayClick = !!cur?.from && !!cur?.to && isSameDay(cur.from, cur.to) && isSameDay(date, cur.from)
      let range: DateRange | undefined
      if (this.resetOnSelect && (full || !cur?.from))
        range = !this.required && singleDayClick ? undefined : { from: date, to: undefined }
      else range = addToRange(date, cur, this.min, this.max, this.required)
      if (this.excludeDisabled && this.disabled && range?.from && range.to) {
        for (let d = startOfDay(range.from); d <= range.to; d = addDays(d, 1)) {
          if (dateMatchModifiers(d, this.disabled)) {
            range = { from: date, to: undefined }
            break
          }
        }
      }
      next = range
    } else return sel
    if (!this.isControlled) this.internalSelected = next
    this.select.emit(next)
    return next
  }

  // ---- navigation ----

  goToMonth(date: Date): void {
    if (this.disableNavigation) return
    const [navStart, navEnd] = this.navMonths
    let m = startOfMonth(date)
    if (navStart && m < startOfMonth(navStart)) m = startOfMonth(navStart)
    if (navEnd && m > startOfMonth(navEnd)) m = startOfMonth(navEnd)
    this.internalMonth = m
    this.monthChange.emit(m)
    this.invalidate()
  }

  onPrevious(): void {
    const prev = this.view.previousMonth
    if (!prev) return
    this.goToMonth(prev)
    this.prevClick.emit(prev)
  }

  onNext(): void {
    const next = this.view.nextMonth
    if (!next) return
    this.goToMonth(next)
    this.nextClick.emit(next)
  }

  onDropdown(kind: 'month' | 'year', m: MonthVM, e: Event): void {
    const v = Number((e.target as HTMLSelectElement).value)
    const base = startOfMonth(m.date)
    const target = kind === 'month' ? new Date(base.getFullYear(), v, 1) : new Date(v, base.getMonth(), 1)
    this.goToMonth(addMonths(target, -m.offset))
  }

  // ---- day events ----

  onDayClick(d: DayVM, e: MouseEvent): void {
    e.preventDefault()
    e.stopPropagation()
    this.focusedDay = d.day
    this.invalidate()
    if (d.modifiers['disabled']) return
    this.selectDate(d.date)
    this.dayClick.emit({ date: d.date, modifiers: d.modifiers, event: e })
  }

  onDayFocus(d: DayVM, e: FocusEvent): void {
    this.focusedDay = d.day
    this.invalidate()
    this.dayFocus.emit({ date: d.date, modifiers: d.modifiers, event: e })
  }

  onDayBlur(d: DayVM, e: FocusEvent): void {
    this.lastFocused = this.focusedDay
    this.focusedDay = undefined
    this.invalidate()
    this.dayBlur.emit({ date: d.date, modifiers: d.modifiers, event: e })
  }

  onDayMouseEnter(d: DayVM, e: MouseEvent): void {
    this.dayMouseEnter.emit({ date: d.date, modifiers: d.modifiers, event: e })
  }

  onDayMouseLeave(d: DayVM, e: MouseEvent): void {
    this.dayMouseLeave.emit({ date: d.date, modifiers: d.modifiers, event: e })
  }

  onDayKeyDown(d: DayVM, e: KeyboardEvent): void {
    const rtl = this.dir === 'rtl'
    const map: Record<string, [string, 'before' | 'after']> = {
      ArrowLeft: [e.shiftKey ? 'month' : 'day', rtl ? 'after' : 'before'],
      ArrowRight: [e.shiftKey ? 'month' : 'day', rtl ? 'before' : 'after'],
      ArrowDown: [e.shiftKey ? 'year' : 'week', 'after'],
      ArrowUp: [e.shiftKey ? 'year' : 'week', 'before'],
      PageUp: [e.shiftKey ? 'year' : 'month', 'before'],
      PageDown: [e.shiftKey ? 'year' : 'month', 'after'],
      Home: ['startOfWeek', 'before'],
      End: ['endOfWeek', 'after'],
    }
    const move = map[e.key]
    if (move) {
      e.preventDefault()
      e.stopPropagation()
      this.moveFocus(move[0], move[1])
    }
    this.dayKeyDown.emit({ date: d.date, modifiers: d.modifiers, event: e })
  }

  private moveFocus(moveBy: string, dir: 'before' | 'after'): void {
    if (!this.focusedDay) return
    const [navStart, navEnd] = this.navMonths
    let ref = this.focusedDay.date
    let next: Date | undefined
    for (let attempt = 0; attempt <= 365; attempt++) {
      const n = dir === 'after' ? 1 : -1
      let d: Date
      if (moveBy === 'day') d = addDays(ref, n)
      else if (moveBy === 'week') d = addDays(ref, 7 * n)
      else if (moveBy === 'month') d = addMonths(ref, n)
      else if (moveBy === 'year') d = addYears(ref, n)
      else if (moveBy === 'startOfWeek') d = startOfWeek(ref, this.ws)
      else d = startOfDay(endOfWeek(ref, this.ws))
      if (dir === 'before' && navStart && d < navStart) d = navStart
      else if (dir === 'after' && navEnd && d > navEnd) d = navEnd
      const blocked =
        (this.disabled !== undefined && dateMatchModifiers(d, this.disabled)) ||
        (this.hidden !== undefined && dateMatchModifiers(d, this.hidden))
      if (!blocked) {
        next = d
        break
      }
      ref = d
    }
    if (!next) return
    const target: CalDay = { date: next, displayMonth: next, outside: false }
    const inCalendar = this.days.some((day) => sameCalDay(day, target))
    if (this.disableNavigation && !inCalendar) return
    if (!inCalendar) this.goToMonth(next)
    this.focusedDay = target
    this.invalidate()
    this.cdr.detectChanges()
    this.focusDomDay(target)
  }

  private focusDomDay(day: CalDay): void {
    const btn = this.host.querySelector<HTMLButtonElement>(
      `td[data-day="${isoDate(day.date)}"]:not([data-outside]) > button`,
    )
    btn?.focus()
  }

  /** autoFocus: focus the focus-target day button (DayButton effect in React). */
  private focusTarget(): void {
    const btn = this.host.querySelector<HTMLButtonElement>('td > button[tabindex="0"]')
    btn?.focus()
  }

  // ---- view model ----

  private build(): DayPickerVM {
    const locale = this.localeCode
    const ws = this.ws
    const f = this.fmts
    const l = this.lbls
    const cls = this.cls
    const today = this.todayDate
    const [navStart, navEnd] = this.navMonths
    const first = this.firstMonth
    const n = this.numberOfMonths || 1

    const displayMonths: Date[] = []
    for (let i = 0; i < n; i++) {
      const m = addMonths(first, i)
      if (navEnd && m > navEnd) break
      displayMonths.push(m)
    }
    const lastMonth = displayMonths[displayMonths.length - 1]!
    const startWeekFirst = startOfWeek(first, ws)
    const displayWeekEnd = endOfWeek(endOfMonth(lastMonth), ws)
    const maxDate = this.endMonth ? endOfMonth(this.endMonth) : undefined
    const constraintEnd = maxDate && endOfWeek(maxDate, ws)
    const gridEnd = constraintEnd && displayWeekEnd > constraintEnd ? constraintEnd : displayWeekEnd
    const nDays = differenceInCalendarDays(gridEnd, startWeekFirst)
    const dates: Date[] = []
    for (let i = 0; i <= nDays; i++) dates.push(addDays(startWeekFirst, i))
    const extra = 42 * (differenceInCalendarMonths(lastMonth, first) + 1)
    if (this.fixedWeeks && dates.length < extra) {
      const add = extra - dates.length
      for (let i = 0; i < add; i++) dates.push(addDays(dates[dates.length - 1]!, 1))
    }

    const monthDays = displayMonths.map((month) => {
      const firstOfWeek = startOfWeek(month, ws)
      const lastOfWeek = endOfWeek(endOfMonth(month), ws)
      const md = dates.filter((d) => d >= firstOfWeek && d <= lastOfWeek)
      if (this.fixedWeeks && md.length < 42) {
        const add = 42 - md.length
        const limit = addDays(lastOfWeek, add)
        md.push(...dates.filter((d) => d > lastOfWeek && d <= limit))
      }
      return md.map<CalDay>((date) => ({ date, displayMonth: month, outside: !isSameMonth(date, month) }))
    })
    if (this.reverseMonths) {
      displayMonths.reverse()
      monthDays.reverse()
    }
    this.days = monthDays.flat()

    const navStartDay = navStart && startOfMonth(navStart)
    const navEndDay = navEnd && endOfMonth(navEnd)
    const sel = this.currentSelected
    const range = this.mode === 'range' && sel && !(sel instanceof Date) && !Array.isArray(sel) ? sel : undefined
    const flags = (day: CalDay): Modifiers => {
      const { date } = day
      const hidden =
        (this.hidden !== undefined && dateMatchModifiers(date, this.hidden)) ||
        (!!navStartDay && date < navStartDay) ||
        (!!navEndDay && date > navEndDay) ||
        (!this.showOutsideDays && day.outside)
      const mods: Modifiers = {
        focused: false,
        disabled: this.disabled !== undefined && dateMatchModifiers(date, this.disabled),
        hidden,
        outside: day.outside,
        today: isSameDay(date, today),
      }
      for (const [name, matcher] of Object.entries(this.modifiers ?? {})) {
        if (matcher !== undefined && dateMatchModifiers(date, matcher)) mods[name] = true
      }
      return mods
    }

    // Focus target: last focused > selected > today > first focusable (calculateFocusTarget).
    let focusTarget: CalDay | undefined
    let priority = -1
    const focusable = (m: Modifiers) => !m['disabled'] && !m['hidden'] && !m['outside']
    const flagsFor = new Map<CalDay, Modifiers>()
    for (const day of this.days) {
      const m = flags(day)
      flagsFor.set(day, m)
      if (!focusable(m)) continue
      if (sameCalDay(this.lastFocused, day) && priority < 2) {
        focusTarget = day
        priority = 2
      } else if (this.isSelected(day.date) && priority < 1) {
        focusTarget = day
        priority = 1
      } else if (m['today'] && priority < 0) {
        focusTarget = day
        priority = 0
      }
    }
    focusTarget ??= this.days.find((d) => focusable(flagsFor.get(d)!))

    const dayVM = (day: CalDay): DayVM => {
      const mods: Modifiers = { ...flagsFor.get(day)! }
      mods['focused'] = !mods['hidden'] && sameCalDay(this.focusedDay, day)
      mods['selected'] = this.isSelected(day.date) || !!mods['selected']
      if (range) {
        const { from, to } = range
        mods['range_start'] = !!(from && to && isSameDay(day.date, from))
        mods['range_end'] = !!(from && to && isSameDay(day.date, to))
        mods['range_middle'] = rangeIncludesDate(range, day.date, true)
      }
      const classes = [cls['day']]
      for (const [key, active] of Object.entries(mods)) {
        if (active !== true) continue
        const c =
          this.modifiersClassNames?.[key] ??
          (DAY_FLAGS.includes(key) || SELECTION_STATES.includes(key) ? cls[key] : undefined)
        if (c) classes.push(c)
      }
      const label = f.formatDay(day.date, locale)
      const iso = isoDate(day.date)
      return {
        key: `${iso}_${monthId(day.displayMonth)}`,
        date: day.date,
        iso,
        dataMonth: day.outside ? monthId(day.date) : null,
        cellClass: classes.join(' '),
        modifiers: mods,
        label,
        cellLabel: !this.interactive && !mods['hidden'] ? l.labelGridcell(day.date, mods, locale) : null,
        buttonLabel: l.labelDayButton(day.date, mods, locale),
        tabIndex: sameCalDay(focusTarget, day) ? 0 : -1,
        buttonDisabled: !mods['focused'] && !!mods['disabled'],
        buttonAriaDisabled: !!mods['focused'] && !!mods['disabled'],
        ctx: { $implicit: day.date, date: day.date, modifiers: mods, label },
        day,
      }
    }

    const yearFirst = YEAR_FIRST.has(locale)
    const months: MonthVM[] = displayMonths.map((month, displayIndex) => {
      const offset = this.reverseMonths ? displayMonths.length - 1 - displayIndex : displayIndex
      const cal = monthDays[displayIndex]!
      const weeks: MonthVM['weeks'] = []
      for (let i = 0; i < cal.length; i += 7) weeks.push({ key: i, days: cal.slice(i, i + 7).map(dayVM) })
      const controls: DropdownVM[] = []
      if (this.isDropdownLayout) {
        const monthSelect = this.captionLayout === 'dropdown' || this.captionLayout === 'dropdown-months'
        const yearSelect = this.captionLayout === 'dropdown' || this.captionLayout === 'dropdown-years'
        const monthOptions = Array.from({ length: 12 }, (_, i) => {
          const m = new Date(month.getFullYear(), i, 1)
          return {
            value: i,
            label: f.formatMonthDropdown(m, locale),
            disabled: (!!navStart && m < startOfMonth(navStart)) || (!!navEnd && m > startOfMonth(navEnd)),
          }
        })
        const yearOptions: DropdownVM['options'] = []
        if (navStart && navEnd) {
          for (let y = navStart.getFullYear(); y <= navEnd.getFullYear(); y++) {
            yearOptions.push({ value: y, label: f.formatYearDropdown(new Date(y, 0, 1), locale), disabled: false })
          }
          if (this.reverseYears) yearOptions.reverse()
        }
        const monthCtl: DropdownVM = {
          kind: 'month',
          select: monthSelect,
          label: f.formatMonthDropdown(month, locale),
          ariaLabel: l.labelMonthDropdown(),
          options: monthOptions,
          value: month.getMonth(),
        }
        const yearCtl: DropdownVM = {
          kind: 'year',
          select: yearSelect,
          label: yearSelect
            ? (yearOptions.find((o) => o.value === month.getFullYear())?.label ?? '')
            : f.formatYearDropdown(month, locale),
          ariaLabel: l.labelYearDropdown(),
          options: yearOptions,
          value: month.getFullYear(),
        }
        controls.push(...(yearFirst ? [yearCtl, monthCtl] : [monthCtl, yearCtl]))
      }
      return {
        date: month,
        offset,
        caption: f.formatCaption(month, locale),
        gridLabel: l.labelGrid(month, locale),
        weeks,
        controls,
      }
    })

    const weekStart = startOfWeek(today, ws)
    const weekdays = Array.from({ length: 7 }, (_, i) => {
      const d = addDays(weekStart, i)
      return { key: d.getDay(), label: l.labelWeekday(d, locale), name: f.formatWeekdayName(d, locale) }
    })

    const offset = this.pagedNavigation ? n : 1
    const firstStart = startOfMonth(first)
    let previousMonth: Date | undefined
    let nextMonth: Date | undefined
    if (!this.disableNavigation) {
      previousMonth =
        !navStart || differenceInCalendarMonths(firstStart, navStart) > 0 ? addMonths(firstStart, -offset) : undefined
      nextMonth = !navEnd || differenceInCalendarMonths(navEnd, first) >= n ? addMonths(firstStart, offset) : undefined
    }

    return {
      months,
      weekdays,
      previousMonth,
      nextMonth,
      labelNav: l.labelNav(),
      labelPrevious: l.labelPrevious(previousMonth),
      labelNext: l.labelNext(nextMonth),
    }
  }

  /** Host attributes (Root). */
  get dataMultipleMonths(): string | null {
    return this.numberOfMonths > 1 ? 'true' : null
  }
}

/** Narrow weekday names, locale-aware (both registry wrappers override rdp's two-letter default). */
export const narrowWeekday = (weekday: Date, locale: string) => fmt(locale, { weekday: 'narrow' }).format(weekday)
