<script setup lang="ts">
import { ChordChart } from "@/components/ui/charts";

const nodes = [
  { name: "API" },
  { name: "Worker" },
  { name: "DB" },
  { name: "Cache" },
  { name: "Queue" },
];
const links = [
  { source: "API", target: "DB", value: 42 },
  { source: "API", target: "Cache", value: 30 },
  { source: "API", target: "Queue", value: 24 },
  { source: "Queue", target: "Worker", value: 24 },
  { source: "Worker", target: "DB", value: 18 },
  { source: "Worker", target: "Cache", value: 8 },
];
</script>

<template>
  <Story
    title="Service traffic"
    description="Weighted ribbons; hover a node to isolate its flows."
  >
    <ChordChart :nodes="nodes" :links="links" height="380" />
  </Story>

  <Story
    title="Team handoffs"
    description="Same shape for people and process flows."
  >
    <ChordChart
      :nodes="[{ name: 'Design' }, { name: 'Eng' }, { name: 'QA' }]"
      :links="[
        { source: 'Design', target: 'Eng', value: 30 },
        { source: 'Eng', target: 'QA', value: 26 },
        { source: 'QA', target: 'Design', value: 8 },
      ]"
      height="340"
    />
  </Story>
</template>
