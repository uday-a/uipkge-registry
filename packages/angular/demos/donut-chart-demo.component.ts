import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { UiDonutChartComponent } from '../../../../../packages/registry-angular/components/charts/donut-chart/donut-chart.component'

/** Angular demo for the donut-chart primitive page. Mirrors demos/react/donut-chart.tsx. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'angular-donut-chart-demo',
  standalone: true,
  imports: [UiDonutChartComponent],
  template: `
    @switch (story) {
      @case ('Filled donut') {
        <ui-donut-chart [data]="share" [thickness]="0" [height]="320" />
      }
      @case ('Half donut') {
        <ui-donut-chart [data]="devices" type="half" [height]="280" />
      }
      @case ('KPI ring') {
        <ui-donut-chart [data]="kpi" centerLabel="68%" [height]="280" />
      }
      @default {
        <ui-donut-chart [data]="share" [height]="320" />
      }
    }
  `,
})
export class AngularDonutChartDemoComponent {
  @Input() story = 'Revenue split'

  readonly share = [
    { name: 'Product', value: 45 },
    { name: 'Services', value: 25 },
    { name: 'Support', value: 20 },
    { name: 'Other', value: 10 },
  ]

  readonly devices = [
    { name: 'Desktop', value: 52 },
    { name: 'Mobile', value: 38 },
    { name: 'Tablet', value: 10 },
  ]

  readonly kpi = [
    { name: 'Used', value: 68 },
    { name: 'Left', value: 32 },
  ]
}
