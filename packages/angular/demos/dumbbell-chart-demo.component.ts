import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { UiDumbbellChartComponent } from '../../../../../packages/registry-angular/components/charts/dumbbell-chart/dumbbell-chart.component'

/** Angular demo for the dumbbell-chart primitive page. Mirrors demos/react/dumbbell-chart.tsx. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'angular-dumbbell-chart-demo',
  standalone: true,
  imports: [UiDumbbellChartComponent],
  template: `
    @switch (story) {
      @default {
        <ui-dumbbell-chart [data]="churn" [names]="names" [height]="300" />
      }
    }
  `,
})
export class AngularDumbbellChartDemoComponent {
  @Input() story = 'Churn before/after'

  readonly churn = [
    { label: 'Acme', a: 4.2, b: 2.1 },
    { label: 'Globex', a: 3.8, b: 3.1 },
    { label: 'Initech', a: 5.1, b: 2.8 },
    { label: 'Umbrella', a: 2.4, b: 2.9 },
  ]

  readonly names: [string, string] = ['Q1', 'Q2']
}
