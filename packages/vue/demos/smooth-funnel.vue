<script setup lang="ts">
// SmoothFunnel lives in a charts subdir (Nuxt auto-imports it by filename; not
// re-exported from the charts index), so import the file directly.
import SmoothFunnel from '@/components/ui/charts/smooth-funnel/SmoothFunnel.vue'

const acquisition = [
  { name: 'Visits', value: 8420 },
  { name: 'Sign-ups', value: 2442 },
  { name: 'Purchases', value: 185 },
]

const checkout = [
  { name: 'Cart', value: 5200 },
  { name: 'Checkout', value: 3100 },
  { name: 'Payment', value: 2400 },
  { name: 'Confirmed', value: 2050 },
]

const fiveStage = [
  { name: 'Visitors', value: 24850 },
  { name: 'Sign-ups', value: 14910 },
  { name: 'Activated', value: 5964 },
  { name: 'Paid', value: 1789 },
  { name: 'Retained', value: 447 },
]

const brandPalette = ['#2e6642', '#4c9160', '#7ab98c', '#a9dcb8', '#d9a441']
</script>

<template>
  <Story
    title="Basic three-stage funnel"
    description="Three smoothly tapering stages with cubic-bezier transitions. Percent pills float at each stage centre."
  >
    <div class="mx-auto max-w-md">
      <SmoothFunnel :data="acquisition" />
    </div>
  </Story>

  <Story
    title="Four-stage checkout"
    description="One extra stage. The bezier control points (38% / 62%) keep the transitions smooth at any stage count."
  >
    <div class="mx-auto max-w-md">
      <SmoothFunnel :data="checkout" />
    </div>
  </Story>

  <Story
    title="Five stages, custom palette"
    description="Pass colors to override the default per-index palette. Useful when the funnel sits next to other charts and you need to coordinate."
  >
    <div class="mx-auto max-w-md">
      <SmoothFunnel :data="fiveStage" :colors="brandPalette" />
    </div>
  </Story>

  <Story
    title="No labels"
    description="Pass show-labels=false to drop the percent pills. Use when the funnel is one of many tiles on a dashboard and the absolute values live in a sibling table."
  >
    <div class="mx-auto max-w-md">
      <SmoothFunnel :data="acquisition" :show-labels="false" />
    </div>
  </Story>

  <Story
    title="Compact"
    description="A shorter height for in-card placement or sparkline-like use next to a KPI. The minHeight floor keeps tail stages visible even at small canvases."
  >
    <div class="mx-auto max-w-md">
      <SmoothFunnel :data="acquisition" height="120" :show-labels="false" />
    </div>
  </Story>
</template>
