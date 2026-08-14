<script setup lang="ts">
import { Map } from '@/components/ui/map'

const token = (import.meta.env.PUBLIC_MAPBOX_TOKEN as string) || undefined
</script>

<template>
  <Story
    title="Controls & Toolbar"
    description="Native navigation controls (+/- zoom buttons, compass) and HTML5 fullscreen display controls."
  >
    <Map
      :access-token="token"
      variant="streets"
      :center="[2.3522, 48.8566]"
      :zoom="12"
      :navigation="true"
      navigation-position="top-right"
      :fullscreen="true"
      fullscreen-position="top-left"
      :show-compass="true"
      :show-zoom="true"
      class="h-96 w-full rounded-lg border"
    />
  </Story>
</template>
