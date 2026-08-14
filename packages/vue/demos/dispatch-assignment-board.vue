<script setup lang="ts">
import DispatchAssignmentBoard from '@/components/blocks/dispatch-assignment-board/DispatchAssignmentBoard.vue'
</script>

<template>
  <Story
    title="Dispatch Assignment Board"
    description="Last-mile delivery dispatch and route optimization board with live fleet overview KPIs, zone selector, payload weight load balancing, and driver route sequencing."
  >
    <DispatchAssignmentBoard />
  </Story>

  <Story title="Filtered Zone View" description="Regional dispatch view preset for San Fernando Valley Hub routes.">
    <DispatchAssignmentBoard initial-zone="San Fernando Valley Hub" />
  </Story>
</template>
