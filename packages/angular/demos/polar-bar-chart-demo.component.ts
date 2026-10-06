import { ChangeDetectionStrategy, Component } from '@angular/core'
import { UiPolarBarChartComponent } from '../../../../../packages/registry-angular/components/charts/polar-bar-chart/polar-bar-chart.component'

const traffic = [
  { category: 'Organic', value: 42 },
  { category: 'Paid', value: 28 },
  { category: 'Referral', value: 18 },
  { category: 'Social', value: 24 },
  { category: 'Email', value: 12 },
]

/** Angular demo for the polar-bar-chart page. Mirrors demos/react/polar-bar-chart.tsx 1:1. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'angular-polar-bar-chart-demo',
  standalone: true,
  imports: [UiPolarBarChartComponent],
  template: ` <ui-polar-bar-chart [data]="traffic" [height]="320" /> `,
})
export class AngularPolarBarChartDemoComponent {
  protected readonly traffic = traffic
}
