import { Component, Input, ChangeDetectionStrategy } from '@angular/core'
import { cn } from '@/lib/utils'

export interface DistributionSlice {
  label: string
  /** Share of the whole; auto-normalised when the sum is not 100. */
  percentage: number
  value?: string | number
  color?: string
}

const DEFAULT_COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)']

/**
 * Angular port of the UIPKGE CategoryDistributionChart. Dependency-free like React/Vue:
 * a KPI headline plus a stacked share bar and a value legend. Shares auto-normalise.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-category-distribution-chart, [ui-category-distribution-chart]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"category-distribution-chart"',
    '[attr.data-uipkge]': '""',
    '[attr.role]': '"img"',
    '[attr.aria-label]': 'ariaLabel || "Chart"',
    '[class]': 'hostClass',
    '[style.height]': 'heightStyle',
  },
  template: `
    <div class="flex items-baseline gap-2">
      <span class="text-foreground text-3xl font-bold tabular-nums">{{ primaryValue }}</span>
      @if (trend) {
        <span class="text-xs font-semibold tabular-nums" [style.color]="trendColor">{{ trendSign }}{{ trend.value }}</span>
      }
      @if (primaryLabel) {
        <span class="text-muted-foreground text-xs">{{ primaryLabel }}</span>
      }
    </div>
    <div class="mt-3 flex h-3 w-full overflow-hidden rounded-full" role="presentation">
      @for (s of slices; track s.label) {
        <div class="h-full" [style.width.%]="s.share" [style.background]="s.color" [title]="s.label + ' — ' + s.rounded + '%'"></div>
      }
    </div>
    @if (showLegend) {
      <ul class="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
        @for (s of slices; track s.label) {
          <li class="flex min-w-0 items-center gap-2">
            <span class="size-2.5 shrink-0 rounded-[3px]" [style.background]="s.color"></span>
            <span class="text-foreground truncate font-medium">{{ s.label }}</span>
            <span class="text-muted-foreground ml-auto shrink-0 tabular-nums">{{ s.displayValue }}</span>
          </li>
        }
      </ul>
    }
  `,
})
export class UiCategoryDistributionChartComponent {
  @Input() primaryValue!: string | number
  @Input() primaryLabel?: string
  @Input() trend?: { value: string; direction: 'up' | 'down' }
  @Input() categories: DistributionSlice[] = []
  @Input() height: number | string = 220
  @Input() showLegend = true
  @Input() colors: string[] = DEFAULT_COLORS
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  @Input() ariaLabel?: string
  @Input('class') className?: string

  get hostClass(): string {
    return cn('flex w-full flex-col justify-center', this.className)
  }

  get heightStyle(): string {
    return /^\d+$/.test(String(this.height)) ? `${this.height}px` : String(this.height)
  }

  get total(): number {
    return this.categories.reduce((s, c) => s + c.percentage, 0) || 1
  }

  get slices(): (DistributionSlice & { share: number; rounded: number; displayValue: string | number })[] {
    return this.categories.map((c, i) => {
      const share = (c.percentage / this.total) * 100
      return {
        ...c,
        color: c.color ?? this.colors[i % this.colors.length],
        share,
        rounded: Math.round(share),
        displayValue: c.value ?? `${Math.round(share)}%`,
      }
    })
  }

  get trendColor(): string {
    return this.trend?.direction === 'up' ? 'var(--chart-2)' : 'var(--destructive)'
  }

  get trendSign(): string {
    return this.trend?.direction === 'up' ? '+' : '−'
  }
}
