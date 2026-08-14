<script setup lang="ts">
import NdaAgreementGenerator from '@/components/blocks/nda-agreement-generator/NdaAgreementGenerator.vue'
</script>

<template>
  <Story
    title="Default NDA Customizer &amp; Document Canvas"
    description="Full Non-Disclosure Agreement builder with bilateral/unilateral modes, customizable protective covenants, live legal parchment preview, and e-signature execution pad."
  >
    <NdaAgreementGenerator />
  </Story>

  <Story
    title="Fully Executed &amp; Countersigned NDA"
    description="Fully executed agreement displaying verified digital signatures from both disclosing and receiving parties with SHA-256 cryptographic audit hashes and PDF export."
  >
    <NdaAgreementGenerator :initial-signed="true" />
  </Story>

  <Story
    title="Unilateral Vendor Agreement Preset"
    description="Unilateral confidentiality agreement preset under California jurisdiction with a 5-year confidentiality term and custom protective covenants."
  >
    <NdaAgreementGenerator
      initial-agreement-type="unilateral"
      initial-jurisdiction="california"
      initial-term="5 Years"
    />
  </Story>
</template>
