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
import { signaturePadVariants, type SignaturePadVariants } from './signature-pad.variants'

/** Context of the `actions` template (React `actions({ clear, exportSignature, empty })`). */
export interface SignaturePadActionsContext {
  $implicit: SignaturePadActionsState
  clear: () => void
  exportSignature: () => void
  empty: boolean
}
export interface SignaturePadActionsState {
  clear: () => void
  exportSignature: () => void
  empty: boolean
}

/** Resolve theme CSS variables (and legacy `hsl(var(--x))`) to a paint color canvas accepts. */
function resolveColor(input: string | undefined, cssVar: string): string {
  let candidate = (input || '').trim()
  if (!candidate) candidate = `var(${cssVar})`
  const hslWrapped = candidate.match(/^hsl\(\s*(var\(--[^)]+\))\s*\)$/i)
  if (hslWrapped) candidate = hslWrapped[1]!
  if (candidate.startsWith('var(')) {
    const name = candidate.match(/var\((--[^),]+)/)?.[1]
    if (name && typeof document !== 'undefined') {
      const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
      if (v) return v
    }
  }
  return candidate
}

/** Renders the `actions` template, keeping one view and refreshing its context. */
@Directive({ selector: '[uiSignaturePadActions]', standalone: true })
export class UiSignaturePadActionsDirective implements OnChanges, OnDestroy {
  @Input('uiSignaturePadActions') template!: TemplateRef<SignaturePadActionsContext>
  @Input('uiSignaturePadActionsState') state!: SignaturePadActionsState
  private readonly vcr = inject(ViewContainerRef)
  private view?: EmbeddedViewRef<SignaturePadActionsContext>

  ngOnChanges(changes: SimpleChanges): void {
    const context = { $implicit: this.state, ...this.state }
    if (changes['template'] || !this.view) {
      this.vcr.clear()
      this.view = this.vcr.createEmbeddedView(this.template, context)
    } else {
      Object.assign(this.view.context, context)
    }
  }

  ngOnDestroy(): void {
    this.vcr.clear()
  }
}

/**
 * Angular port of the React SignaturePad: a DPR-aware canvas that strokes pointer input
 * (mouse / touch / pen, with pointer capture), a footer with the live point count and a
 * Clear button, and an optional `actions` template. The value is a PNG data URL (null when
 * empty): `modelValue` in, `modelChange` / `change` out (React `onModelChange` /
 * `onChange`; `modelValueChange` too, so `[(modelValue)]` and forms work), plus
 * `begin` / `end` per stroke. React's ref handle is the public API: `clear()`,
 * `exportSignature()`, `toDataURL()`, `pointCount`, `isEmpty`.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-signature-pad, [ui-signature-pad]',
  standalone: true,
  imports: [UiSignaturePadActionsDirective],
  exportAs: 'uiSignaturePad',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiSignaturePadComponent), multi: true }],
  host: {
    'data-uipkge': '',
    'data-slot': 'signature-pad',
    '[attr.data-disabled]': 'disabled ? "" : null',
    '[attr.data-readonly]': 'readonly ? "" : null',
    '[class]': 'hostClass',
  },
  template: `
    <canvas
      #canvas
      [class]="canvasClass"
      [attr.aria-label]="ariaLabel"
      [attr.aria-disabled]="disabled || null"
      role="img"
      (pointerdown)="onPointerDown($event)"
      (pointermove)="onPointerMove($event)"
      (pointerup)="onPointerUp($event)"
      (pointercancel)="onPointerUp($event)"
      (pointerleave)="onPointerUp($event)"
    ></canvas>
    @if (showClearButton && isInteractive) {
      <div class="flex items-center justify-between gap-2 pt-2">
        <span class="text-muted-foreground text-xs tabular-nums">{{ pointCount }} points</span>
        <button
          type="button"
          class="text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex items-center gap-1 rounded-md text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
          [disabled]="!hasInk()"
          (click)="clear()"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-eraser size-4"
            aria-hidden="true"
          >
            <path
              d="M21 21H8a2 2 0 0 1-1.42-.587l-3.994-3.999a2 2 0 0 1 0-2.828l10-10a2 2 0 0 1 2.829 0l5.999 6a2 2 0 0 1 0 2.828L12.834 21"
            />
            <path d="m5.082 11.09 8.828 8.828" />
          </svg>
          {{ clearLabel }}
        </button>
      </div>
    }
    @if (actions) {
      <ng-container [uiSignaturePadActions]="actions" [uiSignaturePadActionsState]="actionsState" />
    }
  `,
})
export class UiSignaturePadComponent implements ControlValueAccessor, AfterViewInit, OnChanges {
  // Zoneless-safe: form writes happen outside template events, so schedule a repaint.
  private readonly cdr = inject(ChangeDetectorRef)
  private readonly _pointCount = signal(0)
  readonly hasInk = signal(false)
  private ctx: CanvasRenderingContext2D | null = null
  private drawing = false
  private lastPos = { x: 0, y: 0 }
  private viewReady = false
  private onChangeFn: (v: string | null) => void = () => {}
  private onTouched: () => void = () => {}
  private _actionsState?: SignaturePadActionsState

  /** PNG data URL of the current canvas contents, or null when empty (read-only from outside). */
  @Input() modelValue?: string | null
  @Input({ transform: numberAttribute }) width = 400
  @Input({ transform: numberAttribute }) height = 200
  /** Empty resolves --foreground (theme-aware). */
  @Input() penColor = ''
  @Input({ transform: numberAttribute }) penThickness = 2
  /** Empty resolves --background (theme-aware). */
  @Input() backgroundColor = ''
  @Input() exportFormat = 'image/png'
  @Input({ transform: booleanAttribute }) disabled = false
  @Input({ transform: booleanAttribute }) readonly = false
  @Input({ transform: booleanAttribute }) showClearButton = true
  @Input() clearLabel = 'Clear'
  @Input('class') className?: string
  /** Custom action controls (`<ng-template let-clear="clear" let-empty="empty">`). */
  @Input() actions?: TemplateRef<SignaturePadActionsContext>

  /** Fired with the new data URL (or null) whenever the signature changes (React `onModelChange`). */
  @Output() modelChange = new EventEmitter<string | null>()
  /** Same payload as `modelChange`, named for `[(modelValue)]`. */
  @Output() modelValueChange = new EventEmitter<string | null>()
  /** Same payload as `modelChange` (React `onChange`). */
  @Output() change = new EventEmitter<string | null>()
  /** A stroke began. */
  @Output() begin = new EventEmitter<void>()
  /** A stroke ended. */
  @Output() end = new EventEmitter<void>()

  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>

  get pointCount(): number {
    return this._pointCount()
  }

  get isEmpty(): boolean {
    return !this.hasInk()
  }

  get isInteractive(): boolean {
    return !this.disabled && !this.readonly
  }

  get hostClass(): string {
    return cn(signaturePadVariants(), this.className)
  }

  get canvasClass(): string {
    return cn('block touch-none rounded-md', !this.isInteractive && 'pointer-events-none')
  }

  get ariaLabel(): string {
    return `Signature pad${this.disabled ? ' (disabled)' : this.readonly ? ' (readonly)' : ''}`
  }

  /** Stable object while `empty` is unchanged, so the actions view only refreshes on change. */
  get actionsState(): SignaturePadActionsState {
    const empty = !this.hasInk()
    if (!this._actionsState || this._actionsState.empty !== empty) {
      this._actionsState = { clear: () => this.clear(), exportSignature: () => this.exportSignature(), empty }
    }
    return this._actionsState
  }

  ngAfterViewInit(): void {
    this.viewReady = true
    this.setupCanvas()
  }

  ngOnChanges(changes: SimpleChanges): void {
    // React re-runs the canvas setup (which resets the ink) when these change.
    const setupKeys = ['width', 'height', 'penColor', 'penThickness', 'backgroundColor']
    if (this.viewReady && setupKeys.some((k) => changes[k])) this.setupCanvas()
  }

  private setupCanvas(): void {
    const canvas = this.canvasRef.nativeElement
    const dpr = window.devicePixelRatio || 1
    canvas.width = this.width * dpr
    canvas.height = this.height * dpr
    canvas.style.width = `${this.width}px`
    canvas.style.height = `${this.height}px`
    const context = canvas.getContext?.('2d')
    if (!context) return
    context.scale(dpr, dpr)
    context.lineCap = 'round'
    context.lineJoin = 'round'
    context.strokeStyle = resolveColor(this.penColor, '--foreground')
    context.lineWidth = this.penThickness
    context.fillStyle = resolveColor(this.backgroundColor, '--background')
    context.fillRect(0, 0, this.width, this.height)
    this.ctx = context
    this._pointCount.set(0)
    this.hasInk.set(false)
  }

  private pointerPos(e: PointerEvent): { x: number; y: number } {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect()
    // Map CSS pixels → logical canvas coords if the element is CSS-scaled.
    const scaleX = this.width / (rect.width || this.width)
    const scaleY = this.height / (rect.height || this.height)
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY }
  }

  private emitValue(value: string | null): void {
    this.modelChange.emit(value)
    this.modelValueChange.emit(value)
    this.change.emit(value)
    this.onChangeFn(value)
  }

  /** Emit the current data URL (or null when empty) through modelChange / change. */
  exportSignature(): void {
    if (!this.hasInk()) {
      this.emitValue(null)
      return
    }
    this.emitValue(this.canvasRef.nativeElement.toDataURL(this.exportFormat))
  }

  /** Alias of exportSignature (React ref `toDataURL`). */
  toDataURL(): void {
    this.exportSignature()
  }

  /** Repaint the background, reset the point count and emit null. */
  clear(): void {
    const context = this.ctx
    if (!context) return
    context.fillStyle = resolveColor(this.backgroundColor, '--background')
    context.fillRect(0, 0, this.width, this.height)
    this._pointCount.set(0)
    this.hasInk.set(false)
    this.emitValue(null)
  }

  onPointerDown(e: PointerEvent): void {
    if (!this.isInteractive || !this.ctx) return
    e.preventDefault()
    this.drawing = true
    const { x, y } = this.pointerPos(e)
    this.lastPos = { x, y }
    this.ctx.beginPath()
    this.ctx.moveTo(x, y)
    this._pointCount.update((c) => c + 1)
    this.hasInk.set(true)
    this.begin.emit()
    this.canvasRef.nativeElement.setPointerCapture?.(e.pointerId)
  }

  onPointerMove(e: PointerEvent): void {
    if (!this.drawing || !this.ctx) return
    e.preventDefault()
    const { x, y } = this.pointerPos(e)
    this.ctx.beginPath()
    this.ctx.moveTo(this.lastPos.x, this.lastPos.y)
    this.ctx.lineTo(x, y)
    this.ctx.stroke()
    this.lastPos = { x, y }
    this._pointCount.update((c) => c + 1)
  }

  onPointerUp(e: PointerEvent): void {
    if (!this.drawing) return
    this.drawing = false
    this.ctx?.closePath()
    this.canvasRef.nativeElement.releasePointerCapture?.(e.pointerId)
    this.exportSignature()
    this.end.emit()
    this.onTouched()
  }

  // ── ControlValueAccessor (the value is output-only; like React it is never painted back) ──
  writeValue(v: string | null): void {
    this.modelValue = v
    this.cdr.markForCheck()
  }
  registerOnChange(fn: (v: string | null) => void): void {
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

export { signaturePadVariants, type SignaturePadVariants }
