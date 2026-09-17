<script setup lang="ts">
import { BeeswarmChart } from "@/components/ui/charts";

const scores = [
  { group: "Eng", value: 82 },
  { group: "Eng", value: 88 },
  { group: "Eng", value: 74 },
  { group: "Eng", value: 91 },
  { group: "Eng", value: 79 },
  { group: "Design", value: 76 },
  { group: "Design", value: 84 },
  { group: "Design", value: 69 },
  { group: "Design", value: 81 },
  { group: "Sales", value: 64 },
  { group: "Sales", value: 71 },
  { group: "Sales", value: 58 },
  { group: "Sales", value: 77 },
  { group: "Sales", value: 66 },
];
</script>

<template>
  <Story
    title="Scores by team"
    description="One dot per observation; jitter is deterministic so SSR matches."
  >
    <BeeswarmChart
      :data="scores"
      value-field="value"
      group-field="group"
      height="300"
    />
  </Story>

  <Story
    title="Latency sample"
    description="Single-group strip for raw distributions."
  >
    <BeeswarmChart
      :data="[
        { group: 'p99', value: 12 },
        { group: 'p99', value: 18 },
        { group: 'p99', value: 15 },
        { group: 'p99', value: 42 },
        { group: 'p99', value: 21 },
      ]"
      height="200"
    />
  </Story>
</template>
