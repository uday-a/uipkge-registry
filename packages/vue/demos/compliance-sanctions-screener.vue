<script setup lang="ts">
import ComplianceSanctionsScreener from '@/components/blocks/compliance-sanctions-screener/ComplianceSanctionsScreener.vue'
</script>

<template>
  <Story
    title="Default AML/OFAC Screening Workbench"
    description="Full-featured AML/KYC screening workbench with 4 telemetry cards, live entity search pre-filled with Viktor Ivanov, country filter, 85% fuzzy match threshold slider, target list results table, and attribute comparison investigation modal."
  >
    <ComplianceSanctionsScreener />
  </Story>

  <Story
    title="High Sensitivity Fuzzy Threshold (60%)"
    description="Expanded match sensitivity mode detecting phonetic variants and broad cross-jurisdiction watchlists."
  >
    <ComplianceSanctionsScreener :initial-threshold="60" initial-search="" />
  </Story>

  <Story
    title="Corporate Sectoral Sanctions Filter"
    description="Filtered to Russian Federation corporate entities under EU Article 5 and OFAC Sectoral SSI sanctions."
  >
    <ComplianceSanctionsScreener initial-search="Sberbank" initial-country="Russia" />
  </Story>
</template>
