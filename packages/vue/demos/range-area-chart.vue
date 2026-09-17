<script setup lang="ts">
import { RangeAreaChart } from "@/components/ui/charts";

const temps = [
  { d: "Mon", min: 12, avg: 17, max: 22 },
  { d: "Tue", min: 13, avg: 18, max: 24 },
  { d: "Wed", min: 11, avg: 16, max: 21 },
  { d: "Thu", min: 14, avg: 19, max: 25 },
  { d: "Fri", min: 15, avg: 21, max: 27 },
  { d: "Sat", min: 16, avg: 22, max: 28 },
];
</script>

<template>
  <Story
    title="Forecast band"
    description="Min/max envelope with the average trend on top."
  >
    <RangeAreaChart :data="temps" x-field="d" height="320" />
  </Story>

  <Story
    title="Custom fields"
    description="Point the band at any record shape."
  >
    <RangeAreaChart
      :data="[
        { w: 'W1', lo: 40, mid: 55, hi: 70 },
        { w: 'W2', lo: 44, mid: 60, hi: 76 },
        { w: 'W3', lo: 38, mid: 52, hi: 68 },
      ]"
      x-field="w"
      min-field="lo"
      max-field="hi"
      avg-field="mid"
      height="300"
    />
  </Story>
</template>
