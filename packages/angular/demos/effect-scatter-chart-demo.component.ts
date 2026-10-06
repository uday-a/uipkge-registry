import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { UiEffectScatterChartComponent } from '../../../../../packages/registry-angular/components/charts/effect-scatter-chart/effect-scatter-chart.component'

/** Angular demo for the effect-scatter-chart primitive page. Mirrors demos/react/effect-scatter-chart.tsx. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'angular-effect-scatter-chart-demo',
  standalone: true,
  imports: [UiEffectScatterChartComponent],
  template: `
    @switch (story) {
      @case ('Slow ripple') {
        <ui-effect-scatter-chart
          [data]="incidents"
          xField="x"
          yField="y"
          categoryField="c"
          [ripplePeriod]="8"
          [height]="300"
        />
      }
      @default {
        <ui-effect-scatter-chart [data]="incidents" xField="x" yField="y" categoryField="c" [height]="300" />
      }
    }
  `,
})
export class AngularEffectScatterChartDemoComponent {
  @Input() story = 'Alert ripple'

  readonly incidents = [
    { x: 10, y: 22, c: 'p1' },
    { x: 18, y: 30, c: 'p1' },
    { x: 26, y: 18, c: 'p2' },
    { x: 34, y: 42, c: 'p2' },
    { x: 42, y: 28, c: 'p3' },
    { x: 50, y: 36, c: 'p3' },
  ]
}
