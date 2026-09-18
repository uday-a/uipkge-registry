<script setup lang="ts">
import { ProgressItem } from '@/components/ui/progress-item'
</script>

<template>
  <Story
    title="Default"
    description="Stacked rows with label, value, secondary label, and per-row colorIndex (chart-1..5)."
  >
    <div class="max-w-md space-y-3">
      <ProgressItem label="Engineering" :value="42" secondary-label="42%" :color-index="0" />
      <ProgressItem label="Product" :value="22" secondary-label="22%" :color-index="1" />
      <ProgressItem label="Design" :value="14" secondary-label="14%" :color-index="2" />
      <ProgressItem label="Sales" :value="12" secondary-label="12%" :color-index="3" />
      <ProgressItem label="Marketing" :value="10" secondary-label="10%" :color-index="4" />
    </div>
  </Story>

  <Story title="Single item" description="One progress row — label on the left, percent on the right by default.">
    <div class="max-w-md">
      <ProgressItem label="Profile completion" :value="68" />
    </div>
  </Story>

  <Story
    title="Custom barClass"
    description="Override the indicator color with any utility — barClass takes precedence over colorIndex."
  >
    <div class="max-w-md space-y-3">
      <ProgressItem label="Healthy" :value="76" bar-class="[&_[data-slot=progress-indicator]]:bg-emerald-500" />
      <ProgressItem label="At risk" :value="48" bar-class="[&_[data-slot=progress-indicator]]:bg-amber-500" />
      <ProgressItem label="Critical" :value="22" bar-class="[&_[data-slot=progress-indicator]]:bg-red-500" />
    </div>
  </Story>

  <Story
    title="Custom secondary labels"
    description="Use secondaryLabel for non-percentage units like counts, time, or fractions."
  >
    <div class="max-w-md space-y-3">
      <ProgressItem label="Tasks completed" :value="62" secondary-label="124 / 200" :color-index="1" />
      <ProgressItem label="Storage used" :value="34" secondary-label="3.4 GB / 10 GB" :color-index="2" />
      <ProgressItem label="Time elapsed" :value="80" secondary-label="48m left" :color-index="3" />
    </div>
  </Story>

  <Story title="Compact stack" description="Multiple progress rows in a denser two-column grid for dashboards.">
    <div class="grid max-w-2xl grid-cols-2 gap-x-6 gap-y-3">
      <ProgressItem label="API uptime" :value="99" :color-index="0" />
      <ProgressItem label="DB uptime" :value="97" :color-index="1" />
      <ProgressItem label="Cache hit rate" :value="84" :color-index="2" />
      <ProgressItem label="Error budget" :value="62" :color-index="3" />
      <ProgressItem label="P95 latency" :value="78" secondary-label="78ms" :color-index="4" />
      <ProgressItem label="Throughput" :value="55" secondary-label="5.5k/s" :color-index="5" />
    </div>
  </Story>
</template>
