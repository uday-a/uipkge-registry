import { ChangeDetectionStrategy, Component } from '@angular/core'
import { UiRangeAreaChartComponent } from '../../../../../packages/registry-angular/components/charts/range-area-chart/range-area-chart.component'

const temps = [
  { d: 'Mon', min: 12, avg: 17, max: 22 },
  { d: 'Tue', min: 13, avg: 18, max: 24 },
  { d: 'Wed', min: 11, avg: 16, max: 21 },
  { d: 'Thu', min: 14, avg: 19, max: 25 },
  { d: 'Fri', min: 15, avg: 21, max: 27 },
  { d: 'Sat', min: 16, avg: 22, max: 28 },
]

/** Angular demo for the range-area-chart page. Mirrors demos/react/range-area-chart.tsx 1:1. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'angular-range-area-chart-demo',
  standalone: true,
  imports: [UiRangeAreaChartComponent],
  template: ` <ui-range-area-chart [data]="temps" xField="d" [height]="320" /> `,
})
export class AngularRangeAreaChartDemoComponent {
  protected readonly temps = temps
}
