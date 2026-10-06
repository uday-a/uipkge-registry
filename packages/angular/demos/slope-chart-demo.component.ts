import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { UiSlopeChartComponent } from '../../../../../packages/registry-angular/components/charts/slope-chart/slope-chart.component'

const share = [
  { label: 'Desktop', values: [52, 44] },
  { label: 'Mobile', values: [38, 47] },
  { label: 'Tablet', values: [10, 9] },
]
const ranks = [
  { label: 'Aurora', values: [3, 2, 1, 1] },
  { label: 'Boreal', values: [1, 1, 2, 3] },
  { label: 'Cirrus', values: [2, 3, 3, 2] },
]

/** Angular demo for the slope-chart page. Mirrors demos/react/slope-chart.tsx 1:1. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'angular-slope-chart-demo',
  standalone: true,
  imports: [UiSlopeChartComponent],
  template: `
    @switch (story) {
      @case ('Rank bump chart') {
        <ui-slope-chart [data]="ranks" [points]="['W1', 'W2', 'W3', 'W4']" height="320" />
      }
      @default {
        <ui-slope-chart [data]="share" [points]="['2024', '2025']" height="300" />
      }
    }
  `,
})
export class AngularSlopeChartDemoComponent {
  @Input() story = 'Traffic share shift'
  protected readonly share = share
  protected readonly ranks = ranks
}
