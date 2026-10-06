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
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  booleanAttribute,
  forwardRef,
  inject,
  numberAttribute,
  signal,
  type EmbeddedViewRef,
  ChangeDetectionStrategy,
} from '@angular/core'
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms'
import { cn } from '@/lib/utils'

/** Context of the `renderValue` template (React `renderValue(value)`): `let-value`. */
export interface KnobValueContext {
  $implicit: number
}

const startAngle = -Math.PI * 0.75
const endAngle = Math.PI * 0.75
const sweep = endAngle - startAngle

function clamp(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v))
}

function arcPath(cx: number, cy: number, r: number, a1: number, a2: number): string {
  const x1 = cx + r * Math.cos(a1)
  const y1 = cy + r * Math.sin(a1)
  const x2 = cx + r * Math.cos(a2)
  const y2 = cy + r * Math.sin(a2)
  const large = a2 - a1 > Math.PI ? 1 : 0
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`
}

/** Renders the `renderValue` template with the current value (keeps one view, updates its context). */
@Directive({ selector: '[uiKnobValue]', standalone: true })
export class UiKnobValueDirective implements OnChanges, OnDestroy {
  @Input('uiKnobValue') template!: TemplateRef<KnobValueContext>
  @Input('uiKnobValueOf') value = 0
  private readonly vcr = inject(ViewContainerRef)
  private view?: EmbeddedViewRef<KnobValueContext>

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['template'] || !this.view) {
      this.vcr.clear()
      this.view = this.vcr.createEmbeddedView(this.template, { $implicit: this.value })
    } else {
      this.view.context.$implicit = this.value
    }
  }

  ngOnDestroy(): void {
    this.vcr.clear()
  }
}

/**
 * Angular port of the React Knob: the dial IS the `<svg role="slider">` (this host is
 * `contents`, so the svg lays out exactly like React's root). Drag anywhere on the dial
 * (pointer capture), Arrow keys step, PageUp / PageDown step x10, Home / End jump, and
 * the wheel steps without scrolling the page. `value` / `defaultValue` / `valueChange`
 * (`[(value)]`) plus `change` (React `onChange`) and NG_VALUE_ACCESSOR. `renderValue`
 * is a template for the centred text (`<ng-template let-value>`, SVG content).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-knob, [ui-knob]',
  standalone: true,
  imports: [UiKnobValueDirective],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiKnobComponent), multi: true }],
  host: {
    // class / aria-label belong to the svg (React's root); the host only stays out of layout.
    '[attr.class]': '"contents"',
    '[attr.aria-label]': 'null',
  },
  template: `
    <svg
      #svg
      data-uipkge=""
      data-slot="knob"
      [attr.class]="svgClass"
      [attr.width]="size"
      [attr.height]="size"
      viewBox="0 0 100 100"
      role="slider"
      [attr.aria-label]="ariaLabel"
      [attr.aria-valuemin]="min"
      [attr.aria-valuemax]="max"
      [attr.aria-valuenow]="current"
      [attr.aria-disabled]="disabled || null"
      [attr.aria-readonly]="readonly || null"
      [attr.tabindex]="disabled ? -1 : 0"
      (pointerdown)="onPointerDown($event)"
      (pointermove)="onPointerMove($event)"
      (pointerup)="onPointerUp($event)"
      (pointercancel)="onPointerUp($event)"
      (keydown)="onKeyDown($event)"
      (blur)="onTouched()"
    >
      <path
        [attr.d]="rangePath"
        [attr.stroke]="rangeColor"
        [attr.stroke-width]="strokeWidth"
        fill="none"
        stroke-linecap="round"
      />
      <path
        [attr.d]="valuePath"
        [attr.stroke]="valueColor"
        [attr.stroke-width]="strokeWidth"
        fill="none"
        stroke-linecap="round"
      />
      @if (showValue) {
        <text x="50" y="55" text-anchor="middle" font-size="18" class="fill-foreground font-medium">
          @if (renderValue) {
            <ng-container [uiKnobValue]="renderValue" [uiKnobValueOf]="current" />
          } @else {
            <ng-container>{{ current }}</ng-container>
          }
        </text>
      }
    </svg>
  `,
})
export class UiKnobComponent implements ControlValueAccessor, AfterViewInit, OnDestroy {
  // Zoneless-safe: form writes happen outside template events, so schedule a repaint.
  private readonly cdr = inject(ChangeDetectorRef)
  private readonly _value = signal<number | undefined>(undefined)
  private readonly _internal = signal<number | null>(null)
  private readonly dragging = signal(false)
  private formBound = false
  private onChangeFn: (v: number) => void = () => {}
  private removeWheel?: () => void

  /** Controlled value (React `value`). Reading it returns the current raw value. */
  @Input()
  set value(v: number | null | undefined) {
    this._value.set(v ?? undefined)
  }
  get value(): number {
    return this._value() ?? this._internal() ?? this.defaultValue
  }
  /** Initial value when uncontrolled. */
  @Input({ transform: numberAttribute }) defaultValue = 0
  @Output() valueChange = new EventEmitter<number>()
  /** Also fired on every committed change (React `onChange`). */
  @Output() change = new EventEmitter<number>()
  @Input({ transform: numberAttribute }) min = 0
  @Input({ transform: numberAttribute }) max = 100
  @Input({ transform: numberAttribute }) step = 1
  @Input({ transform: numberAttribute }) size = 100
  @Input({ transform: numberAttribute }) strokeWidth = 14
  @Input() valueColor = 'var(--primary)'
  @Input() rangeColor = 'var(--muted)'
  @Input({ transform: booleanAttribute }) disabled = false
  @Input({ transform: booleanAttribute }) readonly = false
  @Input({ transform: booleanAttribute }) showValue = true
  @Input('class') className?: string
  /** Accessible name for the slider. */
  @Input('aria-label') ariaLabel = 'Value'
  /** Custom renderer for the centred value text (SVG content, e.g. `<svg:tspan>`). */
  @Input() renderValue?: TemplateRef<KnobValueContext>

  @ViewChild('svg', { static: true }) svgRef!: ElementRef<SVGSVGElement>

  onTouched: () => void = () => {}

  /** Value clamped to [min, max] (what the dial and aria-valuenow show). */
  get current(): number {
    return clamp(this.value, this.min, this.max)
  }

  get svgClass(): string {
    return cn(
      'focus-visible:ring-ring inline-block touch-none rounded-full outline-none select-none focus-visible:ring-2',
      this.disabled && 'cursor-not-allowed opacity-50',
      !this.disabled && !this.readonly && 'cursor-pointer',
      this.className,
    )
  }

  get rangePath(): string {
    return arcPath(50, 50, 40, startAngle, endAngle)
  }

  get valuePath(): string {
    const percent = this.max === this.min ? 0 : (this.current - this.min) / (this.max - this.min)
    return arcPath(50, 50, 40, startAngle, startAngle + sweep * percent)
  }

  private snap(v: number): number {
    const stepped = Math.round((v - this.min) / this.step) * this.step + this.min
    return clamp(stepped, this.min, this.max)
  }

  setValue(v: number): void {
    if (this.disabled || this.readonly) return
    const next = this.snap(v)
    if (next === this.value) return
    if (this._value() === undefined) this._internal.set(next)
    else if (this.formBound) this._value.set(next)
    this.valueChange.emit(next)
    this.change.emit(next)
    this.onChangeFn(next)
  }

  private angleFromEvent(e: PointerEvent): number {
    const rect = this.svgRef.nativeElement.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    return Math.atan2(e.clientY - cy, e.clientX - cx)
  }

  private angleToValue(angle: number): number {
    let a = angle - startAngle
    if (a < 0) a += Math.PI * 2
    if (a > sweep) return a < (Math.PI * 2 + sweep) / 2 ? this.max : this.min
    return this.min + (a / sweep) * (this.max - this.min)
  }

  onPointerDown(e: PointerEvent): void {
    if (this.disabled || this.readonly) return
    ;(e.target as Element).setPointerCapture?.(e.pointerId)
    this.dragging.set(true)
    this.setValue(this.angleToValue(this.angleFromEvent(e)))
  }

  onPointerMove(e: PointerEvent): void {
    if (!this.dragging()) return
    this.setValue(this.angleToValue(this.angleFromEvent(e)))
  }

  onPointerUp(e: PointerEvent): void {
    if (!this.dragging()) return
    this.dragging.set(false)
    ;(e.target as Element).releasePointerCapture?.(e.pointerId)
  }

  onKeyDown(e: KeyboardEvent): void {
    if (this.disabled || this.readonly) return
    const big = this.step * 10
    const next: Record<string, number> = {
      ArrowUp: this.current + this.step,
      ArrowRight: this.current + this.step,
      ArrowDown: this.current - this.step,
      ArrowLeft: this.current - this.step,
      PageUp: this.current + big,
      PageDown: this.current - big,
      Home: this.min,
      End: this.max,
    }
    if (!(e.key in next)) return
    e.preventDefault()
    this.setValue(next[e.key]!)
  }

  ngAfterViewInit(): void {
    // Non-passive, so preventDefault stops the page from scrolling while the wheel turns the dial.
    const node = this.svgRef.nativeElement
    const handler = (e: WheelEvent) => {
      if (this.disabled || this.readonly) return
      e.preventDefault()
      this.setValue(this.current + (e.deltaY < 0 ? this.step : -this.step))
    }
    node.addEventListener('wheel', handler, { passive: false })
    this.removeWheel = () => node.removeEventListener('wheel', handler)
  }

  ngOnDestroy(): void {
    this.removeWheel?.()
  }

  // ── ControlValueAccessor ──
  writeValue(v: number | null): void {
    this._value.set(v ?? undefined)
    this.cdr.markForCheck()
  }
  registerOnChange(fn: (v: number) => void): void {
    this.formBound = true
    this.onChangeFn = fn
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled
    this.cdr.markForCheck()
  }
}
