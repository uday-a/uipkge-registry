import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  AfterViewInit,
  Output,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
  booleanAttribute,
  forwardRef,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core'
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms'
import { cn } from '@/lib/utils'
import { BodyPortal, autoPlace, pushDismissableLayer, uniqueId, type Placement } from '@/ui/popper/popper'

/** Mirrors React Slider.tsx motion styles (range ease, press scale, reduced-motion) — copied verbatim. */
const STYLE_CONTENT = `
@media (prefers-reduced-motion: no-preference) {
  [data-slot='slider-range'] {
    transition-property: left, right, top, bottom;
    transition-duration: 150ms;
    transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  }
  [data-slot='slider-thumb'] {
    scale: 1;
    transition-property: color, box-shadow, border-color, scale, left, right, top, bottom;
    transition-duration: 150ms;
    transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  }
  [data-slot='slider-thumb']:active:not([data-disabled]) {
    scale: 0.94;
    transition-duration: 100ms;
  }
  [data-slot='slider']:active [data-slot='slider-range'],
  [data-slot='slider']:active [data-slot='slider-thumb'] {
    transition-property: color, box-shadow, border-color, scale;
    transition-duration: 100ms;
  }
}
@media (prefers-reduced-motion: reduce) {
  [data-slot='slider-range'],
  [data-slot='slider-thumb'] {
    transition: none !important;
    scale: 1 !important;
  }
}
`

export interface SliderMark {
  label: string
  /** CSS properties applied to the label (React: `style`). */
  style?: Record<string, string>
}
/** Accepted by the `value` input / form control; `valueChange` always emits `number[]` like React. */
export type SliderValue = number | number[]
export type SliderSize = 'small' | 'default'
export type SliderTooltip = boolean | ((value: number) => string)
type TooltipState = 'closed' | 'delayed-open' | 'instant-open'

const PAGE_KEYS = ['PageUp', 'PageDown']
const ARROW_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
const BACK_KEYS: Record<string, string[]> = {
  'from-left': ['Home', 'PageDown', 'ArrowDown', 'ArrowLeft'],
  'from-right': ['Home', 'PageDown', 'ArrowDown', 'ArrowRight'],
  'from-bottom': ['Home', 'PageDown', 'ArrowDown', 'ArrowLeft'],
  'from-top': ['Home', 'PageDown', 'ArrowUp', 'ArrowLeft'],
}

const clamp = (v: number, [lo, hi]: [number, number]) => Math.min(hi, Math.max(lo, v))
function linearScale(input: [number, number], output: [number, number]) {
  return (value: number) => {
    if (input[0] === input[1] || output[0] === output[1]) return output[0]
    const ratio = (output[1] - output[0]) / (input[1] - input[0])
    return output[0] + ratio * (value - input[0])
  }
}
function decimalCount(value: number): number {
  if (!Number.isFinite(value)) return 0
  const str = value.toString()
  if (str.includes('e')) {
    const [coefficient = '', exponent = '0'] = str.split('e')
    return Math.max(0, (coefficient.split('.')[1] || '').length - Number(exponent))
  }
  return (str.split('.')[1] || '').length
}
const roundValue = (value: number, decimals: number) => Math.round(value * 10 ** decimals) / 10 ** decimals
export function valueToPercent(value: number, min: number, max: number): number {
  return clamp((100 / (max - min)) * (value - min), [0, 100])
}
function closestIndex(values: number[], next: number): number {
  if (values.length === 1) return 0
  const distances = values.map((v) => Math.abs(v - next))
  return distances.indexOf(Math.min(...distances))
}
/** Radix: keeps the thumb inside the track at the ends (0% / 100%). */
function thumbInBoundsOffset(size: number, percent: number, direction: number): number {
  const half = size / 2
  return (half - linearScale([0, 50], [0, half])(percent) * direction) * direction
}
function thumbLabel(index: number, total: number): string | null {
  if (total > 2) return `Value ${index + 1} of ${total}`
  if (total === 2) return ['Minimum', 'Maximum'][index] ?? null
  return null
}

/** Radix popper arrow placement (same as tooltip): wrapper pinned to the edge facing the anchor. */
function placeArrow(wrapper: HTMLElement | null, anchor: Element, floating: HTMLElement, p: Placement): void {
  if (!wrapper) return
  const a = anchor.getBoundingClientRect()
  const f = floating.getBoundingClientRect()
  const vertical = p.side === 'top' || p.side === 'bottom'
  const base = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' }[p.side]
  Object.assign(wrapper.style, {
    position: 'absolute',
    top: '',
    bottom: '',
    left: '',
    right: '',
    transformOrigin: { top: '', right: '0 0', bottom: 'center 0', left: '100% 0' }[p.side],
    transform: {
      top: 'translateY(100%)',
      right: 'translateY(50%) rotate(90deg) translateX(-50%)',
      bottom: 'rotate(180deg)',
      left: 'translateY(50%) rotate(-90deg) translateX(50%)',
    }[p.side],
  })
  wrapper.style.setProperty(base, '0px')
  if (vertical) wrapper.style.left = `${Math.max(4, Math.min(f.width - 14, a.left + a.width / 2 - f.left - 5))}px`
  else wrapper.style.top = `${Math.max(4, Math.min(f.height - 14, a.top + a.height / 2 - f.top - 5))}px`
}

let lastTooltipClosedAt = 0

/**
 * Angular port of UIPKGE Slider (React: Radix Slider + Radix Tooltip on each thumb).
 * Same DOM as React: wrapper div (this host) > root span[data-slot=slider] > track > range,
 * step dots, mark labels, and one span[role=slider] thumb per value. Radix behaviour:
 * pointer-down on the track jumps the closest thumb and drags it (pointer capture),
 * dragging a thumb moves it, Arrow / Shift+Arrow / PageUp / PageDown / Home / End step,
 * values snap to `step`, stay sorted and respect `minStepsBetweenThumbs`; `valueCommit`
 * fires at the end of a slide or a key step. Hover / focus shows the value tooltip.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-slider, [ui-slider]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  styles: [STYLE_CONTENT],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiSliderComponent), multi: true }],
  host: {
    // [attr.class], not [class]: [class] merges in the consumer's static class attribute, which
    // belongs to the inner root only.
    '[attr.class]': 'wrapperClass',
    '[style.height]': 'wrapperHeight',
  },
  template: `
    <span
      #root
      data-uipkge=""
      data-slot="slider"
      [attr.dir]="isHorizontal ? dir : null"
      [attr.data-orientation]="orientation"
      [attr.aria-disabled]="disabled"
      [attr.data-disabled]="disabled ? '' : null"
      [class]="rootClass"
      (keydown)="onKeydown($event)"
      (pointerdown)="onPointerDown($event)"
      (pointermove)="onPointerMove($event)"
      (pointerup)="onPointerUp($event)"
    >
      <span
        data-uipkge=""
        data-slot="slider-track"
        [attr.data-orientation]="orientation"
        [attr.data-disabled]="disabled ? '' : null"
        [class]="trackClass"
      >
        @if (included) {
          <span
            data-uipkge=""
            data-slot="slider-range"
            [attr.data-orientation]="orientation"
            [attr.data-disabled]="disabled ? '' : null"
            [class]="rangeClass"
            [style]="rangeStyle"
          ></span>
        }
      </span>
      @for (dot of dotList; track dot) {
        <div [class]="dotClass" [style]="edgeStyle(dot)"></div>
      }
      @if (markList.length > 0) {
        <div [class]="marksClass">
          @for (mark of markList; track mark.value) {
            <span [class]="markLabelClass" [style]="markStyle(mark)">{{ mark.label }}</span>
          }
        </div>
      }
      @for (thumb of values; track $index) {
        <span class="absolute [transform:var(--radix-slider-thumb-transform)]" [style]="thumbStyle(thumb)">
          <span
            role="slider"
            data-uipkge=""
            data-slot="slider-thumb"
            [attr.aria-label]="ariaLabel || thumbLabel($index, values.length)"
            [attr.aria-valuemin]="min"
            [attr.aria-valuenow]="thumb"
            [attr.aria-valuemax]="max"
            [attr.aria-orientation]="orientation"
            [attr.data-orientation]="orientation"
            [attr.data-disabled]="disabled ? '' : null"
            [attr.tabindex]="disabled ? null : 0"
            [attr.data-state]="showTooltip ? tooltipStateFor($index) : null"
            [attr.aria-describedby]="showTooltip && tooltipIndex() === $index ? tooltipId : null"
            [class]="thumbClass"
            (focus)="onThumbFocus($index)"
            (blur)="closeTooltip()"
            (pointermove)="onThumbPointerMove($index, $event)"
            (pointerleave)="onThumbPointerLeave()"
            (pointerdown)="onThumbPointerDown()"
            (click)="closeTooltip()"
          ></span>
        </span>
        @if (name) {
          <input hidden [attr.name]="values.length > 1 ? name + '[]' : name" [value]="thumb" />
        }
      }
    </span>
    <ng-template #tooltipTpl>
      <div
        [id]="tooltipId"
        role="tooltip"
        [attr.data-state]="tooltipState()"
        class="bg-foreground text-background z-50 w-fit rounded-md px-2 py-1 text-xs"
      >
        {{ tooltipText }}
        <span data-tooltip-arrow=""
          ><svg
            class="bg-foreground fill-foreground size-2.5 rotate-45 rounded-[2px]"
            width="10"
            height="5"
            viewBox="0 0 30 10"
            preserveAspectRatio="none"
          >
            <polygon points="0,0 30,0 15,10" /></svg
        ></span>
      </div>
    </ng-template>
  `,
})
export class UiSliderComponent implements ControlValueAccessor, AfterViewInit, OnDestroy {
  private readonly cdr = inject(ChangeDetectorRef)
  private readonly portal = new BodyPortal(inject(ViewContainerRef))

  /** Controlled value (React: number[]; a plain number is accepted for form controls / one-thumb bindings). */
  @Input()
  set value(v: SliderValue | null | undefined) {
    this._value.set(v ?? undefined)
  }
  get value(): SliderValue | undefined {
    return this._value()
  }
  /** Uncontrolled initial value. */
  @Input() defaultValue?: number[]
  @Output() valueChange = new EventEmitter<number[]>()
  @Output() valueCommit = new EventEmitter<number[]>()
  @Input() min = 0
  @Input() max = 100
  @Input() step = 1
  @Input() minStepsBetweenThumbs = 0
  @Input() name?: string
  @Input() dir: 'ltr' | 'rtl' = 'ltr'
  @Input('aria-label') ariaLabel?: string
  @Input({ transform: booleanAttribute }) disabled = false
  /** Dual-thumb range selection (affects the default value when uncontrolled). */
  @Input({ transform: booleanAttribute }) range = false
  @Input({ transform: booleanAttribute }) vertical = false
  /** Height when vertical (px number or CSS value). */
  @Input() height?: string | number
  @Input() marks?: Record<number, string | SliderMark>
  /** Show a tooltip on hover / focus. Boolean or formatter function. */
  @Input() tooltip: SliderTooltip = true
  @Input({ transform: booleanAttribute }) dots = false
  @Input({ transform: booleanAttribute }) reverse = false
  @Input({ transform: booleanAttribute }) included = true
  @Input() size: SliderSize = 'default'
  /** Classes for the Radix Root span (React `className`). */
  @Input('class') className?: string

  @ViewChild('root', { static: true }) rootRef!: ElementRef<HTMLElement>
  @ViewChild('tooltipTpl', { static: true }) tooltipTpl!: TemplateRef<unknown>

  readonly tooltipId = uniqueId('slider-tooltip')
  readonly thumbLabel = thumbLabel
  readonly tooltipIndex = signal<number | null>(null)
  readonly tooltipState = signal<TooltipState>('closed')

  private readonly _value = signal<SliderValue | undefined>(undefined)
  private readonly _internal = signal<number[] | null>(null)
  private readonly thumbSize = signal<{ width: number; height: number } | null>(null)
  private valueIndexToChange = 0
  private valuesBeforeSlide: number[] = []
  private keyboard = false
  private captureTarget: EventTarget | null = null
  private formBound = false
  private onChange: (v: SliderValue) => void = () => {}
  private onTouched: () => void = () => {}
  private ro?: ResizeObserver
  private tooltipCleanups: (() => void)[] = []
  private tooltipTimer?: ReturnType<typeof setTimeout>
  private pointerMoveOpened = false
  private pointerDownOnThumb = false

  get orientation(): 'horizontal' | 'vertical' {
    return this.vertical ? 'vertical' : 'horizontal'
  }
  get isHorizontal(): boolean {
    return !this.vertical
  }

  /** Current thumb values (controlled value, else internal state, else default). */
  get values(): number[] {
    const v = this._value()
    if (v !== undefined) return Array.isArray(v) ? v : [v]
    return this._internal() ?? this.defaultValue ?? (this.range ? [this.min, this.max] : [this.min])
  }

  private get slidingFromStart(): boolean {
    if (this.isHorizontal) return (this.dir === 'ltr') !== this.reverse
    return !this.reverse
  }
  private get startEdge(): string {
    if (this.isHorizontal) return this.slidingFromStart ? 'left' : 'right'
    return this.slidingFromStart ? 'bottom' : 'top'
  }
  private get endEdge(): string {
    const opposite: Record<string, string> = { left: 'right', right: 'left', top: 'bottom', bottom: 'top' }
    return opposite[this.startEdge]!
  }
  private get direction(): number {
    return this.slidingFromStart ? 1 : -1
  }

  // ── classes (verbatim from React) ──
  get wrapperClass(): string {
    return cn('block relative w-full', !this.isHorizontal && 'flex flex-col items-center')
  }
  get wrapperHeight(): string | null {
    if (this.isHorizontal || this.height == null || this.height === '') return null
    return typeof this.height === 'number' ? `${this.height}px` : this.height
  }
  get rootClass(): string {
    return cn(
      'relative flex touch-none select-none data-[disabled]:opacity-50',
      this.isHorizontal ? 'w-full items-center' : 'h-full min-h-44 flex-col justify-center',
      this.isHorizontal
        ? '[--radix-slider-thumb-transform:translateX(-50%)]'
        : '[--radix-slider-thumb-transform:translateY(50%)]',
      this.className,
    )
  }
  get trackClass(): string {
    const trackSize =
      this.size === 'small' ? (this.isHorizontal ? 'h-1' : 'w-1') : this.isHorizontal ? 'h-1.5' : 'w-1.5'
    return cn('bg-muted relative grow overflow-hidden rounded-full', trackSize)
  }
  get rangeClass(): string {
    return cn('bg-primary absolute', this.isHorizontal ? 'h-full' : 'w-full')
  }
  get thumbClass(): string {
    return cn(
      'border-primary bg-background ring-ring/50 block shrink-0 rounded-full border shadow-sm touch-manipulation hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 data-[disabled]:pointer-events-none',
      this.size === 'small' ? 'size-3' : 'size-4',
    )
  }
  get dotClass(): string {
    return cn(
      'border-primary/40 bg-background absolute rounded-full border',
      this.isHorizontal ? 'top-1/2 size-1.5 -translate-y-1/2' : 'left-1/2 size-1.5 -translate-x-1/2',
      this.size === 'small' && 'size-1',
      // React sets these transforms inline; same values as arbitrary-property utilities.
      this.isHorizontal
        ? '[transform:translateX(-50%)_translateY(-50%)]'
        : '[transform:translateX(-50%)_translateY(50%)]',
    )
  }
  get marksClass(): string {
    return cn(
      'pointer-events-none absolute',
      this.isHorizontal ? 'top-full mt-2.5 h-5 w-full' : 'top-0 left-full ml-3 h-full w-20',
    )
  }
  get markLabelClass(): string {
    return cn(
      'text-muted-foreground absolute text-xs whitespace-nowrap',
      this.isHorizontal ? '[transform:translateX(-50%)]' : '[transform:translateY(50%)]',
    )
  }

  // ── derived lists / styles ──
  get markList(): { value: number; label: string; style?: Record<string, string>; pct: number }[] {
    if (!this.marks) return []
    return Object.entries(this.marks)
      .map(([key, val]) => {
        const num = Number(key)
        return {
          value: num,
          label: typeof val === 'string' ? val : val.label,
          style: typeof val === 'string' ? undefined : val.style,
          pct: ((num - this.min) / (this.max - this.min)) * 100,
        }
      })
      .sort((a, b) => a.value - b.value)
  }
  get dotList(): number[] {
    if (!this.dots) return []
    const list: number[] = []
    const count = Math.floor((this.max - this.min) / this.step)
    for (let i = 0; i <= count; i++) list.push(this.min + i * this.step)
    return list
  }
  get rangeStyle(): Record<string, string> {
    const pcts = this.values.map((v) => valueToPercent(v, this.min, this.max))
    const start = pcts.length > 1 ? Math.min(...pcts) : 0
    const end = 100 - Math.max(...pcts)
    return { [this.startEdge]: `${start}%`, [this.endEdge]: `${end}%` }
  }
  edgeStyle(value: number): Record<string, string> {
    const pct = `${((value - this.min) / (this.max - this.min)) * 100}%`
    return this.isHorizontal ? { left: pct } : { bottom: pct }
  }
  markStyle(mark: { style?: Record<string, string>; pct: number }): Record<string, string> {
    return { ...mark.style, ...(this.isHorizontal ? { left: `${mark.pct}%` } : { bottom: `${mark.pct}%` }) }
  }
  thumbStyle(value: number): Record<string, string> {
    const pct = valueToPercent(value, this.min, this.max)
    const size = this.thumbSize()?.[this.isHorizontal ? 'width' : 'height']
    const offset = size ? thumbInBoundsOffset(size, pct, this.direction) : 0
    return { [this.startEdge]: `calc(${pct}% + ${offset}px)` }
  }

  // ── tooltip ──
  get showTooltip(): boolean {
    return this.tooltip !== false
  }
  get tooltipText(): string {
    const i = this.tooltipIndex()
    const v = i === null ? undefined : this.values[i]
    const n = v ?? 0
    return typeof this.tooltip === 'function' ? this.tooltip(n) : String(n)
  }
  tooltipStateFor(index: number): TooltipState {
    return this.tooltipIndex() === index ? this.tooltipState() : 'closed'
  }

  // ── value updates (Radix updateValues) ──
  private updateValues(raw: number, atIndex: number, commit = false): void {
    const snapped = roundValue(Math.round((raw - this.min) / this.step) * this.step + this.min, decimalCount(this.step))
    const next = clamp(snapped, [this.min, this.max])
    const prev = this.values
    const nextValues = [...prev]
    nextValues[atIndex] = next
    nextValues.sort((a, b) => a - b)
    const minGap = this.minStepsBetweenThumbs * this.step
    if (minGap > 0) {
      const gaps = nextValues.slice(0, -1).map((v, i) => nextValues[i + 1]! - v)
      if (Math.min(...gaps) < minGap) return
    }
    this.valueIndexToChange = nextValues.indexOf(next)
    if (String(nextValues) === String(prev)) return
    this.setValues(nextValues)
    if (commit) this.valueCommit.emit(nextValues)
  }

  private setValues(next: number[]): void {
    const current = this._value()
    if (current === undefined) this._internal.set(next)
    else if (this.formBound) this._value.set(Array.isArray(current) ? next : next[0])
    this.thumbs()[this.valueIndexToChange]?.focus({ preventScroll: true, focusVisible: this.keyboard } as FocusOptions)
    this.keyboard = false
    this.valueChange.emit(next)
    this.onChange(Array.isArray(current) || current === undefined ? next : (next[0] ?? this.min))
  }

  private thumbs(): HTMLElement[] {
    return [...this.rootRef.nativeElement.querySelectorAll<HTMLElement>('[data-slot="slider-thumb"]')]
  }

  private valueFromPointer(event: PointerEvent): number {
    const rect = this.rootRef.nativeElement.getBoundingClientRect()
    if (this.isHorizontal) {
      const out: [number, number] = this.slidingFromStart ? [this.min, this.max] : [this.max, this.min]
      return linearScale([0, rect.width], out)(event.clientX - rect.left)
    }
    const out: [number, number] = this.slidingFromStart ? [this.max, this.min] : [this.min, this.max]
    return linearScale([0, rect.height], out)(event.clientY - rect.top)
  }

  onKeydown(event: KeyboardEvent): void {
    if (this.disabled) return
    const key = event.key
    if (key === 'Home') {
      this.keyboard = true
      this.updateValues(this.min, 0, true)
      event.preventDefault()
    } else if (key === 'End') {
      this.keyboard = true
      this.updateValues(this.max, this.values.length - 1, true)
      event.preventDefault()
    } else if (PAGE_KEYS.includes(key) || ARROW_KEYS.includes(key)) {
      this.keyboard = true
      const slide = this.isHorizontal
        ? this.slidingFromStart
          ? 'from-left'
          : 'from-right'
        : this.slidingFromStart
          ? 'from-bottom'
          : 'from-top'
      const dir = BACK_KEYS[slide]!.includes(key) ? -1 : 1
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
    this.keyboard = false
    const target = event.target as HTMLElement
    target.setPointerCapture?.(event.pointerId)
    this.captureTarget = target
    event.preventDefault()
    if (this.thumbs().includes(target)) {
      target.focus({ preventScroll: true, focusVisible: false } as FocusOptions)
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
    if (this.values[i] !== this.valuesBeforeSlide[i]) this.valueCommit.emit(this.values)
    this.onTouched()
  }

  private isCaptured(event: PointerEvent): boolean {
    const target = event.target as HTMLElement
    return target.hasPointerCapture ? target.hasPointerCapture(event.pointerId) : this.captureTarget === target
  }

  // ── thumb tooltip (Radix Tooltip, delayDuration 0) ──
  onThumbFocus(index: number): void {
    this.valueIndexToChange = index
    if (!this.pointerDownOnThumb) this.openTooltip(index, 'instant-open')
  }

  onThumbPointerMove(index: number, event: PointerEvent): void {
    if (event.pointerType === 'touch' || this.pointerMoveOpened) return
    this.pointerMoveOpened = true
    clearTimeout(this.tooltipTimer)
    if (Date.now() - lastTooltipClosedAt < 300) this.openTooltip(index, 'instant-open')
    else this.tooltipTimer = setTimeout(() => this.openTooltip(index, 'delayed-open'), 0)
  }

  onThumbPointerLeave(): void {
    this.pointerMoveOpened = false
    this.closeTooltip()
  }

  onThumbPointerDown(): void {
    this.closeTooltip()
    this.pointerDownOnThumb = true
    document.addEventListener('pointerup', () => (this.pointerDownOnThumb = false), { once: true })
  }

  private openTooltip(index: number, how: TooltipState): void {
    if (!this.showTooltip || this.disabled) return
    const thumb = this.thumbs()[index]
    if (!thumb) return
    this.tooltipCleanups.splice(0).forEach((fn) => fn())
    this.tooltipIndex.set(index)
    this.tooltipState.set(how)
    if (!this.portal.attached) this.portal.attach(this.tooltipTpl)
    const panel = document.getElementById(this.tooltipId)
    if (!panel) return
    const arrow = panel.querySelector<HTMLElement>('[data-tooltip-arrow]')
    // Radix Popper offsets by sideOffset (4) + the arrow's layout height (size-2.5 = 10px, unrotated).
    const svg = arrow?.firstElementChild
    const arrowHeight = (svg && parseFloat(getComputedStyle(svg).height)) || 10
    const place = () =>
      autoPlace(
        thumb,
        panel,
        () => ({
          side: this.isHorizontal ? 'top' : 'right',
          align: 'center',
          sideOffset: 4 + arrowHeight,
          alignOffset: 0,
          collisionPadding: 0,
          avoidCollisions: true,
        }),
        'tooltip',
        (p) => placeArrow(arrow, thumb, panel, p),
      )
    let stop = place()
    // Follow the thumb while its value changes (keyboard steps, track drags).
    const follow = new MutationObserver(() => {
      stop()
      stop = place()
    })
    if (thumb.parentElement) follow.observe(thumb.parentElement, { attributes: true, attributeFilter: ['style'] })
    this.tooltipCleanups.push(
      () => stop(),
      () => follow.disconnect(),
      pushDismissableLayer({
        contains: () => true,
        onEscape: () => this.closeTooltip(),
        onPointerDownOutside: () => {},
      }),
    )
  }

  closeTooltip(): void {
    clearTimeout(this.tooltipTimer)
    if (this.tooltipIndex() === null) return
    lastTooltipClosedAt = Date.now()
    this.tooltipCleanups.splice(0).forEach((fn) => fn())
    this.tooltipIndex.set(null)
    this.tooltipState.set('closed')
    this.portal.detach()
  }

  ngAfterViewInit(): void {
    if (typeof ResizeObserver === 'undefined') return
    this.ro = new ResizeObserver(() => {
      const t = this.thumbs()[0]
      if (t) this.thumbSize.set({ width: t.offsetWidth, height: t.offsetHeight })
    })
    this.ro.observe(this.rootRef.nativeElement)
  }

  ngOnDestroy(): void {
    this.ro?.disconnect()
    clearTimeout(this.tooltipTimer)
    this.tooltipCleanups.splice(0).forEach((fn) => fn())
    this.portal.detach()
  }

  // ── ControlValueAccessor ──
  writeValue(v: SliderValue | null): void {
    this._value.set(v ?? undefined)
    this.cdr.markForCheck()
  }
  registerOnChange(fn: (v: SliderValue) => void): void {
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
