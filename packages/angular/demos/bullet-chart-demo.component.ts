import { Component, Input } from '@angular/core'
import { UiBulletChartComponent } from '../../../../../packages/registry-angular/components/charts/bullet-chart/bullet-chart.component'

/** Angular demo for the bullet-chart page. Mirrors demos/react/bullet-chart.tsx 1:1. */
@Component({
  selector: 'angular-bullet-chart-demo',
  standalone: true,
  imports: [UiBulletChartComponent],
  template: `
    @switch (story) {
      @default {
        <ui-bullet-chart [data]="kpis" height="300" />
      }
    }
  `,
})
export class AngularBulletChartDemoComponent {
  @Input() story = 'Default'

  kpis: { label: string; actual: number; target: number; ranges: [number, number, number] }[] = [
    { label: 'Revenue', actual: 82, target: 90, ranges: [50, 75, 100] },
    { label: 'NPS', actual: 64, target: 70, ranges: [40, 60, 100] },
    { label: 'Uptime', actual: 99.2, target: 99.9, ranges: [95, 99, 100] },
    { label: 'CSAT', actual: 88, target: 85, ranges: [60, 80, 100] },
  ]
}
