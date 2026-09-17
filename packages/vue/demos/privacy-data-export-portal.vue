<script setup lang="ts">
import PrivacyDataExportPortal from '@/components/blocks/privacy-data-export-portal/PrivacyDataExportPortal.vue'
</script>

<template>
  <Story
    title="Default"
    description="Complete GDPR Article 15 and CCPA personal data export portal with governance stats, multi-category archive generator, and previous archive history."
  >
    <PrivacyDataExportPortal />
  </Story>

  <Story
    title="Custom Preset Selection"
    description="Pre-configured export selection targeting only Profile and Financial data domains in JSON format."
  >
    <PrivacyDataExportPortal :initial-categories="['profile', 'financial']" initial-format="json" />
  </Story>
</template>
