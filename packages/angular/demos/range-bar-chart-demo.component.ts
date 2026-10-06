import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { UiRangeBarChartComponent } from '../../../../../packages/registry-angular/components/charts/range-bar-chart/range-bar-chart.component'

// Contracted rate bands ($/kg) by lane.
const bands = [
  { label: 'PVG–LAX', low: 3.8, high: 6.2 },
  { label: 'ICN–ORD', low: 3.4, high: 5.1 },
  { label: 'NRT–DFW', low: 3.9, high: 5.6 },
  { label: 'FRA–JFK', low: 2.9, high: 4.4 },
  { label: 'SIN–HKG', low: 1.8, high: 3.0 },
]

const shortBands = bands.slice(0, 3)

/** Angular demo for the range-bar-chart page. Mirrors demos/react/range-bar-chart.tsx 1:1. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'angular-range-bar-chart-demo',
  standalone: true,
  imports: [UiRangeBarChartComponent],
  template: `
    @switch (story) {
      @case ('Horizontal bands') {
        <ui-range-bar-chart [data]="shortBands" orientation="horizontal" [height]="240" />
      }
      @default {
        <ui-range-bar-chart [data]="bands" [height]="320" />
      }
    }
  `,
})
export class AngularRangeBarChartDemoComponent {
  protected readonly bands = bands
  protected readonly shortBands = shortBands
  @Input() story = 'Rate bands'
}
