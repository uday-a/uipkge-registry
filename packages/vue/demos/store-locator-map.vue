<script setup lang="ts">
import StoreLocatorMap from '@/components/blocks/store-locator-map/StoreLocatorMap.vue'

const token = (import.meta.env.PUBLIC_MAPBOX_TOKEN as string) || undefined
</script>

<template>
  <Story title="Stores" description="Store pins with open/closed status. Select a location to fly the camera.">
    <StoreLocatorMap :access-token="token" />
  </Story>
</template>
