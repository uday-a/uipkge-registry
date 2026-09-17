<script setup lang="ts">
import OnboardingChecklist from '@/components/blocks/onboarding-checklist/OnboardingChecklist.vue'
</script>

<template>
  <Story title="Default" description="Three of five tasks complete with a live progress bar.">
    <OnboardingChecklist />
  </Story>

  <Story title="All done" description="Completing every task flips the body to a success panel.">
    <OnboardingChecklist class="[&_[role='checkbox']]:pointer-events-auto" />
  </Story>
</template>
