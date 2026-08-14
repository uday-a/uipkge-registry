<script setup lang="ts">
import AuditEventStream from '@/components/blocks/audit-event-stream/AuditEventStream.vue'
</script>

<template>
  <Story
    title="Default"
    description="Real-time live streaming audit log viewer and security telemetry feed with status indicators, stream pause/resume controls, regex and keyword log filtering, severity badges, expandable JSON payload inspectors, and ingestion telemetry stats."
  >
    <AuditEventStream />
  </Story>

  <Story
    title="Critical incidents"
    description="Pre-filtered view showing only critical severity security violations, ingress changes, and privilege alerts."
  >
    <AuditEventStream initial-severity="critical" />
  </Story>

  <Story
    title="Stream paused"
    description="Stream paused state with buffer frozen, telemetry indicator showing paused status, and resume toggle."
  >
    <AuditEventStream :initial-paused="true" />
  </Story>

  <Story title="Search query filter" description="Pre-populated search query targeting IAM and authentication events.">
    <AuditEventStream initial-search="iam.user" />
  </Story>

  <Story
    title="Empty stream"
    description="Empty state when stream buffer is cleared with affordance to restore default telemetry stream."
  >
    <AuditEventStream :initial-events="[]" />
  </Story>
</template>
