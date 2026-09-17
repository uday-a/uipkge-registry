<script setup lang="ts">
import SocialProofStatCounterStream from '@/components/blocks/social-proof-stat-counter-stream/SocialProofStatCounterStream.vue'
import Story from '@/components/story/Story.vue'
</script>

<template>
  <Story
    title="Default"
    description="Live telemetry stat counter with animated numerical streams and global edge round-trip latency ticker."
  >
    <SocialProofStatCounterStream />
  </Story>
</template>
