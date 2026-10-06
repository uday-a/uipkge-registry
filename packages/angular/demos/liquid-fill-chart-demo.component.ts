import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { UiLiquidFillChartComponent } from '../../../../../packages/registry-angular/components/charts/liquid-fill-chart/liquid-fill-chart.component'

/** Angular demo for the liquid-fill-chart primitive page. Mirrors demos/react/liquid-fill-chart.tsx. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'angular-liquid-fill-chart-demo',
  standalone: true,
  imports: [UiLiquidFillChartComponent],
  template: `
    @switch (story) {
      @case ('Full') {
        <ui-liquid-fill-chart [value]="92" unit="%" [height]="220" />
      }
      @case ('No label') {
        <ui-liquid-fill-chart [value]="55" [showLabel]="false" [height]="180" />
      }
      @default {
        <ui-liquid-fill-chart [value]="68" unit="%" [height]="220" />
      }
    }
  `,
})
export class AngularLiquidFillChartDemoComponent {
  @Input() story = 'Quota used'
}
