import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { UiHeikinAshiChartComponent } from '../../../../../packages/registry-angular/components/charts/heikin-ashi-chart/heikin-ashi-chart.component'

/** Angular demo for the heikin-ashi-chart primitive page. Mirrors demos/react/heikin-ashi-chart.tsx. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'angular-heikin-ashi-chart-demo',
  standalone: true,
  imports: [UiHeikinAshiChartComponent],
  template: `
    @switch (story) {
      @case ('With zoom') {
        <ui-heikin-ashi-chart [data]="tpeb" [zoom]="true" [height]="340" />
      }
      @default {
        <ui-heikin-ashi-chart [data]="tpeb" [height]="340" />
      }
    }
  `,
})
export class AngularHeikinAshiChartDemoComponent {
  @Input() story = 'TPEB spot trend'

  readonly tpeb = [
    { date: 'W18', open: 4.1, high: 4.4, low: 3.9, close: 4.3 },
    { date: 'W19', open: 4.3, high: 4.6, low: 4.1, close: 4.5 },
    { date: 'W20', open: 4.5, high: 4.7, low: 4.2, close: 4.3 },
    { date: 'W21', open: 4.3, high: 4.5, low: 4.0, close: 4.1 },
    { date: 'W22', open: 4.1, high: 4.3, low: 3.8, close: 3.9 },
    { date: 'W23', open: 3.9, high: 4.2, low: 3.7, close: 4.1 },
    { date: 'W24', open: 4.1, high: 4.5, low: 4.0, close: 4.4 },
    { date: 'W25', open: 4.4, high: 4.8, low: 4.3, close: 4.7 },
    { date: 'W26', open: 4.7, high: 5.1, low: 4.5, close: 5.0 },
    { date: 'W27', open: 5.0, high: 5.4, low: 4.8, close: 5.2 },
  ]
}
