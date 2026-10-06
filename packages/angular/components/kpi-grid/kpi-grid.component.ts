import { Component, Input, ChangeDetectionStrategy } from '@angular/core'
import { cn } from '@/lib/utils'

export type KpiGridColumns = 2 | 3 | 4

/**
 * Angular port of UIPKGE KpiGrid. Bare responsive grid wrapper (2/3/4
 * columns). Pass any children — no items prop, no item rendering.
 * Class strings mirror the Vue source.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-kpi-grid, [ui-kpi-grid]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"kpi-grid"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiKpiGridComponent {
  @Input() columns: KpiGridColumns = 4
  @Input('class') className?: string

  get hostClass(): string {
    return cn(
      'grid gap-4 md:grid-cols-2',
      this.columns === 3 ? 'lg:grid-cols-3' : this.columns === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-4',
      this.className,
    )
  }
}
