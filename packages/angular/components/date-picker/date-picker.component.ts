import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  booleanAttribute,
  forwardRef,
  inject,
  numberAttribute,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core'
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms'
import { cn } from '@/lib/utils'
import { buttonVariants, type ButtonSize } from '@/ui/button/button.component'
import { UiCalendarComponent } from '@/ui/calendar/calendar.component'
import type { CaptionLayout, DateRange, DayContentContext, DayPickerSelected, Matcher } from '@/ui/calendar/day-picker'
import {
  UiPopoverComponent,
  UiPopoverContentComponent,
  type PopoverAlign,
  type PopoverSide,
} from '@/ui/popover/popover.component'
import { UiRangeCalendarComponent } from '@/ui/range-calendar/range-calendar.component'
import { UiTimeColumnsComponent } from '@/ui/time-picker/time-picker.component'
import {
  coerceDate,
  coerceShape,
  defaultRangePresets,
  fmtDate,
  fmtMonth,
  fmtTime,
  parseTimeShape,
  stripTime,
  toISODate,
  toISODateTime,
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

export type DatePickerValue = SingleValue | MultipleValue | RangeValue
type InternalValue = InternalSingle | InternalMultiple | InternalRange | undefined

const QUARTER_LABELS = ['Q1', 'Q2', 'Q3', 'Q4']
const QUARTER_MONTHS = [1, 4, 7, 10] as const

const compareDates = (a: Date, b: Date) => stripTime(a).getTime() - stripTime(b).getTime()
const fmtDateTime = (d: Date, locale: string, format: FormatValue, showSeconds: boolean, use24Hour: boolean) =>
  `${fmtDate(d, locale, format)} ${fmtTime(d, showSeconds, use24Hour)}`.trim()
const quarterStart = (year: number, q: number) => new Date(year, QUARTER_MONTHS[q]! - 1, 1)
const weekAnchorForMonth = (year: number, month: number, ws: number) => weekStart(new Date(year, month - 1, 1), ws)
const pad = (n: number) => String(n).padStart(2, '0')

function layoutToCaptionLayout(layout: DatePickerLayout): CaptionLayout {
  if (layout === 'month-and-year') return 'dropdown'
  if (layout === 'month-only') return 'dropdown-months'
  if (layout === 'year-only') return 'dropdown-years'
  return 'label'
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

const PLACEMENT: Record<DatePickerPlacement, { side: PopoverSide; align: PopoverAlign }> = {
  top: { side: 'top', align: 'center' },
  bottom: { side: 'bottom', align: 'center' },
  left: { side: 'left', align: 'center' },
  right: { side: 'right', align: 'center' },
  topLeft: { side: 'top', align: 'start' },
  topRight: { side: 'top', align: 'end' },
  bottomLeft: { side: 'bottom', align: 'start' },
  bottomRight: { side: 'bottom', align: 'end' },
}

const NAV_BTN =
  'border-input hover:bg-accent focus-visible:ring-ring inline-flex size-7 items-center justify-center rounded-md border bg-transparent transition-colors focus-visible:ring-1 focus-visible:outline-none'
const CAL_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar size-4" aria-hidden="true"><path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /></svg>`
const X_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x size-3.5" aria-hidden="true"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>`
const LEFT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-left text-muted-foreground size-4" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>`
const RIGHT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right text-muted-foreground size-4" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>`
const CELL_TAIL =
  'transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-30 disabled:hover:bg-transparent'
const ACTIVE = 'bg-primary text-primary-foreground hover:bg-primary'

/**
 * Angular port of the UIPKGE React DatePicker. Put it on a button
 * (`<button ui-date-picker>`): the host IS the outline trigger Button (React renders
 * PopoverTrigger asChild > Button) with the calendar icon, the formatted value /
 * placeholder and a clear control; the popover holds Calendar / RangeCalendar (single,
 * multiple, range), week / month / quarter / year grids, presets, the time pane, the
 * "Today" shortcut and the confirm footer. Same props, defaults and class strings as
 * React; `value` / `defaultValue` / `valueChange` emit ISO strings (`YYYY-MM-DD`, or
 * `YYYY-MM-DDTHH:mm[:ss]` with `showTime`). Also a ControlValueAccessor.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'button[ui-date-picker]',
  standalone: true,
  imports: [
    UiPopoverComponent,
    UiPopoverContentComponent,
    UiCalendarComponent,
    UiRangeCalendarComponent,
    UiTimeColumnsComponent,
  ],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiDatePickerComponent), multi: true }],
  host: {
    type: 'button',
    '[class]': 'hostClass',
    '[disabled]': 'isDisabled',
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"date-picker"',
    '[attr.data-variant]': '"outline"',
    '[attr.data-size]': 'buttonSize',
    '[attr.aria-haspopup]': '"dialog"',
    '[attr.aria-expanded]': 'open()',
    '[attr.aria-controls]': 'open() ? (popover?.contentId ?? null) : null',
    '[attr.data-state]': 'open() ? "open" : "closed"',
    '(click)': 'toggle()',
  },
  template: `
    ${CAL_SVG}<span class="flex-1 truncate">{{ display || placeholder }}</span>
    @if (clearable && hasValue && !isDisabled && !readOnly) {
      <span
        role="button"
        tabindex="0"
        class="text-muted-foreground hover:text-foreground focus-visible:ring-ring -mr-1 inline-flex size-9 cursor-pointer items-center justify-center rounded transition-colors focus-visible:ring-2 focus-visible:outline-none"
        aria-label="Clear date"
        (click)="$event.stopPropagation(); clear($event)"
        (keydown)="onClearKeyDown($event)"
        >${X_SVG}</span
      >
    }
    <ui-popover [open]="open()" (openChange)="setOpen($event)">
      <ui-popover-content class="w-auto p-0" [side]="popoverPlacement.side" [align]="popoverPlacement.align">
        @if (showCurrentDate && type === 'single' && (picker === 'day' || picker === 'week')) {
          <div class="flex justify-end border-b px-3 py-2">
            <button
              type="button"
              class="text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded px-2 py-1.5 text-xs focus-visible:ring-2 focus-visible:outline-none"
              (click)="pickToday()"
            >
              Today
            </button>
          </div>
        }
        @if (showAlternatePicker) {
          <div class="w-[260px] p-3" data-uipkge="" data-slot="month-year-picker">
            <div class="mb-3 flex items-center justify-between">
              <button type="button" class="${NAV_BTN}" aria-label="Previous" (click)="shiftAnchor(-1)">
                ${LEFT_SVG}
              </button>
              <span class="text-sm font-medium">{{ monthYearLabel }}</span>
              <button type="button" class="${NAV_BTN}" aria-label="Next" (click)="shiftAnchor(1)">${RIGHT_SVG}</button>
            </div>
            @if (picker === 'week') {
              <div class="flex flex-col gap-1">
                @for (week of weekGrid; track $index) {
                  <button
                    type="button"
                    data-uipkge=""
                    data-slot="week-picker-cell"
                    [attr.data-active]="isWeekSelected(week.start) || null"
                    [disabled]="isWeekDisabled(week.start)"
                    [attr.aria-pressed]="isWeekSelected(week.start)"
                    [attr.aria-disabled]="isWeekDisabled(week.start) || null"
                    [class]="weekCellClass(week.start)"
                    (click)="pickWeek(week.start)"
                  >
                    <span class="font-medium">Week {{ week.weekNum }}</span
                    ><span [class]="weekRangeClass(week.start)"
                      >{{ week.start.getDate() }} {{ shortMonth(week.start) }} – {{ week.end.getDate() }}
                      {{ shortMonth(week.end) }}</span
                    >
                  </button>
                }
              </div>
            }
            @if (picker === 'quarter') {
              <div class="grid grid-cols-2 gap-2">
                @for (label of quarterLabels; track $index; let q = $index) {
                  <button
                    type="button"
                    data-uipkge=""
                    data-slot="quarter-picker-cell"
                    [attr.data-active]="isQuarterSelected(q) || null"
                    [disabled]="isQuarterDisabled(q)"
                    [attr.aria-pressed]="isQuarterSelected(q)"
                    [attr.aria-disabled]="isQuarterDisabled(q) || null"
                    [class]="cellClass('rounded px-4 py-6 text-sm font-medium', isQuarterSelected(q))"
                    (click)="pickQuarter(q)"
                  >
                    {{ label }}
                  </button>
                }
              </div>
            }
            @if (picker === 'month') {
              <div class="grid grid-cols-3 gap-2">
                @for (label of monthLabels; track $index; let m = $index) {
                  <button
                    type="button"
                    data-uipkge=""
                    data-slot="month-picker-cell"
                    [attr.data-active]="isMonthSelected(m) || null"
                    [disabled]="isMonthDisabled(m)"
                    [attr.aria-pressed]="isMonthSelected(m)"
                    [attr.aria-disabled]="isMonthDisabled(m) || null"
                    [class]="cellClass('rounded px-2 py-2 text-sm', isMonthSelected(m))"
                    (click)="pickMonth(m)"
                  >
                    {{ label }}
                  </button>
                }
              </div>
            }
            @if (picker === 'year') {
              <div class="grid grid-cols-3 gap-2">
                @for (y of yearGrid; track y) {
                  <button
                    type="button"
                    data-uipkge=""
                    data-slot="year-picker-cell"
                    [attr.data-active]="isYearSelected(y) || null"
                    [disabled]="isYearDisabled(y)"
                    [attr.aria-pressed]="isYearSelected(y)"
                    [attr.aria-disabled]="isYearDisabled(y) || null"
                    [class]="cellClass('rounded px-2 py-2 text-sm tabular-nums', isYearSelected(y))"
                    (click)="pickYear(y)"
                  >
                    {{ y }}
                  </button>
                }
              </div>
            }
          </div>
        } @else {
          <div class="flex">
            @if (presetGroups.length > 0) {
              <aside class="flex w-40 flex-col gap-1 border-r p-2">
                @for (group of presetGroups; track $index) {
                  @if (group.category) {
                    <div class="text-muted-foreground px-2 pt-1 text-xs font-semibold tracking-wider uppercase">
                      {{ group.category }}
                    </div>
                  }
                  @for (p of group.presets; track p.label) {
                    <button
                      type="button"
                      class="hover:bg-accent focus-visible:ring-ring rounded-md px-2 py-1.5 text-left text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
                      (click)="applyPreset(p)"
                    >
                      {{ p.label }}
                    </button>
                  }
                }
              </aside>
            }
            @if (type === 'range') {
              <ui-range-calendar
                [selected]="$any(calendarValue)"
                [numberOfMonths]="effectiveNumberOfMonths"
                [weekStartsOn]="weekStartsOn"
                [fixedWeeks]="fixedWeeks"
                [disabled]="calendarDisabled"
                [startMonth]="minDate ? strip(minDate) : undefined"
                [endMonth]="maxDate ? strip(maxDate) : undefined"
                (select)="handleCalendarUpdate($event)"
              />
            } @else {
              <ui-calendar
                [mode]="type === 'multiple' ? 'multiple' : 'single'"
                [selected]="calendarValue"
                [numberOfMonths]="effectiveNumberOfMonths"
                [weekStartsOn]="weekStartsOn"
                [fixedWeeks]="fixedWeeks"
                [disabled]="calendarDisabled"
                [captionLayout]="captionLayout"
                [startMonth]="captionLayout !== 'label' && minDate ? strip(minDate) : undefined"
                [endMonth]="captionLayout !== 'label' && maxDate ? strip(maxDate) : undefined"
                [dayContent]="renderCell ?? null"
                (select)="handleCalendarUpdate($event)"
              />
            }
            @if (showTime) {
              <div class="flex flex-col border-l">
                <div class="flex items-center justify-between border-b px-3 py-2">
                  <span class="text-muted-foreground text-xs tracking-widest uppercase">Time</span>
                  <button
                    type="button"
                    class="text-primary focus-visible:ring-ring rounded px-2 py-1.5 text-xs font-medium focus-visible:ring-2 focus-visible:outline-none"
                    (click)="onDone()"
                  >
                    Done
                  </button>
                </div>
                <ui-time-columns
                  [value]="timeForColumns"
                  [format]="showSeconds ? 'HH:mm:ss' : 'HH:mm'"
                  [use24Hour]="use24Hour"
                  [minuteStep]="minuteStep"
                  [secondStep]="secondStep"
                  [visible]="open()"
                  [disabledHours]="disabledTimeConfig?.disabledHours"
                  [disabledMinutes]="disabledTimeConfig?.disabledMinutes"
                  [disabledSeconds]="disabledTimeConfig?.disabledSeconds"
                  (valueChange)="handleTimeUpdate($event)"
                />
              </div>
            }
          </div>
        }
        @if (needConfirm) {
          <div class="flex items-center justify-end gap-2 border-t px-3 py-2">
            <button
              type="button"
              class="hover:bg-accent focus-visible:ring-ring rounded px-3 py-1.5 text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
              (click)="cancelPreview()"
            >
              Cancel
            </button>
            <button
              type="button"
              class="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring rounded px-3 py-1.5 text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
              (click)="commitPreview()"
            >
              OK
            </button>
          </div>
        }
      </ui-popover-content>
    </ui-popover>
  `,
})
export class UiDatePickerComponent implements OnInit, ControlValueAccessor {
  private readonly host = inject<ElementRef<HTMLButtonElement>>(ElementRef).nativeElement
  private readonly cdr = inject(ChangeDetectorRef)
  @ViewChild(UiPopoverComponent, { static: true }) popover!: UiPopoverComponent

  /** Controlled value. Shape depends on `type`. ISO `YYYY-MM-DD` (or `YYYY-MM-DDTHH:mm` when `showTime`). */
  @Input() value?: DatePickerValue
  /** Uncontrolled initial value. */
  @Input() defaultValue: DatePickerValue = null
  @Input() type: DatePickerType = 'single'
  @Input() placeholder = 'Pick a date'
  @Input({ transform: booleanAttribute }) disabled = false
  @Input({ transform: booleanAttribute }) readOnly = false
  @Input({ transform: booleanAttribute }) clearable = true
  /** Trigger label format: presets or Intl.DateTimeFormatOptions. */
  @Input() format: FormatValue = 'medium'
  /** Backward-compat alias for `format`. */
  @Input() dateFormat?: FormatValue
  @Input() locale = 'en-US'
  @Input() numberOfMonths?: number
  @Input() weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 0
  @Input({ transform: booleanAttribute }) fixedWeeks = false
  @Input() minValue?: string | Date
  @Input() maxValue?: string | Date
  /** Header layout: which parts (month / year) become dropdowns. */
  @Input() layout: DatePickerLayout = 'default'
  /** Granularity of selection (single type only): day / week / month / quarter / year. */
  @Input() picker: DatePickerPicker = 'day'
  /** "Today" shortcut at the popover top (single + day / week picker). */
  @Input({ transform: booleanAttribute }) showCurrentDate = false
  /** Require clicking OK before applying the selection. */
  @Input({ transform: booleanAttribute }) needConfirm = false
  @Input() status?: DatePickerStatus
  @Input() size: DatePickerSize = 'middle'
  @Input() placement: DatePickerPlacement = 'bottomLeft'
  /** Pair the calendar with a time selector. Value becomes `YYYY-MM-DDTHH:mm`. */
  @Input({ transform: booleanAttribute }) showTime = false
  @Input({ transform: booleanAttribute }) showSeconds = false
  @Input({ transform: booleanAttribute }) use24Hour = false
  @Input({ transform: numberAttribute }) minuteStep = 5
  @Input({ transform: numberAttribute }) secondStep = 1
  /** Default time for newly picked dates when `showTime`. `HH:mm` or `HH:mm:ss`. */
  @Input() defaultTime = '12:00'
  @Input() presets?: DatePickerPreset[]
  /** Separator between range start and end. */
  @Input() separator = '~'
  @Input() disabledDate?: (current: Date) => boolean
  @Input() disabledTime?: (current?: Date) => DisabledTimeResult
  /** Custom day-cell content (React `renderCell(day)`); context `$implicit` is the Date. */
  @Input() renderCell?: TemplateRef<DayContentContext>
  @Input() triggerClassName?: string
  @Input('class') className?: string

  @Output() readonly valueChange = new EventEmitter<DatePickerValue>()

  readonly open = signal(false)
  private readonly previewValue = signal<InternalValue>(undefined)
  private readonly internalState = signal<InternalValue>(undefined)
  private readonly formDisabled = signal(false)
  private readonly anchor = signal<Date>(stripTime(new Date()))
  private onChange: (v: DatePickerValue) => void = () => {}
  private onTouched: () => void = () => {}

  readonly quarterLabels = QUARTER_LABELS
  readonly strip = stripTime

  ngOnInit(): void {
    this.popover.trigger = this.host
    this.internalState.set(coerceShape(this.type, this.defaultValue ?? null))
    const v = this.internalState()
    this.anchor.set(v instanceof Date ? v : stripTime(new Date()))
  }

  // ---- derived state ----

  get isControlled(): boolean {
    return this.value !== undefined
  }

  get internal(): InternalValue {
    return this.isControlled ? coerceShape(this.type, this.value) : this.internalState()
  }

  get activeValue(): InternalValue {
    return this.needConfirm ? (this.previewValue() ?? this.internal) : this.internal
  }

  get isDisabled(): boolean {
    return this.disabled || this.formDisabled()
  }

  get effectiveFormat(): FormatValue {
    return this.dateFormat ?? this.format
  }

  get effectiveNumberOfMonths(): number {
    return this.numberOfMonths ?? (this.type === 'range' ? 2 : 1)
  }

  get effectivePresets(): DatePickerPreset[] | undefined {
    return this.presets ?? (this.type === 'range' ? defaultRangePresets() : undefined)
  }

  get presetGroups(): { category?: string; presets: DatePickerPreset[] }[] {
    const groups = new Map<string | undefined, DatePickerPreset[]>()
    for (const p of this.effectivePresets ?? []) {
      if (!groups.has(p.category)) groups.set(p.category, [])
      groups.get(p.category)!.push(p)
    }
    return Array.from(groups.entries()).map(([category, presets]) => ({ category, presets }))
  }

  get minDate(): Date | undefined {
    return coerceDate(this.minValue) ?? undefined
  }

  get maxDate(): Date | undefined {
    return coerceDate(this.maxValue) ?? undefined
  }

  get captionLayout(): CaptionLayout {
    return layoutToCaptionLayout(this.layout)
  }

  get popoverPlacement(): { side: PopoverSide; align: PopoverAlign } {
    return PLACEMENT[this.placement] ?? { side: 'bottom', align: 'start' }
  }

  get buttonSize(): ButtonSize {
    return this.size === 'small' ? 'sm' : this.size === 'large' ? 'lg' : 'default'
  }

  get hasValue(): boolean {
    const v = this.internal
    if (!v) return false
    if (this.type === 'multiple') return (v as InternalMultiple).length > 0
    if (this.type === 'range') return Boolean((v as InternalRange).start)
    return true
  }

  get hostClass(): string {
    return cn(
      buttonVariants({ variant: 'outline', size: this.buttonSize }),
      cn(
        this.showTime ? 'min-w-[280px]' : 'min-w-[240px]',
        'justify-start gap-2 text-left font-normal',
        !this.hasValue && 'text-muted-foreground',
        this.status === 'error' && 'border-destructive focus-visible:ring-destructive',
        this.status === 'warning' && 'border-warning focus-visible:ring-warning',
        this.triggerClassName,
        this.className,
      ),
    )
  }

  get display(): string {
    const v = this.internal
    if (!v) return ''
    const locale = this.locale
    const f = this.effectiveFormat
    if (this.type === 'multiple') {
      const arr = v as InternalMultiple
      if (!arr.length) return ''
      if (arr.length === 1) return fmtDate(arr[0]!, locale, f)
      if (arr.length <= 3) return arr.map((d) => fmtDate(d, locale, f)).join(', ')
      return `${arr.length} dates selected`
    }
    if (this.type === 'range') {
      const r = v as InternalRange
      const fmt = this.showTime
        ? (d: Date) => fmtDateTime(d, locale, f, this.showSeconds, this.use24Hour)
        : (d: Date) => fmtDate(d, locale, f)
      if (r.start && r.end) return `${fmt(r.start)} ${this.separator} ${fmt(r.end)}`
      if (r.start) return `${fmt(r.start)} ${this.separator} …`
      return ''
    }
    if (this.picker === 'week') {
      const ws = weekStart(v as Date, this.weekStartsOn)
      return `Week ${weekNumber(ws)}, ${ws.getFullYear()}`
    }
    if (this.picker === 'month') return fmtMonth(v as Date, locale)
    if (this.picker === 'quarter') {
      const d = v as Date
      return `Q${Math.ceil((d.getMonth() + 1) / 3)} ${d.getFullYear()}`
    }
    if (this.picker === 'year') return String((v as Date).getFullYear())
    return this.showTime
      ? fmtDateTime(v as Date, locale, f, this.showSeconds, this.use24Hour)
      : fmtDate(v as Date, locale, f)
  }

  /** Prefer preview (confirm mode) so time columns track the uncommitted selection. */
  get lastTime(): TimeShape {
    return getLastTime(this.activeValue, this.type, this.defaultTime)
  }

  get timeForColumns(): string {
    const t = this.lastTime
    return this.showSeconds ? `${pad(t.h)}:${pad(t.m)}:${pad(t.s)}` : `${pad(t.h)}:${pad(t.m)}`
  }

  private timeCache?: { key: string; fn: unknown; value: DisabledTimeResult | undefined }
  get disabledTimeConfig(): DisabledTimeResult | undefined {
    if (!this.disabledTime) return undefined
    const v = this.activeValue
    let current: Date | undefined
    if (this.type === 'range') current = (v as InternalRange | undefined)?.start
    else if (v instanceof Date) current = v
    else if (Array.isArray(v)) current = v[0]
    // Memoized (React useMemo): the callbacks feed TimeColumns inputs, so keep identities stable.
    const key = String(current?.getTime())
    if (this.timeCache?.key !== key || this.timeCache.fn !== this.disabledTime) {
      this.timeCache = { key, fn: this.disabledTime, value: this.disabledTime(current) }
    }
    return this.timeCache.value
  }

  private matchersCache?: { key: string; value: Matcher[] | undefined }
  get calendarDisabled(): Matcher[] | undefined {
    const min = this.minDate
    const max = this.maxDate
    const key = `${min?.getTime()}|${max?.getTime()}|${this.disabledDate ? 'fn' : ''}`
    if (this.matchersCache?.key !== key) {
      const m: Matcher[] = []
      if (min) m.push({ before: stripTime(min) })
      if (max) m.push({ after: stripTime(max) })
      if (this.disabledDate) m.push(this.disabledDate)
      this.matchersCache = { key, value: m.length ? m : undefined }
    }
    return this.matchersCache.value
  }

  private valueCache?: { key: string; value: DayPickerSelected }
  /** Memoized (React useMemo) so the calendar only re-renders when the selection changes. */
  get calendarValue(): DayPickerSelected {
    const v = this.activeValue
    const t = (d?: Date) => (d ? stripTime(d).getTime() : '')
    const key =
      this.type === 'multiple'
        ? `m${((v as InternalMultiple | undefined) ?? []).map((d) => t(d)).join(',')}${v ? '' : 'u'}`
        : this.type === 'range'
          ? `r${t((v as InternalRange | undefined)?.start)}-${t((v as InternalRange | undefined)?.end)}`
          : `s${v instanceof Date ? t(v) : ''}`
    if (this.valueCache?.key !== key) {
      let value: DayPickerSelected
      if (this.type === 'multiple') value = (v as InternalMultiple | undefined)?.map(stripTime)
      else if (this.type === 'range') value = rangeToCalendar(v as InternalRange | undefined)
      else value = v instanceof Date ? stripTime(v) : undefined
      this.valueCache = { key, value }
    }
    return this.valueCache.value
  }

  get showAlternatePicker(): boolean {
    return this.picker !== 'day' && this.type === 'single'
  }

  get monthLabels(): string[] {
    const f = new Intl.DateTimeFormat(this.locale, { month: 'short' })
    return Array.from({ length: 12 }, (_, i) => f.format(new Date(2024, i, 1)))
  }

  get yearGrid(): number[] {
    const y = this.anchor().getFullYear()
    const start = y - (y % 12)
    return Array.from({ length: 12 }, (_, i) => start + i)
  }

  get weekGrid(): { start: Date; end: Date; weekNum: number }[] {
    const a = this.anchor()
    const start = weekAnchorForMonth(a.getFullYear(), a.getMonth() + 1, this.weekStartsOn)
    return Array.from({ length: 6 }, (_, i) => {
      const s = new Date(start)
      s.setDate(s.getDate() + i * 7)
      const e = new Date(s)
      e.setDate(e.getDate() + 6)
      return { start: s, end: e, weekNum: weekNumber(s) }
    })
  }

  get monthYearLabel(): string {
    const a = this.anchor()
    if (this.picker === 'week')
      return new Intl.DateTimeFormat(this.locale, { month: 'short', year: 'numeric' }).format(a)
    if (this.picker === 'quarter' || this.picker === 'month') return String(a.getFullYear())
    const g = this.yearGrid
    return `${g[0]} – ${g[g.length - 1]}`
  }

  shortMonth(d: Date): string {
    return new Intl.DateTimeFormat(this.locale, { month: 'short' }).format(d)
  }

  cellClass(base: string, active: boolean): string {
    return cn(`hover:bg-accent focus-visible:ring-ring ${base} ${CELL_TAIL}`, active && ACTIVE)
  }

  weekCellClass(ws: Date): string {
    return cn(
      'hover:bg-accent focus-visible:ring-ring flex items-center justify-between rounded px-3 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-30 disabled:hover:bg-transparent',
      this.isWeekSelected(ws) && ACTIVE,
    )
  }

  weekRangeClass(ws: Date): string {
    return cn('text-muted-foreground text-xs', this.isWeekSelected(ws) && 'text-primary-foreground')
  }

  // ---- open state ----

  toggle(): void {
    if (this.isDisabled) return
    this.setOpen(!this.open())
  }

  setOpen(v: boolean): void {
    if (v === this.open()) return
    this.open.set(v)
    if (v) this.syncAnchor()
    else {
      this.previewValue.set(undefined)
      this.onTouched()
    }
  }

  /** React effect on [open, internal]: anchor the alternate grids on the value (or today). */
  private syncAnchor(): void {
    const v = this.internal
    this.anchor.set(v instanceof Date ? v : stripTime(new Date()))
  }

  // ---- emit ----

  private serializeDate(d: Date): string {
    return this.showTime ? toISODateTime(d, this.showSeconds) : toISODate(d)
  }

  private emit(v: DatePickerValue): void {
    this.valueChange.emit(v)
    this.onChange(v)
  }

  private emitOut(v: InternalValue): void {
    if (this.type === 'multiple') {
      this.emit(((v as InternalMultiple) ?? []).map((d) => this.serializeDate(d)))
      return
    }
    if (this.type === 'range') {
      // Clear emits null; an incomplete range (start only) stays local until both ends exist.
      if (!v) return this.emit(null)
      const r = v as InternalRange
      if (!r.start || !r.end) return
      this.emit({ start: this.serializeDate(r.start), end: this.serializeDate(r.end) })
      return
    }
    const single = v as InternalSingle
    this.emit(single ? this.serializeDate(single) : null)
  }

  private handleUpdate(v: InternalValue): void {
    if (!this.isControlled) this.internalState.set(v)
    this.emitOut(v)
    // React effect on [open, internal]: re-anchor the alternate grids on the new value.
    if (this.open()) this.anchor.set(v instanceof Date ? v : stripTime(new Date()))
    if (this.needConfirm) return
    if (this.type === 'single' && v && !this.showTime) this.setOpen(false)
    if (this.type === 'range') {
      const r = v as InternalRange | undefined
      if (r?.start && r?.end && !this.showTime) this.setOpen(false)
    }
  }

  clear(e: Event): void {
    e.stopPropagation()
    if (this.isDisabled || this.readOnly) return
    this.handleUpdate(this.type === 'multiple' ? [] : undefined)
  }

  onClearKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      e.stopPropagation()
      this.clear(e)
    }
  }

  applyPreset(preset: DatePickerPreset): void {
    if (this.isDisabled || this.readOnly) return
    const v = preset.value
    const done = (next: InternalValue) => {
      this.handleUpdate(next)
      this.setOpen(false)
    }
    if (!v) return done(undefined)
    if (this.type === 'multiple') {
      return done(((v as MultipleValue) ?? []).map(coerceDate).filter((x): x is Date => x != null))
    }
    if (this.type === 'range') {
      const r = v as RangeValue
      if (!r?.start) return done(undefined)
      const start = coerceDate(r.start)
      const end = r.end ? coerceDate(r.end) : undefined
      if (!start) return done(undefined)
      return done(end ? { start, end } : { start })
    }
    done(coerceDate(v as SingleValue) ?? undefined)
  }

  commitPreview(): void {
    const p = this.previewValue()
    if (this.needConfirm && p !== undefined) {
      this.handleUpdate(p)
      this.previewValue.set(undefined)
    }
    this.setOpen(false)
  }

  cancelPreview(): void {
    this.previewValue.set(undefined)
    this.setOpen(false)
  }

  onDone(): void {
    // In confirm mode, Done must commit the preview -- closing alone discards it.
    if (this.needConfirm) this.commitPreview()
    else this.setOpen(false)
  }

  handleCalendarUpdate(sel: DayPickerSelected): void {
    if (this.readOnly) return
    const t = this.lastTime
    const time = (d: Date) => (this.showTime ? withTime(d, t) : d)
    if (this.needConfirm) {
      if (this.type === 'multiple') this.previewValue.set(((sel as Date[]) ?? []).map(time))
      else if (this.type === 'range') {
        const r = rangeFromCalendar(sel as DateRange | undefined)
        if (!r?.start) this.previewValue.set(undefined)
        else {
          const start = time(r.start)
          const end = r.end ? time(r.end) : undefined
          this.previewValue.set(end ? { start, end } : { start })
        }
      } else {
        const d = sel as Date | undefined
        this.previewValue.set(d ? time(d) : undefined)
      }
      return
    }
    if (!this.showTime) {
      if (this.type === 'range') this.handleUpdate(rangeFromCalendar(sel as DateRange | undefined))
      else if (this.type === 'multiple') this.handleUpdate((sel as Date[]) ?? [])
      else this.handleUpdate(sel as InternalSingle)
      return
    }
    if (this.type === 'multiple') return this.handleUpdate(((sel as Date[]) ?? []).map((d) => withTime(d, t)))
    if (this.type === 'range') {
      const r = rangeFromCalendar(sel as DateRange | undefined)
      if (!r?.start) return this.handleUpdate(undefined)
      const start = withTime(r.start, t)
      const end = r.end ? withTime(r.end, t) : undefined
      return this.handleUpdate(end ? { start, end } : { start })
    }
    const d = sel as Date | undefined
    if (d) this.handleUpdate(withTime(d, t))
  }

  handleTimeUpdate(timeValue: string): void {
    const base = this.needConfirm ? (this.previewValue() ?? this.internal) : this.internal
    if (!base) return
    const t = parseTimeShape(timeValue, this.lastTime)
    if (this.type === 'single') {
      const next = withTime(base as Date, t)
      if (this.needConfirm) return this.previewValue.set(next)
      return this.handleUpdate(next)
    }
    if (this.type === 'range') {
      const r = base as InternalRange
      if (!r.start) return
      const start = withTime(r.start, t)
      const end = r.end ? withTime(r.end, t) : undefined
      const next = end ? { start, end } : { start }
      if (this.needConfirm) return this.previewValue.set(next)
      this.handleUpdate(next)
    }
  }

  pickToday(): void {
    if (this.type !== 'single') return
    const t = stripTime(new Date())
    this.handleUpdate(this.picker === 'week' ? weekStart(t, this.weekStartsOn) : t)
  }

  shiftAnchor(dir: -1 | 1): void {
    const a = this.anchor()
    const y = a.getFullYear()
    if (this.picker === 'month' || this.picker === 'week') this.anchor.set(new Date(y + dir, a.getMonth(), 1))
    else if (this.picker === 'year' || this.picker === 'quarter') this.anchor.set(new Date(y + dir, 0, 1))
  }

  private pickAlt(d: Date, disabled: boolean): void {
    if (disabled || this.readOnly) return
    if (this.needConfirm) return this.previewValue.set(d)
    this.handleUpdate(d)
  }

  isWeekSelected(ws: Date): boolean {
    const v = this.activeValue
    return v instanceof Date && compareDates(weekStart(v, this.weekStartsOn), ws) === 0
  }

  isWeekDisabled(ws: Date): boolean {
    if (this.minDate && compareDates(ws, this.minDate) < 0) return true
    const end = new Date(ws)
    end.setDate(end.getDate() + 6)
    if (this.maxDate && compareDates(end, this.maxDate) > 0) return true
    return !!this.disabledDate?.(ws)
  }

  pickWeek(ws: Date): void {
    this.pickAlt(ws, this.isWeekDisabled(ws))
  }

  isQuarterSelected(q: number): boolean {
    const v = this.activeValue
    return (
      v instanceof Date &&
      v.getFullYear() === this.anchor().getFullYear() &&
      Math.ceil((v.getMonth() + 1) / 3) === q + 1
    )
  }

  isQuarterDisabled(q: number): boolean {
    const d = quarterStart(this.anchor().getFullYear(), q)
    if (this.minDate && compareDates(d, this.minDate) < 0) return true
    const last = new Date(d.getFullYear(), d.getMonth() + 3, 0)
    if (this.maxDate && compareDates(last, this.maxDate) > 0) return true
    return !!this.disabledDate?.(d)
  }

  pickQuarter(q: number): void {
    this.pickAlt(quarterStart(this.anchor().getFullYear(), q), this.isQuarterDisabled(q))
  }

  isMonthSelected(m: number): boolean {
    const v = this.activeValue
    return v instanceof Date && v.getFullYear() === this.anchor().getFullYear() && v.getMonth() === m
  }

  isMonthDisabled(m: number): boolean {
    const d = new Date(this.anchor().getFullYear(), m, 1)
    if (this.minDate && compareDates(d, this.minDate) < 0) return true
    if (this.maxDate && compareDates(d, this.maxDate) > 0) return true
    return !!this.disabledDate?.(d)
  }

  pickMonth(m: number): void {
    this.pickAlt(new Date(this.anchor().getFullYear(), m, 1), this.isMonthDisabled(m))
  }

  isYearSelected(y: number): boolean {
    const v = this.activeValue
    return v instanceof Date && v.getFullYear() === y
  }

  isYearDisabled(y: number): boolean {
    const d = new Date(y, 0, 1)
    if (this.minDate && compareDates(new Date(y, 11, 31), this.minDate) < 0) return true
    if (this.maxDate && compareDates(d, this.maxDate) > 0) return true
    return !!this.disabledDate?.(d)
  }

  pickYear(y: number): void {
    const d = new Date(y, 0, 1)
    if (this.isYearDisabled(y) || this.readOnly) return
    if (this.picker === 'year') this.pickAlt(d, false)
    else this.anchor.set(d)
  }

  // ---- ControlValueAccessor ----

  writeValue(v: DatePickerValue): void {
    this.internalState.set(coerceShape(this.type, v ?? null))
    this.cdr.markForCheck()
  }

  registerOnChange(fn: (v: DatePickerValue) => void): void {
    this.onChange = fn
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn
  }

  setDisabledState(isDisabled: boolean): void {
    this.formDisabled.set(isDisabled)
    this.cdr.markForCheck()
  }
}
