<script setup lang="ts">
import { RangeBarChart } from "@/components/ui/charts";

// Contracted rate bands ($/kg) by lane.
const bands = [
  { label: "PVG–LAX", low: 3.8, high: 6.2 },
  { label: "ICN–ORD", low: 3.4, high: 5.1 },
  { label: "NRT–DFW", low: 3.9, high: 5.6 },
  { label: "FRA–JFK", low: 2.9, high: 4.4 },
  { label: "SIN–HKG", low: 1.8, high: 3.0 },
];
</script>

<template>
  <Story
    title="Rate bands"
    description="Floating min–max columns — the negotiable corridor per lane."
  >
    <RangeBarChart :data="bands" height="320" />
  </Story>

  <Story
    title="Horizontal bands"
    description="Same corridors laid flat for long lane names."
  >
    <RangeBarChart
      :data="bands.slice(0, 3)"
      orientation="horizontal"
      height="240"
    />
  </Story>
</template>
