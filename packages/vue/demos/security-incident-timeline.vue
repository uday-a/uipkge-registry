<script setup lang="ts">
import SecurityIncidentTimeline from '@/components/blocks/security-incident-timeline/SecurityIncidentTimeline.vue'
</script>

<template>
  <Story
    title="Default"
    description="Security Operations Center (SOC) incident response timeline and post-mortem tracker with telemetry KPIs, chronological audit trail, log snippets, and corrective action items."
  >
    <SecurityIncidentTimeline />
  </Story>

  <Story
    title="Active SEV-1 Incident Triage"
    description="In-flight incident triage state with active war room bridge and unmitigated containment status."
  >
    <SecurityIncidentTimeline
      incident-id="#SEC-INC-2026-0914"
      incident-title="Distributed API Gateway Credential Stuffing Attempt"
      severity="SEV-1 Critical"
      status="Active · In Triage"
      commander-name="Elena Rostova"
      commander-role="Staff Security Architect · War Room Commander"
    />
  </Story>
</template>
