<script setup lang="ts">
import MaintenanceRequestTicket from '@/components/blocks/maintenance-request-ticket/MaintenanceRequestTicket.vue'
</script>

<template>
  <Story
    title="Default Maintenance Request"
    description="Resident repair work order portal with category selection, urgency level radios, unit location, photo dropzone, and emergency hotline sidebar."
  >
    <MaintenanceRequestTicket />
  </Story>

  <Story
    title="High Emergency Priority"
    description="Work order configured with High/Emergency 2h SLA, showing the urgent response banner and immediate dispatch protocol."
  >
    <MaintenanceRequestTicket
      initial-category="plumbing"
      initial-urgency="emergency"
      initial-location="master_bathroom"
      initial-description="Main water shutoff pipe under the master bathroom sink is leaking rapidly onto the hardwood flooring. Water is pooling under the cabinet."
    />
  </Story>

  <Story
    title="Call Before Entering Protocol"
    description="Work order with resident phone call appointment required prior to technician arrival."
  >
    <MaintenanceRequestTicket
      initial-category="hvac"
      initial-urgency="routine"
      initial-location="living_room"
      initial-description="Annual HVAC filter inspection and thermostat schedule reprogramming request."
      initial-permission="call_first"
    />
  </Story>
</template>
