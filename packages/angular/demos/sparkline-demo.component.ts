import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { UiSparklineComponent } from '../../../../../packages/registry-angular/components/charts/sparkline/sparkline.component'

const trendUp = [12, 19, 15, 25, 22, 30, 28, 35, 32, 40]
const trendDown = [42, 38, 41, 33, 36, 28, 30, 22, 19, 14]
const flat = [22, 24, 21, 23, 22, 25, 22, 24, 23, 22]
const winLoss = [1, 1, -1, 1, -1, -1, 1, 1, -1, 1, 1, -1, 1]

/** Angular demo for the sparkline page. Mirrors demos/react/sparkline.tsx 1:1. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'angular-sparkline-demo',
  standalone: true,
  imports: [UiSparklineComponent],
  template: `
    @switch (story) {
      @case ('Trend down (custom color)') {
        <div class="flex items-center gap-6 px-2">
          <div>
            <div class="text-muted-foreground font-mono text-xs">Churn</div>
            <div class="text-xl font-semibold">3.2%</div>
          </div>
          <div class="w-32">
            <ui-sparkline [data]="trendDown" color="#f97316" [height]="40" />
          </div>
        </div>
      }
      @case ('Flat trend') {
        <div class="flex items-center gap-6 px-2">
          <div>
            <div class="text-muted-foreground font-mono text-xs">Latency p50</div>
            <div class="text-xl font-semibold">22ms</div>
          </div>
          <div class="w-32">
            <ui-sparkline [data]="flat" color="#94a3b8" [height]="40" />
          </div>
        </div>
      }
      @case ('Bar sparkline') {
        <div class="flex items-center gap-6 px-2">
          <div>
            <div class="text-muted-foreground font-mono text-xs">Daily signups</div>
            <div class="text-xl font-semibold">128</div>
          </div>
          <div class="w-32">
            <ui-sparkline [data]="trendUp" [option]="barOption" [height]="44" />
          </div>
        </div>
      }
      @case ('Win / loss') {
        <div class="flex items-center gap-6 px-2">
          <div>
            <div class="text-muted-foreground font-mono text-xs">A/B win rate</div>
            <div class="text-xl font-semibold">8 / 13</div>
          </div>
          <div class="w-40">
            <ui-sparkline [data]="winLoss" [option]="winLossOption" [height]="36" />
          </div>
        </div>
      }
      @default {
        <div class="flex items-center gap-6 px-2">
          <div>
            <div class="text-muted-foreground font-mono text-xs">MRR</div>
            <div class="text-xl font-semibold">$8.4k</div>
          </div>
          <div class="w-32">
            <ui-sparkline [data]="trendUp" [height]="40" />
          </div>
        </div>
      }
    }
  `,
})
export class AngularSparklineDemoComponent {
  @Input() story = 'Trend up'
  protected readonly trendUp = trendUp
  protected readonly trendDown = trendDown
  protected readonly flat = flat
  protected readonly winLoss = winLoss
  // Bar-style sparkline via the option escape hatch.
  protected readonly barOption = {
    series: [
      {
        type: 'bar',
        barCategoryGap: '25%',
        itemStyle: { color: '#14b8a6', borderRadius: [2, 2, 0, 0] },
      },
    ],
  }
  // Win/loss: ±1 values rendered as up-bars (green) / down-bars (red).
  protected readonly winLossOption = {
    series: [
      {
        type: 'bar',
        barCategoryGap: '15%',
        data: winLoss,
        itemStyle: {
          color: (params: { value: number }) => (params.value >= 0 ? '#14b8a6' : '#f97316'),
          borderRadius: 1,
        },
      },
    ],
    yAxis: { type: 'value', show: false, min: -1.2, max: 1.2 },
  }
}
