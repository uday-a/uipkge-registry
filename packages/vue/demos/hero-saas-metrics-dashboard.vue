<script setup lang="ts">
import { HeroSaasMetricsDashboard } from '@/components/blocks/hero-saas-metrics-dashboard'
import Story from '@/components/story/Story.vue'
</script>

<template>
  <Story title="Default" description="SaaS hero section with timeframe filter and dynamic SVG telemetry chart">
    <div class="w-full">
      <HeroSaasMetricsDashboard />
    </div>
  </Story>
</template>
