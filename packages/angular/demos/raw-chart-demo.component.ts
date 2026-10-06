import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { UiRawChartComponent } from '../../../../../packages/registry-angular/components/charts/raw-chart/raw-chart.component'

// Vue `:option` mapped to Angular `[rawOption]` (same ECharts option objects 1:1).

// 1. SANKEY — flow between marketing channels and outcomes.
const sankeyOption = {
  tooltip: { trigger: 'item', triggerOn: 'mousemove' },
  series: [
    {
      type: 'sankey',
      data: [
        { name: 'Organic' },
        { name: 'Paid' },
        { name: 'Referral' },
        { name: 'Landing' },
        { name: 'Pricing' },
        { name: 'Blog' },
        { name: 'Sign-up' },
        { name: 'Bounce' },
      ],
      links: [
        { source: 'Organic', target: 'Landing', value: 480 },
        { source: 'Organic', target: 'Blog', value: 220 },
        { source: 'Paid', target: 'Landing', value: 360 },
        { source: 'Paid', target: 'Pricing', value: 140 },
        { source: 'Referral', target: 'Pricing', value: 180 },
        { source: 'Referral', target: 'Landing', value: 60 },
        { source: 'Landing', target: 'Sign-up', value: 420 },
        { source: 'Landing', target: 'Bounce', value: 480 },
        { source: 'Pricing', target: 'Sign-up', value: 240 },
        { source: 'Pricing', target: 'Bounce', value: 80 },
        { source: 'Blog', target: 'Sign-up', value: 90 },
        { source: 'Blog', target: 'Bounce', value: 130 },
      ],
      lineStyle: { color: 'gradient', curveness: 0.5 },
      label: { fontSize: 11 },
      emphasis: { focus: 'adjacency' },
      left: 10,
      right: 80,
      top: 10,
      bottom: 10,
    },
  ],
}

// 2. SUNBURST — hierarchical share breakdown.
const sunburstOption = {
  tooltip: { trigger: 'item' },
  series: [
    {
      type: 'sunburst',
      radius: ['12%', '90%'],
      data: [
        {
          name: 'Revenue',
          children: [
            {
              name: 'Subscription',
              value: 64,
              children: [
                { name: 'Pro', value: 38 },
                { name: 'Team', value: 18 },
                { name: 'Enterprise', value: 8 },
              ],
            },
            {
              name: 'Usage',
              value: 22,
              children: [
                { name: 'API', value: 14 },
                { name: 'Storage', value: 8 },
              ],
            },
            {
              name: 'Services',
              value: 14,
              children: [
                { name: 'Onboarding', value: 9 },
                { name: 'Training', value: 5 },
              ],
            },
          ],
        },
      ],
      label: { rotate: 'radial' },
      itemStyle: { borderColor: '#fff', borderWidth: 1 },
    },
  ],
}

// 3. CANDLESTICK — OHLC bars for price series.
const candleData: (string | number)[][] = [
  ['2026-03-01', 145, 148, 142, 150],
  ['2026-03-02', 148, 144, 142, 149],
  ['2026-03-03', 144, 151, 143, 152],
  ['2026-03-04', 151, 155, 150, 157],
  ['2026-03-05', 155, 153, 150, 156],
  ['2026-03-08', 153, 158, 152, 160],
  ['2026-03-09', 158, 162, 156, 163],
  ['2026-03-10', 162, 159, 156, 163],
  ['2026-03-11', 159, 164, 158, 166],
  ['2026-03-12', 164, 167, 162, 169],
]
const candleOption = {
  tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
  grid: { left: 40, right: 16, top: 16, bottom: 32 },
  xAxis: { type: 'category', data: candleData.map((c) => c[0]) },
  yAxis: { type: 'value', scale: true, splitLine: { lineStyle: { color: '#e5e5e5' } } },
  series: [
    {
      type: 'candlestick',
      data: candleData.map((c) => [c[1], c[2], c[3], c[4]]),
      itemStyle: {
        color: '#14b8a6',
        color0: '#f97316',
        borderColor: '#0f766e',
        borderColor0: '#9a3412',
      },
    },
  ],
}

// 4. NETWORK GRAPH — force-directed.
const graphOption = {
  tooltip: { trigger: 'item' },
  series: [
    {
      type: 'graph',
      layout: 'force',
      roam: false,
      symbolSize: 28,
      label: { show: true, fontSize: 10 },
      edgeSymbol: ['none', 'arrow'],
      edgeSymbolSize: [0, 6],
      force: { repulsion: 220, edgeLength: 80 },
      lineStyle: { color: '#94a3b8', curveness: 0.15 },
      data: [
        { name: 'API', itemStyle: { color: '#f59e0b' } },
        { name: 'Worker', itemStyle: { color: '#14b8a6' } },
        { name: 'DB', itemStyle: { color: '#3b82f6' } },
        { name: 'Cache', itemStyle: { color: '#a855f7' } },
        { name: 'Queue', itemStyle: { color: '#f97316' } },
        { name: 'CDN', itemStyle: { color: '#eab308' } },
      ],
      links: [
        { source: 'API', target: 'DB' },
        { source: 'API', target: 'Cache' },
        { source: 'API', target: 'Queue' },
        { source: 'Queue', target: 'Worker' },
        { source: 'Worker', target: 'DB' },
        { source: 'CDN', target: 'API' },
      ],
    },
  ],
}

// 5. BOXPLOT — distribution of response latencies per region.
const boxData = [
  [120, 145, 165, 180, 215],
  [115, 138, 152, 170, 220],
  [130, 152, 172, 200, 260],
  [110, 128, 142, 158, 195],
  [140, 168, 185, 210, 280],
]
const boxOption = {
  tooltip: { trigger: 'item' },
  grid: { left: 40, right: 16, top: 16, bottom: 32 },
  xAxis: { type: 'category', data: ['US-W', 'US-E', 'EU', 'APAC', 'SA'] },
  yAxis: { type: 'value', splitLine: { lineStyle: { color: '#e5e5e5' } } },
  series: [
    {
      type: 'boxplot',
      data: boxData,
      itemStyle: { color: '#fde68a', borderColor: '#f59e0b' },
    },
  ],
}

/** Angular demo for the raw-chart page. Mirrors demos/react/raw-chart.tsx 1:1. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'angular-raw-chart-demo',
  standalone: true,
  imports: [UiRawChartComponent],
  template: `
    @switch (story) {
      @case ('Sunburst — hierarchical share') {
        <ui-raw-chart [rawOption]="sunburstOption" [height]="380" />
      }
      @case ('Candlestick — OHLC price series') {
        <ui-raw-chart [rawOption]="candleOption" [height]="320" />
      }
      @case ('Network graph — force-directed') {
        <ui-raw-chart [rawOption]="graphOption" [height]="380" />
      }
      @case ('Boxplot — distribution') {
        <ui-raw-chart [rawOption]="boxOption" [height]="320" />
      }
      @default {
        <ui-raw-chart [rawOption]="sankeyOption" [height]="380" />
      }
    }
  `,
})
export class AngularRawChartDemoComponent {
  protected readonly sankeyOption = sankeyOption
  protected readonly sunburstOption = sunburstOption
  protected readonly candleOption = candleOption
  protected readonly graphOption = graphOption
  protected readonly boxOption = boxOption
  @Input() story = 'Sankey — flow diagram'
}
