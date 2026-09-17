<script setup lang="ts">
import { CustomerMetricsBand } from '@/components/blocks/customer-metrics-band'
import Story from '@/components/story/Story.vue'
</script>

<template>
  <Story title="Default" description="Customer velocity and ROI telemetry band with cohort segmentation">
    <div class="w-full">
      <CustomerMetricsBand />
    </div>
  </Story>
</template>
