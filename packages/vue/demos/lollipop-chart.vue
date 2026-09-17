<script setup lang="ts">
import { LollipopChart } from "@/components/ui/charts";

const votes = [
  { category: "Alpha", value: 84 },
  { category: "Beta", value: 62 },
  { category: "Gamma", value: 91 },
  { category: "Delta", value: 45 },
  { category: "Epsilon", value: 73 },
];
</script>

<template>
  <Story
    title="Feature votes"
    description="Thin stems with dot endpoints; lighter than bars for ranked lists."
  >
    <LollipopChart :data="votes" height="300" />
  </Story>

  <Story title="Compact" description="Short frame for sidebars and tiles.">
    <LollipopChart :data="votes.slice(0, 3)" height="220" />
  </Story>
</template>
