import { Component, Input, ChangeDetectionStrategy } from '@angular/core'
import { cn } from '@/lib/utils'

export type DayStatus = 'up' | 'degraded' | 'down' | 'unknown'

export interface StatusDay {
  date: string
  status: DayStatus
}

const COLORS: Record<DayStatus, string> = {
  up: 'var(--chart-2)',
  degraded: 'var(--chart-4)',
  down: 'var(--destructive)',
  unknown: 'var(--border)',
}

/**
 * Angular port of the UIPKGE UptimeTrackerChart — dependency-free status bars
 * (React/Vue parity): one flex bar per day colored by status, plus a legend row
 * with the computed uptime % (days fully `up` over total days).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-uptime-tracker-chart, [ui-uptime-tracker-chart]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"uptime-tracker-chart"',
    '[attr.data-uipkge]': '""',
    '[attr.role]': '"img"',
    '[attr.aria-label]': 'resolvedAriaLabel',
    '[attr.tabindex]': '0',
    '[class]': 'hostClass',
  },
  template: `
    <div class="flex min-h-6 w-full items-stretch" [style.height]="heightStyle" [style.gap]="gap + 'px'">
      @for (d of days; track d.date + '-' + $index) {
        <div
          class="min-w-0 flex-1"
          [style.background]="barColor(d.status)"
          [style.border-radius]="rounded + 'px'"
          [title]="barTitle(d)"
        ></div>
      }
    </div>
    @if (showLegend) {
      <div class="mt-2 flex items-center gap-3 text-xs">
        <span class="text-foreground font-semibold tabular-nums">{{ uptime }} uptime</span>
        <span class="text-muted-foreground">{{ days.length }} days</span>
        <span class="ml-auto flex items-center gap-2">
          <span class="flex items-center gap-1">
            <span class="size-2 rounded-[2px]" [style.background]="legendColor('up')"></span>Up
          </span>
          <span class="flex items-center gap-1">
            <span class="size-2 rounded-[2px]" [style.background]="legendColor('degraded')"></span>Degraded
          </span>
          <span class="flex items-center gap-1">
            <span class="size-2 rounded-[2px]" [style.background]="legendColor('down')"></span>Down
          </span>
        </span>
      </div>
    }
  `,
})
export class UiUptimeTrackerChartComponent {
  @Input() days: StatusDay[] = []
  @Input() height: number | string = 48
  /** Gap between bars in px. Default 2. */
  @Input() gap = 2
  /** Bar corner radius in px. Default 2. */
  @Input() rounded = 2
  /** Show the legend row with the computed uptime %. Default true. */
  @Input() showLegend = true
  /** Accessible name announced for the chart image. Defaults to "Uptime tracker: <summary>". */
  @Input() ariaLabel?: string
  @Input('class') className?: string

  get hostClass(): string {
    return cn('focus-visible:ring-ring block w-full focus-visible:ring-2 focus-visible:outline-none', this.className)
  }

  get heightStyle(): string {
    return /^\d+$/.test(String(this.height)) ? `${this.height}px` : String(this.height)
  }

  /** Percent of days fully `up` (React/Vue formula), or '—' with no data. */
  get uptime(): string {
    if (!this.days.length) return '—'
    const up = this.days.filter((d) => d.status === 'up').length
    return `${((up / this.days.length) * 100).toFixed(1)}%`
  }

  get summary(): string {
    const counts = (s: DayStatus) => this.days.filter((d) => d.status === s).length
    return `${counts('up')} up, ${counts('degraded')} degraded, ${counts('down')} down days`
  }

  get resolvedAriaLabel(): string {
    return this.ariaLabel || `Uptime tracker: ${this.summary}`
  }

  barColor(status: DayStatus): string {
    return COLORS[status]
  }

  legendColor(status: DayStatus): string {
    return COLORS[status]
  }

  barTitle(d: StatusDay): string {
    return `${d.date} — ${d.status}`
  }
}
