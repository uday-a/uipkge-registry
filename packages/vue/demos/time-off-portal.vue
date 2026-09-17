<script setup lang="ts">
import TimeOffPortal from '@/components/blocks/time-off-portal/TimeOffPortal.vue'
</script>

<template>
  <Story
    title="Default"
    description="Employee time off & leave portal with PTO balance cards, month calendar view, request form, pending manager approvals, team OOO list, and company holidays."
  >
    <TimeOffPortal />
  </Story>

  <Story
    title="Custom Copy"
    description="Portal with customized headline and description for enterprise HR & People operations."
  >
    <TimeOffPortal
      title="Acme Corp Time Off & Leave"
      subtitle="Request PTO, manage team availability, and view company holiday schedules."
    />
  </Story>
</template>
