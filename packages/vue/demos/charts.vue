<script setup lang="ts">
import {
  AreaChart,
  BarChart,
  BulletChart,
  CalendarHeatmap,
  ChordChart,
  ComboChart,
  DumbbellChart,
  EffectScatterChart,
  FunnelChart,
  GanttChart,
  GaugeChart,
  Heatmap,
  HistogramChart,
  LineChart,
  LiquidFillChart,
  ParetoChart,
  PictorialBarChart,
  PieChart,
  PolarBarChart,
  ProgressRingChart,
  QuadrantChart,
  RadarChart,
  RawChart,
  ScatterChart,
  SlopeChart,
  Sparkline,
  StackedBarChart,
  TreemapChart,
  WaffleChart,
  WaterfallChart,
  WordCloudChart,
} from "@/components/ui/charts";
// `use()`-register the chart types and components needed by the
// RawChart sankey demo below. Consumer code does the same when
// reaching for RawChart in their own app -- the opinionated wrappers
// (AreaChart, etc.) each register their own dependencies so you only
// pay for what you use.
import { use } from "echarts/core";
import { SankeyChart } from "echarts/charts";
import {
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from "echarts/components";
use([SankeyChart, TooltipComponent, LegendComponent, GridComponent]);

const monthlyData = [
  { month: "Jan", revenue: 4200, profit: 1200 },
  { month: "Feb", revenue: 5100, profit: 1500 },
  { month: "Mar", revenue: 4800, profit: 1300 },
  { month: "Apr", revenue: 6200, profit: 2100 },
  { month: "May", revenue: 5800, profit: 1800 },
  { month: "Jun", revenue: 7100, profit: 2400 },
];

const categoryData = [
  { category: "Electronics", value: 350 },
  { category: "Clothing", value: 280 },
  { category: "Home", value: 210 },
  { category: "Sports", value: 160 },
  { category: "Books", value: 90 },
];

const pieData = [
  { name: "Desktop", value: 45 },
  { name: "Mobile", value: 35 },
  { name: "Tablet", value: 15 },
  { name: "Other", value: 5 },
];

const radarIndicators = [
  { name: "Speed", max: 100 },
  { name: "Reliability", max: 100 },
  { name: "Comfort", max: 100 },
  { name: "Safety", max: 100 },
  { name: "Efficiency", max: 100 },
];

const radarData = [
  { name: "Model A", value: [85, 90, 70, 95, 80] },
  { name: "Model B", value: [70, 85, 90, 80, 75] },
];

const scatterData = [
  { x: 10, y: 8, size: 20, category: "A" },
  { x: 15, y: 12, size: 30, category: "A" },
  { x: 20, y: 15, size: 25, category: "A" },
  { x: 25, y: 18, size: 35, category: "B" },
  { x: 30, y: 22, size: 40, category: "B" },
  { x: 35, y: 20, size: 28, category: "B" },
  { x: 40, y: 28, size: 45, category: "B" },
];

const heatmapData = [
  [0, 0, 10],
  [0, 1, 20],
  [0, 2, 30],
  [1, 0, 40],
  [1, 1, 35],
  [1, 2, 25],
  [2, 0, 15],
  [2, 1, 45],
  [2, 2, 50],
  [3, 0, 30],
  [3, 1, 25],
  [3, 2, 40],
];

const sparkData = [12, 19, 15, 25, 22, 30, 28, 35, 32, 40];

const funnelData = [
  { name: "Visitors", value: 24850 },
  { name: "Sign-ups", value: 14910 },
  { name: "Activated", value: 5964 },
  { name: "Paid", value: 1789 },
  { name: "Retained 30d", value: 447 },
];

const treemapData = [
  { name: "Backend", value: 22 },
  { name: "Frontend", value: 18 },
  { name: "Inside sales", value: 14 },
  { name: "Field sales", value: 12 },
  { name: "Customer success", value: 10 },
  { name: "Marketing", value: 8 },
  { name: "Support", value: 8 },
  { name: "Mobile", value: 8 },
  { name: "Infra", value: 8 },
  { name: "Sales ops", value: 6 },
];

const waterfallData = [
  { label: "Opening", value: 12000 },
  { label: "Sales", value: 8400 },
  { label: "Refunds", value: -1800 },
  { label: "COGS", value: -5200 },
  { label: "Opex", value: -3100 },
];

const comboData = [
  { m: "Jan", orders: 320, conv: 2.1 },
  { m: "Feb", orders: 410, conv: 2.4 },
  { m: "Mar", orders: 380, conv: 2.2 },
  { m: "Apr", orders: 520, conv: 2.9 },
];

const polarData = [
  { category: "Organic", value: 42 },
  { category: "Paid", value: 28 },
  { category: "Referral", value: 18 },
  { category: "Social", value: 24 },
];

const effectData = [
  { x: 10, y: 22 },
  { x: 22, y: 30 },
  { x: 34, y: 26 },
  { x: 44, y: 36 },
];

const bulletData = [
  {
    label: "Revenue",
    actual: 82,
    target: 90,
    ranges: [50, 75, 100] as [number, number, number],
  },
  {
    label: "NPS",
    actual: 64,
    target: 70,
    ranges: [40, 60, 100] as [number, number, number],
  },
];

const wordData = [
  { name: "dashboards", value: 96 },
  { name: "echarts", value: 82 },
  { name: "tokens", value: 74 },
  { name: "vue", value: 61 },
  { name: "react", value: 58 },
  { name: "a11y", value: 44 },
];

// Deterministic calendar data so SSR + client render identical strings
// (avoids hydration warnings on the preview).
function seeded(i: number) {
  const x = Math.sin(i * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}
const calendarAnchor = new Date("2026-05-15T00:00:00Z");
const calendarData: [string, number][] = Array.from({ length: 365 }, (_, i) => {
  const d = new Date(calendarAnchor);
  d.setUTCDate(calendarAnchor.getUTCDate() - i);
  const iso = d.toISOString().slice(0, 10);
  const dow = d.getUTCDay();
  return [
    iso,
    Math.max(
      0,
      Math.round((dow === 0 || dow === 6 ? 0 : 3) + (seeded(i) - 0.3) * 6),
    ),
  ];
});
const calendarRange: [string, string] = [
  new Date(calendarAnchor.getTime() - 364 * 86400_000)
    .toISOString()
    .slice(0, 10),
  calendarAnchor.toISOString().slice(0, 10),
];

// RawChart example: sankey diagram of marketing channel -> page -> outcome.
// You build the full ECharts option object yourself; RawChart hands it
// straight to vue-echarts. Same pattern works for sunburst, graph,
// candlestick, custom, themeRiver, parallel, tree -- any chart type
// ECharts supports.
const sankeyOption = {
  tooltip: { trigger: "item", triggerOn: "mousemove" },
  series: [
    {
      type: "sankey",
      data: [
        { name: "Organic" },
        { name: "Paid" },
        { name: "Referral" },
        { name: "Landing" },
        { name: "Pricing" },
        { name: "Blog" },
        { name: "Sign-up" },
        { name: "Bounce" },
      ],
      links: [
        { source: "Organic", target: "Landing", value: 480 },
        { source: "Organic", target: "Blog", value: 220 },
        { source: "Paid", target: "Landing", value: 360 },
        { source: "Paid", target: "Pricing", value: 140 },
        { source: "Referral", target: "Pricing", value: 180 },
        { source: "Referral", target: "Landing", value: 60 },
        { source: "Landing", target: "Sign-up", value: 420 },
        { source: "Landing", target: "Bounce", value: 480 },
        { source: "Pricing", target: "Sign-up", value: 240 },
        { source: "Pricing", target: "Bounce", value: 80 },
        { source: "Blog", target: "Sign-up", value: 90 },
        { source: "Blog", target: "Bounce", value: 130 },
      ],
      lineStyle: { color: "gradient", curveness: 0.5 },
      label: { fontSize: 11 },
      emphasis: { focus: "adjacency" },
      left: 10,
      right: 80,
      top: 10,
      bottom: 10,
    },
  ],
};
</script>

<template>
  <Story
    title="Area chart"
    description="Smooth area chart with multiple series."
  >
    <AreaChart
      :data="monthlyData"
      x-field="month"
      :y-field="['revenue', 'profit']"
      height="280"
    />
  </Story>

  <Story title="Bar chart" description="Vertical bars with rounded tops.">
    <BarChart
      :data="categoryData"
      x-field="category"
      y-field="value"
      height="280"
    />
  </Story>

  <Story title="Line chart" description="Line chart with data point markers.">
    <LineChart
      :data="monthlyData"
      x-field="month"
      y-field="revenue"
      height="280"
    />
  </Story>

  <Story
    title="Pie chart"
    description="Donut chart showing percentage breakdown."
  >
    <PieChart
      :data="pieData"
      name-field="name"
      value-field="value"
      :donut="true"
      height="320"
    />
  </Story>

  <Story
    title="Radar chart"
    description="Multi-metric comparison on a radar grid."
  >
    <RadarChart :indicators="radarIndicators" :data="radarData" height="320" />
  </Story>

  <Story title="Scatter chart" description="XY scatter with category grouping.">
    <ScatterChart
      :data="scatterData"
      x-field="x"
      y-field="y"
      category-field="category"
      height="280"
    />
  </Story>

  <Story
    title="Heatmap"
    description="Color-coded matrix with visual map legend."
  >
    <Heatmap
      :data="heatmapData"
      :x-labels="['Mon', 'Tue', 'Wed', 'Thu']"
      :y-labels="['A', 'B', 'C']"
      height="300"
    />
  </Story>

  <Story
    title="Sparkline"
    description="Mini trend line without axes, perfect for dashboards."
  >
    <Sparkline :data="sparkData" height="48" />
  </Story>

  <Story
    title="Funnel chart"
    description="Stage-by-stage conversion with auto-shaded segments. Each entry is { name, value }."
  >
    <FunnelChart :data="funnelData" height="320" />
  </Story>

  <Story
    title="Gauge chart"
    description="KPI gauge with green/amber/red threshold ramp. Single value + min/max + unit + optional label."
  >
    <GaugeChart :value="68" unit="%" label="Quota used" height="280" />
  </Story>

  <Story
    title="Treemap chart"
    description="Hierarchical proportions. Flat array of { name, value }; pass a nested shape with `children` to get sub-trees."
  >
    <TreemapChart :data="treemapData" height="320" />
  </Story>

  <Story
    title="Calendar heatmap"
    description="GitHub-style yearly contribution grid. Pass [date, value] tuples and a [from, to] range."
  >
    <CalendarHeatmap :data="calendarData" :range="calendarRange" height="200" />
  </Story>

  <Story
    title="Waterfall"
    description="Cashflow walk with signed deltas and a computed Total."
  >
    <WaterfallChart :data="waterfallData" height="300" />
  </Story>

  <Story
    title="Combo bar + line"
    description="Bars on the left axis, smooth line on the right."
  >
    <ComboChart
      :data="comboData"
      x-field="m"
      bar-field="orders"
      line-field="conv"
      height="300"
    />
  </Story>

  <Story
    title="Polar bars"
    description="Radial bars on the polar coordinate system."
  >
    <PolarBarChart :data="polarData" height="300" />
  </Story>

  <Story
    title="Pictorial bars"
    description="Repeated symbols fill to the value."
  >
    <PictorialBarChart :data="polarData" height="280" />
  </Story>

  <Story
    title="Effect scatter"
    description="Ripple animation for live points and alerts."
  >
    <EffectScatterChart :data="effectData" height="280" />
  </Story>

  <Story title="Bullets" description="KPI vs target with qualitative bands.">
    <BulletChart :data="bulletData" height="220" />
  </Story>

  <Story
    title="Liquid fill"
    description="Dependency-free SVG gauge with animated waves."
  >
    <LiquidFillChart :value="68" height="220" />
  </Story>

  <Story
    title="Word cloud"
    description="Frequency-sized words, no extra dependencies."
  >
    <WordCloudChart :data="wordData" height="240" />
  </Story>

  <Story
    title="Histogram"
    description="Distribution shape with an auto-highlighted peak."
  >
    <HistogramChart
      :data="[
        { bin: '0–10', count: 12 },
        { bin: '10–20', count: 28 },
        { bin: '20–30', count: 44 },
        { bin: '30–40', count: 22 },
      ]"
      height="280"
    />
  </Story>

  <Story
    title="Stacked bars"
    description="Part-to-whole per column with a shared legend."
  >
    <StackedBarChart
      :data="[
        { q: 'Q1', a: 24, b: 18, c: 12 },
        { q: 'Q2', a: 31, b: 22, c: 15 },
        { q: 'Q3', a: 38, b: 28, c: 17 },
      ]"
      x-field="q"
      :y-fields="['a', 'b', 'c']"
      height="300"
    />
  </Story>

  <Story title="Pareto" description="Sorted bars plus the cumulative % line.">
    <ParetoChart
      :data="[
        { category: 'Typos', value: 142 },
        { category: 'Links', value: 98 },
        { category: 'Slow', value: 64 },
        { category: 'Auth', value: 31 },
      ]"
      height="300"
    />
  </Story>

  <Story title="Dumbbell" description="Before/after change per category.">
    <DumbbellChart
      :data="[
        { label: 'Acme', a: 4.2, b: 2.1 },
        { label: 'Globex', a: 3.8, b: 3.1 },
        { label: 'Initech', a: 5.1, b: 2.8 },
      ]"
      :names="['Q1', 'Q2']"
      height="260"
    />
  </Story>

  <Story title="Slope" description="Two-point rank shifts with end labels.">
    <SlopeChart
      :data="[
        { label: 'Desktop', values: [52, 44] },
        { label: 'Mobile', values: [38, 47] },
      ]"
      :points="['2024', '2025']"
      height="280"
    />
  </Story>

  <Story title="Gantt" description="Date ranges with progress shading.">
    <GanttChart
      :tasks="[
        {
          name: 'Design',
          start: '2026-09-01',
          end: '2026-09-18',
          progress: 1,
          group: 'Product',
        },
        {
          name: 'API',
          start: '2026-09-10',
          end: '2026-10-09',
          progress: 0.65,
          group: 'Eng',
        },
      ]"
      height="220"
    />
  </Story>

  <Story title="Chord" description="Weighted flows around a circle.">
    <ChordChart
      :nodes="[{ name: 'API' }, { name: 'DB' }, { name: 'Cache' }]"
      :links="[
        { source: 'API', target: 'DB', value: 42 },
        { source: 'API', target: 'Cache', value: 30 },
      ]"
      height="320"
    />
  </Story>

  <Story title="Progress ring" description="Dependency-free SVG gauge.">
    <ProgressRingChart :rings="[{ value: 68 }]" height="220" />
  </Story>

  <Story title="Waffle" description="Each cell is 1% of the whole.">
    <WaffleChart
      :data="[
        { name: 'A', value: 46 },
        { name: 'B', value: 28 },
        { name: 'C', value: 16 },
        { name: 'D', value: 10 },
      ]"
      :show-legend="false"
      height="240"
    />
  </Story>

  <Story title="Quadrant" description="Median-split 2×2 strategy matrix.">
    <QuadrantChart
      :data="[
        { x: 8.2, y: 7.4, label: 'Acme' },
        { x: 6.1, y: 8.8, label: 'Globex' },
        { x: 4.4, y: 5.2, label: 'Initech' },
        { x: 7.8, y: 4.1, label: 'Umbrella' },
      ]"
      height="300"
    />
  </Story>

  <Story
    title="Raw chart — full ECharts API escape hatch"
    description="Pass any ECharts option object and render anything ECharts supports (sankey, sunburst, graph, candlestick, themeRiver, custom, …). You use()-register the chart type yourself. Theme tokens are exported from useChartTheme for visual consistency."
  >
    <RawChart :option="sankeyOption" height="380" />
  </Story>
</template>
