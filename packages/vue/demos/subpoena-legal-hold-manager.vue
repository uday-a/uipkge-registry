<script setup lang="ts">
import SubpoenaLegalHoldManager from '@/components/blocks/subpoena-legal-hold-manager/SubpoenaLegalHoldManager.vue'
</script>

<template>
  <Story
    title="Default"
    description="Enterprise e-discovery litigation hold notice tracker with 100% custodian compliance, 4 metric cards, custodian roster table, system preservation locks, and signed receipt modal."
  >
    <SubpoenaLegalHoldManager />
  </Story>

  <Story
    title="Engineering Custodians"
    description="Filtered view showing engineering and architecture custodians under active code repository and chat preservation holds."
  >
    <SubpoenaLegalHoldManager default-filter="engineering" />
  </Story>

  <Story
    title="Operations & Legal Custodians"
    description="Filtered view for executive and operations custodians preserving vendor contracts, cloud storage, and financial communications."
  >
    <SubpoenaLegalHoldManager default-filter="operations" />
  </Story>
</template>
