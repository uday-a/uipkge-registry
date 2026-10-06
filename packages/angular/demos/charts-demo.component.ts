import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { UiAreaChartComponent } from '../../../../../packages/registry-angular/components/charts/area-chart/area-chart.component'
import { UiBarChartComponent } from '../../../../../packages/registry-angular/components/charts/bar-chart/bar-chart.component'
import { UiBulletChartComponent } from '../../../../../packages/registry-angular/components/charts/bullet-chart/bullet-chart.component'
import { UiCalendarHeatmapComponent } from '../../../../../packages/registry-angular/components/charts/calendar-heatmap/calendar-heatmap.component'
import { UiChordChartComponent } from '../../../../../packages/registry-angular/components/charts/chord-chart/chord-chart.component'
import { UiComboChartComponent } from '../../../../../packages/registry-angular/components/charts/combo-chart/combo-chart.component'
import { UiDumbbellChartComponent } from '../../../../../packages/registry-angular/components/charts/dumbbell-chart/dumbbell-chart.component'
import { UiEffectScatterChartComponent } from '../../../../../packages/registry-angular/components/charts/effect-scatter-chart/effect-scatter-chart.component'
import { UiFunnelChartComponent } from '../../../../../packages/registry-angular/components/charts/funnel-chart/funnel-chart.component'
import { UiGanttChartComponent } from '../../../../../packages/registry-angular/components/charts/gantt-chart/gantt-chart.component'
import { UiGaugeChartComponent } from '../../../../../packages/registry-angular/components/charts/gauge-chart/gauge-chart.component'
import { UiHeatmapComponent } from '../../../../../packages/registry-angular/components/charts/heatmap/heatmap.component'
import { UiHistogramChartComponent } from '../../../../../packages/registry-angular/components/charts/histogram-chart/histogram-chart.component'
import { UiLineChartComponent } from '../../../../../packages/registry-angular/components/charts/line-chart/line-chart.component'
import { UiLiquidFillChartComponent } from '../../../../../packages/registry-angular/components/charts/liquid-fill-chart/liquid-fill-chart.component'
import { UiParetoChartComponent } from '../../../../../packages/registry-angular/components/charts/pareto-chart/pareto-chart.component'
import { UiPictorialBarChartComponent } from '../../../../../packages/registry-angular/components/charts/pictorial-bar-chart/pictorial-bar-chart.component'
import { UiPieChartComponent } from '../../../../../packages/registry-angular/components/charts/pie-chart/pie-chart.component'
import { UiPolarBarChartComponent } from '../../../../../packages/registry-angular/components/charts/polar-bar-chart/polar-bar-chart.component'
import { UiProgressRingChartComponent } from '../../../../../packages/registry-angular/components/charts/progress-ring-chart/progress-ring-chart.component'
import { UiQuadrantChartComponent } from '../../../../../packages/registry-angular/components/charts/quadrant-chart/quadrant-chart.component'
import { UiRadarChartComponent } from '../../../../../packages/registry-angular/components/charts/radar-chart/radar-chart.component'
import { UiRawChartComponent } from '../../../../../packages/registry-angular/components/charts/raw-chart/raw-chart.component'
import { UiScatterChartComponent } from '../../../../../packages/registry-angular/components/charts/scatter-chart/scatter-chart.component'
import { UiSlopeChartComponent } from '../../../../../packages/registry-angular/components/charts/slope-chart/slope-chart.component'
import { UiSparklineComponent } from '../../../../../packages/registry-angular/components/charts/sparkline/sparkline.component'
import { UiStackedBarChartComponent } from '../../../../../packages/registry-angular/components/charts/stacked-bar-chart/stacked-bar-chart.component'
import { UiTreemapChartComponent } from '../../../../../packages/registry-angular/components/charts/treemap-chart/treemap-chart.component'
import { UiWaffleChartComponent } from '../../../../../packages/registry-angular/components/charts/waffle-chart/waffle-chart.component'
import { UiWaterfallChartComponent } from '../../../../../packages/registry-angular/components/charts/waterfall-chart/waterfall-chart.component'
import { UiWordCloudChartComponent } from '../../../../../packages/registry-angular/components/charts/word-cloud-chart/word-cloud-chart.component'

// Deterministic calendar data so SSR + client render identical strings.
function seeded(i: number): number {
  const x = Math.sin(i * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

/**
 * Angular composite gallery for the charts page. Mirrors
 * apps/astro-site/src/demos/vue/charts.vue section by section: the Default
 * story renders the full gallery, and each per-chart story renders one chart
 * in isolation. Vue -> Angular input mappings applied throughout (see inline
 * comments); no registry component was modified.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'angular-charts-demo',
  standalone: true,
  imports: [
    UiAreaChartComponent,
    UiBarChartComponent,
    UiBulletChartComponent,
    UiCalendarHeatmapComponent,
    UiChordChartComponent,
    UiComboChartComponent,
    UiDumbbellChartComponent,
    UiEffectScatterChartComponent,
    UiFunnelChartComponent,
    UiGanttChartComponent,
    UiGaugeChartComponent,
    UiHeatmapComponent,
    UiHistogramChartComponent,
    UiLineChartComponent,
    UiLiquidFillChartComponent,
    UiParetoChartComponent,
    UiPictorialBarChartComponent,
    UiPieChartComponent,
    UiPolarBarChartComponent,
    UiProgressRingChartComponent,
    UiQuadrantChartComponent,
    UiRadarChartComponent,
    UiRawChartComponent,
    UiScatterChartComponent,
    UiSlopeChartComponent,
    UiSparklineComponent,
    UiStackedBarChartComponent,
    UiTreemapChartComponent,
    UiWaffleChartComponent,
    UiWaterfallChartComponent,
    UiWordCloudChartComponent,
  ],
  template: `
    @switch (story) {
      @case ('Area chart') {
        <ui-area-chart [data]="monthlyData" xField="month" [yField]="['revenue', 'profit']" height="280" />
      }
      @case ('Bar chart') {
        <ui-bar-chart [data]="categoryData" xField="category" yField="value" height="280" />
      }
      @case ('Line chart') {
        <ui-line-chart [data]="monthlyData" xField="month" yField="revenue" height="280" />
      }
      @case ('Pie chart') {
        <ui-pie-chart [data]="pieData" [option]="donutOption" height="320" />
      }
      @case ('Radar chart') {
        <ui-radar-chart [indicators]="radarIndicators" [data]="radarData" height="320" />
      }
      @case ('Scatter chart') {
        <ui-scatter-chart [data]="scatterData" xField="x" yField="y" height="280" />
      }
      @case ('Heatmap') {
        <ui-heatmap [data]="heatmapPoints" [xLabels]="heatmapX" [yLabels]="heatmapY" height="300" />
      }
      @case ('Sparkline') {
        <ui-sparkline [data]="sparkData" height="48" />
      }
      @case ('Funnel chart') {
        <ui-funnel-chart [data]="funnelData" height="320" />
      }
      @case ('Gauge chart') {
        <ui-gauge-chart [value]="68" name="Quota used" height="280" />
      }
      @case ('Treemap chart') {
        <ui-treemap-chart [data]="treemapData" height="320" />
      }
      @case ('Calendar heatmap') {
        <ui-calendar-heatmap [data]="calendarData" [option]="calendarRangeOption" height="200" />
      }
      @case ('Waterfall') {
        <ui-waterfall-chart [data]="waterfallData" height="300" />
      }
      @case ('Combo bar + line') {
        <ui-combo-chart [data]="comboData" xField="m" barField="orders" lineField="conv" height="300" />
      }
      @case ('Polar bars') {
        <ui-polar-bar-chart [data]="polarData" height="300" />
      }
      @case ('Pictorial bars') {
        <ui-pictorial-bar-chart [data]="polarSource" height="280" />
      }
      @case ('Effect scatter') {
        <ui-effect-scatter-chart [data]="effectData" xField="x" yField="y" height="280" />
      }
      @case ('Bullets') {
        <ui-bullet-chart [data]="bulletData" height="220" />
      }
      @case ('Liquid fill') {
        <ui-liquid-fill-chart [value]="68" height="220" />
      }
      @case ('Word cloud') {
        <ui-word-cloud-chart [words]="wordItems" height="240" />
      }
      @case ('Histogram') {
        <ui-histogram-chart [data]="histogramData" height="280" />
      }
      @case ('Stacked bars') {
        <ui-stacked-bar-chart [data]="stackedData" xField="q" [yField]="['a', 'b', 'c']" height="300" />
      }
      @case ('Pareto') {
        <ui-pareto-chart [data]="paretoData" height="300" />
      }
      @case ('Dumbbell') {
        <ui-dumbbell-chart [data]="dumbbellData" [names]="dumbbellNames" height="260" />
      }
      @case ('Slope') {
        <ui-slope-chart [data]="slopeData" [points]="slopePoints" height="280" />
      }
      @case ('Gantt') {
        <ui-gantt-chart [tasks]="ganttTasks" height="220" />
      }
      @case ('Chord') {
        <ui-chord-chart [nodes]="chordNodes" [links]="chordLinks" height="320" />
      }
      @case ('Progress ring') {
        <ui-progress-ring-chart [rings]="progressRings" height="220" />
      }
      @case ('Waffle') {
        <ui-waffle-chart [items]="waffleItems" height="240" />
      }
      @case ('Quadrant') {
        <ui-quadrant-chart [data]="quadrantData" height="300" />
      }
      @case ('Raw chart — full ECharts API escape hatch') {
        <ui-raw-chart [rawOption]="sankeyOption" height="380" />
      }
      @default {
        <ui-area-chart [data]="monthlyData" xField="month" [yField]="['revenue', 'profit']" height="280" />
        <ui-bar-chart [data]="categoryData" xField="category" yField="value" height="280" />
        <ui-line-chart [data]="monthlyData" xField="month" yField="revenue" height="280" />
        <ui-pie-chart [data]="pieData" [option]="donutOption" height="320" />
        <ui-radar-chart [indicators]="radarIndicators" [data]="radarData" height="320" />
        <ui-scatter-chart [data]="scatterData" xField="x" yField="y" height="280" />
        <ui-heatmap [data]="heatmapPoints" [xLabels]="heatmapX" [yLabels]="heatmapY" height="300" />
        <ui-sparkline [data]="sparkData" height="48" />
        <ui-funnel-chart [data]="funnelData" height="320" />
        <ui-gauge-chart [value]="68" name="Quota used" height="280" />
        <ui-treemap-chart [data]="treemapData" height="320" />
        <ui-calendar-heatmap [data]="calendarData" [option]="calendarRangeOption" height="200" />
        <ui-waterfall-chart [data]="waterfallData" height="300" />
        <ui-combo-chart [data]="comboData" xField="m" barField="orders" lineField="conv" height="300" />
        <ui-polar-bar-chart [data]="polarData" height="300" />
        <ui-pictorial-bar-chart [data]="polarSource" height="280" />
        <ui-effect-scatter-chart [data]="effectData" xField="x" yField="y" height="280" />
        <ui-bullet-chart [data]="bulletData" height="220" />
        <ui-liquid-fill-chart [value]="68" height="220" />
        <ui-word-cloud-chart [words]="wordItems" height="240" />
        <ui-histogram-chart [data]="histogramData" height="280" />
        <ui-stacked-bar-chart [data]="stackedData" xField="q" [yField]="['a', 'b', 'c']" height="300" />
        <ui-pareto-chart [data]="paretoData" height="300" />
        <ui-dumbbell-chart [data]="dumbbellData" [names]="dumbbellNames" height="260" />
        <ui-slope-chart [data]="slopeData" [points]="slopePoints" height="280" />
        <ui-gantt-chart [tasks]="ganttTasks" height="220" />
        <ui-chord-chart [nodes]="chordNodes" [links]="chordLinks" height="320" />
        <ui-progress-ring-chart [rings]="progressRings" height="220" />
        <ui-waffle-chart [items]="waffleItems" height="240" />
        <ui-quadrant-chart [data]="quadrantData" height="300" />
        <ui-raw-chart [rawOption]="sankeyOption" height="380" />
      }
    }
  `,
})
export class AngularChartsDemoComponent {
  @Input() story = 'Default'

  readonly monthlyData = [
    { month: 'Jan', revenue: 4200, profit: 1200 },
    { month: 'Feb', revenue: 5100, profit: 1500 },
    { month: 'Mar', revenue: 4800, profit: 1300 },
    { month: 'Apr', revenue: 6200, profit: 2100 },
    { month: 'May', revenue: 5800, profit: 1800 },
    { month: 'Jun', revenue: 7100, profit: 2400 },
  ]

  readonly categoryData = [
    { category: 'Electronics', value: 350 },
    { category: 'Clothing', value: 280 },
    { category: 'Home', value: 210 },
    { category: 'Sports', value: 160 },
    { category: 'Books', value: 90 },
  ]

  readonly pieData = [
    { name: 'Desktop', value: 45 },
    { name: 'Mobile', value: 35 },
    { name: 'Tablet', value: 15 },
    { name: 'Other', value: 5 },
  ]

  // Angular has no `donut` boolean — hollow centers come from a series override.
  readonly donutOption = {
    series: [{ radius: ['45%', '70%'] }],
  }

  readonly radarIndicators = [
    { name: 'Speed', max: 100 },
    { name: 'Reliability', max: 100 },
    { name: 'Comfort', max: 100 },
    { name: 'Safety', max: 100 },
    { name: 'Efficiency', max: 100 },
  ]

  // Radar series, React/Vue shape { name, value: number[] }[].
  readonly radarData = [
    { name: 'Model A', value: [85, 90, 70, 95, 80] },
    { name: 'Model B', value: [70, 85, 90, 80, 75] },
  ]

  // Angular scatter has no categoryField input, so the grouping is dropped;
  // the extra keys are harmless on the generic record rows.
  readonly scatterData = [
    { x: 10, y: 8, size: 20, category: 'A' },
    { x: 15, y: 12, size: 30, category: 'A' },
    { x: 20, y: 15, size: 25, category: 'A' },
    { x: 25, y: 18, size: 35, category: 'B' },
    { x: 30, y: 22, size: 40, category: 'B' },
    { x: 35, y: 20, size: 28, category: 'B' },
    { x: 40, y: 28, size: 45, category: 'B' },
  ]

  // Vue `[x, y, value]` matrix mapped to Angular `{ x, y, value }[]` + categories.
  readonly heatmapX = ['Mon', 'Tue', 'Wed', 'Thu']
  readonly heatmapY = ['A', 'B', 'C']
  readonly heatmapPoints = [
    { x: 'Mon', y: 'A', value: 10 },
    { x: 'Tue', y: 'A', value: 20 },
    { x: 'Wed', y: 'A', value: 30 },
    { x: 'Thu', y: 'A', value: 40 },
    { x: 'Mon', y: 'B', value: 35 },
    { x: 'Tue', y: 'B', value: 25 },
    { x: 'Wed', y: 'B', value: 15 },
    { x: 'Thu', y: 'B', value: 45 },
    { x: 'Mon', y: 'C', value: 50 },
    { x: 'Tue', y: 'C', value: 30 },
    { x: 'Wed', y: 'C', value: 25 },
    { x: 'Thu', y: 'C', value: 40 },
  ]

  readonly sparkData = [12, 19, 15, 25, 22, 30, 28, 35, 32, 40]

  readonly funnelData = [
    { name: 'Visitors', value: 24850 },
    { name: 'Sign-ups', value: 14910 },
    { name: 'Activated', value: 5964 },
    { name: 'Paid', value: 1789 },
    { name: 'Retained 30d', value: 447 },
  ]

  readonly treemapData = [
    { name: 'Backend', value: 22 },
    { name: 'Frontend', value: 18 },
    { name: 'Inside sales', value: 14 },
    { name: 'Field sales', value: 12 },
    { name: 'Customer success', value: 10 },
    { name: 'Marketing', value: 8 },
    { name: 'Support', value: 8 },
    { name: 'Mobile', value: 8 },
    { name: 'Infra', value: 8 },
    { name: 'Sales ops', value: 6 },
  ]

  readonly calendarAnchor = new Date('2026-05-15T00:00:00Z')

  readonly calendarData: [string, number][] = Array.from({ length: 365 }, (_, i) => {
    const d = new Date(this.calendarAnchor)
    d.setUTCDate(this.calendarAnchor.getUTCDate() - i)
    const iso = d.toISOString().slice(0, 10)
    const dow = d.getUTCDay()
    return [iso, Math.max(0, Math.round((dow === 0 || dow === 6 ? 0 : 3) + (seeded(i) - 0.3) * 6))] as [
      string,
      number,
    ]
  })

  // Angular calendar-heatmap has no `range` input — the window comes from the option escape hatch.
  readonly calendarRangeOption: Record<string, unknown> = {
    calendar: {
      range: [
        new Date(this.calendarAnchor.getTime() - 364 * 86400_000).toISOString().slice(0, 10),
        this.calendarAnchor.toISOString().slice(0, 10),
      ],
    },
  }

  readonly waterfallData = [
    { label: 'Opening', value: 12000 },
    { label: 'Sales', value: 8400 },
    { label: 'Refunds', value: -1800 },
    { label: 'COGS', value: -5200 },
    { label: 'Opex', value: -3100 },
  ]

  readonly comboData = [
    { m: 'Jan', orders: 320, conv: 2.1 },
    { m: 'Feb', orders: 410, conv: 2.4 },
    { m: 'Mar', orders: 380, conv: 2.2 },
    { m: 'Apr', orders: 520, conv: 2.9 },
  ]

  // Vue `data: { category, value }[]` mapped to Angular `data: { label, value }[]`.
  readonly polarData = [
    { label: 'Organic', value: 42 },
    { label: 'Paid', value: 28 },
    { label: 'Referral', value: 18 },
    { label: 'Social', value: 24 },
  ]

  readonly polarSource = [
    { category: 'Organic', value: 42 },
    { category: 'Paid', value: 28 },
    { category: 'Referral', value: 18 },
    { category: 'Social', value: 24 },
  ]

  readonly effectData = [
    { x: 10, y: 22 },
    { x: 22, y: 30 },
    { x: 34, y: 26 },
    { x: 44, y: 36 },
  ]

  readonly bulletData: { label: string; actual: number; target: number; ranges: [number, number, number] }[] = [
    { label: 'Revenue', actual: 82, target: 90, ranges: [50, 75, 100] },
    { label: 'NPS', actual: 64, target: 70, ranges: [40, 60, 100] },
  ]

  // Vue `:data="{ name, value }[]"` mapped to Angular `[words]="{ text, value }[]"`.
  readonly wordItems = [
    { text: 'dashboards', value: 96 },
    { text: 'echarts', value: 82 },
    { text: 'tokens', value: 74 },
    { text: 'vue', value: 61 },
    { text: 'react', value: 58 },
    { text: 'a11y', value: 44 },
  ]

  readonly histogramData = [
    { bin: '0–10', count: 12 },
    { bin: '10–20', count: 28 },
    { bin: '20–30', count: 44 },
    { bin: '30–40', count: 22 },
  ]

  readonly stackedData = [
    { q: 'Q1', a: 24, b: 18, c: 12 },
    { q: 'Q2', a: 31, b: 22, c: 15 },
    { q: 'Q3', a: 38, b: 28, c: 17 },
  ]

  // Vue `data: { category, value }[]` mapped to Angular `data: { label, value }[]`.
  readonly paretoData = [
    { category: 'Typos', value: 142 },
    { category: 'Links', value: 98 },
    { category: 'Slow', value: 64 },
    { category: 'Auth', value: 31 },
  ]

  // Dumbbell deltas, React/Vue shape { label, a, b }[]; names label the two ends.
  readonly dumbbellData = [
    { label: 'Acme', a: 4.2, b: 2.1 },
    { label: 'Globex', a: 3.8, b: 3.1 },
    { label: 'Initech', a: 5.1, b: 2.8 },
  ]
  readonly dumbbellNames: [string, string] = ['Q1', 'Q2']

  // Two-point slope; points label the x-axis ends like React/Vue.
  readonly slopePoints = ['2024', '2025']
  readonly slopeData = [
    { label: 'Desktop', values: [52, 44] },
    { label: 'Mobile', values: [38, 47] },
  ]

  // Vue `tasks: { name, ... }[]` mapped to Angular `tasks: { label, ... }[]`.
  readonly ganttTasks = [
    { label: 'Design', start: '2026-09-01', end: '2026-09-18', progress: 1, group: 'Product' },
    { label: 'API', start: '2026-09-10', end: '2026-10-09', progress: 0.65, group: 'Eng' },
  ]

  readonly chordNodes = [{ name: 'API' }, { name: 'DB' }, { name: 'Cache' }]
  readonly chordLinks = [
    { source: 'API', target: 'DB', value: 42 },
    { source: 'API', target: 'Cache', value: 30 },
  ]

  readonly progressRings = [{ value: 68 }]

  // Vue `:data="{ name, value }[]"` + `:show-legend` mapped to Angular `[items]="{ label, value }[]"`
  // (no legend input on the Angular waffle).
  readonly waffleItems = [
    { label: 'A', value: 46 },
    { label: 'B', value: 28 },
    { label: 'C', value: 16 },
    { label: 'D', value: 10 },
  ]

  readonly quadrantData = [
    { x: 8.2, y: 7.4, label: 'Acme' },
    { x: 6.1, y: 8.8, label: 'Globex' },
    { x: 4.4, y: 5.2, label: 'Initech' },
    { x: 7.8, y: 4.1, label: 'Umbrella' },
  ]

  // Vue `:option` mapped to Angular `[rawOption]` (same ECharts option object).
  readonly sankeyOption = {
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
}
