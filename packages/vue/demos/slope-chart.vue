<script setup lang="ts">
import { SlopeChart } from '@/components/ui/charts'

const share = [
  { label: 'Desktop', values: [52, 44] },
  { label: 'Mobile', values: [38, 47] },
  { label: 'Tablet', values: [10, 9] },
]

const ranks = [
  { label: 'Aurora', values: [3, 2, 1, 1] },
  { label: 'Boreal', values: [1, 1, 2, 3] },
  { label: 'Cirrus', values: [2, 3, 3, 2] },
]
</script>

<template>
  <Story title="Traffic share shift" description="Two-point slope with end labels; no legend needed.">
    <SlopeChart :data="share" :points="['2024', '2025']" height="300" />
  </Story>

  <Story title="Rank bump chart" description="Same wrapper across four checkpoints.">
    <SlopeChart :data="ranks" :points="['W1', 'W2', 'W3', 'W4']" height="320" />
  </Story>
</template>
