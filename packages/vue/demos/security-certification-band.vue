<script setup lang="ts">
import SecurityCertificationBand from '@/components/blocks/security-certification-band/SecurityCertificationBand.vue'
// SecurityCertificationBand is the block file the user installs. Open
// `components/blocks/SecurityCertificationBand.vue` after install to edit
// the `certifications` array and wire the residency select.
</script>

<template>
  <Story
    title="Security — Certification Band"
    description="Slim band of certifications with issuing body and last audit date, plus a residency selector — sized to sit above a pricing table."
  >
    <SecurityCertificationBand />
  </Story>
</template>
