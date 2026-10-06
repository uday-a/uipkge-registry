import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { UiProgressRingChartComponent } from '../../../../../packages/registry-angular/components/charts/progress-ring-chart/progress-ring-chart.component'

const quotaRings = [{ value: 68, label: 'Quota' }]

const multiRings = [
  { value: 82, label: 'Revenue' },
  { value: 64, label: 'NPS' },
  { value: 45, label: 'Retention' },
]

/** Angular demo for the progress-ring-chart page. Mirrors demos/react/progress-ring-chart.tsx 1:1. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'angular-progress-ring-chart-demo',
  standalone: true,
  imports: [UiProgressRingChartComponent],
  template: `
    @switch (story) {
      @case ('Multi-ring') {
        <ui-progress-ring-chart [rings]="multiRings" [height]="260" />
      }
      @default {
        <ui-progress-ring-chart [rings]="quotaRings" [height]="220" />
      }
    }
  `,
})
export class AngularProgressRingChartDemoComponent {
  protected readonly quotaRings = quotaRings
  protected readonly multiRings = multiRings
  @Input() story = 'Quota ring'
}
