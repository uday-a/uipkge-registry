<script setup lang="ts">
import { LiquidFillChart } from "@/components/ui/charts";
</script>

<template>
  <Story title="Quota used" description="Animated dual waves inside a ring.">
    <LiquidFillChart :value="68" unit="%" height="220" />
  </Story>

  <Story
    title="Full"
    description="Waves rise to the value; label centres automatically."
  >
    <LiquidFillChart :value="92" unit="%" height="220" />
  </Story>

  <Story
    title="Custom colour"
    description="Override the wave colour for semantic fills."
  >
    <LiquidFillChart :value="34" color="var(--chart-2)" height="220" />
  </Story>

  <Story title="No label" description="Hide the centre label for tile grids.">
    <LiquidFillChart :value="55" :show-label="false" height="180" />
  </Story>
</template>
