import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { UiGaugeChartComponent } from '../../../../../packages/registry-angular/components/charts/gauge-chart/gauge-chart.component'

/** Angular demo for the gauge-chart primitive page. Mirrors demos/react/gauge-chart.tsx. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'angular-gauge-chart-demo',
  standalone: true,
  imports: [UiGaugeChartComponent],
  template: `
    @switch (story) {
      @case ('Custom thresholds') {
        <div class="mx-auto max-w-[420px]">
          <ui-gauge-chart [value]="72" [max]="100" name="Distance" [height]="280" />
        </div>
      }
      @case ('Progress ring') {
        <div class="mx-auto max-w-[420px]">
          <ui-gauge-chart [value]="42" [option]="progressRingOption" [height]="260" />
        </div>
      }
      @case ('Multi-needle') {
        <div class="mx-auto max-w-[420px]">
          <ui-gauge-chart [value]="68" [option]="multiNeedleOption" [height]="280" />
        </div>
      }
      @case ('Compact KPI tile') {
        <div class="mx-auto grid max-w-2xl grid-cols-3 gap-3">
          <div><ui-gauge-chart [value]="94" name="Uptime" [height]="180" /></div>
          <div><ui-gauge-chart [value]="62" name="CPU" [height]="180" /></div>
          <div><ui-gauge-chart [value]="38" name="Memory" [height]="180" /></div>
        </div>
      }
      @default {
        <div class="mx-auto max-w-[420px]">
          <ui-gauge-chart [value]="68" name="Quota used" [height]="280" />
        </div>
      }
    }
  `,
})
export class AngularGaugeChartDemoComponent {
  @Input() story = 'Stoplight gauge'

  readonly progressRingOption = {
    series: [
      {
        type: 'gauge',
        data: [{ value: 42, name: 'Onboarding' }],
        progress: { show: true, width: 18, itemStyle: { color: '#f59e0b' } },
        axisLine: { lineStyle: { width: 18, color: [[1, '#f1f5f9']] as [number, string][] } },
        pointer: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        anchor: { show: false },
      },
    ],
  }

  readonly multiNeedleOption = {
    series: [
      {
        type: 'gauge',
        data: [
          { value: 68, name: 'Current' },
          { value: 85, name: 'Target' },
        ],
        pointer: { show: true, length: '55%', width: 4 },
      },
    ],
  }
}
