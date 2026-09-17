<script setup lang="ts">
import FieldInspectionManager from '@/components/blocks/field-inspection-manager/FieldInspectionManager.vue'
</script>

<template>
  <Story
    title="Default (All Inspections)"
    description="Commercial property & equipment site inspection audit manager with 4 KPI cards, GPS geostamp telemetry, searchable table, photo evidence thumbnail gallery, and cryptographic engineer sign-offs."
  >
    <FieldInspectionManager />
  </Story>

  <Story
    title="Critical Deficiencies Filtered"
    description="Pre-filtered view highlighting high-priority audits with critical defect flags and automated work order dispatch actions."
  >
    <FieldInspectionManager initial-filter="critical" />
  </Story>
</template>
