<script setup lang="ts">
import UseCasesPersonaTabs from '@/components/blocks/use-cases-persona-tabs/UseCasesPersonaTabs.vue'
// UseCasesPersonaTabs is the block file the user installs. Open
// `components/blocks/UseCasesPersonaTabs.vue` after install to edit the
// `personas` array. Panels are height-matched so switching tabs does not
// jump the page.
</script>

<template>
  <Story
    title="Use Cases — Persona Tabs"
    description="Persona-switched use cases. Selecting a role swaps the pain-point summary, outcome list, supporting metric, and CTA in place — no navigation, no layout shift between tabs."
  >
    <UseCasesPersonaTabs />
  </Story>
</template>
