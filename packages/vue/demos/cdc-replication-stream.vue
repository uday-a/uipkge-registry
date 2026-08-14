<script setup lang="ts">
import CdcReplicationStream from '@/components/blocks/cdc-replication-stream/CdcReplicationStream.vue'
</script>

<template>
  <Story
    title="Default"
    description="Real-time Change Data Capture (CDC) replication pipeline monitor showing binlog sync status, telemetry metrics, table operation breakdowns, and live WAL event stream."
  >
    <CdcReplicationStream />
  </Story>

  <Story
    title="Filtered by UPDATE"
    description="Pre-filtered view highlighting UPDATE delta operations with side-by-side before and after row payload comparisons."
  >
    <CdcReplicationStream initial-operation-filter="UPDATE" />
  </Story>

  <Story
    title="Stream Paused"
    description="Replication stream paused state with binlog offset frozen and pause/resume control."
  >
    <CdcReplicationStream :initial-paused="true" />
  </Story>

  <Story
    title="Filtered by Table"
    description="Pre-populated search query targeting the public.orders table change records."
  >
    <CdcReplicationStream initial-search="orders" />
  </Story>

  <Story
    title="Empty Stream"
    description="Empty state when stream buffer is cleared with affordance to restore default CDC telemetry stream."
  >
    <CdcReplicationStream :initial-events="[]" />
  </Story>
</template>
