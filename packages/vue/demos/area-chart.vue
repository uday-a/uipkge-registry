<script setup lang="ts">
import { AreaChart } from "@/components/ui/charts";
const monthlyRevenue = [
  { month: "Jan", revenue: 4200 },
  { month: "Feb", revenue: 5100 },
  { month: "Mar", revenue: 4800 },
  { month: "Apr", revenue: 6200 },
  { month: "May", revenue: 5800 },
  { month: "Jun", revenue: 7100 },
  { month: "Jul", revenue: 7600 },
  { month: "Aug", revenue: 8200 },
];

const multiSeries = [
  { month: "Jan", desktop: 4200, mobile: 2400, tablet: 1100 },
  { month: "Feb", desktop: 5100, mobile: 3200, tablet: 1300 },
  { month: "Mar", desktop: 4800, mobile: 3800, tablet: 1500 },
  { month: "Apr", desktop: 6200, mobile: 4400, tablet: 1700 },
  { month: "May", desktop: 5800, mobile: 4800, tablet: 1900 },
  { month: "Jun", desktop: 7100, mobile: 5600, tablet: 2200 },
];

// Stacked stack option: stack key shared across series.
const stackedOption = {
  series: [
    { stack: "total", areaStyle: { opacity: 0.7 } },
    { stack: "total", areaStyle: { opacity: 0.7 } },
    { stack: "total", areaStyle: { opacity: 0.7 } },
  ],
};

// Gradient option: replace areaStyle with a vertical linear gradient.
const gradientOption = {
  series: [
    {
      areaStyle: {
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: "rgba(245, 158, 11, 0.6)" },
            { offset: 1, color: "rgba(245, 158, 11, 0)" },
          ],
        },
      },
    },
  ],
};

// Stepped option: replace smooth lines with right-stepped segments.
const steppedOption = {
  series: [
    { smooth: false, step: "end" as const, areaStyle: { opacity: 0.4 } },
  ],
};
</script>

<template>
  <Story
    title="Basic area"
    description="Single-series filled area chart with smooth interpolation."
  >
    <AreaChart
      :data="monthlyRevenue"
      x-field="month"
      y-field="revenue"
      height="280"
    />
  </Story>

  <Story
    title="Multi-series"
    description="Three series share the same x-axis. Legend appears automatically once you pass an array to y-field."
  >
    <AreaChart
      :data="multiSeries"
      x-field="month"
      :y-field="['desktop', 'mobile', 'tablet']"
      height="300"
    />
  </Story>

  <Story
    title="Stacked"
    description="Pass `stack` on each series via the option escape hatch to stack values cumulatively. Areas turn opaque so segments are readable."
  >
    <AreaChart
      :data="multiSeries"
      x-field="month"
      :y-field="['desktop', 'mobile', 'tablet']"
      :option="stackedOption"
      height="300"
    />
  </Story>

  <Story
    title="Gradient fill"
    description="Replace the default flat fill with a linear gradient that fades from chart-1 to transparent."
  >
    <AreaChart
      :data="monthlyRevenue"
      x-field="month"
      y-field="revenue"
      :option="gradientOption"
      height="280"
    />
  </Story>

  <Story
    title="Stepped"
    description="Right-stepped segments instead of smooth curves. Useful when the metric represents discrete state at each tick (price tier, plan slot)."
  >
    <AreaChart
      :data="monthlyRevenue"
      x-field="month"
      y-field="revenue"
      :option="steppedOption"
      height="280"
    />
  </Story>

  <Story
    title="Linear multi"
    description="Straight segments across all series via the curve prop."
  >
    <AreaChart
      :data="multiSeries"
      x-field="month"
      :y-field="['desktop', 'mobile', 'tablet']"
      curve="linear"
      height="300"
    />
  </Story>

  <Story
    title="Markers on"
    description="Dots on every point for sparse series where each value matters."
  >
    <AreaChart
      :data="monthlyRevenue"
      x-field="month"
      y-field="revenue"
      :markers="true"
      height="280"
    />
  </Story>

  <Story
    title="Stacked prop"
    description="Same cumulative stack as the override above, now as a one-word prop."
  >
    <AreaChart
      :data="multiSeries"
      x-field="month"
      :y-field="['desktop', 'mobile', 'tablet']"
      :stacked="true"
      height="300"
    />
  </Story>
</template>
