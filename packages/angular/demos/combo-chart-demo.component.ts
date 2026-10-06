import { Component, Input } from '@angular/core'
import { UiComboChartComponent } from '../../../../../packages/registry-angular/components/charts/combo-chart/combo-chart.component'

/** Angular demo for the combo-chart page. Mirrors demos/react/combo-chart.tsx story by story. */
@Component({
  selector: 'angular-combo-chart-demo',
  standalone: true,
  imports: [UiComboChartComponent],
  template: `
    @switch (story) {
      @case ('Orders + conversion') {
        <ui-combo-chart
          [data]="monthly"
          xField="m"
          barField="orders"
          lineField="conversion"
          height="320"
        />
      }
      @case ('Multi-bar + line') {
        <ui-combo-chart
          [data]="multiBar"
          xField="m"
          [barField]="['a', 'b']"
          lineField="t"
          height="300"
        />
      }
      @case ('Bookings vs rate') {
        <ui-combo-chart [data]="laneMonths" xField="m" barField="tonnes" lineField="rate" height="320" />
      }
      @default {
        <ui-combo-chart
          [data]="monthly"
          xField="m"
          barField="orders"
          lineField="conversion"
          height="320"
        />
      }
    }
  `,
})
export class AngularComboChartDemoComponent {
  @Input() story = 'Orders + conversion'

  monthly = [
    { m: 'Jan', orders: 320, conversion: 2.1 },
    { m: 'Feb', orders: 410, conversion: 2.4 },
    { m: 'Mar', orders: 380, conversion: 2.2 },
    { m: 'Apr', orders: 520, conversion: 2.9 },
    { m: 'May', orders: 480, conversion: 2.7 },
    { m: 'Jun', orders: 610, conversion: 3.4 },
  ]

  laneMonths = [
    { m: 'Jan', tonnes: 18200, rate: 4.1 },
    { m: 'Feb', tonnes: 16400, rate: 5.9 },
    { m: 'Mar', tonnes: 19800, rate: 4.4 },
    { m: 'Apr', tonnes: 20500, rate: 4.0 },
    { m: 'May', tonnes: 21300, rate: 4.3 },
    { m: 'Jun', tonnes: 22100, rate: 4.7 },
  ]

  multiBar = [
    { m: 'Jan', a: 120, b: 90, t: 200 },
    { m: 'Feb', a: 150, b: 110, t: 240 },
    { m: 'Mar', a: 130, b: 100, t: 220 },
  ]
}
