import {
  Component,
  EventEmitter,
  Input,
  Output,
  booleanAttribute,
  signal,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core'
import { cn } from '@/lib/utils'
import { chipVariants, type ChipVariants } from './chip.variants'

// Copied verbatim from the React chip (injected there as a global <style>). Unscoped
// (ViewEncapsulation.None) so it reaches the host and projected content; Angular adds it once.
const CHIP_MOTION_STYLES = `
@keyframes chip-enter {
  from { opacity: 0; transform: scale(0.88); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes chip-leave {
  to { opacity: 0; transform: scale(0.88); }
}
[data-slot='chip'].chip-enter {
  animation: chip-enter 180ms cubic-bezier(0.22, 1.2, 0.36, 1) both;
}
[data-slot='chip'].chip-leave {
  animation: chip-leave 160ms ease-in both;
  pointer-events: none;
}
@media (prefers-reduced-motion: reduce) {
  [data-slot='chip'].chip-enter,
  [data-slot='chip'].chip-leave {
    animation: none !important;
  }
}
`

export type ChipVariant =
  'default' | 'filled' | 'outlined' | 'outline' | 'elevated' | 'success' | 'warning' | 'destructive'
export type ChipSize = NonNullable<ChipVariants['size']>

/**
 * Angular port of UIPKGE Chip (React `Chip`, a <span>). Compact removable tag / filter pill.
 * `closable` renders the built-in Lucide X dismiss button; clicking it plays the chip-leave
 * animation (skipped under prefers-reduced-motion) and then emits `close` (React `onClose`),
 * so the host removes the chip after it has faded. Class strings and the injected motion CSS
 * are copied from React.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-chip, [ui-chip]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  styles: [CHIP_MOTION_STYLES],
  host: {
    '[attr.data-slot]': '"chip"',
    '[attr.data-uipkge]': '""',
    '[attr.data-leaving]': 'leaving() || null',
    '[class]': 'hostClass',
  },
  template: `
    <ng-content />
    @if (closable) {
      <button
        type="button"
        aria-label="Remove item"
        class="focus-visible:ring-ring hover:bg-foreground/10 ml-1 inline-flex min-h-6 min-w-6 items-center justify-center rounded-full transition-transform duration-150 focus-visible:ring-1 focus-visible:outline-none active:scale-90"
        (click)="onClose($event)"
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
          class="lucide lucide-x size-3"
          aria-hidden="true"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
    }
  `,
})
export class UiChipComponent {
  @Input() variant: ChipVariant = 'default'
  @Input() size: ChipSize = 'default'
  @Input({ transform: booleanAttribute }) wrap = false
  @Input({ transform: booleanAttribute }) closable = false
  @Input('class') className?: string

  @Output() close = new EventEmitter<void>()

  /** Signal: set from the click handler, read by the host binding (zoneless-safe). */
  readonly leaving = signal(false)

  get hostClass(): string {
    return cn(
      chipVariants({ variant: this.variant, size: this.size, wrap: this.wrap ? true : undefined }),
      'chip-enter',
      this.leaving() && 'chip-leave',
      this.className,
    )
  }

  onClose(event: Event): void {
    event.stopPropagation()
    if (this.leaving()) return
    this.leaving.set(true)
    const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setTimeout(() => this.close.emit(), reduce ? 0 : 160)
  }
}

/**
 * React `ChipGroup`: a role="group" wrap row with controlled `selected` + `selectedChange`
 * (React `onSelectedChange`) and single / multiple / mandatory / max selection rules. React
 * hands `{ selected, multiple, filter, isSelected, toggle }` to a render-prop child; in
 * Angular take the same API from a template reference:
 * `<div ui-chip-group #g="uiChipGroup"> ... g.isSelected('x') / g.toggle('x') ... </div>`.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-chip-group, [ui-chip-group]',
  exportAs: 'uiChipGroup',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  styles: [CHIP_MOTION_STYLES],
  host: {
    '[attr.data-chip-group]': '"true"',
    '[attr.data-multiple]': 'multiple || null',
    '[attr.data-filter]': 'filter || null',
    '[attr.role]': '"group"',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiChipGroupComponent {
  @Input() selected: string[] = []
  @Input({ transform: booleanAttribute }) multiple = false
  @Input({ transform: booleanAttribute }) filter = false
  @Input({ transform: booleanAttribute }) column = false
  @Input({ transform: booleanAttribute }) mandatory = false
  @Input() max?: number
  @Input({ transform: booleanAttribute }) disabled = false
  @Input('class') className?: string

  @Output() selectedChange = new EventEmitter<string[]>()

  get hostClass(): string {
    return cn('flex flex-wrap gap-2', this.column && 'flex-col', this.className)
  }

  isSelected(value: string): boolean {
    return this.selected.includes(value)
  }

  toggle(value: string): void {
    if (this.disabled) return
    let next: string[]
    if (this.multiple) {
      if (this.isSelected(value)) {
        next = this.selected.filter((v) => v !== value)
      } else if (this.max && this.selected.length >= this.max) {
        next = [...this.selected.slice(1), value]
      } else {
        next = [...this.selected, value]
      }
    } else if (this.isSelected(value) && !this.mandatory) {
      next = []
    } else {
      next = [value]
    }
    this.selectedChange.emit(next)
  }
}

export { chipVariants, type ChipVariants }
