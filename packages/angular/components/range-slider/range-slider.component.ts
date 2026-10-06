import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
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
import { uniqueId } from '@/ui/popper/popper'

export type RangeSliderValue = [number, number]
export type RangeSliderColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | (string & {})
export type RangeSliderThumbSize = 'sm' | 'md' | 'lg'
export type RangeSliderTrackHeight = 'sm' | 'md' | 'lg'

const colorClasses: Record<string, string> = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-destructive',
  info: 'bg-info',
}

const trackHeightClasses: Record<RangeSliderTrackHeight, string> = {
  sm: 'h-1',
  md: 'h-1.5',
  lg: 'h-2',
}

const thumbSizeClasses: Record<RangeSliderThumbSize, string> = {
  sm: 'size-3',
  md: 'size-4',
  lg: 'size-5',
}

const PAGE_KEYS = ['PageUp', 'PageDown']
const ARROW_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
const BACK_KEYS: Record<'from-left' | 'from-right', string[]> = {
  'from-left': ['Home', 'PageDown', 'ArrowDown', 'ArrowLeft'],
  'from-right': ['Home', 'PageDown', 'ArrowDown', 'ArrowRight'],
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))
function linearScale(input: [number, number], output: [number, number]) {
  return (value: number) => {
    if (input[0] === input[1] || output[0] === output[1]) return output[0]
    const ratio = (output[1] - output[0]) / (input[1] - input[0])
    return output[0] + ratio * (value - input[0])
  }
}
function decimalCount(value: number): number {
  return (String(value).split('.')[1] || '').length
}
const roundValue = (value: number, decimals: number) => Math.round(value * 10 ** decimals) / 10 ** decimals
const toPercent = (value: number, min: number, max: number) => clamp((100 / (max - min)) * (value - min), 0, 100)
function closestIndex(values: number[], next: number): number {
  const distances = values.map((v) => Math.abs(v - next))
  return distances.indexOf(Math.min(...distances))
}
/** Radix: keeps the thumb inside the track at the ends (0% / 100%). */
function thumbInBoundsOffset(size: number, percent: number, direction: number): number {
  const half = size / 2
  return (half - linearScale([0, 50], [0, half])(percent) * direction) * direction
}

/**
 * Angular port of the React RangeSlider (Radix Slider Root with two thumbs, wrapped in a
 * label / hint / min-max readout / error layout). Same DOM as React: the Radix root
 * span[data-slot=range-slider] > track > range, optional ticks, two span[role=slider]
 * thumbs (optional value bubbles). Radix behaviour: pressing the track moves the closest
 * thumb and drags it (pointer capture), Arrow / Shift+Arrow / PageUp / PageDown / Home /
 * End step, values snap to `step` and stay sorted, `inverted` / `dir` flip the direction,
 * `valueCommit` fires at the end of a slide or key step.
 *
 * `value` / `defaultValue` / `valueChange` (`[(value)]`, a `[min, max]` tuple) plus
 * NG_VALUE_ACCESSOR.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-range-slider, [ui-range-slider]',
  standalone: true,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiRangeSliderComponent), multi: true }],
  host: {
    '[attr.class]': '"flex flex-col gap-2"',
    // id / class belong to the Radix root (React spreads them there).
    '[attr.id]': 'null',
  },
  template: `
    @if (label) {
      <label [attr.for]="fieldId" class="text-sm font-medium">{{ label }}</label>
    }
    @if (hint && !hasError) {
      <p [id]="fieldId + '-hint'" class="text-muted-foreground text-xs">{{ hint }}</p>
    }
    <div class="flex items-center gap-4">
      <div class="text-muted-foreground min-w-[3rem] text-sm tabular-nums" aria-hidden="true">
        {{ valueAt(0, min) }}
      </div>
      <span
        #root
        [id]="fieldId"
        data-slot="range-slider"
        [attr.dir]="dir"
        data-orientation="horizontal"
        [attr.aria-disabled]="disabled"
        [attr.data-disabled]="disabled ? '' : null"
        [attr.aria-describedby]="describedBy"
        [attr.aria-invalid]="hasError || null"
        [class]="rootClass"
        (keydown)="onKeydown($event)"
        (pointerdown)="onPointerDown($event)"
        (pointermove)="onPointerMove($event)"
        (pointerup)="onPointerUp($event)"
      >
        <span
          data-uipkge=""
          data-slot="slider-track"
          data-orientation="horizontal"
          [attr.data-disabled]="disabled ? '' : null"
          [class]="trackClass"
        >
          <span
            data-uipkge=""
            data-slot="slider-range"
            data-orientation="horizontal"
            [attr.data-disabled]="disabled ? '' : null"
            [class]="rangeClass"
            [style]="rangeStyle"
          ></span>
        </span>
        @if (showTicks && ticks.length > 0) {
          <div
            class="pointer-events-none absolute top-1/2 right-0 left-0 flex -translate-y-1/2 justify-between"
            aria-hidden="true"
          >
            @for (tick of ticks; track tick) {
              <div class="bg-muted-foreground/30 h-2 w-0.5 rounded-full"></div>
            }
          </div>
        }
        @for (thumb of values; track $index) {
          <span class="absolute [transform:var(--radix-slider-thumb-transform)]" [style]="thumbStyle(thumb)">
            <span
              role="slider"
              data-uipkge=""
              data-slot="slider-thumb"
              [attr.aria-label]="thumbAriaLabel($index)"
              [attr.aria-valuemin]="min"
              [attr.aria-valuenow]="thumb"
              [attr.aria-valuemax]="max"
              aria-orientation="horizontal"
              data-orientation="horizontal"
              [attr.data-disabled]="disabled ? '' : null"
              [attr.tabindex]="disabled ? null : 0"
              [class]="thumbClass"
              (focus)="valueIndexToChange = $index"
              (blur)="onTouched()"
            >
              @if (thumbLabel) {
                <span
                  class="bg-background absolute -top-6 left-1/2 -translate-x-1/2 rounded px-1 text-xs whitespace-nowrap"
                  >{{ formatThumb(valueAt($index, 0)) }}</span
                >
              }
            </span>
            @if (name) {
              <input hidden [attr.name]="name + '[]'" [value]="thumb" />
            }
          </span>
        }
      </span>
      <div class="text-muted-foreground min-w-[3rem] text-sm tabular-nums" aria-hidden="true">
        {{ valueAt(1, max) }}
      </div>
    </div>
    @if (showTicks && ticks.length > 0) {
      <div class="text-muted-foreground flex justify-between px-1 text-xs" aria-hidden="true">
        <span>{{ min }}</span>
        <span>{{ max }}</span>
      </div>
    }
    @if (hasError) {
      <div [id]="fieldId + '-error'" class="flex flex-col gap-0.5" role="alert">
        @for (msg of errorList; track $index) {
          <p class="text-destructive text-xs">{{ msg }}</p>
        }
      </div>
    }
  `,
})
export class UiRangeSliderComponent implements ControlValueAccessor, AfterViewInit, OnDestroy {
  private readonly cdr = inject(ChangeDetectorRef)
  private readonly autoId = uniqueId('range-slider')
  private readonly _value = signal<RangeSliderValue | undefined>(undefined)
  private readonly _internal = signal<RangeSliderValue | null>(null)
  private readonly thumbWidth = signal<number | null>(null)
  private valuesBeforeSlide: number[] = []
  private captureTarget: EventTarget | null = null
  private formBound = false
  private onChange: (v: RangeSliderValue) => void = () => {}
  private ro?: ResizeObserver
  valueIndexToChange = 0
  onTouched: () => void = () => {}

  /** Controlled value (React `value`). Reading it returns the current tuple. */
  @Input()
  set value(v: RangeSliderValue | null | undefined) {
    this._value.set(v ?? undefined)
  }
  get value(): RangeSliderValue {
    return this._value() ?? this._internal() ?? this.defaultValue ?? [this.min, this.max]
  }
  /** Uncontrolled initial value. */
  @Input() defaultValue?: RangeSliderValue
  @Output() valueChange = new EventEmitter<RangeSliderValue>()
  /** Radix `onValueCommit`: end of a slide or a key step. */
  @Output() valueCommit = new EventEmitter<RangeSliderValue>()
  @Input({ transform: booleanAttribute }) disabled = false
  @Input({ transform: numberAttribute }) min = 0
  @Input({ transform: numberAttribute }) max = 100
  @Input({ transform: numberAttribute }) step = 1
  @Input() label?: string
  @Input() hint?: string
  @Input() errorMessages?: string | string[]
  @Input({ transform: booleanAttribute }) error = false
  /** Track fill color. */
  @Input() color: RangeSliderColor = 'primary'
  @Input() thumbSize: RangeSliderThumbSize = 'md'
  @Input() trackHeight: RangeSliderTrackHeight = 'md'
  @Input({ transform: booleanAttribute }) showTicks = false
  @Input({ transform: numberAttribute }) tickInterval?: number
  /** Always-visible value bubbles above the thumbs. */
  @Input({ transform: booleanAttribute }) thumbLabel = false
  @Input() thumbLabelFormat?: (value: number) => string
  /** Radix Root props (React spreads them onto the root). */
  @Input({ transform: booleanAttribute }) inverted = false
  @Input() dir: 'ltr' | 'rtl' = 'ltr'
  @Input() name?: string
  @Input({ transform: numberAttribute }) minStepsBetweenThumbs = 0
  @Input() id?: string
  @Input('class') className?: string

  @ViewChild('root', { static: true }) rootRef!: ElementRef<HTMLElement>

  get fieldId(): string {
    return this.id || this.autoId
  }

  get values(): number[] {
    return this.value
  }

  /** `value` can be shorter than the thumbs (e.g. still empty), so reads fall back explicitly. */
  valueAt(index: number, fallback: number): number {
    return this.values[index] ?? fallback
  }

  get hasError(): boolean {
    const m = this.errorMessages
    return this.error || Boolean(m && (typeof m === 'string' ? m : m.length > 0))
  }

  get errorList(): string[] {
    const m = this.errorMessages
    return !m ? [] : typeof m === 'string' ? [m] : m
  }

  get describedBy(): string | null {
    if (this.hint && !this.hasError) return `${this.fieldId}-hint`
    return this.hasError ? `${this.fieldId}-error` : null
  }

  get ticks(): number[] {
    if (!this.showTicks || !this.tickInterval) return []
    const result: number[] = []
    for (let i = this.min; i <= this.max; i += this.tickInterval) result.push(i)
    return result
  }

  private get slidingFromLeft(): boolean {
    return (this.dir !== 'rtl') !== this.inverted
  }

  // ── classes (verbatim from React) ──
  get rootClass(): string {
    // Radix sets --radix-slider-thumb-transform inline on the root; same value as a utility.
    return cn(
      'relative flex w-full touch-none items-center select-none',
      '[--radix-slider-thumb-transform:translateX(-50%)]',
      this.className,
    )
  }
  get trackClass(): string {
    return cn('bg-muted relative w-full overflow-hidden rounded-full', trackHeightClasses[this.trackHeight])
  }
  get rangeClass(): string {
    return cn('absolute h-full', colorClasses[this.color] || colorClasses['primary'])
  }
  get thumbClass(): string {
    return cn(
      'border-primary ring-ring/50 bg-background block rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50',
      thumbSizeClasses[this.thumbSize],
      this.hasError && 'border-destructive',
    )
  }

  // ── Radix positioning ──
  get rangeStyle(): Record<string, string> {
    const pcts = this.values.map((v) => toPercent(v, this.min, this.max))
    const start = pcts.length > 1 ? Math.min(...pcts) : 0
    const end = 100 - Math.max(...pcts)
    const [s, e] = this.slidingFromLeft ? ['left', 'right'] : ['right', 'left']
    return { [s]: `${start}%`, [e]: `${end}%` }
  }
  thumbStyle(value: number): Record<string, string> {
    const pct = toPercent(value, this.min, this.max)
    const size = this.thumbWidth()
    const direction = this.slidingFromLeft ? 1 : -1
    const offset = size ? thumbInBoundsOffset(size, pct, direction) : 0
    return { [this.slidingFromLeft ? 'left' : 'right']: `calc(${pct}% + ${offset}px)` }
  }

  thumbAriaLabel(index: number): string {
    const which = index === 0 ? 'minimum' : 'maximum'
    return this.label ? `${this.label} ${which}` : index === 0 ? 'Minimum value' : 'Maximum value'
  }

  formatThumb(v: number): string | number {
    return this.thumbLabelFormat ? this.thumbLabelFormat(v) : v
  }

  // ── value updates (Radix updateValues) ──
  private updateValues(raw: number, atIndex: number, commit = false): void {
    const snapped = roundValue(Math.round((raw - this.min) / this.step) * this.step + this.min, decimalCount(this.step))
    const next = clamp(snapped, this.min, this.max)
    const prev = this.values
    const nextValues = [...prev]
    nextValues[atIndex] = next
    nextValues.sort((a, b) => a - b)
    const minGap = this.minStepsBetweenThumbs * this.step
    if (minGap > 0 && nextValues[1]! - nextValues[0]! < minGap) return
    this.valueIndexToChange = nextValues.indexOf(next)
    if (String(nextValues) === String(prev)) return
    const tuple: RangeSliderValue = [nextValues[0]!, nextValues[1]!]
    if (this._value() === undefined) this._internal.set(tuple)
    else if (this.formBound) this._value.set(tuple)
    this.thumbs()[this.valueIndexToChange]?.focus({ preventScroll: true })
    this.valueChange.emit(tuple)
    this.onChange(tuple)
    if (commit) this.valueCommit.emit(tuple)
  }

  private thumbs(): HTMLElement[] {
    return [...this.rootRef.nativeElement.querySelectorAll<HTMLElement>('[data-slot="slider-thumb"]')]
  }

  private valueFromPointer(event: PointerEvent): number {
    const rect = this.rootRef.nativeElement.getBoundingClientRect()
    const out: [number, number] = this.slidingFromLeft ? [this.min, this.max] : [this.max, this.min]
    return linearScale([0, rect.width], out)(event.clientX - rect.left)
  }

  onKeydown(event: KeyboardEvent): void {
    if (this.disabled) return
    const key = event.key
    if (key === 'Home') {
      this.updateValues(this.min, 0, true)
      event.preventDefault()
    } else if (key === 'End') {
      this.updateValues(this.max, this.values.length - 1, true)
      event.preventDefault()
    } else if (PAGE_KEYS.includes(key) || ARROW_KEYS.includes(key)) {
      const dir = BACK_KEYS[this.slidingFromLeft ? 'from-left' : 'from-right'].includes(key) ? -1 : 1
      const skip = PAGE_KEYS.includes(key) || (event.shiftKey && ARROW_KEYS.includes(key))
      const atIndex = this.valueIndexToChange
      const current = this.values[atIndex] ?? this.min
      this.updateValues(current + this.step * (skip ? 10 : 1) * dir, atIndex, true)
      event.preventDefault()
    }
  }

  onPointerDown(event: PointerEvent): void {
    if (this.disabled) return
    this.valuesBeforeSlide = this.values
    const target = event.target as HTMLElement
    target.setPointerCapture?.(event.pointerId)
    this.captureTarget = target
    event.preventDefault()
    const thumbs = this.thumbs()
    if (thumbs.includes(target)) {
      this.valueIndexToChange = thumbs.indexOf(target)
      target.focus({ preventScroll: true })
    } else {
      const v = this.valueFromPointer(event)
      this.updateValues(v, closestIndex(this.values, v))
    }
  }

  onPointerMove(event: PointerEvent): void {
    if (this.disabled || !this.isCaptured(event)) return
    this.updateValues(this.valueFromPointer(event), this.valueIndexToChange)
  }

  onPointerUp(event: PointerEvent): void {
    if (this.disabled || !this.isCaptured(event)) return
    const target = event.target as HTMLElement
    target.releasePointerCapture?.(event.pointerId)
    this.captureTarget = null
    const i = this.valueIndexToChange
    if (this.values[i] !== this.valuesBeforeSlide[i]) this.valueCommit.emit([this.values[0]!, this.values[1]!])
    this.onTouched()
  }

  private isCaptured(event: PointerEvent): boolean {
    const target = event.target as HTMLElement
    return target.hasPointerCapture ? target.hasPointerCapture(event.pointerId) : this.captureTarget === target
  }

  ngAfterViewInit(): void {
    if (typeof ResizeObserver === 'undefined') return
    this.ro = new ResizeObserver(() => {
      const t = this.thumbs()[0]
      if (t) this.thumbWidth.set(t.offsetWidth)
    })
    this.ro.observe(this.rootRef.nativeElement)
    const t = this.thumbs()[0]
    if (t) this.ro.observe(t)
  }

  ngOnDestroy(): void {
    this.ro?.disconnect()
  }

  // ── ControlValueAccessor ──
  writeValue(v: RangeSliderValue | null): void {
    this._value.set(v ?? undefined)
    this.cdr.markForCheck()
  }
  registerOnChange(fn: (v: RangeSliderValue) => void): void {
    this.formBound = true
    this.onChange = fn
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled
    this.cdr.markForCheck()
  }
}
