<script setup lang="ts">
import CapTableOwnershipSummary from '@/components/blocks/cap-table-ownership-summary/CapTableOwnershipSummary.vue'
</script>

<template>
  <Story
    title="Default Cap Table &amp; Modeling"
    description="Full Carta-style capitalization table with equity overview cards, multi-segment ownership progress distribution bar, shareholder vesting breakdown table, and interactive Series A dilution simulator."
  >
    <CapTableOwnershipSummary />
  </Story>

  <Story
    title="Custom Growth Round Scenario"
    description="Pre-configured with a $15M Series A investment model at a $60M pre-money valuation scenario."
  >
    <CapTableOwnershipSummary :initial-investment="15000000" :initial-pre-money="60000000" />
  </Story>
</template>
