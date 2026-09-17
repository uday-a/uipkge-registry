<script setup lang="ts">
import { HubLocatorMap } from '@/components/blocks/hub-locator-map'

const token = (import.meta.env.PUBLIC_MAPBOX_TOKEN as string) || undefined
</script>

<template>
  <Story title="Hubs" description="Global hub pins. Select a location to fly the camera.">
    <HubLocatorMap :access-token="token" />
  </Story>
</template>
