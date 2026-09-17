<script setup lang="ts">
import RateLimitingConfig from '@/components/blocks/rate-limiting-config/RateLimitingConfig.vue'
</script>

<template>
  <Story
    title="Default"
    description="Cloudflare and Upstash style rate limiting configuration panel with real-time health metrics, interactive token bucket simulation engine, and per-endpoint throttling rules."
  >
    <RateLimitingConfig />
  </Story>
</template>
