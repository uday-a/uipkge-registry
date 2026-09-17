<script setup lang="ts">
import { WordCloudChart } from '@/components/ui/charts'

const topics = [
  { name: 'dashboards', value: 96 },
  { name: 'echarts', value: 82 },
  { name: 'tokens', value: 74 },
  { name: 'registry', value: 68 },
  { name: 'vue', value: 61 },
  { name: 'react', value: 58 },
  { name: 'a11y', value: 44 },
  { name: 'dark-mode', value: 39 },
  { name: 'sparklines', value: 28 },
  { name: 'funnels', value: 22 },
]

const skills = [
  { name: 'TypeScript', value: 100 },
  { name: 'Tailwind', value: 88 },
  { name: 'ECharts', value: 76 },
  { name: 'Reka UI', value: 64 },
  { name: 'Radix', value: 52 },
  { name: 'Astro', value: 41 },
]
</script>

<template>
  <Story title="Docs topics" description="Frequency-sized words from the chart palette. Hover to emphasise.">
    <WordCloudChart :data="topics" height="280" />
  </Story>

  <Story title="Skill cloud" description="Same wrapper for profile and tag surfaces.">
    <WordCloudChart :data="skills" height="240" />
  </Story>
</template>
