<script setup lang="ts">
import LeaseAgreementSign from '@/components/blocks/lease-agreement-sign/LeaseAgreementSign.vue'
</script>

<template>
  <Story
    title="Default Review &amp; Sign"
    description="Full residential lease agreement review and signature workflow with financial terms summary, pending initial markers on Sections 2 and 4, and sticky action sidebar."
  >
    <LeaseAgreementSign />
  </Story>

  <Story
    title="Ready for Final Signature"
    description="All required clause initials completed, unlocking the electronic signature pad and execution button."
  >
    <LeaseAgreementSign :initial-initials-completed="true" />
  </Story>

  <Story
    title="Executed &amp; Legally Binding"
    description="Countersigned lease agreement displaying verified landlord and tenant digital signature stamps, cryptographic audit hash, and download actions."
  >
    <LeaseAgreementSign :initial-signed="true" />
  </Story>
</template>
