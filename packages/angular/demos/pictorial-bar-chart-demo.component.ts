import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { UiPictorialBarChartComponent } from '../../../../../packages/registry-angular/components/charts/pictorial-bar-chart/pictorial-bar-chart.component'

const hiring = [
  { category: 'Eng', value: 24 },
  { category: 'Design', value: 12 },
  { category: 'Sales', value: 18 },
  { category: 'Support', value: 9 },
  { category: 'Ops', value: 6 },
]

/** Angular demo for the pictorial-bar-chart page. Mirrors demos/react/pictorial-bar-chart.tsx 1:1. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'angular-pictorial-bar-chart-demo',
  standalone: true,
  imports: [UiPictorialBarChartComponent],
  template: `
    @switch (story) {
      @case ('Diamond symbols') {
        <ui-pictorial-bar-chart [data]="hiring" symbol="diamond" [height]="300" />
      }
      @default {
        <ui-pictorial-bar-chart [data]="hiring" [height]="300" />
      }
    }
  `,
})
export class AngularPictorialBarChartDemoComponent {
  protected readonly hiring = hiring
  @Input() story = 'Headcount'
}
