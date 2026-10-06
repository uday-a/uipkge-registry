import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import {
  UiUptimeTrackerChartComponent,
  type StatusDay,
} from '../../../../../packages/registry-angular/components/charts/uptime-tracker-chart/uptime-tracker-chart.component'

function seeded(i: number) {
  const x = Math.sin(i * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

const anchor = new Date('2026-09-05T00:00:00Z')
function build(outages: Record<number, 'degraded' | 'down'>): StatusDay[] {
  return Array.from({ length: 90 }, (_, i) => {
    const d = new Date(anchor)
    d.setUTCDate(anchor.getUTCDate() - (89 - i))
    return { date: d.toISOString().slice(0, 10), status: outages[i] ?? (seeded(i) > 0.97 ? 'unknown' : 'up') }
  })
}

const healthy = build({})
const incident = build({ 62: 'degraded', 63: 'degraded', 64: 'down', 81: 'degraded' })

/** Angular demo for the uptime-tracker-chart page. Mirrors demos/react/uptime-tracker-chart.tsx 1:1. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'angular-uptime-tracker-chart-demo',
  standalone: true,
  imports: [UiUptimeTrackerChartComponent],
  template: `
    @switch (story) {
      @case ('With incidents') {
        <ui-uptime-tracker-chart [days]="incident" />
      }
      @default {
        <ui-uptime-tracker-chart [days]="healthy" />
      }
    }
  `,
})
export class AngularUptimeTrackerChartDemoComponent {
  @Input() story = 'Healthy quarter'
  protected readonly healthy = healthy
  protected readonly incident = incident
}
