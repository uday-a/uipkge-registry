<script setup lang="ts">
import RoiCalculatorInputs from '@/components/blocks/roi-calculator-inputs/RoiCalculatorInputs.vue'
// RoiCalculatorInputs is the block file the user installs. Open\n// `components/blocks/RoiCalculatorInputs.vue` after install to change the\n// model. Showing the assumptions is what stops it reading as a toy.
</script>

<template>
  <Story
    title="ROI — Calculator"
    description="Team size, close days, and analyst rate drive a computed saving, with every assumption stated beneath the figure rather than buried."
  >
    <RoiCalculatorInputs />
  </Story>
</template>
