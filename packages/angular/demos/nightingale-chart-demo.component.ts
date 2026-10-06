import { ChangeDetectionStrategy, Component } from '@angular/core'
import { UiNightingaleChartComponent } from '../../../../../packages/registry-angular/components/charts/nightingale-chart/nightingale-chart.component'

const traffic = [
  { name: 'Organic', value: 480 },
  { name: 'Paid', value: 360 },
  { name: 'Referral', value: 220 },
  { name: 'Social', value: 150 },
  { name: 'Email', value: 90 },
]

/** Angular demo for the nightingale-chart page. Mirrors demos/react/nightingale-chart.tsx 1:1. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'angular-nightingale-chart-demo',
  standalone: true,
  imports: [UiNightingaleChartComponent],
  template: ` <ui-nightingale-chart [data]="traffic" [height]="340" /> `,
})
export class AngularNightingaleChartDemoComponent {
  protected readonly traffic = traffic
}
