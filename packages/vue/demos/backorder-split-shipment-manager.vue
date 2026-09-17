<script setup lang="ts">
import { BackorderSplitShipmentManager } from '@/components/blocks/backorder-split-shipment-manager'
</script>

<template>
  <Story
    title="Default"
    description="Multi-warehouse split fulfillment console with inventory triage and partial dispatch controls."
  >
    <div class="p-4">
      <BackorderSplitShipmentManager />
    </div>
  </Story>
</template>
