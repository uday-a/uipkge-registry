<script setup lang="ts">
import SyntheticDataGenerator from '@/components/blocks/synthetic-data-generator/SyntheticDataGenerator.vue'
</script>

<template>
  <Story
    title="Synthetic Dataset Generator & Privacy Engine"
    description="Gretel and Tonic-style LLM and mathematical synthetic dataset synthesizer with differential privacy epsilon controls, custom schema field generator, K-anonymity policy switches, live tabular CSV preview, and streaming JSON Lines export."
  >
    <SyntheticDataGenerator />
  </Story>

  <Story
    title="Healthcare Clinical Records (EHR) with Strict Privacy"
    description="HIPAA-compliant patient cohort synthesizer configured with strict differential privacy (ε = 0.5) and biomarker distribution curves."
  >
    <SyntheticDataGenerator initial-template="healthcare-ehr" :initial-row-count="5000" :initial-epsilon="0.5" />
  </Story>

  <Story
    title="Fintech Fraud Detection & Risk Scoring"
    description="High-volume synthetic credit card transactions for fraud ML classifiers with skewed anomaly distributions and tokenized PANs."
  >
    <SyntheticDataGenerator initial-template="fintech-fraud" :initial-row-count="10000" :initial-epsilon="2.0" />
  </Story>
</template>
