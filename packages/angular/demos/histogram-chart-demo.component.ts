import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { UiHistogramChartComponent } from '../../../../../packages/registry-angular/components/charts/histogram-chart/histogram-chart.component'

/** Angular demo for the histogram-chart primitive page. Mirrors demos/react/histogram-chart.tsx. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'angular-histogram-chart-demo',
  standalone: true,
  imports: [UiHistogramChartComponent],
  template: `
    @switch (story) {
      @case ('Pre-binned') {
        <ui-histogram-chart [data]="binned" [height]="300" />
      }
      @default {
        <ui-histogram-chart [values]="ages" [bins]="8" [height]="300" />
      }
    }
  `,
})
export class AngularHistogramChartDemoComponent {
  @Input() story = 'Auto-binned'

  readonly ages = [22, 24, 25, 27, 29, 31, 31, 33, 34, 35, 36, 38, 41, 44, 47, 52, 58, 63]

  readonly binned = [
    { bin: '0–10s', count: 42 },
    { bin: '100–200ms', count: 128 },
    { bin: '200–500ms', count: 86 },
    { bin: '500ms–1s', count: 24 },
    { bin: '1s+', count: 6 },
  ]
}
