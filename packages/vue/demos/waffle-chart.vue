<script setup lang="ts">
import { WaffleChart } from "@/components/ui/charts";

const share = [
  { name: "Organic", value: 46 },
  { name: "Paid", value: 28 },
  { name: "Referral", value: 16 },
  { name: "Other", value: 10 },
];
</script>

<template>
  <Story
    title="Traffic share"
    description="Each cell is 1%; legend carries the exact shares."
  >
    <WaffleChart :data="share" height="260" />
  </Story>

  <Story
    title="Survey result"
    description="No legend for pictogram-style tiles."
  >
    <WaffleChart
      :data="[
        { name: 'Yes', value: 72 },
        { name: 'No', value: 28 },
      ]"
      :show-legend="false"
      height="220"
    />
  </Story>
</template>
