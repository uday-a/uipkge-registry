import { ChangeDetectionStrategy, Component } from '@angular/core'
import { UiParetoChartComponent } from '../../../../../packages/registry-angular/components/charts/pareto-chart/pareto-chart.component'

const defects = [
  { category: 'Typos', value: 142 },
  { category: 'Broken links', value: 98 },
  { category: 'Slow pages', value: 64 },
  { category: 'Auth errors', value: 31 },
  { category: 'Billing bugs', value: 18 },
  { category: 'Other', value: 12 },
]

/** Angular demo for the pareto-chart page. Mirrors demos/react/pareto-chart.tsx 1:1. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'angular-pareto-chart-demo',
  standalone: true,
  imports: [UiParetoChartComponent],
  template: ` <ui-pareto-chart [data]="defects" [height]="320" /> `,
})
export class AngularParetoChartDemoComponent {
  protected readonly defects = defects
}
