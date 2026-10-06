import { Component, Input } from '@angular/core'
import { UiCalendarHeatmapComponent } from '../../../../../packages/registry-angular/components/charts/calendar-heatmap/calendar-heatmap.component'

// Deterministic data so SSR and client render the same strings.
function seeded(i: number): number {
  const x = Math.sin(i * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

/** Angular demo for the calendar-heatmap page. Mirrors demos/react/calendar-heatmap.tsx story by story. */
@Component({
  selector: 'angular-calendar-heatmap-demo',
  standalone: true,
  imports: [UiCalendarHeatmapComponent],
  template: `
    @switch (story) {
      @case ('Yearly contribution grid') {
        <ui-calendar-heatmap [data]="yearData" [option]="yearRangeOption" height="200" />
      }
      @case ('Quarter view') {
        <ui-calendar-heatmap [data]="quarterData" [option]="quarterRangeOption" height="160" />
      }
      @case ('Teal palette') {
        <ui-calendar-heatmap
          [data]="yearData"
          [option]="yearRangeOption"
          [colorRange]="tealRange"
          height="200"
        />
      }
      @case ('Blue palette') {
        <ui-calendar-heatmap
          [data]="yearData"
          [option]="yearRangeOption"
          [colorRange]="blueRange"
          height="200"
        />
      }
      @case ('Single month') {
        <ui-calendar-heatmap [data]="monthData" [option]="monthRangeOption" height="160" />
      }
      @case ('Freighter operating days') {
        <ui-calendar-heatmap
          [data]="opsData"
          [option]="opsRangeOption"
          [colorRange]="opsRange"
          height="200"
        />
      }
      @default {
        <ui-calendar-heatmap [data]="yearData" [option]="yearRangeOption" height="200" />
      }
    }
  `,
})
export class AngularCalendarHeatmapDemoComponent {
  @Input() story = 'Yearly contribution grid'

  anchor = new Date('2026-05-15T00:00:00Z')

  opsAnchor = new Date('2026-09-05T00:00:00Z')

  mxDays = new Set([11, 42, 43, 70])

  opsData: [string, number][] = Array.from({ length: 90 }, (_, i) => {
    const d = new Date(this.opsAnchor)
    d.setUTCDate(this.opsAnchor.getUTCDate() - (89 - i))
    const v = this.mxDays.has(i) ? 0 : 1 + Math.floor(seeded(i + 500) * 2)
    return [d.toISOString().slice(0, 10), v] as [string, number]
  })

  opsStart = new Date(this.opsAnchor.getTime() - 89 * 86400_000).toISOString().slice(0, 10)

  opsEnd = this.opsAnchor.toISOString().slice(0, 10)

  opsRangeOption: Record<string, unknown> = {
    calendar: { range: [this.opsStart, this.opsEnd] },
  }

  opsRange: [string, string] = ['#dcfce7', '#15803d']

  yearData: [string, number][] = Array.from({ length: 365 }, (_, i) => {
    const d = new Date(this.anchor)
    d.setUTCDate(this.anchor.getUTCDate() - i)
    const iso = d.toISOString().slice(0, 10)
    const dow = d.getUTCDay()
    return [iso, Math.max(0, Math.round((dow === 0 || dow === 6 ? 0 : 3) + (seeded(i) - 0.3) * 6))] as [
      string,
      number,
    ]
  })

  yearStart = new Date(this.anchor.getTime() - 364 * 86400_000).toISOString().slice(0, 10)

  yearEnd = this.anchor.toISOString().slice(0, 10)

  yearRangeOption: Record<string, unknown> = {
    calendar: { range: [this.yearStart, this.yearEnd] },
  }

  quarterData: [string, number][] = this.yearData.filter(([iso]) => iso >= '2026-03-01' && iso <= '2026-05-15')

  quarterRangeOption: Record<string, unknown> = {
    calendar: { range: ['2026-03-01', '2026-05-15'] },
  }

  tealRange: [string, string] = ['#ccfbf1', '#0f766e']

  blueRange: [string, string] = ['#dbeafe', '#1d4ed8']

  monthData: [string, number][] = this.yearData.filter(([iso]) => iso >= '2026-05-01' && iso <= '2026-05-31')

  monthRangeOption: Record<string, unknown> = {
    calendar: { range: ['2026-05-01', '2026-05-31'] },
  }
}
