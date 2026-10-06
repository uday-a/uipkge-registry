import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
  booleanAttribute,
  numberAttribute,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core'
import { cn } from '@/lib/utils'
import { uniqueId } from '@/ui/popper/popper'

export type RatingDensity = 'compact' | 'default' | 'comfortable'
export type RatingSize = 'x-small' | 'small' | 'medium' | 'large' | 'x-large'
export type RatingVariant = 'outlined' | 'filled' | 'soft'

// Star path shared by all three icon states.
const STAR_PATH = 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'

const variantClasses: Record<RatingVariant, string> = {
  outlined: '',
  filled: 'bg-muted p-1 rounded-lg',
  soft: 'bg-accent p-1 rounded-lg',
}

const sizeIcon: Record<RatingSize, string> = {
  'x-small': '0.875rem',
  small: '1.125rem',
  medium: '1.375rem',
  large: '1.625rem',
  'x-large': '2rem',
}

const densityPad: Record<RatingDensity, string> = {
  compact: '0',
  default: '0.0625rem',
  comfortable: '0.125rem',
}

// Copied verbatim from the React Rating (injected there as a global <style>).
const STYLE_CONTENT = `
@keyframes rating-star-pop {
  0% { opacity: 0.4; transform: scale(0.6); }
  60% { opacity: 1; transform: scale(1.18); }
  100% { opacity: 1; transform: scale(1); }
}
[data-slot='rating'] .rating-star-full-icon {
  animation: rating-star-pop 280ms cubic-bezier(0.22, 1.4, 0.36, 1) both;
  animation-delay: var(--star-delay, 0ms);
}
[data-slot='rating'] button:not(:disabled):hover {
  transform: scale(1.12);
  transition: transform 0.15s ease-in-out;
}
@media (prefers-reduced-motion: reduce) {
  [data-slot='rating'] .rating-star-full-icon {
    animation: none !important;
  }
  [data-slot='rating'] button:not(:disabled):hover {
    transition: none !important;
    transform: none !important;
  }
}
`

/**
 * Angular port of the React Rating: a radiogroup of star buttons (role="radio", roving
 * tabindex on the selected star), with half-star resolution from the click position when
 * `halfIncrements`, Arrow / Home / End / Enter / Space keys, `clearable` reset, per-star
 * tooltips and the pop-in animation. `value` / `defaultValue` / `valueChange` (`[(value)]`).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-rating, [ui-rating]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  styles: [STYLE_CONTENT],
  host: {
    'data-uipkge': '',
    'data-slot': 'rating',
    role: 'radiogroup',
    '[attr.aria-valuenow]': 'current',
    'aria-valuemin': '0',
    '[attr.aria-valuemax]': 'max',
    '[attr.aria-label]': '"Rating: " + current + " of " + max',
    '[class]': 'hostClass',
  },
  template: `
    @for (n of stars; track n) {
      <button
        type="button"
        role="radio"
        [disabled]="disabled || readonly"
        [attr.aria-label]="tooltips?.[n - 1] ?? itemAriaLabel + ' ' + n + ' of ' + max"
        [attr.aria-checked]="ceil(current || 0) === n"
        [attr.title]="tooltips?.[n - 1] ?? null"
        [attr.tabindex]="readonly || disabled ? -1 : focusStar === n ? 0 : -1"
        [style.padding]="padding"
        [style.outline-color]="color"
        [style.--star-delay]="current >= n ? (n - 1) * 45 + 'ms' : '0ms'"
        [class]="buttonClass"
        (click)="handleClick($event, n)"
        (keydown)="handleKeydown($event, n)"
      >
        @if (current >= n) {
          <svg
            class="rating-star-full-icon"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            [style.width]="iconSize"
            [style.height]="iconSize"
            [style.color]="color"
          >
            <path [attr.d]="starPath" />
          </svg>
        } @else if (current >= n - 0.5 && halfIncrements) {
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            [style.width]="iconSize"
            [style.height]="iconSize"
            [style.color]="color"
          >
            <defs>
              <linearGradient [attr.id]="halfId(n)">
                <stop offset="50%" stop-color="currentColor" />
                <stop offset="50%" stop-color="transparent" />
              </linearGradient>
            </defs>
            <path [attr.d]="starPath" [attr.fill]="'url(#' + halfId(n) + ')'" stroke="currentColor" stroke-width="1" />
          </svg>
        } @else {
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            aria-hidden="true"
            [style.width]="iconSize"
            [style.height]="iconSize"
            class="text-muted-foreground"
          >
            <path [attr.d]="starPath" />
          </svg>
        }
      </button>
    }
    @if (showValue) {
      <span class="text-foreground ml-2 font-semibold">{{ current }}</span>
    }
  `,
})
export class UiRatingComponent {
  private readonly _value = signal<number | undefined>(undefined)
  private readonly _internal = signal<number | null>(null)
  private readonly idBase = uniqueId('rating')

  /** Currently selected value (React `value`); reading it returns the resolved value. */
  @Input()
  set value(v: number | null | undefined) {
    this._value.set(v ?? undefined)
  }
  get value(): number {
    return this._value() ?? this._internal() ?? this.defaultValue
  }
  /** Default value when uncontrolled. */
  @Input({ transform: numberAttribute }) defaultValue = 0
  @Output() valueChange = new EventEmitter<number>()
  @Input({ transform: numberAttribute }) max = 5
  @Input({ transform: booleanAttribute }) readonly = false
  @Input({ transform: booleanAttribute }) disabled = false
  @Input() density: RatingDensity = 'default'
  /** Color of the selected stars. */
  @Input() color = 'var(--warning)'
  /** Clicking the selected value clears the rating. */
  @Input({ transform: booleanAttribute }) clearable = false
  /** Stars grow on hover. */
  @Input({ transform: booleanAttribute }) hover = false
  @Input() itemAriaLabel = 'rating'
  @Input() size: RatingSize = 'medium'
  @Input('class') className?: string
  @Input({ transform: booleanAttribute }) showValue = false
  @Input() variant: RatingVariant = 'outlined'
  @Input({ transform: booleanAttribute }) halfIncrements = false
  /** Optional per-star tooltip labels (native title + aria-label). */
  @Input() tooltips?: string[]

  readonly starPath = STAR_PATH
  readonly ceil = Math.ceil

  get current(): number {
    return this.value
  }

  get stars(): number[] {
    return Array.from({ length: Math.max(0, this.max) }, (_, i) => i + 1)
  }

  get focusStar(): number {
    return Math.ceil(this.current || 1)
  }

  get iconSize(): string {
    return sizeIcon[this.size]
  }

  get padding(): string {
    return densityPad[this.density]
  }

  get hostClass(): string {
    return cn(
      'inline-flex items-center gap-0.5',
      variantClasses[this.variant],
      this.disabled && 'cursor-not-allowed opacity-50',
      this.readonly && 'cursor-default',
      this.showValue && 'flex items-center gap-1',
      this.className,
    )
  }

  get buttonClass(): string {
    return cn(
      'inline-flex items-center justify-center border-none bg-none leading-none transition-transform duration-150',
      'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
      this.clearable && 'cursor-pointer',
      this.hover && 'hover:scale-[1.15]',
    )
  }

  halfId(n: number): string {
    return `${this.idBase}-half-${n}`
  }

  private emit(next: number): void {
    if (this._value() === undefined) this._internal.set(next)
    this.valueChange.emit(next)
  }

  private resolveClickValue(e: MouseEvent, star: number): number {
    if (!this.halfIncrements) return star
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const isLeft = e.clientX - rect.left < rect.width / 2
    const next = isLeft ? star - 0.5 : star
    return next < 0.5 ? 0.5 : next
  }

  handleClick(e: MouseEvent, star: number): void {
    if (this.disabled || this.readonly) return
    const next = this.resolveClickValue(e, star)
    if (this.clearable && next === this.current) this.emit(0)
    else this.emit(next)
  }

  handleKeydown(e: KeyboardEvent, star: number): void {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (this.disabled || this.readonly) return
      if (this.clearable && star === this.current) this.emit(0)
      else this.emit(star)
      return
    }
    const step = this.halfIncrements ? 0.5 : 1
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault()
      this.emit(Math.min(this.max, this.current + step))
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault()
      this.emit(Math.max(0, this.current - step))
    } else if (e.key === 'Home') {
      e.preventDefault()
      this.emit(this.halfIncrements ? 0.5 : 1)
    } else if (e.key === 'End') {
      e.preventDefault()
      this.emit(this.max)
    }
  }
}
