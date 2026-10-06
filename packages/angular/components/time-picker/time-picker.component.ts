import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
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
import { buttonVariants } from '@/ui/button/button.component'
import { UiPopoverComponent, UiPopoverContentComponent } from '@/ui/popover/popover.component'
import { UiScrollAreaComponent } from '@/ui/scroll-area/scroll-area.component'

export type TimeFormat = 'HH:mm' | 'HH:mm:ss' | 'hh:mm A'

export interface TimeParts {
  hour24: number
  minute: number
  second: number
}

export interface TimePreset {
  label: string
  value: string
}

export interface TimeRangePreset {
  label: string
  value: [string, string]
}

export type TimePickerSize = 'small' | 'middle' | 'large'
export type TimePickerStatus = 'error' | 'warning'

/** Parses 24h `HH:mm` / `HH:mm:ss`; null when empty or out of range. */
export function parseTime(v: string): TimeParts | null {
  if (!v) return null
  const m = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(v.trim())
  if (!m) return null
  const h = Number(m[1])
  const min = Number(m[2])
  const s = m[3] ? Number(m[3]) : 0
  if ([h, min, s].some(Number.isNaN) || h < 0 || h > 23 || min < 0 || min > 59 || s < 0 || s > 59) return null
  return { hour24: h, minute: min, second: s }
}

const toMinutes = (p: TimeParts) => p.hour24 * 60 + p.minute + p.second / 60
const pad = (n: number) => String(n).padStart(2, '0')

function formatDisplay(format: TimeFormat, h: number, m: number, s: number): string {
  if (format === 'hh:mm A') return `${pad(h % 12 === 0 ? 12 : h % 12)}:${pad(m)} ${h >= 12 ? 'PM' : 'AM'}`
  if (format === 'HH:mm:ss') return `${pad(h)}:${pad(m)}:${pad(s)}`
  return `${pad(h)}:${pad(m)}`
}

/** "Now" snapped to the minute / second steps (carrying into the next minute / hour). */
function nowSnapped(format: TimeFormat, minuteStep: number, secondStep: number): string {
  const d = new Date()
  const sStep = Math.max(1, secondStep)
  const snappedS = Math.round(d.getSeconds() / sStep) * sStep
  const s = snappedS % 60
  const mStep = Math.max(1, minuteStep)
  const snappedM = Math.round((d.getMinutes() + Math.floor(snappedS / 60)) / mStep) * mStep
  const min = snappedM % 60
  const h = (d.getHours() + Math.floor(snappedM / 60)) % 24
  return format === 'HH:mm:ss' ? `${pad(h)}:${pad(min)}:${pad(s)}` : `${pad(h)}:${pad(min)}`
}

const SIZE_CLASSES: Record<TimePickerSize, string> = {
  small: 'h-8 text-xs px-2.5 py-1',
  middle: 'h-9 text-sm px-3 py-1.5',
  large: 'h-11 text-base px-4 py-2',
}
const STATUS_CLASSES: Record<string, string> = {
  error: 'border-destructive focus-visible:ring-destructive',
  warning: 'border-warning focus-visible:ring-warning',
}

const CELL =
  'hover:bg-accent focus-visible:ring-ring rounded px-2 py-1 text-center text-sm tabular-nums transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-30 disabled:hover:bg-transparent'
const ACTIVE = 'bg-primary text-primary-foreground hover:bg-primary'
const PRESET =
  'hover:bg-accent focus-visible:ring-ring rounded-md px-2 py-1.5 text-left text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none'
const NOW =
  'text-muted-foreground hover:text-foreground focus-visible:ring-ring text-xs focus-visible:ring-2 focus-visible:outline-none'
const CLEAR =
  'text-muted-foreground hover:text-foreground focus-visible:ring-ring -mr-1 inline-flex size-5 items-center justify-center rounded transition-colors focus-visible:ring-2 focus-visible:outline-none'

const CLOCK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock size-4 shrink-0" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>`
const X_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x size-3.5" aria-hidden="true"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>`

/**
 * TimeColumns (React `TimeColumns`): the scrollable hour / minute / second (+ AM/PM)
 * columns shared by TimePicker, TimeRangePicker and DatePicker's time pane. Emits 24h
 * `HH:mm` / `HH:mm:ss` via `valueChange`; min / max / disabled* callbacks grey out (or with
 * `hideDisabledOptions` drop) values; active rows scroll into view while `visible`.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-time-columns, [ui-time-columns]',
  standalone: true,
  imports: [UiScrollAreaComponent],
  host: {
    class: 'flex divide-x',
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"time-columns"',
  },
  template: `
    <ui-scroll-area #hourCol class="h-56">
      <div class="flex w-14 flex-col p-1">
        @for (h of hours; track h) {
          <button
            type="button"
            [attr.data-active]="isHourActive(h)"
            [disabled]="isHourDisabled(h)"
            [class]="cellClass(isHourActive(h))"
            (click)="effective12Hour ? pickHour12(h) : pickHour24(h)"
          >
            {{ pad(h) }}
          </button>
        }
      </div>
    </ui-scroll-area>
    <ui-scroll-area #minCol class="h-56">
      <div class="flex w-14 flex-col p-1">
        @for (m of minutes; track m) {
          <button
            type="button"
            [attr.data-active]="parts?.minute === m"
            [disabled]="isMinuteDisabled(m)"
            [class]="cellClass(parts?.minute === m)"
            (click)="pickMinute(m)"
          >
            {{ pad(m) }}
          </button>
        }
      </div>
    </ui-scroll-area>
    @if (showSeconds) {
      <ui-scroll-area #secCol class="h-56">
        <div class="flex w-14 flex-col p-1">
          @for (s of seconds; track s) {
            <button
              type="button"
              [attr.data-active]="parts?.second === s"
              [disabled]="isSecondDisabled(s)"
              [class]="cellClass(parts?.second === s)"
              (click)="pickSecond(s)"
            >
              {{ pad(s) }}
            </button>
          }
        </div>
      </ui-scroll-area>
    }
    @if (effective12Hour) {
      <div class="flex w-12 flex-col p-1">
        @for (p of periods; track p) {
          <button type="button" [class]="periodClass(p)" (click)="pickPeriod(p)">{{ p }}</button>
        }
      </div>
    }
  `,
})
export class UiTimeColumnsComponent implements OnChanges, AfterViewInit, OnDestroy {
  /** Time value, HH:mm or HH:mm:ss depending on format. Empty = no selection. */
  @Input() value = ''
  @Input({ transform: booleanAttribute }) use24Hour = false
  @Input({ transform: booleanAttribute }) use12Hours = false
  @Input({ transform: numberAttribute }) minuteStep = 5
  @Input({ transform: numberAttribute }) hourStep = 1
  @Input({ transform: numberAttribute }) secondStep = 1
  /** 24h HH:mm or HH:mm:ss. */
  @Input() minTime?: string
  /** 24h HH:mm or HH:mm:ss. */
  @Input() maxTime?: string
  @Input() format: TimeFormat = 'HH:mm'
  @Input() disabledHours?: () => number[]
  @Input() disabledMinutes?: (selectedHour: number) => number[]
  @Input() disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[]
  @Input({ transform: booleanAttribute }) hideDisabledOptions = false
  /** Auto-scroll active rows into view when this becomes true. */
  @Input({ transform: booleanAttribute }) visible = true
  @Output() readonly valueChange = new EventEmitter<string>()

  @ViewChild('hourCol', { read: ElementRef }) hourCol?: ElementRef<HTMLElement>
  @ViewChild('minCol', { read: ElementRef }) minCol?: ElementRef<HTMLElement>
  @ViewChild('secCol', { read: ElementRef }) secCol?: ElementRef<HTMLElement>

  readonly periods = ['AM', 'PM'] as const
  readonly pad = pad
  private raf = 0
  private viewReady = false

  get parts(): TimeParts | null {
    return parseTime(this.value)
  }

  get showSeconds(): boolean {
    return this.format === 'HH:mm:ss'
  }

  /** 24h columns by default; 12h via format="hh:mm A" or use12Hours. */
  get effective12Hour(): boolean {
    return this.format === 'hh:mm A' || this.use12Hours
  }

  get period(): 'AM' | 'PM' {
    const p = this.parts
    return p && p.hour24 >= 12 ? 'PM' : 'AM'
  }

  private withinBounds(p: TimeParts): boolean {
    const min = parseTime(this.minTime ?? '')
    const max = parseTime(this.maxTime ?? '')
    const m = toMinutes(p)
    if (min && m < toMinutes(min)) return false
    if (max && m > toMinutes(max)) return false
    return true
  }

  private get cur(): TimeParts {
    return this.parts ?? { hour24: 0, minute: 0, second: 0 }
  }

  private isHourDisabledItem(h: number): boolean {
    if (this.disabledHours?.().includes(h)) return true
    const c = this.cur
    if (this.effective12Hour) {
      return !this.withinBounds({
        hour24: (h % 12) + (this.period === 'PM' ? 12 : 0),
        minute: c.minute,
        second: c.second,
      })
    }
    return !this.withinBounds({ hour24: h, minute: c.minute, second: c.second })
  }

  private isMinuteDisabledItem(m: number): boolean {
    if (this.disabledMinutes?.(this.parts?.hour24 ?? 0).includes(m)) return true
    const c = this.cur
    return !this.withinBounds({ hour24: c.hour24, minute: m, second: c.second })
  }

  private isSecondDisabledItem(s: number): boolean {
    if (this.disabledSeconds?.(this.parts?.hour24 ?? 0, this.parts?.minute ?? 0).includes(s)) return true
    const c = this.cur
    return !this.withinBounds({ hour24: c.hour24, minute: c.minute, second: s })
  }

  get hours(): number[] {
    const step = Math.max(1, this.hourStep)
    const list = this.effective12Hour
      ? Array.from({ length: 12 }, (_, i) => i + 1).filter((h) => (h - 1) % step === 0)
      : Array.from({ length: 24 }, (_, i) => i).filter((h) => h % step === 0)
    return list.filter((h) => !this.hideDisabledOptions || !this.isHourDisabledItem(h))
  }

  get minutes(): number[] {
    const step = Math.max(1, Math.min(60, this.minuteStep))
    return Array.from({ length: Math.ceil(60 / step) }, (_, i) => i * step).filter(
      (m) => !this.hideDisabledOptions || !this.isMinuteDisabledItem(m),
    )
  }

  get seconds(): number[] {
    const step = Math.max(1, Math.min(60, this.secondStep))
    return Array.from({ length: Math.ceil(60 / step) }, (_, i) => i * step).filter(
      (s) => !this.hideDisabledOptions || !this.isSecondDisabledItem(s),
    )
  }

  isHourActive(h: number): boolean {
    const p = this.parts
    if (!p) return false
    return this.effective12Hour ? (p.hour24 % 12 === 0 ? 12 : p.hour24 % 12) === h : p.hour24 === h
  }

  isHourDisabled(h: number): boolean {
    return !this.hideDisabledOptions && this.isHourDisabledItem(h)
  }

  isMinuteDisabled(m: number): boolean {
    return !this.hideDisabledOptions && this.isMinuteDisabledItem(m)
  }

  isSecondDisabled(s: number): boolean {
    return !this.hideDisabledOptions && this.isSecondDisabledItem(s)
  }

  cellClass(active: boolean): string {
    return cn(CELL, active ? ACTIVE : '')
  }

  periodClass(p: 'AM' | 'PM'): string {
    return cn(
      'hover:bg-accent focus-visible:ring-ring rounded px-2 py-1 text-center text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none',
      this.period === p ? ACTIVE : '',
    )
  }

  private commit(p: TimeParts): void {
    if (!this.withinBounds(p)) return
    this.valueChange.emit(
      this.format === 'HH:mm:ss'
        ? `${pad(p.hour24)}:${pad(p.minute)}:${pad(p.second)}`
        : `${pad(p.hour24)}:${pad(p.minute)}`,
    )
  }

  pickHour12(h: number): void {
    const c = this.cur
    this.commit({ hour24: (h % 12) + (this.period === 'PM' ? 12 : 0), minute: c.minute, second: c.second })
  }

  pickHour24(h: number): void {
    const c = this.cur
    this.commit({ hour24: h, minute: c.minute, second: c.second })
  }

  pickMinute(m: number): void {
    const c = this.cur
    this.commit({ hour24: c.hour24, minute: m, second: c.second })
  }

  pickSecond(s: number): void {
    const c = this.cur
    this.commit({ hour24: c.hour24, minute: c.minute, second: s })
  }

  pickPeriod(p: 'AM' | 'PM'): void {
    const c = this.cur
    this.commit({ hour24: (c.hour24 % 12) + (p === 'PM' ? 12 : 0), minute: c.minute, second: c.second })
  }

  ngOnChanges(): void {
    if (this.viewReady) this.scheduleScroll()
  }

  ngAfterViewInit(): void {
    this.viewReady = true
    this.scheduleScroll()
  }

  /** React effect on [visible, value]: centre the active row of each column. */
  private scheduleScroll(): void {
    if (!this.visible || typeof requestAnimationFrame === 'undefined') return
    cancelAnimationFrame(this.raf)
    this.raf = requestAnimationFrame(() => {
      for (const col of [this.hourCol, this.minCol, this.secCol]) {
        col?.nativeElement.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'center' })
      }
    })
  }

  ngOnDestroy(): void {
    if (typeof cancelAnimationFrame !== 'undefined') cancelAnimationFrame(this.raf)
  }
}

/** Shared trigger behaviour: host = the outline Button, `(click)` toggles the popover. */
@Directive()
abstract class TimeTriggerBase implements OnInit {
  protected readonly host = inject<ElementRef<HTMLButtonElement>>(ElementRef).nativeElement
  protected readonly cdr = inject(ChangeDetectorRef)
  @ViewChild(UiPopoverComponent, { static: true }) popover!: UiPopoverComponent

  @Input() placeholder = ''
  @Input({ transform: booleanAttribute }) disabled = false
  @Input({ transform: booleanAttribute }) readOnly = false
  @Input({ transform: booleanAttribute }) clearable = true
  @Input() allowClear?: boolean
  @Input({ transform: numberAttribute }) minuteStep = 5
  @Input({ transform: numberAttribute }) hourStep = 1
  @Input({ transform: numberAttribute }) secondStep = 1
  /** Backward-compat flag (24-hour columns are the default). */
  @Input({ transform: booleanAttribute }) use24Hour = false
  /** Show the AM/PM selector (12-hour columns). */
  @Input({ transform: booleanAttribute }) use12Hours = false
  @Input() minTime?: string
  @Input() maxTime?: string
  @Input() format: TimeFormat = 'HH:mm'
  @Input() disabledHours?: () => number[]
  @Input() disabledMinutes?: (selectedHour: number) => number[]
  @Input() disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[]
  @Input({ transform: booleanAttribute }) hideDisabledOptions = false
  @Input() size: TimePickerSize = 'middle'
  @Input() status?: TimePickerStatus
  @Input() triggerClassName?: string
  @Input('class') className?: string

  readonly open = signal(false)
  protected readonly formDisabled = signal(false)
  protected onTouched: () => void = () => {}

  get isDisabled(): boolean {
    return this.disabled || this.formDisabled()
  }

  get effectiveAllowClear(): boolean {
    return this.allowClear !== undefined ? this.allowClear : this.clearable
  }

  get contentId(): string | null {
    return this.popover?.contentId ?? null
  }

  ngOnInit(): void {
    // The host button is the Popover trigger (Radix PopoverTrigger asChild).
    this.popover.trigger = this.host
  }

  protected triggerClass(minWidth: string, empty: boolean): string {
    return cn(
      buttonVariants({ variant: 'outline', size: 'default' }),
      cn(
        `${minWidth} justify-start gap-2 text-left font-normal`,
        empty && 'text-muted-foreground',
        SIZE_CLASSES[this.size],
        this.status && STATUS_CLASSES[this.status],
        this.triggerClassName,
        this.className,
      ),
    )
  }

  toggle(): void {
    if (this.isDisabled) return
    this.open.set(!this.open())
  }

  setOpen(v: boolean): void {
    this.open.set(v)
    if (!v) this.onTouched()
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn
  }

  setDisabledState(isDisabled: boolean): void {
    this.formDisabled.set(isDisabled)
    this.cdr.markForCheck()
  }
}

const TRIGGER_HOST = {
  type: 'button',
  '[class]': 'hostClass',
  '[disabled]': 'isDisabled',
  '[attr.data-uipkge]': '""',
  '[attr.data-variant]': '"outline"',
  '[attr.data-size]': '"default"',
  '[attr.aria-haspopup]': '"dialog"',
  '[attr.aria-expanded]': 'open()',
  '[attr.aria-controls]': 'open() ? contentId : null',
  '[attr.data-state]': 'open() ? "open" : "closed"',
  '(click)': 'toggle()',
}

/**
 * Angular port of the UIPKGE React TimePicker. Put it on a button
 * (`<button ui-time-picker>`): the host IS the outline trigger Button (React renders
 * PopoverTrigger asChild > Button), with the Clock icon, the value / placeholder and a
 * clear control; the popover holds presets, a "Now" shortcut and TimeColumns. `value` /
 * `defaultValue` / `valueChange` (24h HH:mm or HH:mm:ss) work controlled or uncontrolled,
 * and it is a ControlValueAccessor for [formControl] / ngModel.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'button[ui-time-picker]',
  standalone: true,
  imports: [UiPopoverComponent, UiPopoverContentComponent, UiTimeColumnsComponent],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiTimePickerComponent), multi: true }],
  host: { ...TRIGGER_HOST, '[attr.data-slot]': '"time-picker"' },
  template: `
    ${CLOCK_SVG}<span class="flex-1 truncate">{{ display || placeholder }}</span>
    @if (effectiveAllowClear && parsed && !isDisabled && !readOnly) {
      <span
        role="button"
        tabindex="-1"
        class="${CLEAR}"
        aria-label="Clear time"
        (click)="clear($event)"
        (mousedown)="$event.preventDefault()"
        >${X_SVG}</span
      >
    }
    <ui-popover [open]="open()" (openChange)="setOpen($event)">
      <ui-popover-content class="w-auto p-0" align="start">
        @if (presets.length > 0) {
          <div class="flex flex-col gap-0.5 border-b p-2">
            @for (p of presets; track p.label) {
              <button type="button" class="${PRESET}" (click)="applyPreset(p)">{{ p.label }}</button>
            }
          </div>
        }
        <div class="flex items-center justify-between border-b px-3 py-2">
          <span class="text-muted-foreground text-xs tracking-widest uppercase">Time</span>
          <button type="button" class="${NOW}" (click)="pickNow()">Now</button>
        </div>
        <ui-time-columns
          [value]="currentValue"
          [use24Hour]="use24Hour"
          [use12Hours]="use12Hours"
          [minuteStep]="minuteStep"
          [hourStep]="hourStep"
          [secondStep]="secondStep"
          [minTime]="minTime"
          [maxTime]="maxTime"
          [format]="format"
          [disabledHours]="disabledHours"
          [disabledMinutes]="disabledMinutes"
          [disabledSeconds]="disabledSeconds"
          [hideDisabledOptions]="hideDisabledOptions"
          [visible]="open()"
          (valueChange)="emitTime($event)"
        />
      </ui-popover-content>
    </ui-popover>
  `,
})
export class UiTimePickerComponent extends TimeTriggerBase implements ControlValueAccessor {
  /** Controlled value as 24h HH:mm or HH:mm:ss. Empty string = no selection. */
  @Input() value?: string
  /** Uncontrolled initial value. */
  @Input() defaultValue = ''
  @Input() presets: TimePreset[] = []
  @Output() readonly valueChange = new EventEmitter<string>()

  override placeholder = 'Pick a time'
  private readonly internal = signal<string | null>(null)
  private onChange: (v: string) => void = () => {}

  get currentValue(): string {
    return this.value !== undefined ? this.value : (this.internal() ?? this.defaultValue)
  }

  get parsed(): TimeParts | null {
    return parseTime(this.currentValue)
  }

  get display(): string {
    const p = this.parsed
    return p ? formatDisplay(this.format, p.hour24, p.minute, p.second) : ''
  }

  get hostClass(): string {
    return this.triggerClass('min-w-[160px]', !this.parsed)
  }

  emitTime(v: string): void {
    if (this.value === undefined) this.internal.set(v)
    this.valueChange.emit(v)
    this.onChange(v)
  }

  pickNow(): void {
    if (this.readOnly) return
    this.emitTime(nowSnapped(this.format, this.minuteStep, this.secondStep))
  }

  applyPreset(p: TimePreset): void {
    if (this.readOnly) return
    this.emitTime(p.value)
    this.setOpen(false)
  }

  clear(e: Event): void {
    e.stopPropagation()
    if (this.isDisabled || this.readOnly) return
    this.emitTime('')
  }

  writeValue(v: string | null): void {
    this.internal.set(v ?? '')
    this.cdr.markForCheck()
  }

  registerOnChange(fn: (v: string) => void): void {
    this.onChange = fn
  }
}

/**
 * Angular port of the UIPKGE React TimeRangePicker (`<button ui-time-range-picker>`): one
 * trigger showing `start ~ end`, a popover with presets, "Now (Start)" / "Now (End)" and two
 * TimeColumns side by side. `value` is a `[start, end]` tuple (or null).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'button[ui-time-range-picker]',
  standalone: true,
  imports: [UiPopoverComponent, UiPopoverContentComponent, UiTimeColumnsComponent],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiTimeRangePickerComponent), multi: true }],
  host: { ...TRIGGER_HOST, '[attr.data-slot]': '"time-range-picker"' },
  template: `
    ${CLOCK_SVG}<span class="flex-1 truncate">{{ display || placeholder }}</span>
    @if (effectiveAllowClear && display && !isDisabled && !readOnly) {
      <span
        role="button"
        tabindex="-1"
        class="${CLEAR}"
        aria-label="Clear time range"
        (click)="clear($event)"
        (mousedown)="$event.preventDefault()"
        >${X_SVG}</span
      >
    }
    <ui-popover [open]="open()" (openChange)="setOpen($event)">
      <ui-popover-content class="w-auto p-0" align="start">
        @if (presets.length > 0) {
          <div class="flex flex-col gap-0.5 border-b p-2">
            @for (p of presets; track p.label) {
              <button type="button" class="${PRESET}" (click)="applyPreset(p)">{{ p.label }}</button>
            }
          </div>
        }
        <div class="flex items-center justify-between border-b px-3 py-2">
          <span class="text-muted-foreground text-xs tracking-widest uppercase">Time Range</span>
          <div class="flex gap-2">
            <button type="button" class="${NOW}" (click)="pickNow('start')">Now (Start)</button>
            <button type="button" class="${NOW}" (click)="pickNow('end')">Now (End)</button>
          </div>
        </div>
        <div class="flex">
          <div class="flex flex-col">
            <div class="text-muted-foreground border-b px-3 py-1.5 text-center text-xs font-medium">Start</div>
            <ui-time-columns
              [value]="startValue"
              [use24Hour]="use24Hour"
              [use12Hours]="use12Hours"
              [minuteStep]="minuteStep"
              [hourStep]="hourStep"
              [secondStep]="secondStep"
              [minTime]="minTime"
              [maxTime]="maxTime"
              [format]="format"
              [disabledHours]="disabledHours"
              [disabledMinutes]="disabledMinutes"
              [disabledSeconds]="disabledSeconds"
              [hideDisabledOptions]="hideDisabledOptions"
              [visible]="open()"
              (valueChange)="emitStart($event)"
            />
          </div>
          <div class="bg-border w-px"></div>
          <div class="flex flex-col">
            <div class="text-muted-foreground border-b px-3 py-1.5 text-center text-xs font-medium">End</div>
            <ui-time-columns
              [value]="endValue"
              [use24Hour]="use24Hour"
              [use12Hours]="use12Hours"
              [minuteStep]="minuteStep"
              [hourStep]="hourStep"
              [secondStep]="secondStep"
              [minTime]="minTime"
              [maxTime]="maxTime"
              [format]="format"
              [disabledHours]="disabledHours"
              [disabledMinutes]="disabledMinutes"
              [disabledSeconds]="disabledSeconds"
              [hideDisabledOptions]="hideDisabledOptions"
              [visible]="open()"
              (valueChange)="emitEnd($event)"
            />
          </div>
        </div>
      </ui-popover-content>
    </ui-popover>
  `,
})
export class UiTimeRangePickerComponent extends TimeTriggerBase implements ControlValueAccessor {
  /** Controlled `[start, end]` (24h). `undefined` = uncontrolled. */
  @Input() value?: [string, string] | null
  @Input() presets: TimeRangePreset[] = []
  @Output() readonly valueChange = new EventEmitter<[string, string] | null>()

  override placeholder = 'Pick a time range'
  private readonly internal = signal<[string, string] | null>(null)
  private onChange: (v: [string, string] | null) => void = () => {}

  get currentValue(): [string, string] | null {
    return this.value !== undefined ? this.value : this.internal()
  }

  get startValue(): string {
    return this.currentValue?.[0] ?? ''
  }

  get endValue(): string {
    return this.currentValue?.[1] ?? ''
  }

  get display(): string {
    const s = parseTime(this.startValue)
    const e = parseTime(this.endValue)
    if (!s && !e) return ''
    const startStr = s ? formatDisplay(this.format, s.hour24, s.minute, s.second) : ''
    const endStr = e ? formatDisplay(this.format, e.hour24, e.minute, e.second) : ''
    if (s && e) return `${startStr} ~ ${endStr}`
    return startStr || endStr
  }

  get hostClass(): string {
    return this.triggerClass('min-w-[200px]', !this.display)
  }

  private emit(next: [string, string] | null): void {
    if (this.value === undefined) this.internal.set(next)
    this.valueChange.emit(next)
    this.onChange(next)
  }

  emitStart(v: string): void {
    this.emit([v, this.endValue || v])
  }

  emitEnd(v: string): void {
    this.emit([this.startValue || v, v])
  }

  pickNow(which: 'start' | 'end'): void {
    if (this.readOnly) return
    const v = nowSnapped(this.format, this.minuteStep, this.secondStep)
    if (which === 'start') this.emitStart(v)
    else this.emitEnd(v)
  }

  applyPreset(p: TimeRangePreset): void {
    if (this.readOnly) return
    this.emit(p.value)
    this.setOpen(false)
  }

  clear(e: Event): void {
    e.stopPropagation()
    if (this.isDisabled || this.readOnly) return
    this.emit(null)
  }

  writeValue(v: [string, string] | null): void {
    this.internal.set(v ?? null)
    this.cdr.markForCheck()
  }

  registerOnChange(fn: (v: [string, string] | null) => void): void {
    this.onChange = fn
  }
}
