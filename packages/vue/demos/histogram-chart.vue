<script setup lang="ts">
import { HistogramChart } from "@/components/ui/charts";

const ages = [
  22, 24, 25, 27, 29, 31, 31, 33, 34, 35, 36, 38, 41, 44, 47, 52, 58, 63,
];
const binned = [
  { bin: "0–10s", count: 42 },
  { bin: "100–200ms", count: 128 },
  { bin: "200–500ms", count: 86 },
  { bin: "500ms–1s", count: 24 },
  { bin: "1s+", count: 6 },
];
</script>

<template>
  <Story
    title="Auto-binned"
    description="Pass raw values plus a bin count; the peak bin highlights."
  >
    <HistogramChart :values="ages" :bins="8" height="300" />
  </Story>

  <Story
    title="Pre-binned"
    description="Pass { bin, count } rows when you aggregate server-side."
  >
    <HistogramChart :data="binned" height="300" />
  </Story>
</template>
