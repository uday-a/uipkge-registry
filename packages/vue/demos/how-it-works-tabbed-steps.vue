<script setup lang="ts">
import HowItWorksTabbedSteps from '@/components/blocks/how-it-works-tabbed-steps/HowItWorksTabbedSteps.vue'
// HowItWorksTabbedSteps is the block file the user installs. Open
// `components/blocks/HowItWorksTabbedSteps.vue` after install to edit the
// `steps` array; panels are height-matched so tabbing never jumps the page.
</script>

<template>
  <Story
    title="How It Works — Tabbed Steps"
    description="Vertical step tabs beside a detail panel. Selecting a stage swaps the action, expected result, and a primitive-built screen without shifting the panel height."
  >
    <HowItWorksTabbedSteps />
  </Story>
</template>
