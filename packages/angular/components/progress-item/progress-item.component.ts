import { Component, Input, ChangeDetectionStrategy } from '@angular/core'
import { cn } from '@/lib/utils'
import { UiProgressComponent } from '@/ui/progress/progress.component'

// Maps to canonical shadcn chart tokens (chart-1..5). Cycles through 5 hues.
const barColors = [
  '[&_[data-slot=progress-indicator]]:bg-primary',
  '[&_[data-slot=progress-indicator]]:bg-[var(--chart-1)]',
  '[&_[data-slot=progress-indicator]]:bg-[var(--chart-2)]',
  '[&_[data-slot=progress-indicator]]:bg-[var(--chart-3)]',
  '[&_[data-slot=progress-indicator]]:bg-[var(--chart-4)]',
  '[&_[data-slot=progress-indicator]]:bg-[var(--chart-5)]',
]

/**
 * Angular port of UIPKGE ProgressItem (React `ProgressItem`). Labeled progress row — item
 * name on the left, percent (or `secondaryLabel`) on the right, a `ui-progress` bar below.
 * `colorIndex` cycles the indicator through the chart tokens; `barClass` wins over it.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-progress-item, [ui-progress-item]',
  standalone: true,
  imports: [UiProgressComponent],
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"progress-item"',
    '[class]': 'hostClass',
  },
  template: `
    <div class="flex items-center justify-between text-sm">
      <span class="font-medium">{{ label }}</span>
      <span class="text-muted-foreground text-xs tabular-nums">{{ secondaryLabel ?? value + '%' }}</span>
    </div>
    <ui-progress [value]="value" [class]="progressClass" />
  `,
})
export class UiProgressItemComponent {
  @Input() label = ''
  @Input() value = 0
  @Input() secondaryLabel?: string
  @Input() barClass?: string
  @Input() colorIndex?: number
  @Input('class') className?: string

  get colorClass(): string {
    return this.colorIndex !== undefined ? barColors[this.colorIndex % barColors.length]! : ''
  }

  get hostClass(): string {
    return cn('block group/progress space-y-1.5', this.className)
  }

  get progressClass(): string {
    return cn('h-2 transition-colors duration-200', this.colorClass, this.barClass)
  }
}
