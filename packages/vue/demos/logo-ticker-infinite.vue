<script setup lang="ts">
import { LogoTickerInfinite } from '@/components/blocks/logo-ticker-infinite'
import Story from '@/components/story/Story.vue'
</script>

<template>
  <Story
    title="Default"
    description="Infinite logo ticker with category tabs, pause/speed controls, and telemetry hover"
  >
    <div class="w-full">
      <LogoTickerInfinite />
    </div>
  </Story>
</template>
