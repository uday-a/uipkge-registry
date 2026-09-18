<script setup lang="ts">
import { BubbleChart } from '@/components/ui/charts'

const markets = [
  { x: 4.2, y: 68, size: 120, c: 'SMB' },
  { x: 6.8, y: 74, size: 320, c: 'SMB' },
  { x: 3.1, y: 52, size: 80, c: 'Enterprise' },
  { x: 8.4, y: 88, size: 540, c: 'Enterprise' },
  { x: 5.5, y: 61, size: 200, c: 'Mid-market' },
  { x: 7.2, y: 79, size: 410, c: 'Mid-market' },
]
</script>

<template>
  <Story title="Deal landscape" description="Third dimension in bubble area; tooltip reads all three.">
    <BubbleChart :data="markets" category-field="c" height="320" />
  </Story>

  <Story title="Single series" description="No category renders one bubble set.">
    <BubbleChart :data="markets.map(({ c, ...d }) => d)" height="300" />
  </Story>

  <Story title="Soft opacity" description="Lower opacity for dense overlaps.">
    <BubbleChart :data="markets" category-field="c" :opacity="0.4" height="320" />
  </Story>

  <Story title="Size range" description="Widen the bubble scale to exaggerate differences.">
    <BubbleChart :data="markets" category-field="c" :min-size="4" :max-size="64" height="320" />
  </Story>
</template>
