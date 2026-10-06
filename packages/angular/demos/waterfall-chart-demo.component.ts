import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { UiWaterfallChartComponent } from '../../../../../packages/registry-angular/components/charts/waterfall-chart/waterfall-chart.component'

const cashflow = [
  { label: 'Opening', value: 12000 },
  { label: 'Sales', value: 8400 },
  { label: 'Refunds', value: -1800 },
  { label: 'COGS', value: -5200 },
  { label: 'Opex', value: -3100 },
  { label: 'Tax', value: -1400 },
]
const noTotal = [
  { label: 'Q1', value: 3200 },
  { label: 'Q2', value: -800 },
  { label: 'Q3', value: 2400 },
  { label: 'Q4', value: 1800 },
]

/** Angular demo for the waterfall-chart page. Mirrors demos/react/waterfall-chart.tsx 1:1. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'angular-waterfall-chart-demo',
  standalone: true,
  imports: [UiWaterfallChartComponent],
  template: `
    @switch (story) {
      @case ('Without total') {
        <ui-waterfall-chart [data]="noTotal" [showTotal]="false" height="280" />
      }
      @case ('Compact') {
        <ui-waterfall-chart [data]="compact" height="240" />
      }
      @default {
        <ui-waterfall-chart [data]="cashflow" height="320" />
      }
    }
  `,
})
export class AngularWaterfallChartDemoComponent {
  @Input() story = 'Cashflow waterfall'
  protected readonly cashflow = cashflow
  protected readonly noTotal = noTotal
  protected readonly compact = cashflow.slice(0, 4)
}
