<script setup lang="ts">
import ExitIntentNewsletter from '@/components/blocks/exit-intent-newsletter/ExitIntentNewsletter.vue'
// ExitIntentNewsletter is the block file the user installs. Open
// `components/blocks/ExitIntentNewsletter.vue` after install to wire the
// submit handler; dismissal is session-scoped.
</script>

<template>
  <Story
    title="Exit Intent — Newsletter"
    description="Exit-intent capture for the newsletter rather than a discount, naming the last issue so the ask is concrete rather than generic."
  >
    <ExitIntentNewsletter />
  </Story>
</template>
