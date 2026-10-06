import { ChangeDetectionStrategy, Component } from '@angular/core'
import { UiMarimekkoChartComponent } from '../../../../../packages/registry-angular/components/charts/marimekko-chart/marimekko-chart.component'

// Weekly tonnage: columns are trade regions (width = share), values are carriers.
const regions = [
  {
    name: 'Transpacific',
    values: [
      { name: 'SQ', value: 320 },
      { name: 'CX', value: 410 },
      { name: 'KE', value: 300 },
      { name: 'Other', value: 250 },
    ],
  },
  {
    name: 'Intra-Asia',
    values: [
      { name: 'SQ', value: 380 },
      { name: 'CX', value: 290 },
      { name: 'KE', value: 120 },
      { name: 'Other', value: 70 },
    ],
  },
  {
    name: 'Europe',
    values: [
      { name: 'SQ', value: 140 },
      { name: 'CX', value: 90 },
      { name: 'KE', value: 60 },
      { name: 'Other', value: 350 },
    ],
  },
]

/** Angular demo for the marimekko-chart page. Mirrors demos/react/marimekko-chart.tsx 1:1. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'angular-marimekko-chart-demo',
  standalone: true,
  imports: [UiMarimekkoChartComponent],
  template: ` <ui-marimekko-chart [columns]="regions" [height]="360" /> `,
})
export class AngularMarimekkoChartDemoComponent {
  protected readonly regions = regions
}
