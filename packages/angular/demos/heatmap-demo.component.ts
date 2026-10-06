import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { UiHeatmapComponent } from '../../../../../packages/registry-angular/components/charts/heatmap/heatmap.component'

type Triple = [number, number, number]

const peaks: Record<string, number> = {
  '0,0': 12,
  '0,1': 24,
  '0,2': 38,
  '0,3': 9,
  '1,0': 18,
  '1,1': 36,
  '1,2': 52,
  '1,3': 14,
  '2,0': 22,
  '2,1': 42,
  '2,2': 64,
  '2,3': 18,
  '3,0': 24,
  '3,1': 38,
  '3,2': 58,
  '3,3': 22,
  '4,0': 14,
  '4,1': 22,
  '4,2': 30,
  '4,3': 8,
}

function buildUsage(): Triple[] {
  const out: Triple[] = []
  for (let x = 0; x < 5; x++) {
    for (let y = 0; y < 4; y++) {
      out.push([x, y, peaks[`${x},${y}`] ?? 0])
    }
  }
  return out
}

const loadRows = [
  [68, 74, 71, 66, 63, 70],
  [71, 76, 73, 68, 65, 72],
  [69, 78, 75, 70, 64, 74],
  [74, 82, 78, 72, 69, 77],
  [77, 85, 80, 74, 71, 79],
  [81, 88, 83, 77, 74, 82],
  [84, 91, 86, 80, 77, 85],
  [88, 94, 89, 83, 80, 87],
]

function buildLoad(): Triple[] {
  return loadRows.flatMap((row, w) => row.map((v, l): Triple => [w, l, v]))
}

/** Angular demo for the heatmap primitive page. Mirrors demos/react/heatmap.tsx. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'angular-heatmap-demo',
  standalone: true,
  imports: [UiHeatmapComponent],
  template: `
    @switch (story) {
      @case ('With gaps') {
        <ui-heatmap [data]="sparse" [xLabels]="xLabels" [yLabels]="yLabels" [height]="320" />
      }
      @case ('Teal palette') {
        <ui-heatmap
          [data]="usage"
          [xLabels]="xLabels"
          [yLabels]="yLabels"
          [option]="tealRampOption"
          [height]="320"
        />
      }
      @case ('Warm palette') {
        <ui-heatmap
          [data]="usage"
          [xLabels]="xLabels"
          [yLabels]="yLabels"
          [option]="orangeRampOption"
          [height]="320"
        />
      }
      @case ('Compact (no legend)') {
        <ui-heatmap
          [data]="usage"
          [xLabels]="xLabels"
          [yLabels]="yLabels"
          [option]="compactOption"
          [height]="160"
        />
      }
      @case ('Lane load factors') {
        <ui-heatmap
          [data]="load"
          [xLabels]="weekLabels"
          [yLabels]="laneLabels"
          [min]="60"
          [max]="100"
          [height]="300"
        />
      }
      @default {
        <ui-heatmap [data]="usage" [xLabels]="xLabels" [yLabels]="yLabels" [height]="320" />
      }
    }
  `,
})
export class AngularHeatmapDemoComponent {
  @Input() story = 'Basic heatmap'

  readonly xLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
  readonly yLabels = ['Morning', 'Afternoon', 'Evening', 'Night']

  readonly laneLabels = ['SIN–HKG', 'PVG–LAX', 'ICN–ORD', 'FRA–JFK', 'DXB–SIN', 'HKG–ANC']
  readonly weekLabels = ['W20', 'W21', 'W22', 'W23', 'W24', 'W25', 'W26', 'W27']

  readonly usage = buildUsage()

  readonly sparse: Triple[] = buildUsage().map(([x, y, v]): Triple => (v < 12 ? [x, y, 0] : [x, y, v]))

  readonly load = buildLoad()

  readonly tealRampOption = {
    visualMap: { inRange: { color: ['#ccfbf1', '#14b8a6', '#0f766e'] } },
  }

  readonly orangeRampOption = {
    visualMap: { inRange: { color: ['#ffedd5', '#fb923c', '#9a3412'] } },
  }

  readonly compactOption = {
    visualMap: { show: false },
  }
}
