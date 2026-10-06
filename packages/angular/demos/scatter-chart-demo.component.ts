import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { UiScatterChartComponent } from '../../../../../packages/registry-angular/components/charts/scatter-chart/scatter-chart.component'

const basic = [
  { x: 10, y: 8 },
  { x: 15, y: 12 },
  { x: 20, y: 15 },
  { x: 25, y: 18 },
  { x: 30, y: 22 },
  { x: 35, y: 20 },
  { x: 40, y: 28 },
  { x: 45, y: 31 },
  { x: 50, y: 33 },
]
const bubble = [
  { x: 10, y: 8, size: 20 },
  { x: 15, y: 12, size: 30 },
  { x: 20, y: 15, size: 25 },
  { x: 25, y: 18, size: 35 },
  { x: 30, y: 22, size: 40 },
  { x: 35, y: 20, size: 28 },
  { x: 40, y: 28, size: 45 },
  { x: 45, y: 31, size: 22 },
  { x: 50, y: 33, size: 60 },
]
const categorical = [
  { x: 10, y: 8, category: 'A' },
  { x: 15, y: 12, category: 'A' },
  { x: 20, y: 15, category: 'A' },
  { x: 18, y: 22, category: 'B' },
  { x: 25, y: 28, category: 'B' },
  { x: 28, y: 24, category: 'B' },
  { x: 35, y: 14, category: 'C' },
  { x: 42, y: 18, category: 'C' },
  { x: 48, y: 12, category: 'C' },
]
const bubbleCategorical = [
  { x: 12, y: 8, size: 25, category: 'Early' },
  { x: 18, y: 15, size: 32, category: 'Early' },
  { x: 24, y: 12, size: 28, category: 'Early' },
  { x: 28, y: 22, size: 48, category: 'Growth' },
  { x: 32, y: 28, size: 60, category: 'Growth' },
  { x: 38, y: 25, size: 42, category: 'Growth' },
  { x: 44, y: 30, size: 70, category: 'Mature' },
  { x: 48, y: 26, size: 65, category: 'Mature' },
]
// Air cargo lanes: transit days vs $/kg, sized by weekly tonnes.
const lanes = [
  { lane: 'SIN–HKG', days: 1, rate: 2.4, tonnes: 380, region: 'Intra-Asia' },
  { lane: 'SIN–ICN', days: 2, rate: 2.9, tonnes: 190, region: 'Intra-Asia' },
  { lane: 'HKG–ANC', days: 2, rate: 3.4, tonnes: 290, region: 'Transpacific' },
  { lane: 'PVG–LAX', days: 3, rate: 4.6, tonnes: 520, region: 'Transpacific' },
  { lane: 'ICN–ORD', days: 4, rate: 4.2, tonnes: 410, region: 'Transpacific' },
  { lane: 'NRT–DFW', days: 4, rate: 4.8, tonnes: 350, region: 'Transpacific' },
  { lane: 'DXB–SIN', days: 3, rate: 3.1, tonnes: 280, region: 'Europe' },
  { lane: 'FRA–JFK', days: 5, rate: 3.6, tonnes: 360, region: 'Europe' },
]

/** Angular demo for the scatter-chart page. Mirrors demos/react/scatter-chart.tsx 1:1. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'angular-scatter-chart-demo',
  standalone: true,
  imports: [UiScatterChartComponent],
  template: `
    @switch (story) {
      @case ('Bubble (sized)') {
        <ui-scatter-chart [data]="bubble" xField="x" yField="y" sizeField="size" height="320" />
      }
      @case ('Categorical color') {
        <ui-scatter-chart [data]="categorical" xField="x" yField="y" categoryField="category" height="320" />
      }
      @case ('Bubble + categorical') {
        <ui-scatter-chart
          [data]="bubbleCategorical"
          xField="x"
          yField="y"
          sizeField="size"
          categoryField="category"
          height="340"
        />
      }
      @case ('With trend line') {
        <ui-scatter-chart [data]="basic" xField="x" yField="y" [option]="trendLineOption" height="320" />
      }
      @case ('Rate vs transit time') {
        <ui-scatter-chart
          [data]="lanes"
          xField="days"
          yField="rate"
          sizeField="tonnes"
          categoryField="region"
          height="340"
        />
      }
      @default {
        <ui-scatter-chart [data]="basic" xField="x" yField="y" height="320" />
      }
    }
  `,
})
export class AngularScatterChartDemoComponent {
  @Input() story = 'Basic scatter'
  protected readonly basic = basic
  protected readonly bubble = bubble
  protected readonly categorical = categorical
  protected readonly bubbleCategorical = bubbleCategorical
  protected readonly lanes = lanes
  protected readonly trendLineOption = {
    series: [
      {
        markLine: {
          silent: true,
          symbol: 'none',
          lineStyle: { type: 'dashed', color: '#94a3b8', width: 1.5 },
          label: { formatter: 'Trend', position: 'insideEndTop', color: '#64748b' },
          data: [[{ coord: [10, 8] }, { coord: [50, 33] }]],
        },
      },
    ],
  }
}
