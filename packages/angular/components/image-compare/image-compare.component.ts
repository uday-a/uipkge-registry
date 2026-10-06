import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  booleanAttribute,
  inject,
  numberAttribute,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core'
import { cn } from '@/lib/utils'
import { UiRenderTemplateDirective } from '@/ui/popper/popper'
import { imageCompareVariants, type ImageCompareVariants } from './image-compare.variants'

export type ImageCompareOrientation = NonNullable<ImageCompareVariants['orientation']>

function clamp(v: number): number {
  return Math.min(100, Math.max(0, v))
}

/**
 * Angular port of the React ImageCompare: the "before" image fills the frame, the "after"
 * image sits on top clipped with `clip-path: inset(...)`, and a divider line carries a
 * focusable `<button role="slider">` handle. Pointer drag anywhere on the frame (pointer
 * capture), Arrow keys on the handle move 1% (Shift = 10%), horizontal or vertical.
 * `value` / `defaultValue` / `valueChange` (`[(value)]`, 0–100); `handle` is a template
 * that replaces the default arrow icon.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-image-compare, [ui-image-compare]',
  standalone: true,
  imports: [UiRenderTemplateDirective],
  host: {
    'data-uipkge': '',
    'data-slot': 'image-compare',
    '[attr.data-orientation]': 'orientation',
    '[attr.data-disabled]': 'disabled ? "" : null',
    '[class]': 'hostClass',
    '(pointerdown)': 'onPointerDown($event)',
    '(pointermove)': 'onPointerMove($event)',
    '(pointerup)': 'onPointerUp($event)',
    '(pointercancel)': 'onPointerUp($event)',
  },
  template: `
    <img
      [src]="beforeSrc"
      [alt]="beforeAlt"
      class="pointer-events-none absolute inset-0 size-full object-cover select-none"
      draggable="false"
    />
    @if (showLabels) {
      <span
        class="bg-background/80 text-foreground absolute bottom-2 left-2 rounded px-2 py-0.5 text-xs font-medium backdrop-blur-sm"
        >{{ beforeLabel }}</span
      >
    }
    <div class="absolute inset-0 size-full" [style.clip-path]="clipPath">
      <img
        [src]="afterSrc"
        [alt]="afterAlt"
        class="pointer-events-none absolute inset-0 size-full object-cover select-none"
        draggable="false"
      />
      @if (showLabels) {
        <span
          class="bg-background/80 text-foreground absolute right-2 bottom-2 rounded px-2 py-0.5 text-xs font-medium backdrop-blur-sm"
          >{{ afterLabel }}</span
        >
      }
    </div>
    @if (!disabled) {
      <div
        [class]="dividerClass"
        [style.left]="orientation === 'horizontal' ? position + '%' : null"
        [style.top]="orientation === 'vertical' ? position + '%' : null"
      >
        @if (showHandle) {
          <button
            type="button"
            role="slider"
            [attr.aria-valuenow]="rounded"
            aria-valuemin="0"
            aria-valuemax="100"
            [attr.aria-label]="'Image comparison slider, ' + rounded + ' percent'"
            [attr.aria-orientation]="orientation === 'vertical' ? 'vertical' : 'horizontal'"
            tabindex="0"
            [class]="handleClass"
            (keydown)="onKeyDown($event)"
            (pointerdown)="$event.stopPropagation(); onPointerDown($event)"
            (pointermove)="$event.stopPropagation(); onPointerMove($event)"
            (pointerup)="$event.stopPropagation(); onPointerUp($event)"
            (pointercancel)="$event.stopPropagation(); onPointerUp($event)"
          >
            @if (handle) {
              <ng-container [uiRenderTemplate]="handle" />
            } @else if (orientation === 'horizontal') {
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
                class="lucide lucide-move-horizontal text-foreground size-4"
                aria-hidden="true"
              >
                <path d="m18 8 4 4-4 4" />
                <path d="M2 12h20" />
                <path d="m6 8-4 4 4 4" />
              </svg>
            } @else {
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
                class="lucide lucide-move-vertical text-foreground size-4"
                aria-hidden="true"
              >
                <path d="M12 2v20" />
                <path d="m8 18 4 4 4-4" />
                <path d="m8 6 4-4 4 4" />
              </svg>
            }
          </button>
        }
      </div>
    }
    @if (disabled) {
      <div class="bg-background/40 absolute inset-0"></div>
    }
  `,
})
export class UiImageCompareComponent {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef)
  private readonly _value = signal<number | undefined>(undefined)
  private readonly _internal = signal<number | null>(null)
  private dragging = false

  @Input({ required: true }) beforeSrc!: string
  @Input({ required: true }) afterSrc!: string
  @Input() beforeAlt = 'Before'
  @Input() afterAlt = 'After'
  @Input() beforeLabel = 'Before'
  @Input() afterLabel = 'After'
  /** Controlled slider position (0–100). */
  @Input()
  set value(v: number | null | undefined) {
    this._value.set(v ?? undefined)
  }
  get value(): number {
    return this._value() ?? this._internal() ?? this.defaultValue
  }
  /** Uncontrolled initial position (0–100). */
  @Input({ transform: numberAttribute }) defaultValue = 50
  /** Fired with the new position (0–100) on drag / keyboard move. */
  @Output() valueChange = new EventEmitter<number>()
  @Input() orientation: ImageCompareOrientation = 'horizontal'
  @Input({ transform: booleanAttribute }) disabled = false
  @Input({ transform: booleanAttribute }) showLabels = true
  @Input({ transform: booleanAttribute }) showHandle = true
  /** Custom handle content — replaces the default arrow icon. */
  @Input() handle?: TemplateRef<unknown>
  @Input('class') className?: string

  get position(): number {
    return this.value
  }

  get rounded(): number {
    return Math.round(this.position)
  }

  get hostClass(): string {
    // React's root is a <div> with touch-action: none; `block` + `touch-none` give the same box.
    return cn('block touch-none', imageCompareVariants({ orientation: this.orientation }), this.className)
  }

  get clipPath(): string {
    const pct = this.position
    return this.orientation === 'horizontal' ? `inset(0 0 0 ${pct}%)` : `inset(${pct}% 0 0 0)`
  }

  get dividerClass(): string {
    return cn(
      'bg-border absolute z-10',
      this.orientation === 'horizontal' ? 'top-0 h-full w-0.5' : 'left-0 h-0.5 w-full',
    )
  }

  get handleClass(): string {
    return cn(
      'bg-background border-border focus-visible:ring-ring absolute flex size-9 cursor-ew-resize items-center justify-center rounded-full border shadow-md transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:outline-none',
      'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
      this.orientation === 'vertical' && 'cursor-ns-resize',
    )
  }

  private setPosition(next: number): void {
    const clamped = clamp(next)
    if (this._value() === undefined) this._internal.set(clamped)
    this.valueChange.emit(clamped)
  }

  private updateFromPointer(clientX: number, clientY: number): void {
    const rect = this.el.nativeElement.getBoundingClientRect()
    if (this.orientation === 'horizontal') this.setPosition(((clientX - rect.left) / rect.width) * 100)
    else this.setPosition(((clientY - rect.top) / rect.height) * 100)
  }

  onPointerDown(e: PointerEvent): void {
    if (this.disabled) return
    this.dragging = true
    try {
      ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    } catch {
      // pointer capture can fail on synthetic / non-active pointers
    }
    this.updateFromPointer(e.clientX, e.clientY)
  }

  onPointerMove(e: PointerEvent): void {
    if (!this.dragging || this.disabled) return
    this.updateFromPointer(e.clientX, e.clientY)
  }

  onPointerUp(e: PointerEvent): void {
    if (!this.dragging) return
    this.dragging = false
    try {
      ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
    } catch {
      // pointer already released
    }
  }

  /** Arrow keys move the slider by 1% (Shift = 10%). */
  onKeyDown(e: KeyboardEvent): void {
    if (this.disabled) return
    const step = e.shiftKey ? 10 : 1
    let next = this.position
    if (this.orientation === 'horizontal') {
      if (e.key === 'ArrowLeft') next -= step
      else if (e.key === 'ArrowRight') next += step
      else return
    } else {
      if (e.key === 'ArrowUp') next -= step
      else if (e.key === 'ArrowDown') next += step
      else return
    }
    e.preventDefault()
    this.setPosition(next)
  }
}

export { imageCompareVariants, type ImageCompareVariants }
