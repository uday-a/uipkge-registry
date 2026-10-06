import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { UiFunnelChartComponent } from '../../../../../packages/registry-angular/components/charts/funnel-chart/funnel-chart.component'

/** Angular demo for the funnel-chart primitive page. Mirrors demos/react/funnel-chart.tsx. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'angular-funnel-chart-demo',
  standalone: true,
  imports: [UiFunnelChartComponent],
  template: `
    @switch (story) {
      @case ('With legend') {
        <ui-funnel-chart [data]="acquisition" [height]="360" />
      }
      @case ('Inverted') {
        <ui-funnel-chart [data]="acquisition" sort="ascending" [height]="340" />
      }
      @case ('With conversion %') {
        <ui-funnel-chart [data]="checkout" [option]="conversionOption" [height]="320" />
      }
      @case ('Compact dashboard tile') {
        <ui-funnel-chart [data]="checkout" [option]="compactOption" [height]="180" />
      }
      @default {
        <ui-funnel-chart [data]="acquisition" [height]="340" />
      }
    }
  `,
})
export class AngularFunnelChartDemoComponent {
  @Input() story = 'Basic funnel'

  readonly acquisition = [
    { name: 'Visitors', value: 24850 },
    { name: 'Sign-ups', value: 14910 },
    { name: 'Activated', value: 5964 },
    { name: 'Paid', value: 1789 },
    { name: 'Retained 30d', value: 447 },
  ]

  readonly checkout = [
    { name: 'Cart', value: 8200 },
    { name: 'Checkout', value: 4900 },
    { name: 'Payment', value: 3100 },
    { name: 'Confirmed', value: 2700 },
  ]

  readonly conversionOption = {
    series: [
      {
        type: 'funnel',
        data: [
          { name: 'Cart', value: 8200 },
          { name: 'Checkout', value: 4900 },
          { name: 'Payment', value: 3100 },
          { name: 'Confirmed', value: 2700 },
        ],
        label: {
          show: true,
          position: 'inside',
          color: '#fff',
          fontSize: 11,
          fontWeight: 600,
          formatter: (p: { name: string; value: number; percent: number }) =>
            `${p.name}\n${p.value.toLocaleString()} (${p.percent}%)`,
        },
      },
    ],
  }

  readonly compactOption = {
    series: [
      {
        type: 'funnel',
        data: [
          { name: 'Cart', value: 8200 },
          { name: 'Checkout', value: 4900 },
          { name: 'Payment', value: 3100 },
          { name: 'Confirmed', value: 2700 },
        ],
        label: { show: false },
      },
    ],
  }
}
