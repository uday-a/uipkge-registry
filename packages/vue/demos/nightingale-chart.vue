<script setup lang="ts">
import { NightingaleChart } from "@/components/ui/charts";

const traffic = [
  { name: "Organic", value: 480 },
  { name: "Paid", value: 360 },
  { name: "Referral", value: 220 },
  { name: "Social", value: 150 },
  { name: "Email", value: 90 },
];
</script>

<template>
  <Story
    title="Channel rose"
    description="Radius encodes value; bigger slices reach further."
  >
    <NightingaleChart :data="traffic" height="340" />
  </Story>

  <Story title="Compact" description="Short frame for dashboard tiles.">
    <NightingaleChart :data="traffic.slice(0, 3)" height="280" />
  </Story>
</template>
