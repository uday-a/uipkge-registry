import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { UiStackedAreaChartComponent } from '../../../../../packages/registry-angular/components/charts/stacked-area-chart/stacked-area-chart.component'

const traffic = [
  { m: 'Jan', organic: 120, paid: 80, referral: 40 },
  { m: 'Feb', organic: 150, paid: 95, referral: 52 },
  { m: 'Mar', organic: 135, paid: 88, referral: 48 },
  { m: 'Apr', organic: 180, paid: 110, referral: 64 },
  { m: 'May', organic: 210, paid: 128, referral: 72 },
]

/** Angular demo for the stacked-area-chart page. Mirrors demos/react/stacked-area-chart.tsx 1:1. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'angular-stacked-area-chart-demo',
  standalone: true,
  imports: [UiStackedAreaChartComponent],
  template: `
    @switch (story) {
      @case ('100% share') {
        <ui-stacked-area-chart [data]="traffic" xField="m" [yField]="yFields" [percent]="true" height="320" />
      }
      @default {
        <ui-stacked-area-chart [data]="traffic" xField="m" [yField]="yFields" height="320" />
      }
    }
  `,
})
export class AngularStackedAreaChartDemoComponent {
  @Input() story = 'Traffic streams'
  protected readonly traffic = traffic
  protected readonly yFields = ['organic', 'paid', 'referral']
}
