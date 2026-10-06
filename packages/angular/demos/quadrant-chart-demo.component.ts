import { ChangeDetectionStrategy, Component } from '@angular/core'
import { UiQuadrantChartComponent } from '../../../../../packages/registry-angular/components/charts/quadrant-chart/quadrant-chart.component'

const vendors = [
  { x: 8.2, y: 7.4, label: 'Acme' },
  { x: 6.1, y: 8.8, label: 'Globex' },
  { x: 4.4, y: 5.2, label: 'Initech' },
  { x: 7.8, y: 4.1, label: 'Umbrella' },
  { x: 3.2, y: 8.1, label: 'Hooli' },
  { x: 5.5, y: 6.0, label: 'Stark' },
]

/** Angular demo for the quadrant-chart page. Mirrors demos/react/quadrant-chart.tsx 1:1. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'angular-quadrant-chart-demo',
  standalone: true,
  imports: [UiQuadrantChartComponent],
  template: ` <ui-quadrant-chart [data]="vendors" xName="Completeness" yName="Satisfaction" [height]="340" /> `,
})
export class AngularQuadrantChartDemoComponent {
  protected readonly vendors = vendors
}
