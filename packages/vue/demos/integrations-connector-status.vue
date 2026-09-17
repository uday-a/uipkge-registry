<script setup lang="ts">
import IntegrationsConnectorStatus from '@/components/blocks/integrations-connector-status/IntegrationsConnectorStatus.vue'
// IntegrationsConnectorStatus is the block file the user installs. Open
// `components/blocks/IntegrationsConnectorStatus.vue` after install to feed
// the `connectors` array from your status endpoint.
</script>

<template>
  <Story
    title="Integrations — Connector Status"
    description="Connector health table. Each integration lists auth method, sync cadence, last successful run, and a status pill, above a summary band of healthy and degraded counts."
  >
    <IntegrationsConnectorStatus />
  </Story>
</template>
