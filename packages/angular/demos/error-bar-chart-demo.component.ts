import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { UiErrorBarChartComponent } from '../../../../../packages/registry-angular/components/charts/error-bar-chart/error-bar-chart.component'

/** Angular demo for the error-bar-chart primitive page. Mirrors demos/react/error-bar-chart.tsx. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'angular-error-bar-chart-demo',
  standalone: true,
  imports: [UiErrorBarChartComponent],
  template: `
    @switch (story) {
      @default {
        <ui-error-bar-chart [data]="lanes" [height]="320" />
      }
    }
  `,
})
export class AngularErrorBarChartDemoComponent {
  @Input() story = 'Rate forecast intervals'

  readonly lanes = [
    { category: 'PVG–LAX', value: 4.6, low: 4.1, high: 5.3 },
    { category: 'ICN–ORD', value: 4.2, low: 3.8, high: 4.7 },
    { category: 'SIN–HKG', value: 2.4, low: 2.1, high: 2.8 },
    { category: 'FRA–JFK', value: 3.6, low: 3.2, high: 4.1 },
    { category: 'DXB–SIN', value: 3.1, low: 2.7, high: 3.6 },
  ]
}
