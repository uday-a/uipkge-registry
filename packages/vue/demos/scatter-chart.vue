<script setup lang="ts">
import { ScatterChart } from "@/components/ui/charts";
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
];

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
];

const categorical = [
  { x: 10, y: 8, category: "A" },
  { x: 15, y: 12, category: "A" },
  { x: 20, y: 15, category: "A" },
  { x: 18, y: 22, category: "B" },
  { x: 25, y: 28, category: "B" },
  { x: 28, y: 24, category: "B" },
  { x: 35, y: 14, category: "C" },
  { x: 42, y: 18, category: "C" },
  { x: 48, y: 12, category: "C" },
];

const bubbleCategorical = [
  { x: 12, y: 8, size: 25, category: "Early" },
  { x: 18, y: 15, size: 32, category: "Early" },
  { x: 24, y: 12, size: 28, category: "Early" },
  { x: 28, y: 22, size: 48, category: "Growth" },
  { x: 32, y: 28, size: 60, category: "Growth" },
  { x: 38, y: 25, size: 42, category: "Growth" },
  { x: 44, y: 30, size: 70, category: "Mature" },
  { x: 48, y: 26, size: 65, category: "Mature" },
];

// markLine renders a regression / reference line through the cloud.
// Air cargo lanes: transit days vs $/kg, sized by weekly tonnes.
const lanes = [
  { lane: "SIN–HKG", days: 1, rate: 2.4, tonnes: 380, region: "Intra-Asia" },
  { lane: "SIN–ICN", days: 2, rate: 2.9, tonnes: 190, region: "Intra-Asia" },
  { lane: "HKG–ANC", days: 2, rate: 3.4, tonnes: 290, region: "Transpacific" },
  { lane: "PVG–LAX", days: 3, rate: 4.6, tonnes: 520, region: "Transpacific" },
  { lane: "ICN–ORD", days: 4, rate: 4.2, tonnes: 410, region: "Transpacific" },
  { lane: "NRT–DFW", days: 4, rate: 4.8, tonnes: 350, region: "Transpacific" },
  { lane: "DXB–SIN", days: 3, rate: 3.1, tonnes: 280, region: "Europe" },
  { lane: "FRA–JFK", days: 5, rate: 3.6, tonnes: 360, region: "Europe" },
];

const trendLineOption = {
  series: [
    {
      markLine: {
        silent: true,
        symbol: "none" as const,
        lineStyle: { type: "dashed" as const, color: "#94a3b8", width: 1.5 },
        label: {
          formatter: "Trend",
          position: "insideEndTop" as const,
          color: "#64748b",
        },
        // Approximate linear fit of the basic dataset above.
        data: [[{ coord: [10, 8] }, { coord: [50, 33] }]] as any,
      },
    },
  ],
};
</script>

<template>
  <Story
    title="Basic scatter"
    description="Plain XY scatter — pass `x-field` and `y-field` and that's it."
  >
    <ScatterChart :data="basic" x-field="x" y-field="y" height="320" />
  </Story>

  <Story
    title="Bubble (sized)"
    description="Pass `size-field` to scale each point by a third dimension. Sqrt-scaled internally to keep areas proportional, not radii."
  >
    <ScatterChart
      :data="bubble"
      x-field="x"
      y-field="y"
      size-field="size"
      height="320"
    />
  </Story>

  <Story
    title="Categorical color"
    description="Pass `category-field` to split the data into one series per category. Each series gets its own chart-N colour and a shared legend."
  >
    <ScatterChart
      :data="categorical"
      x-field="x"
      y-field="y"
      category-field="category"
      height="320"
    />
  </Story>

  <Story
    title="Bubble + categorical"
    description="Combine all three: x, y, size, and category. Common for lifecycle / cohort charts."
  >
    <ScatterChart
      :data="bubbleCategorical"
      x-field="x"
      y-field="y"
      size-field="size"
      category-field="category"
      height="340"
    />
  </Story>

  <Story
    title="With trend line"
    description="Layer a markLine from start to end coordinates to anchor the reader to a regression or threshold. Pure option-prop override — no data restructuring."
  >
    <ScatterChart
      :data="basic"
      x-field="x"
      y-field="y"
      :option="trendLineOption"
      height="320"
    />
  </Story>

  <Story
    title="Rate vs transit time"
    description="Air cargo lanes: days in transit against $/kg, bubble size is weekly tonnes, colour is region."
  >
    <ScatterChart
      :data="lanes"
      x-field="days"
      y-field="rate"
      size-field="tonnes"
      category-field="region"
      height="340"
    />
  </Story>
</template>
