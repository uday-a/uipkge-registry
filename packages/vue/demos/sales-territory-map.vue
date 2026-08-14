<script setup lang="ts">
import { SalesTerritoryMap } from '@/components/blocks/sales-territory-map'

const token = (import.meta.env.PUBLIC_MAPBOX_TOKEN as string) || undefined
</script>

<template>
  <Story title="Territories" description="Quota pins on a world map. Select a region to fly the camera.">
    <SalesTerritoryMap :access-token="token" />
  </Story>
</template>
