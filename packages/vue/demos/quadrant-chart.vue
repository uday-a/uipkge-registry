<script setup lang="ts">
import { QuadrantChart } from "@/components/ui/charts";

const vendors = [
  { x: 8.2, y: 7.4, label: "Acme" },
  { x: 6.1, y: 8.8, label: "Globex" },
  { x: 4.4, y: 5.2, label: "Initech" },
  { x: 7.8, y: 4.1, label: "Umbrella" },
  { x: 3.2, y: 8.1, label: "Hooli" },
  { x: 5.5, y: 6.0, label: "Stark" },
];
</script>

<template>
  <Story
    title="Vendor matrix"
    description="Median splits with labelled strategy quadrants."
  >
    <QuadrantChart
      :data="vendors"
      x-name="Completeness"
      y-name="Satisfaction"
      height="340"
    />
  </Story>

  <Story
    title="Fixed splits"
    description="Pin the crosshairs to contractual thresholds."
  >
    <QuadrantChart :data="vendors" :x-mid="6" :y-mid="6" height="340" />
  </Story>
</template>
