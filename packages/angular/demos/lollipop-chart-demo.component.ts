import { ChangeDetectionStrategy, Component } from '@angular/core'
import { UiLollipopChartComponent } from '../../../../../packages/registry-angular/components/charts/lollipop-chart/lollipop-chart.component'

const votes = [
  { category: 'Alpha', value: 84 },
  { category: 'Beta', value: 62 },
  { category: 'Gamma', value: 91 },
  { category: 'Delta', value: 45 },
  { category: 'Epsilon', value: 73 },
]

/** Angular demo for the lollipop-chart page. Mirrors demos/react/lollipop-chart.tsx 1:1. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'angular-lollipop-chart-demo',
  standalone: true,
  imports: [UiLollipopChartComponent],
  template: ` <ui-lollipop-chart [data]="votes" [height]="300" /> `,
})
export class AngularLollipopChartDemoComponent {
  protected readonly votes = votes
}
